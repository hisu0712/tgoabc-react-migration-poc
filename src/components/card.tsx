import {
  PERSONAL_TYPE_LABEL,
  PERSONAL_TYPE_SEASON,
  SEASON_BADGE_COLOR,
  type PersonalType,
} from "@/lib/analysis";
import { cn } from "@/lib/utils";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight, ListIcon } from "lucide-react";
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
  email,
}: {
  id: string;
  name: string;
  email: string;
}) {
  return (
    <LinkCard
      to={`/customers/${id}`}
      className="flex items-center justify-between gap-2"
    >
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-sm leading-none font-semibold">
          K
        </div>
        <div className="flex gap-0.5 text-lg">
          <span>{name}</span>
          <span>({email.split("@")[0].slice(0, 4)})</span>
        </div>
      </div>
      <ChevronRight className="size-8" strokeWidth={1.2} />
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
        <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-sm leading-none font-semibold">
          K
        </div>
        <div className="flex gap-0.5 text-lg">
          <span>{name}</span>
          <span>({phone.slice(-4)})</span>
        </div>
      </div>
      <ChevronRight className="size-8" strokeWidth={1.2} />
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
