import { Card } from "@/components/card";
import { Fragment } from "react";

export type StatItem = {
  label: string;
  subLabel?: string;
  value: number | string;
  unit?: string;
};
function StatsRow({ label, subLabel, value, unit }: StatItem) {
  return (
    <div className="flex justify-between py-1.5">
      <label className="text-sm">
        {label} {subLabel && <span className="text-sm">{subLabel}</span>}
      </label>
      <div>
        <span className="font-semibold">{value}</span>
        {unit}
      </div>
    </div>
  );
}
export function StatsCard({ items }: { items: StatItem[] }) {
  return (
    <Card className="mb-7 flex flex-col gap-1.5">
      {items.map((item, i) => (
        <Fragment key={item.label}>
          <StatsRow {...item} />
          {i < items.length - 1 && <span className="bg-muted h-px" />}
        </Fragment>
      ))}
    </Card>
  );
}
