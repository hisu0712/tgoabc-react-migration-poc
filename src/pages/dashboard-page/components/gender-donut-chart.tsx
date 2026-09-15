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
import useCustomerCountByGender from "@/hooks/queries/customer/use-customer-count-by-gender-data";
import { MEMBER_HOME_PATH } from "@/lib/route";
import { useSession } from "@/store/session";
import { Pie, PieChart } from "recharts";

export default function GenderDonutChart() {
  const session = useSession();
  const memberId = session!.user.id;

  const { data, isPending, isError } = useCustomerCountByGender(memberId);

  if (isError) {
    return (
      <ErrorRedirect
        to={MEMBER_HOME_PATH}
        message="문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      />
    );
  }

  const countByGender = { M: 0, F: 0 }; // 값이 없이 반환될 경우 대비
  data?.forEach(({ gender, count }) => {
    countByGender[gender] = count;
  });

  const totalCount = countByGender.M + countByGender.F;
  const malePercent =
    totalCount === 0 ? 0 : Math.round((countByGender.M / totalCount) * 100);
  const femalePercent = totalCount === 0 ? 0 : 100 - malePercent;

  const chartData = [
    {
      gender: "male",
      count: malePercent,
      fill: "var(--color-male)",
    },
    {
      gender: "female",
      count: femalePercent,
      fill: "var(--color-female)",
    },
  ];

  const chartConfig = {
    count: { label: "고객 비율" },
    male: { label: "남성(%)", color: "var(--chart-1)" },
    female: { label: "여성(%)", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  return isPending ? (
    <Skeleton className="h-[270px] w-full" />
  ) : (
    <ChartContainer config={chartConfig} className="h-[270px] w-full -mt-3">
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
