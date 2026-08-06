import { supabase } from "@/lib/supabase";

export async function fetchMember(userId: string) {
  const { data, error } = await supabase
    .from("member")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateMember({
  userId,
  name,
  phone,
}: {
  userId: string;
  name?: string;
  phone?: string;
}) {
  const { data, error } = await supabase
    .from("member")
    .update({ name, phone })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
