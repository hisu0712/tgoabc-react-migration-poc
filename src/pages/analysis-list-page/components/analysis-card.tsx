import { LinkCard } from "@/components/card";
import { PERSONAL_TYPE_LABEL, type PersonalType } from "@/lib/analysis";
import { ChevronRightIcon, ListIcon } from "lucide-react";
import { PERSONAL_TYPE_SEASON, SEASON_BADGE_COLOR } from "../constants";

export default function AnalysisCard({
  to,
  personalType,
  date,
}: {
  to: string;
  personalType: PersonalType;
  date: string;
}) {
  const badgeColor = SEASON_BADGE_COLOR[PERSONAL_TYPE_SEASON[personalType]];

  return (
    <LinkCard to={to} className="flex items-center justify-between gap-2">
      <div className="flex flex-col gap-1">
        <span
          className="w-max rounded-sm px-1 text-sm leading-relaxed"
          style={{
            backgroundColor: badgeColor.bg,
            color: badgeColor.text,
          }}
        >
          {PERSONAL_TYPE_LABEL[personalType]}
        </span>
        <div className="flex items-center gap-1">
          <ListIcon className="size-4" strokeWidth={1.8} />
          <span className="font-medium -mb-0.5">{date}</span>
        </div>
      </div>
      <ChevronRightIcon className="size-8" strokeWidth={1.2} />
    </LinkCard>
  );
}
