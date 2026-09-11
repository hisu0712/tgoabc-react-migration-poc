import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRightIcon, ScissorsIcon } from "lucide-react";
import { Link } from "react-router";

const cardVariants = cva("rounded-xl p-4 shadow-[0_0_10px_rgba(0,0,0,0.1)]", {
  variants: {
    variant: {
      default: "bg-card",
      feature1: "bg-feature-1 text-white",
      feature2: "bg-feature-2 text-white",
      gradient: "text-white bg-linear-to-br from-feature-1 to-feature-2 ",
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

type CustomerCardProps = {
  id: string;
  name: string;
  birthDate?: string;
  designerName?: string;
  variant?: "default" | "compact";
  className?: string;
} & (
  | ({ asButton?: false } & Omit<
      React.ComponentProps<typeof LinkCard>,
      "to" | "className" | "variant"
    >)
  | ({ asButton: true } & Omit<React.ComponentProps<"button">, "className">)
);

function CustomerCard({
  id,
  name,
  birthDate,
  designerName,
  variant = "default",
  className,
  ...props
}: CustomerCardProps) {
  const isCompact = variant === "compact";

  const content = (
    <>
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
            <span className="text-muted-foreground -mb-0.5 flex items-center gap-0.5 text-sm leading-none">
              <ScissorsIcon className="size-3" />
              {designerName ? `${designerName} 디자이너` : "담당 없음"}
            </span>
          )}
        </div>
      </div>
      <ChevronRightIcon
        className={cn("shrink-0", isCompact ? "size-5" : "size-7")}
        strokeWidth={1.2}
      />
    </>
  );

  const cardClassName = cn(
    "flex items-center justify-between gap-2",
    isCompact && "w-max gap-1 p-3",
    className,
  );

  if (props.asButton) {
    const { asButton, ...buttonProps } = props;
    return (
      <button
        type="button"
        className={cn(
          cardVariants({ className: cardClassName }),
          "cursor-pointer",
        )}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }

  const { asButton, ...linkProps } = props;
  return (
    <LinkCard to={`/customers/${id}`} className={cardClassName} {...linkProps}>
      {content}
    </LinkCard>
  );
}

export { Card, LinkCard, CustomerCard };
