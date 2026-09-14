import { fetchAnalysisCount } from "@/api/analysis";
import { QUERY_KEYS } from "@/constants/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useAnalysisCount({
  memberId,
  customerId,
  personalType,
  since,
}: {
  memberId?: string;
  customerId?: string;
  personalType?: string;
  since?: string;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.analysis.count(
      memberId,
      customerId,
      personalType,
      since,
    ),
    queryFn: () =>
      fetchAnalysisCount({ memberId, customerId, personalType, since }),
    enabled: !!(customerId || memberId),
    placeholderData: keepPreviousData,
  });
}
