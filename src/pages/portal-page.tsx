import { Card, LinkCard } from "@/components/card";
import {
  ChevronRightIcon,
  FileTextIcon,
  MessageCircleIcon,
  StoreIcon,
} from "lucide-react";
import { Link } from "react-router";
import memuPersonal from "@/assets/menu_personal.png";
import HeaderHomeNav from "@/components/layout/header-home-nav";
import { useSession } from "@/store/session";
import { useShopsData } from "@/hooks/queries/shop/use-shops-data";
import { Button } from "@/components/ui/button";
import defaultShop from "@/assets/default-shop.png";
import defaultUser from "@/assets/customer_profile__joa.png";
import { useOpenAlertModal } from "@/store/modals/alert-modal";
import type { ShopEntity } from "@/types";
import useCustomerData from "@/hooks/queries/customer/use-customer-data";
import { Skeleton } from "@/components/ui/skeleton";
import ListSkeleton from "@/components/list-skeleton";

export default function PortalPage() {
  const session = useSession();
  const openAlertModal = useOpenAlertModal();

  const { data: customer, isLoading: isFetchCustomerLoading } = useCustomerData(
    session!.user.id,
  );
  const { data: shops, isLoading: isFetchShopsLoading } = useShopsData(
    session!.user.id,
  );

  const handleButtonClick = (shop: ShopEntity) => {
    openAlertModal({
      title: shop.name,
      description:
        shop.phone ?? "등록된 전화번호가 없습니다. 해당 주소로 방문해주세요.",
      // 여기에 shop.phone 있는 경우 복사, 전화걸기 버튼이 나와야함
    });
  };

  return (
    <>
      <HeaderHomeNav />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col">
          <p className="mb-0.5">오늘의 분석을 시작해보세요</p>
          {isFetchCustomerLoading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <Link
              to={"/portal-info"}
              className="text-primary flex items-center text-2xl font-bold"
            >
              {customer?.name ? `${customer?.name} 님` : "안녕하세요"}
              <ChevronRightIcon className="size-7" strokeWidth={1.5} />
            </Link>
          )}
        </div>
        <div className="relative size-18">
          <img
            className="h-full w-full overflow-hidden rounded-full object-cover"
            src={defaultUser}
            alt="티고캐릭터 이미지"
          />
        </div>
      </div>

      <div className="mb-7 grid grid-cols-[3fr_2fr] gap-2">
        <LinkCard
          to={"/analysis/photo"}
          variant={"feature2"}
          className="pr-0 pb-0"
        >
          <div>
            <div className="mb-2 text-xl font-semibold tracking-tight">
              퍼스널컬러 분석
            </div>
            <div className="text-sm font-light opacity-80">
              나에게 어울리는 컬러를
              <br />
              한눈에 확인
            </div>
          </div>
          <div className="">
            <img
              className="ml-auto h-33"
              src={memuPersonal}
              alt="퍼스널컬러 분석 이미지"
            />
          </div>
        </LinkCard>

        <div className="grid grid-rows-2 gap-2">
          <LinkCard
            to={"/portal-analysis/list"}
            className="bg-feature-2/10 flex flex-col items-center justify-center gap-2 shadow-none"
          >
            <FileTextIcon
              className="text-feature-1 size-6 fill-white"
              strokeWidth={1.3}
            />
            <span className="text-feature-2 text-lg font-semibold">
              퍼스널컬러 기록
            </span>
          </LinkCard>
          <Card className="bg-feature-1/10 flex flex-col items-center justify-center gap-2 shadow-none">
            <FileTextIcon
              className="text-feature-1 size-6 fill-white"
              strokeWidth={1.3}
            />
            <span className="text-feature-1 text-lg font-semibold">
              두피 분석 기록
            </span>
          </Card>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <div className="text-lg font-semibold">내 매장 예약하기</div>
          <span className="text-muted-foreground text-sm">전화예약</span>
        </div>
        {isFetchShopsLoading ? (
          <ListSkeleton count={1} className="h-18" />
        ) : (
          <div className="flex flex-col gap-2">
            {shops?.map((shop) => (
              <Card key={shop.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    className="size-10 rounded-full object-cover"
                    src={shop.logo_url ?? defaultShop}
                    alt=""
                  />
                  <span>{shop.name}</span>
                </div>
                <Button onClick={() => handleButtonClick(shop)}>예약</Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mb-2 text-lg font-semibold">서비스 바로가기</div>
      <div className="grid grid-cols-2 gap-2">
        <Card className="flex flex-col justify-between gap-5">
          <div className="flex items-center gap-1.5">
            <MessageCircleIcon
              className="text-feature-1 fill-feature-1 size-6"
              strokeWidth={1.3}
            />
            <span className="text-feature-1 font-semibold">메시지</span>
          </div>
          <div className="text-muted-foreground flex items-center">
            <span className="text-sm font-normal">메시지 확인하기</span>
            <ChevronRightIcon className="size-5" strokeWidth={1} />
          </div>
        </Card>

        <Card className="flex flex-col justify-between gap-5">
          <div className="flex items-center gap-1.5">
            <StoreIcon
              className="text-feature-2 fill-feature-2/8 size-6"
              strokeWidth={1.3}
            />
            <span className="text-feature-2 font-semibold">주변 매장 찾기</span>
          </div>
          <div className="text-muted-foreground items-center font-normal not-first-of-type:text-sm">
            <span>티고ABC</span>
            <span className="flex items-center">
              제휴매장 찾기
              <ChevronRightIcon className="size-5" strokeWidth={1} />
            </span>
          </div>
        </Card>
      </div>
    </>
  );
}
