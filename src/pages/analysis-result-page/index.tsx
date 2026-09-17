import { useLocation, useParams } from "react-router";
import useAnalysisData from "@/hooks/queries/analysis/use-analysis-data";
import GlobalLoader from "@/components/global-loader";
import { useActiveRole } from "@/store/active-role";
import { roleHomePath, SIGN_IN_PATH } from "@/lib/route";
import ErrorRedirect from "@/components/error-redirect";
import { useOpenLinkCustomerModal } from "@/store/modals/link-customer-modal";
import { useOpenShareAnalysisModal } from "@/store/modals/share-analysis-modal";
import type { Analysis } from "@/lib/analysis";
import { Share2Icon, UserPlusIcon } from "lucide-react";
import BottomNav from "@/components/layout/bottom-nav";
import { MEMBER_NAV_ITEMS } from "@/constants/nav";
import AnalysisResultView from "@/components/analysis-result/analysis-result-view";

type LocationState = {
  analysis: Analysis;
  resultImageUrl: string;
  customerId: string | null;
};
type ResultCase =
  | { type: "MEMBER_SIMPLE" } // 회원 - 간편분석 [state]
  | { type: "MEMBER_CUSTOMER"; customerId: string } // 회원 - 고객 분석 [state]
  | { type: "CUSTOMER_FRESH" } // 고객 본인 - 분석 직후 진입 [state]
  | { type: "CUSTOMER_LIST" }; // 고객 본인 - 기록 리스트에서 진입 [DB fetch]

export default function AnalysisResultPage() {
  const activeRole = useActiveRole();
  const { analysisId } = useParams();
  const location = useLocation();
  const openLinkCustomerModal = useOpenLinkCustomerModal();
  const openShareAnalysisModal = useOpenShareAnalysisModal();

  const {
    analysis: stateAnalysis,
    resultImageUrl: stateResultImageUrl,
    customerId: stateCustomerId,
  } = (location.state ?? {}) as Partial<LocationState>;

  // location.state가 없을 때만 DB 조회
  const shouldFetch = !stateAnalysis;
  const { data, isLoading, isError } = useAnalysisData(
    shouldFetch ? analysisId : undefined,
  );

  const analysis = stateAnalysis ?? (data?.result as Analysis | undefined);
  const resultImageUrl = stateResultImageUrl ?? data?.result_image_url;
  const customerId = stateCustomerId ?? data?.customer_id ?? null;

  let resultCase: ResultCase | undefined;

  if (activeRole === "member") {
    resultCase = customerId
      ? { type: "MEMBER_CUSTOMER", customerId }
      : { type: "MEMBER_SIMPLE" };
  } else if (activeRole === "customer") {
    resultCase = shouldFetch
      ? { type: "CUSTOMER_LIST" }
      : { type: "CUSTOMER_FRESH" };
  }

  if (!analysisId || !resultCase)
    return (
      <ErrorRedirect
        to={activeRole ? roleHomePath(activeRole) : SIGN_IN_PATH}
        message="분석 결과를 불러오지 못했습니다."
      />
    );
  if (shouldFetch && isLoading) return <GlobalLoader />;
  if (!analysis || !resultImageUrl || isError)
    return (
      <ErrorRedirect
        to={activeRole ? roleHomePath(activeRole) : SIGN_IN_PATH}
        message="분석 결과를 불러오지 못했습니다."
      />
    );

  return (
    <AnalysisResultView
      analysis={analysis}
      resultImageUrl={resultImageUrl}
      fallback={
        <ErrorRedirect
          to={activeRole ? roleHomePath(activeRole) : SIGN_IN_PATH}
          message="분석 결과를 불러오지 못했습니다."
        />
      }
      headerRightSlot={
        resultCase.type === "MEMBER_SIMPLE" ||
        resultCase.type === "MEMBER_CUSTOMER" ? (
          <button
            type="button"
            onClick={() => openShareAnalysisModal(analysisId)}
            className="cursor-pointer"
          >
            <Share2Icon className="size-6" strokeWidth={1.8} />
          </button>
        ) : undefined
      }
      footer={
        <>
          <BottomNav navItems={MEMBER_NAV_ITEMS} />
          {resultCase.type === "MEMBER_SIMPLE" && (
            <button
              type="button"
              onClick={() => openLinkCustomerModal(analysisId)}
              className="text-primary bg-background fixed right-4 bottom-18 z-20 flex size-15 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full shadow-lg"
            >
              <UserPlusIcon className="ml-0.5 size-6" strokeWidth={1.8} />
              <span className="text-xs font-medium">추가</span>
            </button>
          )}
        </>
      }
    />
  );
}
