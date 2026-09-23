import { requestCustomerEmailChange } from "@/api/customer";
import type { UseMutationCallback } from "@/types";
import { useMutation } from "@tanstack/react-query";

type RequestCustomerEmailChangeResult = Awaited<
  ReturnType<typeof requestCustomerEmailChange>
>;

export function useRequestCustomerEmailChange(
  callbacks?: UseMutationCallback<RequestCustomerEmailChangeResult>,
) {
  return useMutation({
    mutationFn: requestCustomerEmailChange,
    onSuccess: (result) => {
      if (callbacks?.onSuccess) callbacks.onSuccess(result);
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
