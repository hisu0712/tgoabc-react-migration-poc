import { fetchAnalysesCountByCustomer } from "@/api/analysis";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export default function useAnalysisCount({
  customerId,
  personalType,
}: {
  customerId?: string;
  personalType?: string;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.analysis.customerCount(customerId!, personalType),
    queryFn: () =>
      fetchAnalysesCountByCustomer({ customerId: customerId!, personalType }),
    enabled: !!customerId,
  });
}
