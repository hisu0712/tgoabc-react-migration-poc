import { requestCustomerSignInWithOtp } from "@/api/auth";
import type { UseMutationCallback } from "@/type";
import { useMutation } from "@tanstack/react-query";

export function useRequestCustomerSignInWithOtp(
  callbacks?: UseMutationCallback,
) {
  return useMutation({
    mutationFn: requestCustomerSignInWithOtp,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
