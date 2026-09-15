import { Card } from "@/components/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { CalendarIcon, ChartNoAxesColumn } from "lucide-react";
import { useState } from "react";
import CumulativeStatChart from "./cumulative-stat-chart";
import dayjs from "dayjs";
import { Calendar } from "@/components/ui/calendar";
import type { Granularity } from "@/types";
import { useSession } from "@/store/session";
import useCustomerCountByPeriod from "@/hooks/queries/customer/use-customer-count-by-period-data";
import useAnalysisCountByPeriod from "@/hooks/queries/analysis/use-analysis-count-by-period-data";
import ErrorRedirect from "@/components/error-redirect";
import { MEMBER_HOME_PATH } from "@/lib/route";
import { Skeleton } from "@/components/ui/skeleton";

export default function PeriodStatsChart() {
  const session = useSession();
  const memberId = session!.user.id;

  const [selectDate, setSelectDate] = useState<Date>(new Date());
  const [selectGranularity, setSelectGranularity] =
    useState<Granularity>("month");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const pivotDate = dayjs(selectDate).format("YYYY-MM-DD"); // RPC 호출 시 날짜 밀림 방지

  const {
    data: customerPeriodBucketsData,
    isPending: isFetchCustomerCountPending,
    isError: isFetchCustomerCountError,
  } = useCustomerCountByPeriod({
    memberId,
    pivotDate,
    granularity: selectGranularity,
  });

  const {
    data: analysisPeriodBucketsData,
    isPending: isFetchAnalysisCountPending,
    isError: isFetchAnalysisCountError,
  } = useAnalysisCountByPeriod({
    memberId,
    pivotDate,
    granularity: selectGranularity,
  });

  if (isFetchCustomerCountError || isFetchAnalysisCountError) {
    return (
      <ErrorRedirect
        to={MEMBER_HOME_PATH}
        message="문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      />
    );
  }

  const formatBucketLabel = (bucketStart: string) =>
    selectGranularity === "month"
      ? dayjs(bucketStart).format("M월")
      : dayjs(bucketStart).format("MM/DD");

  const integratedChartData = (customerPeriodBucketsData ?? []).map((row) => {
    const analysisRow = analysisPeriodBucketsData?.find(
      (a) => a.bucket_start === row.bucket_start,
    );

    return {
      date: formatBucketLabel(row.bucket_start),
      newCustomer: row.new_count,
      newAnalysis: analysisRow?.new_count ?? 0,
    };
  });

  const customerChartData = (customerPeriodBucketsData ?? []).map((row) => ({
    date: formatBucketLabel(row.bucket_start),
    cumulativeCustomer: row.cumulative_count,
  }));

  const analysisChartData = (analysisPeriodBucketsData ?? []).map((row) => ({
    date: formatBucketLabel(row.bucket_start),
    cumulativeAnalysis: row.cumulative_count,
  }));

  const customerChartConfig = {
    cumulativeCustomer: { label: "누적고객수", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  const integratedChartConfig = {
    newCustomer: { label: "신규고객(명)", color: "var(--chart-1)" },
    newAnalysis: { label: "신규분석(건)", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  const analysisChartConfig = {
    cumulativeAnalysis: { label: "누적분석건수", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  const periodUnit = selectGranularity === "month" ? "month" : "day";
  const periodStart = dayjs(selectDate)
    .subtract(3, periodUnit)
    .format("YYYY-MM-DD");
  const periodEnd = dayjs(selectDate).add(3, periodUnit).format("YYYY-MM-DD");

  const isPending = isFetchCustomerCountPending || isFetchAnalysisCountPending;

  return (
    <>
      <Card className="mb-2">
        <div className="mb-2 grid grid-cols-2 gap-1">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-baseline">
                <CalendarIcon
                  className="text-muted-foreground size-4"
                  strokeWidth={1.5}
                />
                <span>{dayjs(selectDate).format("YYYY-MM-DD")}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectDate}
                onSelect={(date) => {
                  if (!date) return;
                  setSelectDate(date);
                  setIsCalendarOpen(false);
                }}
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>

          <Select
            value={selectGranularity}
            onValueChange={(v) => setSelectGranularity(v as Granularity)}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <ChartNoAxesColumn
                  className="text-muted-foreground size-4"
                  strokeWidth={2}
                />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="month">월별</SelectItem>
              <SelectItem value="day">일별</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-muted-foreground mb-3 text-center text-sm">
          기간: {periodStart} ~ {periodEnd}
        </p>

        {isPending ? (
          <Skeleton className="h-[270px] w-full" />
        ) : (
          <ChartContainer
            config={integratedChartConfig}
            className="-ml-5 h-[270px] w-full"
          >
            <AreaChart data={integratedChartData} margin={{ left: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} />
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
                dataKey="newAnalysis"
                type="linear"
                fill="var(--color-newAnalysis)"
                fillOpacity={0.4}
                stroke="var(--color-newAnalysis)"
                dot
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </Card>

      <Card className="mb-2">
        {isPending ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          <CumulativeStatChart
            title="누적 고객"
            unit="명"
            color="var(--chart-1)"
            config={customerChartConfig}
            xAxisDatakey="date"
            datakey="cumulativeCustomer"
            data={customerChartData}
          />
        )}
      </Card>

      <Card>
        {isPending ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          <CumulativeStatChart
            title="누적 분석"
            unit="건"
            color="var(--chart-2)"
            config={analysisChartConfig}
            xAxisDatakey="date"
            datakey="cumulativeAnalysis"
            data={analysisChartData}
          />
        )}
      </Card>
    </>
  );
}
