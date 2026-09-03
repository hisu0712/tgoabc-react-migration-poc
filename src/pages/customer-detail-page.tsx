import { Card, LinkCard } from "@/components/card";
import memuScalp from "@/assets/menu_scalp.png";
import memuPersonal from "@/assets/menu_personal.png";
import { Link, useParams } from "react-router";
import { ChevronRight, FileText, Scissors, SquarePen } from "lucide-react";
import HeaderHomeNav from "@/components/header-home-nav";
import { useSession } from "@/store/session";
import useCustomerWithDesignerData from "@/hooks/queries/use-customer-with-designer-data";
import useDesignersData from "@/hooks/queries/use-designers-data";
import ErrorRedirect from "@/components/error-redirect";
import { MEMBER_HOME_PATH } from "@/lib/route";

export default function CustomerDetailPage() {
  const session = useSession();
  const { customerId } = useParams();

  const { data: customer, isError: isFetchCustomerError } =
    useCustomerWithDesignerData({ customerId, memberId: session!.user.id });

  const { data: designers } = useDesignersData(session!.user.id);
  const designer = designers?.find((d) => d.id === customer?.designer_id);

  if (!customerId) return <ErrorRedirect to={MEMBER_HOME_PATH} />;
  if (isFetchCustomerError) return <ErrorRedirect to={MEMBER_HOME_PATH} />;

  return (
    <main>
      <HeaderHomeNav />

      <div className="mb-5 flex items-end justify-between">
        <div className="text-2xl font-semibold">
          <Link
            to={`/customers/${customerId}/info`}
            className="text-primary flex items-center"
          >
            {customer?.name}
            <ChevronRight className="size-7" strokeWidth={1.3} />
          </Link>
          <span>고객님, 환영합니다!</span>
        </div>

        <div className="bg-muted flex items-center gap-1 rounded-md p-2 font-medium">
          <Scissors className="size-4" />
          <span>
            {customer?.designer_id
              ? `${designer?.name} 디자이너`
              : "디자이너 없음"}
          </span>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <Card variant={"feature1"} className="pr-0 pb-0">
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
        <LinkCard
          to={`/analysis/photo?customerId=${customerId}`}
          variant={"feature2"}
          className="pr-0 pb-0"
        >
          <div>
            <div className="mb-2 text-xl font-semibold tracking-tight">
              <div>퍼스널 컬러 분석</div>
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

        <Card className="flex flex-col justify-between gap-9">
          <div className="flex items-center gap-1.5">
            <FileText
              className="text-feature-1 fill-feature-1/10 size-6"
              strokeWidth={1.3}
            />
            <span className="text-feature-1 text-lg font-semibold">
              두피 분석 기록
            </span>
          </div>
          <div className="text-muted-foreground flex items-center">
            <span className="text-sm font-normal">분석 기록 모아보기</span>
            <ChevronRight className="size-5" strokeWidth={1} />
          </div>
        </Card>
        <Card className="flex flex-col justify-between gap-9">
          <div className="flex items-center gap-1.5">
            <SquarePen
              className="text-feature-2 fill-feature-2/10 size-6"
              strokeWidth={1.3}
            />
            <span className="text-feature-2 text-lg font-semibold">
              시술 노트
            </span>
          </div>
          <div className="text-muted-foreground flex items-center">
            <span className="text-sm font-normal">상담 및 시술 메모</span>
            <ChevronRight className="size-5" strokeWidth={1} />
          </div>
        </Card>
      </div>
    </main>
  );
}
