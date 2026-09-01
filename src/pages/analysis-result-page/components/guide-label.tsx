import { cn } from "@/lib/utils";

export function GuideLabel({
  className,
  children,
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "inline-block border border-[#DC8E5E]/20 bg-[#FFF3E8] px-3 text-center text-sm font-medium break-keep text-[#DC8E5E]",
        className,
      )}
    >
      {children}
    </div>
  );
}
