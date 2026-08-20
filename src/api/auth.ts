import { supabase } from "@/lib/supabase";
import type { UserType } from "@/type";

export async function signOut() {
  const { error } = await supabase.auth.signOut(); // scope: "global"

  if (error) {
    await supabase.auth.signOut({
      scope: "local",
    });
  }
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

export async function findId({ name, phone }: { name: string; phone: string }) {
  const { data, error } = await supabase.functions.invoke("find-id", {
    body: { name, phone },
  });

  if (error) throw error;
  return data;
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${import.meta.env.VITE_PUBLIC_URL}/reset-password`,
  });

  if (error) throw error;
  return data;
}

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw error;
  return data;
}

export async function signInWithOtp({
  email,
  shouldCreateUser,
}: {
  email: string;
  shouldCreateUser: boolean;
}) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser }, // 회원: 유저 생성 가능, 고객: 이미 존재하는 고객 유저만 가능
  });

  if (error) throw error;
}

export async function completeCustomerSignIn({
  email,
  token, // 사용자가 메일함에서 받아서 입력한 6자리 코드
}: {
  email: string;
  token: string;
}) {
  // OTP 검증 + role 부여
  const { data: verifyData, error: verifyError } =
    await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

  if (verifyError) throw verifyError;

  const roles =
    (verifyData.session?.user.app_metadata.roles as UserType[] | undefined) ??
    [];

  if (roles.includes("customer")) return; // 이미 customer role이 등록된 고객은 edge function 생략

  const { error: signupError } = await supabase.functions.invoke(
    "handle-role-signup",
    { body: { entryPoint: "customer" } },
  );

  if (signupError) throw signupError;

  await supabase.auth.refreshSession(); // app_metadata 세션 반영
}

export async function verifyOtp({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) throw error;
}

export async function completeMemberSignUp({
  name,
  phone,
  shopName,
  password,
}: {
  name: string;
  phone: string;
  shopName: string;
  password: string;
}) {
  // 비밀번호 설정 + role 부여
  const { error: passwordError } = await supabase.auth.updateUser({
    password,
  });

  if (passwordError) throw passwordError;

  const { error: roleError } = await supabase.functions.invoke(
    "handle-role-signup",
    {
      body: { entryPoint: "member", name, phone, shopName },
    },
  );

  if (roleError) throw roleError;

  await supabase.auth.refreshSession(); // app_metadata 세션 반영
}
