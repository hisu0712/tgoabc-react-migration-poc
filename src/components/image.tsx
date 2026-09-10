import { cn } from "@/lib/utils";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

export default function Image({
  src,
  alt,
  className,
  wrapperClassName,
  ...props
}: React.ComponentProps<"img"> & { wrapperClassName?: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {status === "loading" && <Skeleton className="absolute inset-0" />}
      {status === "error" ? (
        <div className="bg-muted text-muted-foreground absolute inset-0 flex items-center justify-center text-sm">
          이미지 없음
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cn(
            "h-full w-full transition-opacity",
            status === "loaded" ? "opacity-100" : "opacity-0",
            className,
          )}
          {...props}
        />
      )}
    </div>
  );
}
