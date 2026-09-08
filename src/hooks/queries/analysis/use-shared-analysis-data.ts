import { fetchSharedAnalysis } from "@/api/analysis";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export default function useSharedAnalysis(analysisId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.analysis.shared(analysisId!),
    queryFn: () => fetchSharedAnalysis(analysisId!),
    enabled: !!analysisId,
  });
}
