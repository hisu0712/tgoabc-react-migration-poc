import { fetchRecentAnalyses } from "@/api/analysis";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export default function useRecentAnalyses({ memberId }: { memberId: string }) {
  return useQuery({
    queryKey: QUERY_KEYS.analysis.memberList(memberId!),
    queryFn: () => fetchRecentAnalyses(memberId!),
    enabled: !!memberId,
  });
}
