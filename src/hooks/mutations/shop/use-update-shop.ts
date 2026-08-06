import { updateShop } from "@/api/shop";
import { QUERY_KEYS } from "@/lib/constants";
import type { ShopEntity, UseMutationCallback } from "@/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateShop(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateShop,
    onSuccess: (updatedShop) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      queryClient.setQueryData<ShopEntity>(
        QUERY_KEYS.shop.byId(updatedShop.member_id),
        updatedShop, 
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
