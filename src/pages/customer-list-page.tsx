import { CustomerListCard, LinkCard } from "@/components/card";
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

export default function CustomerListPage() {
  const session = useSession();
  const { ref, inView } = useInView();

  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { data: customerCount } = useCustomerCount(session!.user.id);

  const { data, error, isPending, fetchNextPage, isFetchingNextPage } =
    useInfiniteCustomers({
      memberId: session?.user.id,
      keyword: searchKeyword,
    });

  useEffect(() => {
    // 스크롤이 하단에 닿았을 때 다음페이지 호출
    console.log(inView);
    if (inView) fetchNextPage();
  }, [inView]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(keyword);
    }, 300); // 0.3초마다 자동 검색

    return () => clearTimeout(timer);
  }, [keyword]);

  if (error) return <Navigate to={"/"} />;

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
                className="bg-card py-6 pl-9"
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

      <div className="bg-muted-foreground/20 mb-7 h-[1px] w-full"></div>

      <div className="mb-3 flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          고객 {customerCount ?? 0}명
        </div>

        <Select value="all">
          {/* const { mutate: updateDesigner } = useUpdateCustomerDesigner();
추후 변경 예정
 <Select
   value={customer?.designerId ?? "none"}
   onValueChange={(value) => updateDesigner({ customerId, designerId: value })}
 ></Select> */}
          <SelectTrigger>
            <Scissors className="size-4" strokeWidth={1.5} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="tigo">김티고 디자이너</SelectItem>
            <SelectItem value="tigen">김티젠 디자이너</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        {isPending ? (
          <Loader />
        ) : (
          data.pages.map((page) =>
            page.map((customer) => (
              <CustomerListCard
                key={customer.id}
                id={customer.id}
                name={customer.name}
                email={customer.email}
              />
            )),
          )
        )}
        {isFetchingNextPage && <Loader />}
        <div className="mt-30" ref={ref}></div>
      </div>
    </div>
  );
}
