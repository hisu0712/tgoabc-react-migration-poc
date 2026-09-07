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

export async function fetchShops(customerId: string) {
  const { data: mappings, error: mappingError } = await supabase
    .from("member_customer_mapping")
    .select("member_id")
    .eq("customer_id", customerId);

  if (mappingError) throw mappingError;

  const memberIds = mappings.map((mapping) => mapping.member_id);
  if (memberIds.length === 0) return [];

  const { data: shops, error: shopError } = await supabase
    .from("shop")
    .select("*")
    .in("member_id", memberIds); // member_id가 주어진 목록 중 하나와 일치하는 행

  if (shopError) throw shopError;
  return shops;
}

export async function updateShop({
  memberId,
  name,
  phone,
  address,
  address_detail,
  shopImageFile,
  removeShopImage,
}: {
  memberId: string;
  name: string;
  phone?: string;
  address?: string;
  address_detail?: string;
  shopImageFile?: File;
  removeShopImage?: boolean;
}) {
  let newShopImageUrl;

  if (shopImageFile) {
    await deleteImagesInPath(`${memberId}/shop`);

    const fileExtension = shopImageFile.name.split(".").pop() || "webp";
    const filePath = `${memberId}/shop/${new Date().getTime()}-${crypto.randomUUID()}.${fileExtension}`;

    newShopImageUrl = await uploadImage({
      file: shopImageFile,
      filePath,
    });
  } else if (removeShopImage) {
    await deleteImagesInPath(`${memberId}/shop`);
    newShopImageUrl = null;
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
