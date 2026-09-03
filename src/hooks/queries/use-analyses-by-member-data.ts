import { fetchAnalysesByMember } from "@/api/analysis";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export default function useAnalysesByMember(memberId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.analysis.memberList(memberId!),
    queryFn: () => fetchAnalysesByMember(memberId!),
    enabled: !!memberId,
  });
}
