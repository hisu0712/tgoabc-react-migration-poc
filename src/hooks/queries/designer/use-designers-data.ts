import { fetchDesigners } from "@/api/designer";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export default function useDesignersData(memberId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.designer.memberList(memberId!),
    queryFn: () => fetchDesigners(memberId!),
    enabled: !!memberId,
  });
}
