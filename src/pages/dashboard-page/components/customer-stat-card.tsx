import { StatsCard, type StatItem } from "./stat-item";

export default function CustomerStatCard() {
  const customerStats: StatItem[] = [
    { label: "전체 고객", value: 12, unit: "명" },
    { label: "신규 고객", subLabel: "(최근 30일)", value: 12, unit: "명" },
  ];

  return <StatsCard items={customerStats} />;
}
