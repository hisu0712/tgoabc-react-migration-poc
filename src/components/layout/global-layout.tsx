import { cn } from "@/lib/utils";
import { Outlet } from "react-router";

export default function GlobalLayout() {
  return (
    <div className="global-layout">
      <Outlet />
    </div>
  );
}

export function Layout({ className, children }: React.ComponentProps<"div">) {
  return <div className={cn("screen-h px-5", className)}>{children}</div>;
}
