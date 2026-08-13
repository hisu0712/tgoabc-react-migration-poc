import { supabase } from "@/lib/supabase";

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    await supabase.auth.signOut({
      scope: "local",
    });
  }
}

/*
  -- 1. 함수: auth.users에 새 유저 생기면 member, shop 테이블에 같은 유저 추가
  create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer set search_path = public
  as $$
  begin
    insert into public.member (id, email, name, phone)
      values (
        new.id,
        new.email,
        new.raw_user_meta_data->>'name',
        new.raw_user_meta_data->>'phone'
      );

    insert into public.shop (member_id, name)
      values (
        new.id,
        new.raw_user_meta_data->>'shopName'
      );

    return new;
  end;
  $$;

  -- 2. 트리거: auth.users에 INSERT 발생 시 위 함수 실행
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
*/
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
