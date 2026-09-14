import { Card } from "@/components/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

const chartData = [
  { gender: "male", count: 30, fill: "var(--color-male)" },
  { gender: "female", count: 70, fill: "var(--color-female)" },
];

const chartConfig = {
  count: { label: "고객 비율" },
  male: { label: "남성", color: "var(--chart-1)" },
  female: { label: "여성", color: "var(--chart-2)" },
} satisfies ChartConfig;

export default function GenderDonutChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[270px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="gender"
          fillOpacity={0.6}
          innerRadius={50}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  );
}
