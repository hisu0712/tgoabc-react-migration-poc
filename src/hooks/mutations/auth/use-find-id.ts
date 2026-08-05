import { findId } from "@/api/auth";
import type { UseMutationCallback } from "@/type";
import { useMutation } from "@tanstack/react-query";

type FindIdResponse = Awaited<ReturnType<typeof findId>>;

export function useFindId(callbacks?: UseMutationCallback<FindIdResponse>) {
  return useMutation({
    mutationFn: findId,
    onSuccess: (data) => {
      if (callbacks?.onSuccess) callbacks.onSuccess(data);
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
