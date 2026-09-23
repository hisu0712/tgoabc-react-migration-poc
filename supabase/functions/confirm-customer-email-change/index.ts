import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { customerId, newEmail, otp } = await req.json();

  if (!customerId || !newEmail || !otp) {
    return new Response(
      JSON.stringify({ error: "customerId, newEmail, otp가 필요합니다." }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // 1) Auth(회원) 검증
  const supabaseUser = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const {
    data: { user },
    error: userError,
  } = await supabaseUser.auth.getUser();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const memberId = user.id;

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // 2) 이 회원이 실제로 관리하는 고객(customerId=A)인지 확인
  const { data: mapping, error: mappingError } = await supabaseAdmin
    .from("member_customer_mapping")
    .select("id")
    .eq("member_id", memberId)
    .eq("customer_id", customerId)
    .maybeSingle();

  if (mappingError) {
    console.error("mapping 조회 실패:", mappingError);
    return new Response(
      JSON.stringify({ error: "고객 정보 조회 중 오류가 발생했습니다." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  if (!mapping) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 3) newEmail을 이미 쓰고 있는 고객(B) 재조회
  const { data: conflictCustomer, error: findConflictError } =
    await supabaseAdmin
      .from("customer")
      .select("id")
      .eq("email", newEmail)
      .maybeSingle();

  if (findConflictError) {
    console.error("customer 조회 실패:", findConflictError);
    return new Response(
      JSON.stringify({ error: "고객 정보 조회 중 오류가 발생했습니다." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  if (!conflictCustomer || conflictCustomer.id === customerId) {
    return new Response(
      JSON.stringify({ error: "충돌하는 이메일이 없습니다." }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const conflictCustomerId = conflictCustomer.id;

  // 4) OTP 검증 (임시 client, 세션 저장 없이 성공/실패만 확인)
  const supabaseVerify = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );

  const { error: verifyError } = await supabaseVerify.auth.verifyOtp({
    email: newEmail,
    token: otp,
    type: "email",
  });

  if (verifyError) {
    console.error("OTP 검증 실패:", verifyError);
    return new Response(
      JSON.stringify({ error: "인증번호가 올바르지 않습니다." }),
      {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // 5) B의 auth user 삭제 (cascade로 customer/mapping/analysis 자동 정리)
  const { error: deleteUserError } =
    await supabaseAdmin.auth.admin.deleteUser(conflictCustomerId);

  if (deleteUserError) {
    console.error("기존 고객 삭제 실패:", deleteUserError);
    return new Response(
      JSON.stringify({ error: "기존 고객 삭제 중 오류가 발생했습니다." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // 6) A의 auth 이메일 동기화 + 인증 완료 처리
  const { error: updateAuthEmailError } =
    await supabaseAdmin.auth.admin.updateUserById(customerId, {
      email: newEmail,
      email_confirm: true,
    });

  if (updateAuthEmailError) {
    console.error("이메일 변경 실패:", updateAuthEmailError);
    return new Response(
      JSON.stringify({ error: "이메일 변경 중 오류가 발생했습니다." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // 7) A의 이메일 변경
  const { error: updateEmailError } = await supabaseAdmin
    .from("customer")
    .update({ email: newEmail })
    .eq("id", customerId);

  if (updateEmailError) {
    console.error("이메일 변경 실패:", updateEmailError);
    return new Response(
      JSON.stringify({ error: "이메일 변경 중 오류가 발생했습니다." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  return new Response(JSON.stringify({ conflictCustomerId }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
