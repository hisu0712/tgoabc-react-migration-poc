import {
  PERSONAL_TYPE_LABEL,
  PERSONAL_TYPE_SEASON,
  SEASON_BADGE_COLOR,
  type PersonalType,
} from "@/lib/analysis";
import { cn } from "@/lib/utils";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight, ListIcon, Scissors } from "lucide-react";
import { Link } from "react-router";

const cardVariants = cva("rounded-xl p-4 shadow-[0_0_10px_rgba(0,0,0,0.1)]", {
  variants: {
    variant: {
      default: "bg-card",
      feature1: "bg-feature-1 text-card",
      feature2: "bg-feature-2 text-card",
      gradient: "text-card bg-linear-to-br from-feature-1 to-feature-2 ",
    },
  },
  defaultVariants: { variant: "default" },
});

function Card({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp className={cn(cardVariants({ variant, className }))} {...props} />
  );
}

function LinkCard({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof Link> & VariantProps<typeof cardVariants>) {
  return (
    <Link className={cn(cardVariants({ variant, className }))} {...props} />
  );
}

function CustomerCard({
  id,
  name,
  birthDate,
  designerName,
  variant = "default",
  className,
}: {
  id: string;
  name: string;
  birthDate?: string;
  designerName?: string;
  variant?: "default" | "compact";
} & React.ComponentProps<"div">) {
  const isCompact = variant === "compact";

  return (
    <LinkCard
      to={`/customers/${id}`}
      className={cn(
        "flex items-center justify-between gap-2",
        isCompact && "w-max gap-1 p-3",
        className,
      )}
    >
      <div className={cn("flex", isCompact ? "gap-1.5" : "gap-2.5")}>
        <div
          className={cn(
            "bg-primary/10 text-primary flex items-center justify-center rounded-full text-sm leading-none",
            isCompact ? "size-6" : "size-7",
          )}
        >
          {[...name.trim()][0] ?? "?"}
        </div>
        <div className="flex flex-col justify-center gap-1">
          <div className="flex gap-0.5 leading-none font-medium">
            <span>{name}</span>
            {birthDate && <span>({birthDate.slice(5).replace("-", "")})</span>}
          </div>

          {!isCompact && (
            <span className="text-muted-foreground flex items-center gap-0.5 text-sm leading-none">
              <Scissors className="size-3" />
              {designerName ? `${designerName} 디자이너` : "담당 없음"}
            </span>
          )}
        </div>
      </div>
      <ChevronRight
        className={cn("shrink-0", isCompact ? "size-5" : "size-7")}
        strokeWidth={1.2}
      />
    </LinkCard>
  );
}

function DesignerCard({
  name,
  phone,
  ...props
}: {
  name: string;
  phone: string;
} & React.ComponentProps<"div">) {
  return (
    <Card className="flex items-center justify-between gap-2" {...props}>
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full text-sm leading-none font-medium">
          {[...name.trim()][0] ?? "?"}
        </div>
        <div className="flex gap-0.5 text-lg">
          <span>{name}</span>
          <span>({phone.slice(-4)})</span>
        </div>
      </div>
      <ChevronRight className="size-7" strokeWidth={1.2} />
    </Card>
  );
}

function AnalysisCard({
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
          className="w-max rounded-sm px-1.5 py-0.5 text-sm"
          style={{
            backgroundColor: badgeColor.bg,
            color: badgeColor.text,
          }}
        >
          {PERSONAL_TYPE_LABEL[personalType]}
        </span>
        <div className="flex items-center gap-1">
          <ListIcon className="size-4" strokeWidth={1.8} />
          <span className="font-semibold">{date}</span>
        </div>
      </div>
      <ChevronRight className="size-8" strokeWidth={1.2} />
    </LinkCard>
  );
}

export { Card, LinkCard, CustomerCard, DesignerCard, AnalysisCard };
