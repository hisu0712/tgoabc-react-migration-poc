import { StatsCard, type StatItem } from "./stat-item";

export default function AnalysisStatCard() {
  const analysisStats: StatItem[] = [
    { label: "전체 분석", value: 12, unit: "건" },
    { label: "신규 고객", subLabel: "(최근 30일)", value: 12, unit: "회" },
    { label: "가장 많이 한 분석", value: "퍼스널컬러" },
  ];

  return <StatsCard items={analysisStats} />;
}
