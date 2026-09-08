import { enableAnalysisShare } from "@/api/analysis";
import type { UseMutationCallback } from "@/type";
import { useMutation } from "@tanstack/react-query";

export default function useEnableAnalysisShare(
  callbacks?: UseMutationCallback,
) {
  return useMutation({
    mutationFn: enableAnalysisShare,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
