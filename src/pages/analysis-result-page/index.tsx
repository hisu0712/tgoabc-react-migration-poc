import HeaderNav from "@/components/header-nav";
import { Navigate, useLocation, useParams } from "react-router";
import { Layout } from "@/components/layout/global-layout";
import { Share2Icon } from "lucide-react";
import BottomNav from "@/components/layout/bottom-nav";
import { MEMBER_NAV_ITEMS } from "@/lib/constants";
import { ANALYSIS_PRESET, type Analysis } from "./constants";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { GuideLabel } from "./components/guide-label";
import TypeIntroSection from "./components/type-intro-section";
import SkinToneSection from "./components/skin-tone-section";
import FoundationSection from "./components/foundation-section";
import BodyColorSection from "./components/body-color-section";
import useAnalysisData from "@/hooks/queries/use-analysis-data";
import GlobalLoader from "@/components/global-loader";
import { toast } from "sonner";
import { useActiveRole } from "@/store/active-role";

type LocationState = {
  analysis: Analysis;
  resultImageUrl: string;
};

export default function AnalysisResultPage() {
  const activeRole = useActiveRole();
  const { analysisId } = useParams();
  const location = useLocation();
  const { ref, inView } = useInView({
    initialInView: true,
    rootMargin: "-100px 0px 0px 0px",
  });

  const { analysis: stateAnalysis, resultImageUrl: stateResultImageUrl } =
    (location.state ?? {}) as Partial<LocationState>;

  // location.state가 없을 때만 DB 조회 (기록 페이지 등에서 진입한 경우)
  const shouldFetch = !stateAnalysis;
  const { data, isLoading, isError } = useAnalysisData(
    shouldFetch ? analysisId : undefined,
  );

  const analysis = stateAnalysis ?? (data?.result as Analysis | undefined);
  const resultImageUrl = stateResultImageUrl ?? data?.result_image_url;

  if (!analysisId) return <Navigate to={"/"} />;
  if (shouldFetch && isLoading) return <GlobalLoader />;
  if (!analysis || !resultImageUrl || isError) {
    toast.error("분석 결과를 불러오지 못했습니다.", { position: "top-center" });
    return <Navigate to={"/"} />;
  }

  // 퍼스널컬러 타입에 맞는 결과 가져오기
  const analysisPreset = ANALYSIS_PRESET[analysis.personalType];

  if (!analysisPreset) {
    toast.error("문제가 발생했습니다. 잠시 후 다시 시도해주세요.", {
      position: "top-center",
    });
    return <Navigate to={"/"} />;
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
          activeRole === "member" ? (
            <Share2Icon className="size-6" strokeWidth={1.8} />
          ) : undefined
        }
      />

      <TypeIntroSection
        personalType={analysis.personalType}
        analysisPreset={analysisPreset}
      />

      <div ref={ref} aria-hidden className="h-px"></div>

      <Layout className="-mt-0.5 bg-[#FFFAF6] pt-12 pb-30">
        <p className="mb-4 text-xl font-bold">나의 신체색 분석 결과</p>

        <BodyColorSection analysis={analysis} resultImageUrl={resultImageUrl} />

        <div className="mb-7">
          <GuideLabel className="w-full rounded-md py-2">
            <p className="md:inline">
              신체색은 타고난 피부색, 모발색, 눈동자색을 말하며,{" "}
            </p>
            <p className="md:inline">퍼스널 컬러 진단의 기준이 됩니다.</p>
          </GuideLabel>
        </div>

        <SkinToneSection analysis={analysis} analysisPreset={analysisPreset} />

        <FoundationSection skin={analysis.skin} />
      </Layout>

      <BottomNav navItems={MEMBER_NAV_ITEMS} />
    </div>
  );
}
