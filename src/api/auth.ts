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
    // 트리거 함수로 member 테이블에 auth.uid, 이메일 복제 (+ 이름, 폰)
    options: {
      data: { name, phone },
    },
    // 트리거 함수로 shop  테이블에 행 추가 (+매장명)
  });

  if (error) throw error;
  return data;
}

export async function signInWithPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}
