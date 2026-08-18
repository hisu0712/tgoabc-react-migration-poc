import { completeCustomerSignIn } from "@/api/auth";
import type { UseMutationCallback } from "@/type";
import { useMutation } from "@tanstack/react-query";

export function useCompleteCustomerSignIn(callbacks?: UseMutationCallback) {
  return useMutation({
    mutationFn: completeCustomerSignIn,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
