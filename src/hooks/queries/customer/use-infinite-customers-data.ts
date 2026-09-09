import { fetchCustomersByMember } from "@/api/customer";
import { QUERY_KEYS } from "@/constants/query-keys";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 10;

export default function useInfiniteCustomers({
  memberId,
  keyword,
  designerId,
}: {
  memberId?: string;
  keyword?: string;
  designerId?: number;
}) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.customer.memberList(memberId!, keyword, designerId),
    queryFn: ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      return fetchCustomersByMember({
        from,
        to,
        memberId: memberId!,
        keyword,
        designerId,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined; // 마지막 페이지 도달 (undefined 반환하면 fetchNextPage 등 막힘)
      return allPages.length;
    },
    staleTime: Infinity, // 가져온 데이터를 React Query가 자동으로 stale 상태로 만들지X
    enabled: !!memberId,
    placeholderData: keepPreviousData, // queryKey가 바뀌어도 새 데이터가 올 때까지 이전 key의 값을 그대로 유지
  });
}
