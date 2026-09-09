import { CustomerCard, LinkCard } from "@/components/card";
import HeaderNav from "@/components/layout/header-nav";
import { useInView } from "react-intersection-observer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useInfiniteCustomers from "@/hooks/queries/customer/use-infinite-customers-data";
import { useSession } from "@/store/session";
import { PlusIcon, ScissorsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import useCustomerCount from "@/hooks/queries/customer/use-customer-count-data";
import useDesignersData from "@/hooks/queries/designer/use-designers-data";
import EmptyContent from "@/components/empty-content";
import ErrorRedirect from "@/components/error-redirect";
import { MEMBER_HOME_PATH } from "@/lib/route";
import SearchInput from "@/components/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import ListSkeleton from "@/components/list-skeleton";

export default function CustomerListPage() {
  const session = useSession();
  const { ref, inView } = useInView({ rootMargin: "0px 0px -80px 0px" });

  const [searchKeyword, setSearchKeyword] = useState("");
  const [designerId, setDesignerId] = useState("all");

  const { data: customerCount, isLoading: isFetchCustomerCountLoading } =
    useCustomerCount({
      memberId: session!.user.id,
      keyword: searchKeyword,
      designerId: designerId === "all" ? undefined : Number(designerId),
    });
  const { data: designers } = useDesignersData(session!.user.id);

  const {
    data: customers,
    isError: isFetchCustomersError,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isPlaceholderData,
  } = useInfiniteCustomers({
    memberId: session?.user.id,
    keyword: searchKeyword,
    designerId: designerId === "all" ? undefined : Number(designerId),
  });

  useEffect(() => {
    // 스크롤이 하단에 닿았을 때 다음페이지 호출
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage]);

  if (isFetchCustomersError) return <ErrorRedirect to={MEMBER_HOME_PATH} />;

  return (
    <>
      <HeaderNav
        title="고객 목록"
        hideBack
        bottomSlot={
          <SearchInput
            onSearch={setSearchKeyword}
            placeholder="이름 또는 이메일"
          />
        }
      />

      <LinkCard
        to={"/customers/new"}
        variant={"gradient"}
        className="mb-4 flex items-center justify-between"
      >
        <span className="text-lg font-semibold">신규 고객 추가</span>
        <PlusIcon className="size-9" strokeWidth={1.3} />
      </LinkCard>

      <div className="bg-muted-foreground/20 mb-7 h-px w-full"></div>

      <div className="mb-3 flex items-center justify-between">
        {isFetchCustomerCountLoading ? (
          <Skeleton className="h-5 w-13" />
        ) : (
          <div className="text-muted-foreground text-sm">
            고객 {customerCount ?? "-"}명
          </div>
        )}

        <Select value={designerId} onValueChange={setDesignerId}>
          <SelectTrigger>
            <ScissorsIcon className="size-4" strokeWidth={1.5} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">전체</SelectItem>
            {designers?.map((designer) => (
              <SelectItem key={designer.id} value={String(designer.id)}>
                {designer.name} 디자이너
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        className={cn(
          "flex flex-col gap-2",
          isPlaceholderData && "opacity-60 transition-opacity",
        )}
      >
        {isPending ? (
          <ListSkeleton />
        ) : customers?.pages[0].length ? (
          customers.pages.map((page) =>
            page.map((c) => {
              const designerName = designers?.find(
                (d) => d.id === c.designer_id,
              )?.name;
              return (
                <CustomerCard
                  key={c.id}
                  id={c.id}
                  name={c.name}
                  birthDate={c.birth_date}
                  designerName={designerName}
                />
              );
            }),
          )
        ) : (
          <EmptyContent content="아직 등록된 고객이 없습니다." />
        )}

        {isFetchingNextPage && <ListSkeleton count={2} />}
        <div ref={ref}></div>
      </div>
    </>
  );
}
