import { createCustomer } from "@/api/customer";
import type { CustomerEntity, UseMutationCallback } from "@/type";
import { useMutation } from "@tanstack/react-query";

export function useCreateCustomer(
  callbacks?: UseMutationCallback<CustomerEntity>,
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
