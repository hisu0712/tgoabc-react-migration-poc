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
    // member,shop 테이블에 트리거 함수 추가
    options: {
      data: { name, phone, shopName },
    },
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
