import { supabase } from "@/lib/supabase";
import { deleteImagesInPath, uploadImage } from "./image";

export async function fetchShop(memberId: string) {
  const { data, error } = await supabase
    .from("shop")
    .select("*")
    .eq("member_id", memberId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateShop({
  memberId,
  name,
  phone,
  address,
  address_detail,
  shopImageFile,
}: {
  memberId: string;
  name: string;
  phone?: string;
  address?: string;
  address_detail?: string;
  shopImageFile?: File;
}) {
  if (shopImageFile) {
    await deleteImagesInPath(`${memberId}/shop`);
  }

  let newShopImageUrl;
  if (shopImageFile) {
    const fileExtension = shopImageFile.name.split(".").pop() || "webp";
    const filePath = `${memberId}/shop/${new Date().getTime()}-${crypto.randomUUID()}.${fileExtension}`;

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
    .eq("member_id", memberId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
