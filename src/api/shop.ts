import { supabase } from "@/lib/supabase";
import { deleteImagesInPath, uploadImage } from "./image";

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
  shopImageFile,
}: {
  userId: string;
  name: string;
  phone?: string;
  address?: string;
  address_detail?: string;
  shopImageFile?: File;
}) {
  if (shopImageFile) {
    await deleteImagesInPath(`${userId}/shop`);
  }

  let newShopImageUrl;
  if (shopImageFile) {
    const fileExtension = shopImageFile.name.split(".").pop() || "webp";
    const filePath = `${userId}/shop/${new Date().getTime()}-${crypto.randomUUID()}.${fileExtension}`;

    newShopImageUrl = await uploadImage({
      file: shopImageFile,
      filePath,
    });
  }

  const { data, error } = await supabase
    .from("shop")
    .update({
      name,
      phone,
      address,
      address_detail,
      logo_url: newShopImageUrl,
    })
    .eq("member_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
