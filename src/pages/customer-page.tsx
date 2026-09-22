import { Card } from "@/components/card";
import memuScalp from "@/assets/menu_scalp.webp";
import { Link, useParams } from "react-router";
import {
  ChevronRightIcon,
  FileTextIcon,
  ScissorsIcon,
  SquarePenIcon,
} from "lucide-react";
import HeaderHomeNav from "@/components/layout/header-home-nav";
import { useSession } from "@/store/session";
import useCustomerWithDesignerData from "@/hooks/queries/customer/use-customer-with-designer-data";
import useDesignersData from "@/hooks/queries/designer/use-designers-data";
import ErrorRedirect from "@/components/error-redirect";
import { MEMBER_HOME_PATH } from "@/lib/route";
import { Skeleton } from "@/components/ui/skeleton";
import { toastComingSoon } from "@/lib/toast";
import AnalysisMenuCard from "@/components/analysis/analysis-menu-card";

export default function CustomerDetailPage() {
  const session = useSession();
  const { customerId } = useParams();

  const {
    data: customer,
    isLoading: isFetchCustomerLoading,
    isError: isFetchCustomerError,
  } = useCustomerWithDesignerData({ customerId, memberId: session!.user.id });

  const { data: designers, isLoading: isFetchDesignersLoading } =
    useDesignersData(session!.user.id);
  const designer = designers?.find((d) => d.id === customer?.designer_id);

  if (!customerId) return <ErrorRedirect to={MEMBER_HOME_PATH} />;
  if (isFetchCustomerError) return <ErrorRedirect to={MEMBER_HOME_PATH} />;

  return (
    <>
      <HeaderHomeNav />

      <div className="mb-5 flex items-end justify-between">
        <div className="text-2xl font-semibold">
          {isFetchCustomerLoading ? (
            <Skeleton className="h-8 w-25" />
          ) : (
            <Link
              to={`/customers/${customerId}/info`}
              className="text-primary flex items-center"
            >
              {customer?.name ? customer.name : "안녕하세요"}
              <ChevronRightIcon className="size-7" strokeWidth={1.3} />
            </Link>
          )}
          <span>고객님, 환영합니다!</span>
        </div>

        {isFetchDesignersLoading ? (
          <Skeleton className="h-9 w-28" />
        ) : (
          <div className="bg-muted flex items-center gap-1 rounded-md p-2">
            <ScissorsIcon className="size-4" />
            <span>
              {designer?.name ? `${designer.name} 디자이너` : "디자이너 없음"}
            </span>
          </div>
        )}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <Card
          onClick={toastComingSoon}
          variant={"feature1"}
          className="pr-0 pb-0"
        >
          <div>
            <div className="mb-2 text-xl font-semibold tracking-tight">
              <div>두피 분석</div>
            </div>
            <div className="text-sm font-light opacity-80">
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
        <AnalysisMenuCard to={`/analysis/photo?customerId=${customerId}`} />

        <Card
          onClick={toastComingSoon}
          className="flex flex-col justify-between gap-9"
        >
          <div className="flex items-center gap-1.5">
            <FileTextIcon
              className="text-feature-1 fill-feature-1/10 size-6"
              strokeWidth={1.3}
            />
            <span className="text-feature-1 text-lg font-semibold">
              두피 분석 기록
            </span>
          </div>
          <div className="text-muted-foreground flex items-center">
            <span className="text-sm font-normal">분석 기록 모아보기</span>
            <ChevronRightIcon className="size-5" strokeWidth={1} />
          </div>
        </Card>
        <Card
          onClick={toastComingSoon}
          className="flex flex-col justify-between gap-9"
        >
          <div className="flex items-center gap-1.5">
            <SquarePenIcon
              className="text-feature-2 fill-feature-2/10 size-6"
              strokeWidth={1.3}
            />
            <span className="text-feature-2 text-lg font-semibold">
              시술 노트
            </span>
          </div>
          <div className="text-muted-foreground flex items-center">
            <span className="text-sm font-normal">상담 및 시술 메모</span>
            <ChevronRightIcon className="size-5" strokeWidth={1} />
          </div>
        </Card>
      </div>
    </>
  );
}
