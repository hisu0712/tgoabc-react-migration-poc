import { cn } from "@/lib/utils";
import { Outlet } from "react-router";

export default function GlobalLayout() {
  return (
    <div className="min-h-[100vh] px-6">
      <Outlet />
    </div>
  );
}

export function Layout({ className, children }: React.ComponentProps<"div">) {
  return <div className={cn("px-6", className)}>{children}</div>;
}
