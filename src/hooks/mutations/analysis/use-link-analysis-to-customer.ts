import { linkAnalysisToCustomer } from "@/api/analysis";
import type { UseMutationCallback } from "@/types";
import { useMutation } from "@tanstack/react-query";

export default function useLinkAnalysisToCustomer(
  callbacks?: UseMutationCallback,
) {
  return useMutation({
    mutationFn: linkAnalysisToCustomer,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
