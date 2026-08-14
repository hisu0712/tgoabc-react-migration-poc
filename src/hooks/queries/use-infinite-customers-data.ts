import { fetchCustomersByMember } from "@/api/customer";
import { QUERY_KEYS } from "@/lib/constants";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 7;

export default function useInfiniteCustomers({
  memberId,
  keyword,
}: {
  memberId?: string;
  keyword?: string;
}) {
  // 현재는 memberId가 있어야 고객 리스트 호출이 가능하지만 추후 재사용성을 고려한 수정 가능
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.customer.memberList(memberId!, keyword),
    queryFn: ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      return fetchCustomersByMember({
        from,
        to,
        memberId: memberId!,
        keyword,
      });

      // customers.forEach((customer) => {
      //   queryClient.setQueryData(
      //     QUERY_KEYS.customer.byId(customer.id),
      //     customer,
      //   );
      // });

      // return customers.map((cutomer) => cutomer.id);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined; // 마지막 페이지 도달
      return allPages.length;
    },
    staleTime: Infinity, // 가져온 데이터를 React Query가 자동으로 stale 상태로 만들지X
    enabled: !!memberId,
  });
}
