import { resetPassword } from "@/api/auth";
import type { UseMutationCallback } from "@/type";
import { useMutation } from "@tanstack/react-query";

export function useResetPassword(callbacks?: UseMutationCallback) {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
