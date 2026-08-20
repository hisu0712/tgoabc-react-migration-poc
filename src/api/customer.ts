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
  memberId,
  name,
  email,
  birthDate,
  gender,
}: {
  memberId: string;
  name: string;
  email: string;
  birthDate: string;
  gender: Gender;
}) {
  // 1. 이미 존재하는 고객인지 확인 (email 중복 확인)
  const { data: existingCustomer, error: findCustomerError } = await supabase
    .from("customer")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (findCustomerError) throw findCustomerError;

  if (existingCustomer) {
    // *이미 있는 고객이면, 이 회원과의 mapping 중복 체크
    const { data: existingMapping, error: findMappingError } = await supabase
      .from("member_customer_mapping")
      .select("id")
      .eq("customer_id", existingCustomer.id)
      .eq("member_id", memberId)
      .maybeSingle();

    if (findMappingError) throw findMappingError;

    if (existingMapping) {
      throw new Error("이미 존재하는 고객입니다.");
    }

    // *고객은 있지만 이 회원과의 매핑이 없는 경우 (-> mapping만 추가)
    const { error: insertMappingError } = await supabase
      .from("member_customer_mapping")
      .insert({ member_id: memberId, customer_id: existingCustomer.id });

    if (insertMappingError) throw insertMappingError;

    return existingCustomer.id;
  }

  // 2. 신규 고객: auth 생성 + customer insert + mapping insert
  const { data: result, error: createError } = await supabase.functions.invoke<{
    customerId: string;
  }>("create-customer-auth", { body: { email, name, birthDate, gender } });

  if (createError) throw createError;

  return result!.customerId;
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
  memberId,
  customerId,
}: {
  memberId: string;
  customerId: string;
}) {
  const { error } = await supabase
    .from("member_customer_mapping")
    .delete()
    .eq("member_id", memberId)
    .eq("customer_id", customerId);

  if (error) throw error;
}

export async function fetchCustomersByMember({
  from,
  to,
  memberId,
  keyword,
}: {
  from: number;
  to: number;
  memberId: string;
  keyword?: string;
}) {
  let query = supabase
    .from("customer")
    .select("*, member_customer_mapping!inner(member_id)")
    .eq("member_customer_mapping.member_id", memberId);

  if (keyword) {
    // ilike는 PostgreSQL의 대소문자 구분 없는 부분 검색
    // %는 앞뒤에 어떤 문자열이 와도 된다는 와일드카드
    query = query.or(`name.ilike.%${keyword}%,email.ilike.%${keyword}%`);
  }

  const { data, error } = await query.range(from, to);

  if (error) throw error;
  return data;
}

export async function fetchCustomerCountByMember(memberId: string) {
  const { count, error } = await supabase
    .from("customer")
    .select("*, member_customer_mapping!inner(member_id)", {
      count: "exact", // PostgREST가 "총 몇 건 매치되는지"를 어떤 방식으로 셀지 정하는 옵션
      head: true,
    })
    .eq("member_customer_mapping.member_id", memberId);

  if (error) throw error;
  return count;
}
