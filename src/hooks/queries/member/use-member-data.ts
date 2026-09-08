import { fetchMember } from "@/api/member";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useMemberData(memberId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.member.byId(memberId!),
    queryFn: () => fetchMember(memberId!),
    enabled: !!memberId,
  });
}
