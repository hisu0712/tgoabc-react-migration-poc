import type { Database } from "./database.types";

export type MemberEntity = Database["public"]["Tables"]["member"]["Row"];
export type ShopEntity = Database["public"]["Tables"]["shop"]["Row"];
export type CustomerEntity = Database["public"]["Tables"]["customer"]["Row"];
export type MemberCustomerMappingEntity =
  Database["public"]["Tables"]["member_customer_mapping"]["Row"];
export type DesignerEntity = Database["public"]["Tables"]["designer"]["Row"];
export type Gender = Database["public"]["Enums"]["gender"];

export type UserType = "member" | "customer";

export type UseMutationCallback<TData = void> = {
  onSuccess?: (data?: TData) => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};
