import { fetchDesigner } from "@/api/designer";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useDesignerData(id?: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.designer.byId(id!),
    queryFn: () => fetchDesigner(id!),
    enabled: !!id,
  });
}
