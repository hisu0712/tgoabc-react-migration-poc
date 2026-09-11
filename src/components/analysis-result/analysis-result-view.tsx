import HeaderNav from "@/components/layout/header-nav";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import TypeIntroSection from "./type-intro-section";
import BodyColorSection from "./body-color-section";
import SkinToneSection from "./skin-tone-section";
import FoundationSection from "./foundation-section";
import { ANALYSIS_PRESET } from "@/components/analysis-result/constants";
import type { Analysis } from "@/lib/analysis";

export default function AnalysisResultView({
  analysis,
  resultImageUrl,
  headerHideBack,
  headerRightSlot,
  footer,
  fallback,
}: {
  analysis: Analysis;
  resultImageUrl: string;
  headerHideBack?: boolean;
  headerRightSlot?: React.ReactNode;
  footer?: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { ref, inView } = useInView({
    initialInView: true,
    rootMargin: "-100px 0px 0px 0px",
  });
  const analysisPreset = ANALYSIS_PRESET[analysis.personalType]; // 퍼스널컬러 타입에 맞는 결과 가져오기

  if (!analysisPreset) return <>{fallback}</>;

  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${analysisPreset.palette.bc1}, ${analysisPreset.palette.bc2})`,
      }}
    >
      <HeaderNav
        className={cn(
          "layout-px transition-colors duration-300",
          inView
            ? "bg-transparent text-white backdrop-blur-none"
            : "text-black",
        )}
        hideBack={headerHideBack}
        rightSlot={headerRightSlot}
      />

      <TypeIntroSection
        personalType={analysis.personalType}
        analysisPreset={analysisPreset}
      />

      <div ref={ref} aria-hidden className="h-px"></div>

      <div
        className={cn(
          "layout-px dark:bg-secondary -mt-0.5 bg-[#FFFAF6] pt-12",
          footer ? "pb-30" : "pb-20",
        )}
      >
        <BodyColorSection analysis={analysis} resultImageUrl={resultImageUrl} />
        <SkinToneSection analysis={analysis} analysisPreset={analysisPreset} />
        <FoundationSection skin={analysis.skin} />
      </div>

      {footer}
    </div>
  );
}
