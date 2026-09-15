import { fetchAnalysisCountByPeriod } from "@/api/analysis";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { Granularity } from "@/types";
import { useQuery } from "@tanstack/react-query";

export default function useAnalysisCountByPeriod({
  memberId,
  pivotDate,
  granularity,
}: {
  memberId?: string;
  pivotDate: string;
  granularity: Granularity;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.analysis.countByPeriod(
      memberId!,
      pivotDate,
      granularity,
    ),
    queryFn: () =>
      fetchAnalysisCountByPeriod({
        memberId: memberId!,
        pivotDate,
        granularity,
      }),
    enabled: !!memberId,
  });
}
