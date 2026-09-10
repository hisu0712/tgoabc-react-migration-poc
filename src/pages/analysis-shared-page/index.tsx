import { useParams } from "react-router";
import GlobalLoader from "@/components/global-loader";
import ExpiredError from "./components/expired-error";
import useSharedAnalysis from "@/hooks/queries/analysis/use-shared-analysis-data";
import AnalysisResultView from "@/components/analysis-result/analysis-result-view";

export default function AnalysisSharedPage() {
  const { analysisId } = useParams();

  const { data, isLoading, isError } = useSharedAnalysis(analysisId);

  const analysis = data?.result;
  const resultImageUrl = data?.result_image_url;

  if (isLoading) return <GlobalLoader />;

  if (isError || !analysis || !resultImageUrl) return <ExpiredError />;

  return (
    <AnalysisResultView
      analysis={analysis}
      resultImageUrl={resultImageUrl}
      headerHideBack
      fallback={<ExpiredError />}
    />
  );
}
