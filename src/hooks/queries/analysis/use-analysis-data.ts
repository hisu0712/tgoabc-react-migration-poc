import { fetchAnalysis } from "@/api/analysis";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export default function useAnalysisData(analysisId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.analysis.byId(analysisId!),
    queryFn: () => fetchAnalysis(analysisId!),
    enabled: !!analysisId,
  });
}
