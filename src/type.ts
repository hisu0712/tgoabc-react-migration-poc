import type { Database } from "./database.types";

export type MemberEntity = Database["public"]["Tables"]["member"]["Row"];
export type ShopEntity = Database["public"]["Tables"]["shop"]["Row"];

export type UseMutationCallback = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};
