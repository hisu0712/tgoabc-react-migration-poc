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
      <div className="mt-30"></div>
      <BottomNav navItems={navItems} />
    </div>
  );
}
