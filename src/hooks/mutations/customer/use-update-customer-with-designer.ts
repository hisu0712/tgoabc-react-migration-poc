import { updateCustomerWithDesigner } from "@/api/customer";
import { QUERY_KEYS } from "@/lib/constants";
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

  return useMutation({
    mutationFn: updateCustomerWithDesigner,
    onSuccess: (updatedCustomer) => {
      if (callbacks?.onSuccess) callbacks.onSuccess(updatedCustomer);

      queryClient.setQueryData<CustomerWithDesigner>(
        QUERY_KEYS.customer.byId(updatedCustomer.id),
        updatedCustomer,
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
