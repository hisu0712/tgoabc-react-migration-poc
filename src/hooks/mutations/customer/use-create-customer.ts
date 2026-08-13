import { createCustomer } from "@/api/customer";
import type { CustomerEntity, UseMutationCallback } from "@/type";
import { useMutation } from "@tanstack/react-query";

export function useCreateCustomer(
  callbacks?: UseMutationCallback<CustomerEntity["id"]>,
) {
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: (createdCustomerId) => {
      if (callbacks?.onSuccess) callbacks.onSuccess(createdCustomerId);
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
