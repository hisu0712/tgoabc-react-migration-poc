import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function CumulativeStatChart({
  config,
  xAxisDatakey,
  datakey,
  data,
}: {
  config: ChartConfig;
  xAxisDatakey: string;
  datakey: string;
  data: Record<string, string | number>[];
}) {
  return (
    <ChartContainer config={config} className="h-[200px] w-full">
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
  );
}
