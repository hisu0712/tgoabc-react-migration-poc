import { useSession } from "@/store/session";
import { StatsCard, type StatItem } from "./stat-item";
import useAnalysisCount from "@/hooks/queries/analysis/use-analysis-count-data";
import dayjs from "dayjs";
import ErrorRedirect from "@/components/error-redirect";
import { MEMBER_HOME_PATH } from "@/lib/route";

export default function AnalysisStatCard() {
  const session = useSession();
  const memberId = session!.user.id;

  const {
    data: totalAnalysis,
    isPending: isFetchTotalAnalysisPending,
    isError: isFetchTotalAnalysisError,
  } = useAnalysisCount({ memberId }); // 1. 전체 분석

  const {
    data: newAnalysis,
    isPending: isFetchNewAnalysisPending,
    isError: isFetchNewAnalysisError,
  } = useAnalysisCount({
    memberId,
    since: dayjs().subtract(30, "day").startOf("day").toISOString(),
  }); // 2. 최근 30일 신규 분석

  if (isFetchTotalAnalysisError || isFetchNewAnalysisError)
    return (
      <ErrorRedirect
        to={MEMBER_HOME_PATH}
        message="문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      />
    );

  const analysisStats: StatItem[] = [
    {
      label: "전체 분석",
      value: totalAnalysis!,
      unit: "건",
      isPending: isFetchTotalAnalysisPending,
    },
    {
      label: "신규 분석",
      subLabel: "(최근 30일)",
      value: newAnalysis!,
      unit: "회",
      isPending: isFetchNewAnalysisPending,
    },
  ];

  return <StatsCard items={analysisStats} />;
}
