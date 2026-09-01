import { createAnalysis } from "@/api/analysis";
import type { UseMutationCallback } from "@/type";
import { useMutation } from "@tanstack/react-query";

export default function useCreateAnalysis(callbacks?: UseMutationCallback) {
  return useMutation({
    mutationFn: createAnalysis,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
