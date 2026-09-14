import { Card } from "@/components/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartData = [
  { ageGroup: "10대", male: 0, female: 0 },
  { ageGroup: "20대", male: 210, female: 90 },
  { ageGroup: "30대", male: 100, female: 150 },
  { ageGroup: "40대", male: 410, female: 210 },
  { ageGroup: "50대 이상", male: 0, female: 0 },
];

const chartConfig = {
  male: { label: "남성", color: "var(--chart-1)" },
  female: { label: "여성", color: "var(--chart-2)" },
} satisfies ChartConfig;

export default function AgeGroupBarChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[270px] w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="ageGroup" tickLine={false} />
        <YAxis tickLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="male"
          fill="var(--color-male)"
          fillOpacity={0.6}
          radius={2}
        />
        <Bar
          dataKey="female"
          fill="var(--color-female)"
          fillOpacity={0.6}
          radius={2}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
}
