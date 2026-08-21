import { Card } from "@/components/card";
import { ChevronRight, MessageCircle, Store } from "lucide-react";
import { Link } from "react-router";
import memuScalp from "@/assets/menu_scalp.png";
import memuPersonal from "@/assets/menu_personal.png";
import HeaderHomeNav from "@/components/header-home-nav";
import { useSession } from "@/store/session";
import { useShopsData } from "@/hooks/queries/use-shops-data";
import { Button } from "@/components/ui/button";
import defaultShop from "@/assets/default-shop.png";
import { useOpenAlertModal } from "@/store/alert";
import type { ShopEntity } from "@/type";

export default function PortalPage() {
  const session = useSession();
  const openAlertModal = useOpenAlertModal();

  const { data: shops } = useShopsData(session!.user.id);

  const handleButtonClick = (shop: ShopEntity) => {
    openAlertModal({
      title: shop.name,
      description:
        shop.phone ?? "등록된 전화번호가 없습니다. 해당 주소로 방문해주세요.",
      // 여기에 shop.phone 있는 경우 복사, 전화걸기 버튼이 나와야함
    });
  };

  return (
    <div className="pb-25">
      <HeaderHomeNav />

      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-col font-semibold">
          <Link
            to={"/portal/info"}
            className="text-primary mb-1 flex items-center text-2xl"
          >
            홍길동
            <ChevronRight className="size-7" strokeWidth={1.5} />
          </Link>
          <p className="text-2xl leading-tight">고객님, 환영합니다!</p>
        </div>
      </div>

      <div className="mb-7 grid grid-cols-2 gap-3">
        <Card variant={"feature1"} className="pr-0 pb-0">
          <div>
            <div className="mb-2 text-xl font-semibold tracking-tight">
              두피 분석
            </div>
            <div className="text-sm font-normal">
              AI를 활용한
              <br />
              두피 상태 정밀 분석
            </div>
          </div>
          <div className="">
            <img
              className="ml-auto h-33"
              src={memuScalp}
              alt="두피 분석 이미지"
            />
          </div>
        </Card>
        <Card variant={"feature2"} className="pr-0 pb-0">
          <div>
            <div className="mb-2 text-xl font-semibold tracking-tight">
              퍼스널컬러 분석
            </div>
            <div className="text-sm font-normal">
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
        </Card>

        <Card className="flex flex-col justify-between gap-7">
          <div className="flex items-center gap-1.5">
            <MessageCircle
              className="text-feature-1 fill-feature-1 size-6"
              strokeWidth={1.3}
            />
            <span className="text-feature-1 text-lg font-semibold">메시지</span>
          </div>
          <div className="text-muted-foreground flex items-center">
            <span className="text-sm font-normal">메시지 확인하기</span>
            <ChevronRight className="size-5" strokeWidth={1} />
          </div>
        </Card>
        <Card className="flex flex-col justify-between gap-7">
          <div className="flex items-center gap-1.5">
            <Store
              className="text-feature-2 fill-feature-2/10 size-6"
              strokeWidth={1.3}
            />
            <span className="text-feature-2 text-lg font-semibold">
              주변 매장 찾기
            </span>
          </div>
          <div className="text-muted-foreground items-center font-normal not-first-of-type:text-sm">
            <span>티고ABC</span>
            <span className="flex items-center">
              제휴매장 찾기
              <ChevronRight className="size-5" strokeWidth={1} />
            </span>
          </div>
        </Card>
      </div>

      {!!shops?.length && (
        <>
          <div className="mb-3 flex items-center gap-2">
            <div className="text-xl font-semibold">내 매장 예약하기</div>
            <span className="text-muted-foreground text-sm">전화예약</span>
          </div>
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
        </>
      )}
    </div>
  );
}
