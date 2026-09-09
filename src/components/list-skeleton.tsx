import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ListSkeleton({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn("h-16 w-full rounded-xl", className)} />
      ))}
    </>
  );
}
