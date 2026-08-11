import { createCustomer } from "@/api/customer";
import type { UseMutationCallback } from "@/type";
import { useMutation } from "@tanstack/react-query";

export function useCreateCustomer<CustomerEntity>(
  callbacks?: UseMutationCallback,
) {
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: (createdCustomer) => {
      if (callbacks?.onSuccess) callbacks.onSuccess(createdCustomer);
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
