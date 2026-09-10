import AnalysisResultView from "@/components/analysis-result/analysis-result-view";
import { SAMPLE_ANALYSIS, SAMPLE_RESULT_IMAGE_URL } from "./constants";

export default function AnalysisPreviewPage() {
  return (
    <AnalysisResultView
      analysis={SAMPLE_ANALYSIS}
      resultImageUrl={SAMPLE_RESULT_IMAGE_URL}
    />
  );
}
