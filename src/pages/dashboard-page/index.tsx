import { Card } from "@/components/card";
import HeaderNav from "@/components/layout/header-nav";
import PeriodStatsChart from "./components/period-stats-chart";
import GenderDonutChart from "./components/gender-donut-chart";
import AgeGroupBarChart from "./components/age-group-bar-chart";
import CustomerStatCard from "./components/customer-stat-card";
import AnalysisStatCard from "./components/analysis-stat-card";

export default function DashboardPage() {
  return (
    <>
      <HeaderNav title="대시보드" hideBack />

      <h3 className="mb-1 font-semibold">고객별 통계</h3>
      <CustomerStatCard />
      <h3 className="mb-1 font-semibold">분석별 통계</h3>
      <AnalysisStatCard />

      <h3 className="mb-0.5 font-semibold">기간별 통계</h3>
      <p className="text-muted-foreground mb-1 text-sm">
        기준일을 중심으로 표시되며, 월/일 선택이 가능합니다.
      </p>
      <PeriodStatsChart />

      <h3 className="mt-7 mb-1 font-semibold">고객 통계</h3>
      <Card>
        <h4 className="font-medium">성별</h4>
        <GenderDonutChart />
        <h4 className="my-3 font-medium">연령</h4>
        <AgeGroupBarChart />
      </Card>
    </>
  );
}
