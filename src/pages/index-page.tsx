import { useShopData } from "@/hooks/queries/use-shop-data";
import { useOpenAlertModal } from "@/store/alert";
import { useSession } from "@/store/session";
import { BarChart2, ChevronRight, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import defaultShop from "@/assets/default-shop.png";
import icoAddCustomer from "@/assets/ico_addCustomer.svg";
import { Card, CustomerListCard, LinkCard } from "@/components/card";
import memuScalp from "@/assets/menu_scalp.png";
import memuPersonal from "@/assets/menu_personal.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function IndexPage() {
  const session = useSession();
  const navigate = useNavigate();
  const openAlertModal = useOpenAlertModal();

  const { data: shop, error, isPending } = useShopData(session!.user.id);

  const recentCustomers = [
    {
      id: "7bf457aa-41bd-4889-a029-d1e16738d377",
      name: "문현준",
      phone: "0444",
    },
    {
      id: "7bf457aa-41bd-4889-a029-d1e16738d377",
      name: "문현준",
      phone: "0444",
    },
    {
      id: "7bf457aa-41bd-4889-a029-d1e16738d377",
      name: "문현준",
      phone: "0444",
    },
  ];

  const handleShopEditClick = () => {
    openAlertModal({
      title: "내 매장 등록",
      description: "매장 정보를 입력해 주세요 고객 안내와 홍보에 활용돼요",
      onPositive: () => navigate(`/members/${session?.user.id}/shop`),
    });
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex flex-col">
          <p className="mb-0.5 text-lg">오늘의 분석을 시작해보세요</p>
          <Link
            to={`/members/${session?.user.id}/info`}
            className="text-primary mb-1 flex items-center text-2xl font-bold"
          >
            {shop?.name} 님
            <ChevronRight className="size-7" strokeWidth={1.5} />
          </Link>
          <div className="text-muted-foreground flex items-end gap-1">
            <BarChart2 className="size-5" />
            <p className="text-md leading-none">고객 12명 · 분석수 128건</p>
          </div>
        </div>
        <div onClick={handleShopEditClick} className="relative size-23">
          <img
            className="h-full w-full overflow-hidden rounded-full object-cover"
            src={shop?.logo_url || defaultShop}
            alt={shop?.name}
          />
          <span className="bg-card absolute right-0 bottom-0 h-[25%] w-[25%] rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]">
            <Plus
              className="text-primary absolute top-1/2 left-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2"
              strokeWidth={2.3}
            />
          </span>
        </div>
      </div>

      <LinkCard
        to={"/customers/new"}
        variant={"gradient"}
        className="mb-3 flex items-center gap-5"
      >
        <img src={icoAddCustomer} className="size-15" />
        <div>
          <div className="text-lg font-semibold">고객 추가하기</div>
          <div className="opacity-80">빠른 고객 정보 입력 후 등록!</div>
        </div>
      </LinkCard>

      <div className="mb-7 grid grid-cols-2 gap-3">
        <Card className="pr-0 pb-0">
          <div>
            <div className="text-primary mb-1 text-xl leading-tight font-semibold tracking-tight">
              <div>두피 분석</div>
              <div>바로가기</div>
            </div>
            <div className="text-muted-foreground">바로 시작하기</div>
          </div>
          <div className="">
            <img
              className="ml-auto h-33"
              src={memuScalp}
              alt="두피 분석 이미지"
            />
          </div>
        </Card>
        <Card className="pr-0 pb-0">
          <div>
            <div className="text-feature-2 mb-1 text-xl leading-tight font-semibold tracking-tight">
              <div>퍼스널 컬러</div>
              <div>바로가기</div>
            </div>
            <div className="text-muted-foreground">나의 퍼스널 컬러는?</div>
          </div>
          <div className="">
            <img
              className="ml-auto h-33"
              src={memuPersonal}
              alt="퍼스널컬러 분석 이미지"
            />
          </div>
        </Card>
      </div>

      <div className="mb-2 text-lg font-semibold">최근 분석 목록</div>
      <Carousel>
        <CarouselContent>
          {recentCustomers.map((customer) => (
            <CarouselItem key={customer.id} className="basis-auto pl-2">
              <CustomerListCard
                id={customer.id}
                name={customer.name}
                phone={customer.phone}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
