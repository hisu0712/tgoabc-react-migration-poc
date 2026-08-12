import { fetchCustomer } from "@/api/customer";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export default function useCustomerData(customerId?: string) {
  // 옵셔널 매개변수는 페이지에서 해당 쿼리를 호출 시에 customerId가 없을 수도 있기 때문
  return useQuery({
    queryKey: QUERY_KEYS.customer.byId(customerId!),
    queryFn: () => fetchCustomer(customerId!),
    enabled: !!customerId, // customerId가 없을 때 네트워크 요청 막기
  });
}
