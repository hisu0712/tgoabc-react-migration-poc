import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  // 어떤 사이트에서 요청해도 되는지
  "Access-Control-Allow-Origin": "*",
  // 요청에 어떤 HTTP 헤더를 실어도 되는지
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

  const { email, name, birthDate, gender, designerId } = await req.json();

  if (!email || !name || !birthDate || !gender) {
    return new Response(
      JSON.stringify({ error: "email, name, birthDate, gender가 필요합니다." }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // 1) 호출자(회원) 검증
  const supabaseUser = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const {
    data: { user },
    error: userError,
  } = await supabaseUser.auth.getUser(); // 이 클라이언트에 실려있는 토큰(=지금 요청을 보낸 사람의 access token)이 유효한지 확인하고, 유효하면 그 토큰 주인(유저 정보)을 돌려주는 함수

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

  // 2) 이미 존재하는 고객인지 확인 (email 중복 확인)
  const { data: existingCustomer, error: findCustomerError } = await supabaseAdmin
    .from("customer")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (findCustomerError) {
    console.error("customer 조회 실패:", findCustomerError);
    return new Response(
      JSON.stringify({ error: "고객 정보 조회 중 오류가 발생했습니다." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // 3) 이미 존재하는 고객이면 매핑만 확인/추가하고 종료 (customer insert 스킵)
  if (existingCustomer) {
    const customerId = existingCustomer.id;

    const { data: existingMapping, error: findMappingError } = await supabaseAdmin
      .from("member_customer_mapping")
      .select("id")
      .eq("customer_id", customerId)
      .eq("member_id", memberId)
      .maybeSingle();

    if (findMappingError) {
      console.error("mapping 조회 실패:", findMappingError);
      return new Response(
        JSON.stringify({ error: "고객 매핑 조회 중 오류가 발생했습니다." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (existingMapping) {
      return new Response(
        JSON.stringify({ customerId, isAlreadyExists: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { error: insertMappingError } = await supabaseAdmin
      .from("member_customer_mapping")
      .insert({
        member_id: memberId,
        customer_id: customerId,
        designer_id: designerId ?? null,
      });

    if (insertMappingError) {
      console.error("mapping insert 실패:", insertMappingError);
      return new Response(
        JSON.stringify({ error: "고객 매핑 중 오류가 발생했습니다." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({ customerId, isAlreadyExists: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // 4) member 테이블에서 이메일로 기존 유저 조회 (이미 회원인 사람인 경우)
  const { data: existingMember, error: memberError } = await supabaseAdmin // 여기서 조회하려는 이메일은 호출한 회원 본인의 이메일이 아니라 새로 등록하려는 고객의 이메일 (RLS 정책 우회)
    .from("member")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (memberError) {
    console.error("member 조회 실패:", memberError);
    return new Response(
      JSON.stringify({ error: "회원 정보 조회 중 오류가 발생했습니다." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  let customerId: string;
  let isNewAuthUser = false;

  if (existingMember) {
    customerId = existingMember.id;
  } else {
    // 5) 관리자 권한으로 신규 Auth 고객 생성
    const { data: newUser, error: createUserError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: false, // 고객 이메일은 아직 인증된 것으로 처리X
      });

    if (createUserError) {
      console.error("auth 유저 생성 실패:", createUserError);
      return new Response(
        JSON.stringify({ error: "고객 계정 생성 중 오류가 발생했습니다." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    customerId = newUser.user.id;
    isNewAuthUser = true;
  }

  // 6) customer 테이블 insert
  const { error: insertCustomerError } = await supabaseAdmin
    .from("customer")
    .insert({
      id: customerId,
      name,
      email,
      birth_date: birthDate,
      gender,
    });

  if (insertCustomerError) {
    console.error("customer insert 실패:", insertCustomerError);

    if (isNewAuthUser) {
      await supabaseAdmin.auth.admin.deleteUser(customerId); // auth만 남고 customer가 없는 경우 방지
    }

    return new Response(
      JSON.stringify({ error: "고객 정보 저장 중 오류가 발생했습니다." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // 7) member_customer_mapping insert
  const { error: insertMappingError } = await supabaseAdmin
    .from("member_customer_mapping")
    .insert({
      member_id: memberId,
      customer_id: customerId,
      designer_id: designerId ?? null,
    });

  if (insertMappingError) {
    console.error("mapping insert 실패:", insertMappingError);
    return new Response(
      JSON.stringify({ error: "고객 매핑 중 오류가 발생했습니다." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  return new Response(JSON.stringify({ customerId, isAlreadyExists: false }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
