import ErrorRedirect from "@/components/error-redirect";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import useCustomerCountByAgeGroup from "@/hooks/queries/customer/use-customer-count-by-age-group-data";
import { MEMBER_HOME_PATH } from "@/lib/route";
import { useSession } from "@/store/session";
import type { AgeGroup } from "@/types";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const AGE_GROUPS: AgeGroup[] = ["10대", "20대", "30대", "40대", "50대 이상"];

export default function AgeGroupBarChart() {
  const session = useSession();
  const memberId = session!.user.id;

  const { data, isPending, isError } = useCustomerCountByAgeGroup(memberId);

  if (isError) {
    return (
      <ErrorRedirect
        to={MEMBER_HOME_PATH}
        message="문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      />
    );
  }

  const chartData = AGE_GROUPS.map((ageGroup) => {
    const male =
      data?.find((row) => row.age_group === ageGroup && row.gender === "M")
        ?.count ?? 0;
    const female =
      data?.find((row) => row.age_group === ageGroup && row.gender === "F")
        ?.count ?? 0;

    return { ageGroup, male, female };
  });

  const chartConfig = {
    male: { label: "남성(명)", color: "var(--chart-1)" },
    female: { label: "여성(명)", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  return isPending ? (
    <Skeleton className="h-[270px] w-full" />
  ) : (
    <ChartContainer config={chartConfig} className="-ml-5 h-[270px] w-full">
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
