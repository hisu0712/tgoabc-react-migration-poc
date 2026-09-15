import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function CumulativeStatChart({
  title,
  unit,
  color,
  config,
  xAxisDatakey,
  datakey,
  data,
}: {
  title: string;
  unit: string;
  color: string;
  config: ChartConfig;
  xAxisDatakey: string;
  datakey: string;
  data: Record<string, string | number>[];
}) {
  const latestValue = data[data.length - 1]?.[datakey] ?? 0;

  return (
    <>
      <h3 className="mb-2 font-medium">
        {title}{" "}
        <span className="text-chart-1 font-semibold" style={{ color }}>
          {latestValue}
          {unit}
        </span>
      </h3>

      <ChartContainer config={config} className="-ml-5 h-[200px] w-full">
        <AreaChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey={xAxisDatakey} tickLine={false} axisLine={true} />
          <YAxis tickLine={false} axisLine={true} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            dataKey={datakey}
            type="linear"
            fill={`var(--color-${datakey})`}
            fillOpacity={0.4}
            stroke={`var(--color-${datakey})`}
            dot
          />
        </AreaChart>
      </ChartContainer>
    </>
  );
}
