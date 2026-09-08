import { unlinkCustomer } from "@/api/customer";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { CustomerEntity, UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUnlinkCustomer(
  callbacks?: UseMutationCallback<CustomerEntity>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unlinkCustomer,
    onSuccess: (_, { customerId }) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      queryClient.removeQueries({
        queryKey: QUERY_KEYS.customer.byId(customerId),
      });
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
