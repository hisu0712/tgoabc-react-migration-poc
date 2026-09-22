import { fetchCustomerConfirmedAt } from "@/api/customer";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export default function useCustomerConfirmedAt(customerId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.customer.confirmedAt(customerId!),
    queryFn: () => fetchCustomerConfirmedAt(customerId!),
    enabled: !!customerId,
  });
}
