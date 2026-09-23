import { confirmCustomerEmailChange } from "@/api/customer";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useSession } from "@/store/session";
import type { UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useConfirmCustomerEmailChange(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();
  const session = useSession();

  return useMutation({
    mutationFn: confirmCustomerEmailChange,
    onSuccess: (data, variables) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.customer.byId(variables.customerId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.customer.byId(data.conflictCustomerId),
      });
      queryClient.invalidateQueries({
        queryKey: ["customer", "memberList", session!.user.id],
      });
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
