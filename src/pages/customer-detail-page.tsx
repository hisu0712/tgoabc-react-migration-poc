import { Card } from "@/components/card";
import memuScalp from "@/assets/menu_scalp.png";
import memuPersonal from "@/assets/menu_personal.png";
import { Link, Navigate, useParams } from "react-router";
import useCustomerData from "@/hooks/queries/use-customer-data";
import GlobalLoader from "@/components/global-loader";
import { ChevronRight, FileText, Scissors, SquarePen } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HeaderHomeNav from "@/components/header-home-nav";

export default function CustomerDetailPage() {
  const { customerId } = useParams();

  const {
    data: customer,
    isLoading: isFetchCustomerLoading,
    error: isFetchCustomerError,
  } = useCustomerData(customerId);

  if (!customerId) return <Navigate to={"/"} />;
  if (isFetchCustomerLoading) return <GlobalLoader />;
  if (isFetchCustomerError) return <Navigate to={"/"} />;

  return (
    <main>
      <HeaderHomeNav />

      <div className="mb-5 flex items-end justify-between">
        <div className="text-2xl font-semibold">
          <Link
            to={`/customers/${customerId}/edit`}
            className="text-primary flex items-center"
          >
            {customer?.name}
            <ChevronRight className="size-7" strokeWidth={1.3} />
          </Link>
          <span>고객님, 환영합니다!</span>
        </div>

        <Select value="none">
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
            <SelectItem value="none">디자이너 없음</SelectItem>
            <SelectItem value="tigo">김티고 디자이너</SelectItem>
            <SelectItem value="tigen">김티젠 디자이너</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <Card variant={"feature1"} className="pr-0 pb-0">
          <div>
            <div className="mb-2 text-xl font-semibold tracking-tight">
              <div>두피 분석</div>
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
              <div>퍼스널 컬러 분석</div>
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
            <FileText
              className="text-feature-2 fill-feature-2/10 size-6"
              strokeWidth={1.3}
            />
            <span className="text-feature-2 text-lg font-semibold">
              퍼스널 컬러 기록
            </span>
          </div>
          <div className="text-muted-foreground flex items-center">
            <span className="text-sm font-normal">나의 기록 모아보기</span>
            <ChevronRight className="size-5" strokeWidth={1} />
          </div>
        </Card>
      </div>

      <div className="bg-muted-foreground/20 mb-5 h-[1px] w-full"></div>

      <Card className="flex items-center gap-4">
        <SquarePen
          className="fill-primary/10 text-primary size-7"
          strokeWidth={1.3}
        />
        <div>
          <span className="text-lg leading-tight font-semibold">시술 노트</span>
          <div className="text-muted-foreground flex items-center">
            <span className="text-sm font-normal">상담 및 시술 메모</span>
            <ChevronRight className="size-5" strokeWidth={1} />
          </div>
        </div>
      </Card>
    </main>
  );
}
