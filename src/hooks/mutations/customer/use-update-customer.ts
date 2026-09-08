import { updateCustomer } from "@/api/customer";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { CustomerEntity, UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCustomer(
  callbacks?: UseMutationCallback<CustomerEntity>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: (updatedCustomer) => {
      if (callbacks?.onSuccess) callbacks.onSuccess(updatedCustomer);

      queryClient.setQueryData<CustomerEntity>(
        QUERY_KEYS.customer.byId(updatedCustomer.id),
        updatedCustomer,
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
