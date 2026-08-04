import { supabase } from "@/lib/supabase";

export async function fetchShop(userId: string) {
  const { data, error } = await supabase
    .from("shop")
    .select("*")
    .eq("member_id", userId)
    .single();

  if (error) throw error;
  return data;
}
