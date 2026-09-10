import EmptyContent from "@/components/empty-content";
import HeaderNav from "@/components/layout/header-nav";
import { useSession } from "@/store/session";
import useCustomerData from "@/hooks/queries/customer/use-customer-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { PERSONAL_TYPE_LABEL, type PersonalType } from "@/lib/analysis";
import { useInView } from "react-intersection-observer";
import useInfiniteAnalyses from "@/hooks/queries/analysis/use-infinite-analyses-data";
import useAnalysisCount from "@/hooks/queries/analysis/use-analysis-count-data";
import ErrorRedirect from "@/components/error-redirect";
import { CUSTOMER_HOME_PATH } from "@/lib/route";
import AnalysisCard from "./components/analysis-card";
import ListSkeleton from "@/components/list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalysisListPage() {
  const session = useSession();
  const { ref, inView } = useInView({ rootMargin: "0px 0px -80px 0px" });

  const [personalType, setPersonalType] = useState<PersonalType | "all">("all");

  const { data: customer, isLoading: isFetchCustomerLoading } = useCustomerData(
    session!.user.id,
  );
  const { data: analysisCount, isLoading: isAnalysisCountLoading } =
    useAnalysisCount({
      customerId: session!.user.id,
      personalType: personalType === "all" ? undefined : personalType,
    });

  const {
    data: analyses,
    isError: isFetchAnalysesError,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteAnalyses({
    customerId: session!.user.id,
    personalType: personalType === "all" ? undefined : personalType,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage]);

  if (isFetchAnalysesError) return <ErrorRedirect to={CUSTOMER_HOME_PATH} />;

  return (
    <>
      <HeaderNav title="기록리스트" />

      <div className="mb-4">
        {isFetchCustomerLoading ? (
          <Skeleton className="h-7 w-30" />
        ) : (
          <div className="text-xl font-semibold">
            {customer?.name ? `${customer.name} 님의 ` : ""}분석 기록
          </div>
        )}
      </div>

      <div className="mb-2 flex items-center justify-between">
        {isAnalysisCountLoading ? (
          <Skeleton className="h-5 w-13" />
        ) : (
          <div className="text-muted-foreground text-sm">
            전체 {analysisCount ?? "-"}건
          </div>
        )}

        <Select
          value={personalType}
          onValueChange={(v) => setPersonalType(v as PersonalType | "all")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">전체</SelectItem>
            {Object.entries(PERSONAL_TYPE_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        {isPending ? (
          <ListSkeleton className="h-19" />
        ) : analyses?.pages[0].length ? (
          analyses.pages.map((page) =>
            page.map((a) => (
              <AnalysisCard
                to={`/analysis/${a.id}`}
                personalType={a.personalType}
                key={a.id}
                date={dayjs(a.created_at).format("YYYY-MM-DD (HH:mm)")}
              />
            )),
          )
        ) : (
          <EmptyContent content="아직 분석된 기록이 없습니다." />
        )}

        {isFetchingNextPage && <ListSkeleton count={2} className="h-19" />}
        <div ref={ref}></div>
      </div>
    </>
  );
}
