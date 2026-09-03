import { SIGN_IN_PATH } from "@/lib/route";
import { useActiveRole } from "@/store/active-role";
import { Navigate, Outlet } from "react-router";

export default function UserOnlyLayout() {
  const activeRole = useActiveRole();

  if (!activeRole) return <Navigate to={SIGN_IN_PATH} replace />;

  return <Outlet />;
}
