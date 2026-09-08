import { fetchCustomerWithDesigner } from "@/api/customer";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export default function useCustomerWithDesignerData({
  customerId,
  memberId,
}: {
  customerId?: string;
  memberId?: string;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.customer.byId(customerId!),
    queryFn: () =>
      fetchCustomerWithDesigner({
        customerId: customerId!,
        memberId: memberId!,
      }),
    enabled: !!customerId,
  });
}
