import { signInWithOtp } from "@/api/auth";
import type { UseMutationCallback } from "@/types";
import { useMutation } from "@tanstack/react-query";

type SignInWithOtpResponse = Awaited<ReturnType<typeof signInWithOtp>>;

export function useSignInWithOtp(
  callbacks?: UseMutationCallback<SignInWithOtpResponse>,
) {
  return useMutation({
    mutationFn: signInWithOtp,
    onSuccess: (data) => {
      if (callbacks?.onSuccess) callbacks.onSuccess(data);
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
