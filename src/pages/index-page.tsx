import { useShopData } from "@/hooks/queries/shop/use-shop-data";
import { useOpenAlertModal } from "@/store/modals/alert-modal";
import { useSession } from "@/store/session";
import { BarChart2Icon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import defaultShop from "@/assets/customer_profile__joa.png";
import icoAddCustomer from "@/assets/ico_addCustomer.svg";
import icoHomeDesigner from "@/assets/memberhome_designer.png";
import icoHomeMsg from "@/assets/memberhome_msg.png";
import icoHomeScanner from "@/assets/memberhome_scanner.png";
import icoHomeUse from "@/assets/memberhome_use.png";
import { Card, CustomerCard, LinkCard } from "@/components/card";
import memuScalp from "@/assets/menu_scalp.png";
import memuPersonal from "@/assets/menu_personal.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import HeaderHomeNav from "@/components/layout/header-home-nav";
import useCustomerCount from "@/hooks/queries/customer/use-customer-count-data";
import useAnalysisCount from "@/hooks/queries/analysis/use-analysis-count-data";
import useRecentAnalyses from "@/hooks/queries/analysis/use-recent-analyses-data";
import { Skeleton } from "@/components/ui/skeleton";
import { toastComingSoon } from "@/lib/toast";

export default function IndexPage() {
  const session = useSession();
  const navigate = useNavigate();
  const openAlertModal = useOpenAlertModal();

  const { data: customerCount, isLoading: isFetchCustomerCountLoading } =
    useCustomerCount({
      memberId: session!.user.id,
    });
  const { data: analysisCount, isLoading: isFetchAnalysisCountLoading } =
    useAnalysisCount({
      memberId: session!.user.id,
    });
  const { data: shop, isLoading: isFetchShopLoading } = useShopData(
    session!.user.id,
  );
  const { data: analyses, isLoading: isFetchAnalysesLoading } =
    useRecentAnalyses({ memberId: session!.user.id });

  const handleShopEditClick = () => {
    openAlertModal({
      title: "내 매장 등록",
      description: "매장 정보를 입력해 주세요 고객 안내와 홍보에 활용돼요",
      onPositive: () => navigate("/members/shop"),
    });
  };

  return (
    <>
      <HeaderHomeNav />

      <div className="mb-5 flex items-center justify-between">
        <div className="flex flex-col">
          <p className="mb-0.5 text-sm font-medium">오늘의 분석을 시작해보세요</p>
          <div className="mb-1">
            {isFetchShopLoading ? (
              <Skeleton className="h-8 w-25" />
            ) : (
              <Link
                to={"/members/info"}
                className="text-primary flex items-center text-2xl font-bold"
              >
                {shop?.name ? `${shop.name}` : "안녕하세요"}
                <ChevronRightIcon className="size-7" strokeWidth={1.5} />
              </Link>
            )}
          </div>
          <div className="text-muted-foreground flex items-end gap-1">
            {isFetchCustomerCountLoading || isFetchAnalysisCountLoading ? (
              <Skeleton className="h-4 w-35" />
            ) : (
              <>
                <BarChart2Icon className="size-4" />
                <p className="text-sm leading-none">
                  고객 {customerCount ?? "-"}명 · 분석수 {analysisCount ?? "-"}
                  건
                </p>
              </>
            )}
          </div>
        </div>
        {isFetchShopLoading ? (
          <Skeleton className="size-18 rounded-full" />
        ) : (
          <div
            onClick={handleShopEditClick}
            className="relative size-19 cursor-pointer"
          >
            <img
              className="h-full w-full overflow-hidden rounded-full object-cover"
              src={shop?.logo_url || defaultShop}
              alt={shop?.name}
            />
            <span className="bg-card absolute right-0 bottom-0 h-[25%] w-[25%] rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]">
              <PlusIcon
                className="text-primary absolute top-1/2 left-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2"
                strokeWidth={2.3}
              />
            </span>
          </div>
        )}
      </div>

      <LinkCard
        to={"/customers/new"}
        variant={"gradient"}
        className="mb-3 flex items-center gap-3"
      >
        <img src={icoAddCustomer} className="size-9" />
        <div>
          <div className="leading-tight font-medium">고객 추가하기</div>
          <div className="text-sm opacity-80">빠른 고객 정보 입력 후 등록!</div>
        </div>
      </LinkCard>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <Card onClick={toastComingSoon} className="pr-0 pb-0">
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
        <LinkCard to={"/analysis/photo"} className="pr-0 pb-0">
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
        </LinkCard>
      </div>

      <div className="mb-5 grid grid-cols-4 justify-between">
        <div
          onClick={toastComingSoon}
          className="flex flex-col items-center gap-1"
        >
          <div className="bg-muted rounded-3xl p-1">
            <img
              className="size-13"
              src={icoHomeScanner}
              alt="스캐너 메뉴 이미지"
            />
          </div>
          <span className="text-xs font-medium">스캐너</span>
        </div>
        <div
          onClick={toastComingSoon}
          className="flex flex-col items-center gap-1"
        >
          <div className="bg-muted rounded-3xl p-1">
            <img
              className="size-13"
              src={icoHomeMsg}
              alt="메시지 메뉴 이미지"
            />
          </div>
          <span className="text-xs font-medium">메시지</span>
        </div>
        <Link to={"/designers"} className="flex flex-col items-center gap-1">
          <div className="bg-muted rounded-3xl p-1">
            <img
              className="size-13"
              src={icoHomeDesigner}
              alt="디자이너 메뉴 이미지"
            />
          </div>
          <span className="text-xs font-medium">디자이너</span>
        </Link>
        <div
          onClick={toastComingSoon}
          className="flex flex-col items-center gap-1"
        >
          <div className="bg-muted rounded-3xl p-1">
            <img
              className="size-13"
              src={icoHomeUse}
              alt="앱 사용법 메뉴 이미지"
            />
          </div>
          <span className="text-xs font-medium">앱 사용법</span>
        </div>
      </div>

      {isFetchAnalysesLoading ? (
        <>
          <Skeleton className="mb-2 h-7 w-28" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-28 rounded-xl" />
            ))}
          </div>
        </>
      ) : analyses && analyses.length > 0 ? (
        <>
          <div className="mb-2 text-lg font-semibold">최근 분석 목록</div>
          <Carousel>
            <CarouselContent>
              {analyses.map((a) => (
                <CarouselItem key={a.id} className="basis-auto">
                  <CustomerCard
                    id={a.customer_id}
                    name={a.customer_name}
                    variant="compact"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </>
      ) : null}
    </>
  );
}
