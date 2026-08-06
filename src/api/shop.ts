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

export async function updateShop({
  userId,
  name,
  phone,
  address,
  address_detail,
}: {
  userId: string;
  name: string;
  phone?: string;
  address?: string;
  address_detail?: string;
}) {
  const { data, error } = await supabase
    .from("shop")
    .update({
      name,
      phone,
      address,
      address_detail,
    })
    .eq("member_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
