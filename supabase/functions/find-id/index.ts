import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // 프리플라이트 요청 처리
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { name, phone } = await req.json();

  if (!name || !phone) {
    return new Response(JSON.stringify({ error: "잘못된 요청입니다." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabase
    .from("member")
    .select("email")
    .eq("name", name)
    .eq("phone", phone)
    .maybeSingle();

  if (error || !data) {
    // 이름/번호 중 뭐가 틀렸는지는 알려주지 않는 게 원칙 (계정 존재 여부 추측 방지)
    return new Response(
      JSON.stringify({ error: "일치하는 회원 정보가 없습니다." }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  return new Response(JSON.stringify({ email: maskEmail(data.email) }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

function maskEmail(email: string) {
  const [id, domain] = email.split("@");
  const visible = id.slice(0, Math.min(3, id.length));
  return `${visible}${"*".repeat(Math.max(id.length - visible.length, 2))}@${domain}`;
}
