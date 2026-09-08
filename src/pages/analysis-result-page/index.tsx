import HeaderNav from "@/components/header-nav";
import { useLocation, useParams } from "react-router";
import { Layout } from "@/components/layout/global-layout";
import { Share2Icon, UserPlus } from "lucide-react";
import BottomNav from "@/components/layout/bottom-nav";
import { MEMBER_NAV_ITEMS } from "@/lib/constants";
import { ANALYSIS_PRESET, type Analysis } from "./constants";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import TypeIntroSection from "./components/type-intro-section";
import SkinToneSection from "./components/skin-tone-section";
import FoundationSection from "./components/foundation-section";
import BodyColorSection from "./components/body-color-section";
import useAnalysisData from "@/hooks/queries/analysis/use-analysis-data";
import GlobalLoader from "@/components/global-loader";
import { useActiveRole } from "@/store/active-role";
import { roleHomePath, SIGN_IN_PATH } from "@/lib/route";
import ErrorRedirect from "@/components/error-redirect";
import { useOpenLinkCustomerModal } from "@/store/link-customer-modal";
import { useOpenShareAnalysisModal } from "@/store/share-analysis-modal";

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
  const { ref, inView } = useInView({
    initialInView: true,
    rootMargin: "-100px 0px 0px 0px",
  });

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

  // 퍼스널컬러 타입에 맞는 결과 가져오기
  const analysisPreset = ANALYSIS_PRESET[analysis.personalType];

  if (!analysisPreset) {
    return (
      <ErrorRedirect
        to={activeRole ? roleHomePath(activeRole) : SIGN_IN_PATH}
        message="분석 결과를 불러오지 못했습니다."
      />
    );
  }

  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${analysisPreset.palette.bc1}, ${analysisPreset.palette.bc2})`,
      }}
    >
      <HeaderNav
        className={cn(
          "layout transition-colors duration-300",
          inView
            ? "bg-transparent text-white backdrop-blur-none"
            : "text-black",
        )}
        rightSlot={
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
      />

      <TypeIntroSection
        personalType={analysis.personalType}
        analysisPreset={analysisPreset}
      />

      <div ref={ref} aria-hidden className="h-px"></div>

      <Layout className="-mt-0.5 bg-[#FFFAF6] pt-12 pb-30">
        <BodyColorSection analysis={analysis} resultImageUrl={resultImageUrl} />

        <SkinToneSection analysis={analysis} analysisPreset={analysisPreset} />

        <FoundationSection skin={analysis.skin} />
      </Layout>

      <BottomNav navItems={MEMBER_NAV_ITEMS} />

      {resultCase.type === "MEMBER_SIMPLE" && (
        <button
          type="button"
          onClick={() => openLinkCustomerModal(analysisId)}
          className="text-primary bg-background fixed right-6 bottom-24 z-20 flex size-15 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full shadow-lg"
        >
          <UserPlus className="ml-0.5 size-6" strokeWidth={1.8} />
          <span className="text-xs font-medium">추가</span>
        </button>
      )}
    </div>
  );
}
