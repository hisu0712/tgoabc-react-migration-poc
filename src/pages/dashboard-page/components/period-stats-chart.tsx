import { Card } from "@/components/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import CumulativeStatChart from "./cumulative-stat-chart";

export default function PeriodStatsChart() {
  const [selectOption, setSelectOption] = useState<"month" | "day">("month");

  const chartData = [
    { month: "3월", newCustomer: 0, revisit: 0 },
    { month: "4월", newCustomer: 0, revisit: 0 },
    { month: "5월", newCustomer: 1, revisit: 1 },
    { month: "6월", newCustomer: 3, revisit: 3 },
    { month: "7월", newCustomer: 5, revisit: 4 },
    { month: "8월", newCustomer: 5, revisit: 2 },
    { month: "9월", newCustomer: 7, revisit: 2 },
  ];
  const chartConfig = {
    newCustomer: { label: "신규고객", color: "var(--chart-1)" },
    revisit: { label: "재방문", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  const customerChartData = [
    { month: "3월", cumulativeCustomer: 5 },
    { month: "4월", cumulativeCustomer: 5 },
    { month: "5월", cumulativeCustomer: 5 },
    { month: "6월", cumulativeCustomer: 5 },
    { month: "7월", cumulativeCustomer: 5 },
    { month: "8월", cumulativeCustomer: 5 },
    { month: "9월", cumulativeCustomer: 5 },
  ];
  const customerChartConfig = {
    cumulativeCustomer: { label: "누적 고객", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  const analysisChartData = [
    { month: "3월", cumulativeAnalysis: 5 },
    { month: "4월", cumulativeAnalysis: 5 },
    { month: "5월", cumulativeAnalysis: 5 },
    { month: "6월", cumulativeAnalysis: 5 },
    { month: "7월", cumulativeAnalysis: 5 },
    { month: "8월", cumulativeAnalysis: 5 },
    { month: "9월", cumulativeAnalysis: 5 },
  ];
  const analysisChartConfig = {
    cumulativeAnalysis: { label: "누적 분석", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  return (
    <>
      <Card className="mb-2">
        <div className="mb-2 grid grid-cols-2 gap-1">
          <Button variant="outline" className="justify-baseline">
            <CalendarIcon className="text-muted-foreground size-4" />
            <span>2026/10/11</span>
          </Button>

          <Select
            value={selectOption}
            onValueChange={(v) => setSelectOption(v as "month" | "day")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="month">월</SelectItem>
              <SelectItem value="day">일</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-muted-foreground mb-2 text-center text-sm">
          기간: 2026/10/1 ~ 2026/12/1
        </p>

        <ChartContainer config={chartConfig} className="h-[270px] w-full">
          <AreaChart data={chartData} margin={{ left: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} />
            <YAxis tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="newCustomer"
              type="linear"
              fill="var(--color-newCustomer)"
              fillOpacity={0.4}
              stroke="var(--color-newCustomer)"
              dot
            />
            <Area
              dataKey="revisit"
              type="linear"
              fill="var(--color-revisit)"
              fillOpacity={0.4}
              stroke="var(--color-revisit)"
              dot
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </Card>

      <Card className="mb-2">
        <CumulativeStatChart
          config={customerChartConfig}
          xAxisDatakey="month"
          datakey="cumulativeCustomer"
          data={customerChartData}
        />
      </Card>

      <Card>
        <CumulativeStatChart
          config={analysisChartConfig}
          xAxisDatakey="month"
          datakey="cumulativeAnalysis"
          data={analysisChartData}
        />
      </Card>
    </>
  );
}
