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

  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: "email이 필요합니다." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    // Supabase 클라이언트를 서버 권한으로 생성하는 코드
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabase.auth.admin.createUser({
    // Supabase Auth에 관리자 권한으로 사용자를 직접 생성
    email,
    email_confirm: false, // 이 이메일은 아직 인증된 것으로 처리하지 않겠다
    user_metadata: { account_type: "customer" }, // auth.users의 raw_user_meta_data 컬럼에 저장됨
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ userId: data.user.id }), {
    status: 200,
    // 응답 본문이 JSON
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
