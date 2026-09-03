import { roleHomePath } from "@/lib/route";
import { useActiveRole } from "@/store/active-role";
import { Navigate, Outlet } from "react-router";

export default function GuestOnlyLayout() {
  const activeRole = useActiveRole();

  if (activeRole) return <Navigate to={roleHomePath(activeRole)} replace />;

  return <Outlet />;
}
