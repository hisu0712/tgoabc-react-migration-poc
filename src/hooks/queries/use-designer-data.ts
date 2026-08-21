import { fetchDesigner } from "@/api/designer";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export default function useDesignerData(id?: number) {
  return useQuery({
    queryKey: QUERY_KEYS.designer.byId(id!),
    queryFn: () => fetchDesigner(id!),
    enabled: !!id,
  });
}
