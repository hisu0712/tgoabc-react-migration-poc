import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

const cardVariants = cva("rounded-xl p-5 shadow-[0_0_10px_rgba(0,0,0,0.1)]", {
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

function CustomerListCard({
  id,
  name,
  phone,
}: {
  id: string;
  name: string;
  phone: string;
}) {
  return (
    <LinkCard
      to={`/customers/${id}`}
      className="flex items-center justify-between gap-2"
    >
      <div className="flex items-center gap-1">
        <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full leading-none">
          K
        </div>
        <div className="flex gap-0.5">
          <span>{name}</span>
          <span>({phone})</span>
        </div>
      </div>
      <ChevronRight className="size-6" strokeWidth={1.5} />
    </LinkCard>
  );
}

export { Card, LinkCard, CustomerListCard };
