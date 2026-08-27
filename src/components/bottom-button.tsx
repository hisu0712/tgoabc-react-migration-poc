import type { ComponentProps } from "react";
import { Button } from "./ui/button";
import { Layout } from "./layout/global-layout";

export default function BottomButton({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Layout className="bg-background fixed inset-x-0 bottom-0 z-10 w-full pt-5 pb-10">
      <Button
        className={`w-full cursor-pointer py-6 text-lg ${className ?? ""}`}
        {...props}
      />
    </Layout>
  );
}
