import { supabase } from "@/lib/supabase";

export async function fetchMember(memberId: string) {
  const { data, error } = await supabase
    .from("member")
    .select("*")
    .eq("id", memberId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateMember({
  memberId,
  name,
  phone,
}: {
  memberId: string;
  name?: string;
  phone?: string;
}) {
  const { data, error } = await supabase
    .from("member")
    .update({ name, phone })
    .eq("id", memberId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
