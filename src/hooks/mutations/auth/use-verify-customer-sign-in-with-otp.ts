import { verifyCustomerSignInWithOtp } from "@/api/auth";
import type { UseMutationCallback } from "@/type";
import { useMutation } from "@tanstack/react-query";

export function useVerifyCustomerSignInWithOtp(
  callbacks?: UseMutationCallback,
) {
  return useMutation({
    mutationFn: verifyCustomerSignInWithOtp,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
