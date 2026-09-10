import { Outlet } from "react-router";
import BottomNav, { type NavItem } from "./bottom-nav";

export default function GlobalLayoutWithBottomNav({
  navItems,
}: {
  navItems: NavItem[];
}) {
  return (
    <div className="min-h-[100vh] pr-7 pl-7">
      <Outlet />
      <div aria-hidden className="h-28 w-full"></div>
      <BottomNav navItems={navItems} />
    </div>
  );
}
