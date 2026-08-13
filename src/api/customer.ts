import { supabase } from "@/lib/supabase";
import type { Gender } from "@/type";

export async function fetchCustomer(customerId: string) {
  const { data, error } = await supabase
    .from("customer")
    .select("*")
    .eq("id", customerId)
    .single();

  if (error) throw error;
  return data;
}

/*
  -- 1. 함수: customer에 새 row 생기면 mapping 테이블에 (member_id, customer_id) 추가
  create or replace function public.handle_new_customer()
  returns trigger
  language plpgsql
  security definer set search_path = public
  as $$
  begin
    insert into public.member_customer_mapping (member_id, customer_id)
      values (
        auth.uid(),
        new.id
      );

      return new;
  end;
  $$;

  -- 2. 트리거: customer에 INSERT 발생 시 위 함수 실행
  create trigger on_customer_created
    after insert on public.customer
    for each row execute procedure public.handle_new_customer();
*/
export async function createCustomer({
  userId,
  name,
  email,
  birthDate,
  gender,
}: {
  userId: string;
  name: string;
  email: string;
  birthDate: string;
  gender: Gender;
}) {
  // 1. email 중복 체크
  const { data: existingCustomer, error: findCustomerError } = await supabase
    .from("customer")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (findCustomerError) throw findCustomerError;

  if (existingCustomer) {
    // 2. 이미 있는 고객이면, 이 회원과의 mapping 중복 체크
    const { data: existingMapping, error: findMappingError } = await supabase
      .from("member_customer_mapping")
      .select("id")
      .eq("customer_id", existingCustomer.id)
      .eq("member_id", userId)
      .maybeSingle();

    if (findMappingError) throw findMappingError;

    if (existingMapping) {
      throw new Error("이미 존재하는 고객입니다.");
    }

    // 3. 고객은 있지만 이 회원과의 매핑이 없는 경우 (-> mapping만 추가)
    const { error: insertMappingError } = await supabase
      .from("member_customer_mapping")
      .insert({ member_id: userId, customer_id: existingCustomer.id });

    if (insertMappingError) throw insertMappingError;

    return existingCustomer.id;
  }

  const { data: newCustomer, error: insertCustomerError } = await supabase
    .from("customer")
    .insert({
      name,
      email,
      birth_date: birthDate,
      gender,
    })
    .select("id")
    .single();

  if (insertCustomerError) throw insertCustomerError;
  return newCustomer.id;
}

export async function updateCustomer({
  customerId,
  name,
  email,
  birthDate,
  gender,
}: {
  customerId: string;
  name?: string;
  email?: string;
  birthDate?: string;
  gender?: Gender;
}) {
  const { data, error } = await supabase
    .from("customer")
    .update({ name, email, birth_date: birthDate, gender })
    .eq("id", customerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unlinkCustomer({
  userId,
  customerId,
}: {
  userId: string;
  customerId: string;
}) {
  const { error } = await supabase
    .from("member_customer_mapping")
    .delete()
    .eq("member_id", userId)
    .eq("customer_id", customerId);

  if (error) throw error;
}
