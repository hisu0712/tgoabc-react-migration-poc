import { Outlet } from "react-router";

export default function GlobalLayout() {
  return (
    <div className="flex min-h-[100vh] flex-col pr-7 pl-7">
      <Outlet />
    </div>
  );
}
