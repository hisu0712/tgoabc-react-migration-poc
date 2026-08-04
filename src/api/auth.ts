import { supabase } from "@/lib/supabase";

export async function signUp({
  name,
  email,
  password,
  phone,
  shopName,
}: {
  name: string;
  email: string;
  password: string;
  phone: string;
  shopName: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // 트리거 함수로 member 테이블에 유저 복사 (+ 이름, 폰)
    options: {
      data: { name, phone },
    },
  });

  if (error) throw error;
  return data;
}
