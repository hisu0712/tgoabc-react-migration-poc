import { useSession } from "@/store/session";
import { StatsCard, type StatItem } from "./stat-item";
import useCustomerCount from "@/hooks/queries/customer/use-customer-count-data";
import dayjs from "dayjs";
import ErrorRedirect from "@/components/error-redirect";
import { MEMBER_HOME_PATH } from "@/lib/route";

export default function CustomerStatCard() {
  const session = useSession();
  const memberId = session!.user.id;

  const {
    data: totalCustomer,
    isPending: isFetchTotalCustomerPending,
    isError: isFetchTotalCustomerError,
  } = useCustomerCount({ memberId }); // 1. 전체 고객

  const {
    data: newCustomer,
    isPending: isFetchNewCustomerPending,
    isError: isFetchNewCustomerError,
  } = useCustomerCount({
    memberId,
    since: dayjs().subtract(30, "day").startOf("day").toISOString(),
  }); // 2. 최근 30일 신규 고객

  if (isFetchTotalCustomerError || isFetchNewCustomerError)
    return (
      <ErrorRedirect
        to={MEMBER_HOME_PATH}
        message="문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      />
    );

  const customerStats: StatItem[] = [
    {
      label: "전체 고객",
      value: totalCustomer!,
      unit: "명",
      isPending: isFetchTotalCustomerPending,
    },
    {
      label: "신규 고객",
      subLabel: "(최근 30일)",
      value: newCustomer!,
      unit: "명",
      isPending: isFetchNewCustomerPending,
    },
  ];

  return <StatsCard items={customerStats} />;
}
