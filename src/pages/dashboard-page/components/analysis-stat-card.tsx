import { StatsCard, type StatItem } from "./stat-item";

export default function AnalysisStatCard() {
  const analysisStats: StatItem[] = [
    { label: "전체 분석", value: 12, unit: "건" },
    { label: "신규 분석", subLabel: "(최근 30일)", value: 12, unit: "회" },
  ];

  return <StatsCard items={analysisStats} />;
}
