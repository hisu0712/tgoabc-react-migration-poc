import { fetchMember } from "@/api/member";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useMemberData(userId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.member.byId(userId!),
    queryFn: () => fetchMember(userId!),
  });
}
