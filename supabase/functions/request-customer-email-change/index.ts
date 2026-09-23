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

  const { customerId, newEmail } = await req.json();

  if (!customerId || !newEmail) {
    return new Response(
      JSON.stringify({ error: "customerId, newEmail이 필요합니다." }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // 1) auth(회원) 검증
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

  // 2) 이 회원이 실제로 관리하는 고객(customerId)인지 확인
  const { data: mapping, error: mappingError } = await supabaseAdmin
    .from("member_customer_mapping")
    .select("id")
    .eq("member_id", memberId)
    .eq("customer_id", customerId)
    .maybeSingle();

  if (mappingError) {
    console.error("mapping 조회 실패", mappingError);
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

  // 3) newEmail을 이미 쓰고 있는 다른 고객이 있는지 확인
  const { data: conflictCustomer, error: findConflictCustomerError } =
    await supabaseAdmin
      .from("customer")
      .select("id")
      .eq("email", newEmail)
      .maybeSingle();

  if (findConflictCustomerError) {
    console.error("conflict customer 조회 실패", findConflictCustomerError);
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

  // 3) 충돌 이메일로 OTP 발송 (본인 확인용)
  const { error: otpError } = await supabaseAdmin.auth.signInWithOtp({
    email: newEmail,
    options: { shouldCreateUser: false },
  });

  //   if (otpError) {
  //     console.error("OTP 발송 실패:", otpError);
  //     return new Response(
  //       JSON.stringify({ error: "인증 코드 발송 중 오류가 발생했습니다." }),
  //       {
  //         status: 500,
  //         headers: { ...corsHeaders, "Content-Type": "application/json" },
  //       },
  //     );
  //   }

  // POC_MODE: Resend 도메인 인증 전이라 실제 메일 대신 OTP를 직접 반환 (이슈 #14 해결 후 제거)
  let otp: string | undefined;
  if (Deno.env.get("POC_MODE") === "true") {
    const { data: pocData } = await supabaseAdmin.functions.invoke<{
      otp: string;
    }>("poc-get-otp", { body: { email: newEmail } });
    otp = pocData?.otp;
  } else if (otpError) {
    console.error("OTP 발송 실패:", otpError);
    return new Response(
      JSON.stringify({ error: "인증 코드 발송 중 오류가 발생했습니다." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  return new Response(
    JSON.stringify({ conflictCustomerId: conflictCustomer.id, otp }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
