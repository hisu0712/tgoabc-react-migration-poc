import { useInView } from "react-intersection-observer";
import { useParams } from "react-router";
import { ANALYSIS_PRESET } from "../analysis-result-page/constants";
import GlobalLoader from "@/components/global-loader";
import ExpiredError from "./components/expired-error";
import HeaderNav from "@/components/layout/header-nav";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/layout/global-layout";
import FoundationSection from "../analysis-result-page/components/foundation-section";
import SkinToneSection from "../analysis-result-page/components/skin-tone-section";
import BodyColorSection from "../analysis-result-page/components/body-color-section";
import TypeIntroSection from "../analysis-result-page/components/type-intro-section";
import useSharedAnalysis from "@/hooks/queries/analysis/use-shared-analysis-data";

export default function AnalysisSharedPage() {
  const { analysisId } = useParams();
  const { ref, inView } = useInView({
    initialInView: true,
    rootMargin: "-100px 0px 0px 0px",
  });

  const { data, isLoading, isError } = useSharedAnalysis(analysisId);

  const analysis = data?.result;
  const resultImageUrl = data?.result_image_url;
  const analysisPreset = analysis && ANALYSIS_PRESET[analysis.personalType];

  if (isLoading) return <GlobalLoader />;

  if (isError || !analysis || !resultImageUrl || !analysisPreset)
    return <ExpiredError />;

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
        hideBack
      />

      <TypeIntroSection
        personalType={analysis.personalType}
        analysisPreset={analysisPreset}
      />

      <div ref={ref} aria-hidden className="h-px"></div>

      <Layout className="-mt-0.5 bg-[#FFFAF6] pt-12 pb-20">
        <BodyColorSection analysis={analysis} resultImageUrl={resultImageUrl} />

        <SkinToneSection analysis={analysis} analysisPreset={analysisPreset} />

        <FoundationSection skin={analysis.skin} />
      </Layout>
    </div>
  );
}
