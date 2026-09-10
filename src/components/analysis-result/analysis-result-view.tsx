import HeaderNav from "@/components/layout/header-nav";
import { Layout } from "@/components/layout/global-layout";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import TypeIntroSection from "./type-intro-section";
import BodyColorSection from "./body-color-section";
import SkinToneSection from "./skin-tone-section";
import type { Analysis } from "@/lib/analysis";
import { ANALYSIS_PRESET } from "./constants";
import FoundationSection from "./foundation-section";

export default function AnalysisResultView({
  analysis,
  resultImageUrl,
  headerHideBack,
  headerRightSlot,
  footer,
  fallback: Fallback,
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

  if (!analysisPreset) return <>{Fallback}</>;

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
        hideBack={headerHideBack}
        rightSlot={headerRightSlot}
      />

      <TypeIntroSection
        personalType={analysis.personalType}
        analysisPreset={analysisPreset}
      />

      <div ref={ref} aria-hidden className="h-px"></div>

      <Layout
        className={cn("-mt-0.5 bg-[#FFFAF6] pt-12", footer ? "pb-30" : "pb-20")}
      >
        <BodyColorSection analysis={analysis} resultImageUrl={resultImageUrl} />
        <SkinToneSection analysis={analysis} analysisPreset={analysisPreset} />
        <FoundationSection skin={analysis.skin} />
      </Layout>

      {footer}
    </div>
  );
}
