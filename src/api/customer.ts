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

export async function createCustomer({
  name,
  email,
  birthDate,
  gender,
}: {
  name: string;
  email: string;
  birthDate: string;
  gender: Gender;
}) {
  const { data, error } = await supabase
    .from("customer")
    .insert({
      name,
      email,
      birth_date: birthDate,
      gender,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
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
