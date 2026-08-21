import { supabase } from "@/lib/supabase";

export async function fetchDesigner(id: number) {
  const { data, error } = await supabase
    .from("designer")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchDesigners(memberId: string) {
  const { data, error } = await supabase
    .from("designer")
    .select("*")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createDesigner({
  memberId,
  name,
  phone,
}: {
  memberId: string;
  name: string;
  phone: string;
}) {
  const { data, error } = await supabase
    .from("designer")
    .insert({ member_id: memberId, name, phone })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDesigner({
  designerId,
  name,
  phone,
}: {
  designerId: number;
  name?: string;
  phone?: string;
}) {
  const { data, error } = await supabase
    .from("designer")
    .update({ name, phone })
    .eq("id", designerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDesigner(designerId: number) {
  const { data, error } = await supabase
    .from("designer")
    .delete()
    .eq("id", designerId)
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}
