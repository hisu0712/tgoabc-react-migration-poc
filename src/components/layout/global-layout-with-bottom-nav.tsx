import { Outlet } from "react-router";
import BottomNav from "./bottomNav";

export default function GlobalLayoutWithBottomNav() {
  return (
    <div className="min-h-[100vh] pr-7 pl-7">
      <Outlet />
      <BottomNav />
    </div>
  );
}
