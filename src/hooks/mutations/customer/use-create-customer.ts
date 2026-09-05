import { createCustomer } from "@/api/customer";
import type { UseMutationCallback } from "@/type";
import { useMutation } from "@tanstack/react-query";

export function useCreateCustomer(
  callbacks?: UseMutationCallback<{
    customerId: string;
    isAlreadyExists: boolean;
  }>,
) {
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: (result) => {
      if (callbacks?.onSuccess) callbacks.onSuccess(result);
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
