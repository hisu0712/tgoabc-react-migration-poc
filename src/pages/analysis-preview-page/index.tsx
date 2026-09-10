import { SAMPLE_ANALYSIS, SAMPLE_RESULT_IMAGE_URL } from "./constants";
import AnalysisResultView from "../analysis-result-page/components/analysis-result-view";

export default function AnalysisPreviewPage() {
  return (
    <AnalysisResultView
      analysis={SAMPLE_ANALYSIS}
      resultImageUrl={SAMPLE_RESULT_IMAGE_URL}
    />
  );
}
