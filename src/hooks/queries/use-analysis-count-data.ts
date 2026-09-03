import { fetchAnalysisCount } from "@/api/analysis";
import { QUERY_KEYS } from "@/lib/constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useAnalysisCount({
  memberId,
  customerId,
  personalType,
}: {
  memberId?: string;
  customerId?: string;
  personalType?: string;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.analysis.count(memberId, customerId, personalType),
    queryFn: () => fetchAnalysisCount({ memberId, customerId, personalType }),
    enabled: !!(customerId || memberId),
    placeholderData: keepPreviousData,
  });
}
