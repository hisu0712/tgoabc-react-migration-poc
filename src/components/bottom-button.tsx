import type { ComponentProps } from "react";
import { Button } from "./ui/button";

export default function BottomButton({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <div className="bg-background fixed inset-x-0 bottom-0 z-10 w-full px-7 pt-5 pb-10">
      <Button className={`cursor-pointer w-full py-6 text-lg ${className ?? ""}`} {...props} />
    </div>
  );
}
