import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type UserType = "member" | "customer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// app_metadata roles 추가하는 Edge Function
// 회원: 회원가입 시 호출( verifyOtp 후 해당 유저에 role과 member, shop 테이블 추가 )
// 고객: 로그인 시 호출( 고객 등록 시 이미 생성된 유저에 role 추가 )
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

  const { entryPoint, name, phone, shopName } = (await req.json()) as {
    entryPoint: UserType;
    name?: string;
    phone?: string;
    shopName?: string;
  };

  if (entryPoint !== "member" && entryPoint !== "customer") {
    return new Response(JSON.stringify({ error: "invalid entryPoint" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (entryPoint === "member" && (!name || !phone || !shopName)) {
    return new Response(
      JSON.stringify({ error: "name, phone, shopName이 필요합니다." }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // 1) auth 검증 (공통)
  const supabaseUser = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const {
    data: { user },
    error: userError,
  } = await supabaseUser.auth.getUser();

  if (userError || !user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 2) customer만 customer 테이블에 해당 유저의 id가 있는지 확인 (회원O + 고객X 대응)
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  if (entryPoint === "customer") {
    const { data: customer, error: customerError } = await supabaseAdmin
      .from("customer")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (customerError) {
      console.error("customer 조회 실패:", customerError);
      return new Response(
        JSON.stringify({ error: "고객 정보 조회 중 오류가 발생했습니다." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!customer) {
      return new Response(
        JSON.stringify({ error: "고객으로 등록되어 있진 않습니다." }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
  }

  // 3) roles 중복 체크 (공통)
  const currentRoles: string[] = user.app_metadata?.roles ?? [];
  
  if (currentRoles.includes(entryPoint)) {
    const label = entryPoint === "member" ? "회원" : "고객";
    return new Response(
      JSON.stringify({ error: `이미 ${label}으로 가입되어 있습니다.` }),
      {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // 4) member만 member, shop upsert (충돌 시 최신 값으로 update, customer는 생략)
  if (entryPoint === "member") {
    const { error: memberError } = await supabaseAdmin
      .from("member")
      .upsert(
        { id: user.id, email: user.email, name, phone },
        { onConflict: "id" },
      );

    if (memberError) {
      console.error("member upsert 실패:", memberError);
      return new Response(
        JSON.stringify({ error: "회원 정보 저장 중 오류가 발생했습니다." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { error: shopError } = await supabaseAdmin
      .from("shop")
      .upsert(
        { member_id: user.id, name: shopName },
        { onConflict: "member_id" },
      );

    if (shopError) {
      console.error("shop upsert 실패:", shopError);
      return new Response(
        JSON.stringify({ error: "매장 정보 저장 중 오류가 발생했습니다." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
  }

  // 5) appdata.roles 갱신 (공통)
  const newRoles = [...currentRoles, entryPoint];

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { app_metadata: { ...user.app_metadata, roles: newRoles } },
  );

  if (updateError) {
    console.error("app_metadata 갱신 실패:", updateError);
    return new Response(
      JSON.stringify({ error: "권한 정보 갱신 중 오류가 발생했습니다." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  return new Response(
    JSON.stringify({
      result: currentRoles.length === 0 ? "created" : "mapped",
      roles: newRoles,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
