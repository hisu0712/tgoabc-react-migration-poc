import type { ComponentProps } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function BottomButton({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <>
      <div aria-hidden className="h-35"></div>
      <div className="layout-px bg-background fixed inset-x-0 bottom-0 z-10 w-full pt-5 pb-7">
        <Button
          className={cn("w-full cursor-pointer py-6 text-lg", className)}
          {...props}
        />
      </div>
    </>
  );
}
