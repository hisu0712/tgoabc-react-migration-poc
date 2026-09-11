import { Outlet } from "react-router";
import BottomNav, { type NavItem } from "./bottom-nav";

export default function GlobalLayoutWithBottomNav({
  navItems,
}: {
  navItems: NavItem[];
}) {
  return (
    <div className="global-layout">
      <Outlet />
      <div aria-hidden className="h-28 w-full"></div>
      <BottomNav navItems={navItems} />
    </div>
  );
}
