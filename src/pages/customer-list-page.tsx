import { CustomerCard, LinkCard } from "@/components/card";
import HeaderNav from "@/components/header-nav";
import { Input } from "@/components/ui/input";
import { useInView } from "react-intersection-observer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useInfiniteCustomers from "@/hooks/queries/use-infinite-customers-data";
import { useSession } from "@/store/session";
import { Plus, Scissors, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import Loader from "@/components/loader";
import useCustomerCount from "@/hooks/queries/use-customer-count-data";
import useDesignersData from "@/hooks/queries/use-designers-data";
import EmptyContent from "@/components/emptyContent";

export default function CustomerListPage() {
  const session = useSession();
  const { ref, inView } = useInView();

  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [designerId, setDesignerId] = useState("all");

  const { data: customerCount } = useCustomerCount({
    memberId: session!.user.id,
    keyword: searchKeyword,
    designerId: designerId === "all" ? undefined : Number(designerId),
  });
  const { data: designers } = useDesignersData(session!.user.id);

  const {
    data: customers,
    isError,
    isPending,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteCustomers({
    memberId: session?.user.id,
    keyword: searchKeyword,
    designerId: designerId === "all" ? undefined : Number(designerId),
  });

  useEffect(() => {
    // 스크롤이 하단에 닿았을 때 다음페이지 호출
    if (inView) fetchNextPage();
  }, [inView]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(keyword);
    }, 300); // 0.3초마다 자동 검색

    return () => clearTimeout(timer);
  }, [keyword]);

  if (isError) return <Navigate to={"/"} />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setSearchKeyword(keyword);
  };

  return (
    <div>
      <HeaderNav
        title="고객 목록"
        bottomSlot={
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <form onSubmit={handleSubmit}>
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="이름 또는 이메일"
                className="bg-card h-12 pl-9"
              />
            </form>
          </div>
        }
      />

      <LinkCard
        to={"/customers/new"}
        variant={"gradient"}
        className="mb-4 flex items-center justify-between"
      >
        <span className="text-lg font-semibold">신규 고객 추가</span>
        <Plus className="size-9" strokeWidth={1.3} />
      </LinkCard>

      <div className="bg-muted-foreground/20 mb-7 h-px w-full"></div>

      <div className="mb-3 flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          고객 {customerCount ?? 0}명
        </div>

        <Select value={designerId} onValueChange={setDesignerId}>
          <SelectTrigger>
            <Scissors className="size-4" strokeWidth={1.5} />
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

      <div className="flex flex-col gap-2">
        {isPending ? (
          <Loader />
        ) : customers?.pages[0].length ? (
          customers.pages.map((page) =>
            page.map((c) => (
              <CustomerCard
                key={c.id}
                id={c.id}
                name={c.name}
                email={c.email}
              />
            )),
          )
        ) : (
          <EmptyContent content="아직 등록된 고객이 없습니다." />
        )}

        {isFetchingNextPage && <Loader />}
        <div className="mt-30" ref={ref}></div>
      </div>
    </div>
  );
}
