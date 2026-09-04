import { updateCustomerWithDesigner } from "@/api/customer";
import { QUERY_KEYS } from "@/lib/constants";
import { useSession } from "@/store/session";
import type {
  CustomerEntity,
  CustomerWithDesigner,
  UseMutationCallback,
} from "@/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCustomerWithDesigner(
  callbacks?: UseMutationCallback<CustomerEntity>,
) {
  const queryClient = useQueryClient();
  const session = useSession();

  return useMutation({
    mutationFn: updateCustomerWithDesigner,
    onSuccess: (updatedCustomer) => {
      if (callbacks?.onSuccess) callbacks.onSuccess(updatedCustomer);

      queryClient.setQueryData<CustomerWithDesigner>(
        QUERY_KEYS.customer.byId(updatedCustomer.id),
        updatedCustomer,
      );
      queryClient.invalidateQueries({
        queryKey: ["customer", "memberList", session!.user.id],
      });
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
