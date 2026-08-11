import { Outlet } from "react-router";

export default function GlobalLayout() {
  return (
    <div className="min-h-[100vh] pr-7 pl-7">
      <Outlet />
    </div>
  );
}
