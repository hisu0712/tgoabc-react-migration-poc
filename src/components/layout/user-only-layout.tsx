import { useActiveRole } from "@/store/active-role";
import { useSession, useSessionUserRoles } from "@/store/session";
import { Navigate, Outlet } from "react-router";

export default function UserOnlyLayout() {
  const session = useSession();
  const roles = useSessionUserRoles();
  const activeRole = useActiveRole();

  if (!session) return <Navigate to={"/sign-in"} replace={true} />;
  if (activeRole !== "member" && activeRole !== "customer")
    return <Navigate to={"/sign-in"} replace={true} />;
  if (!roles.includes(activeRole))
    return <Navigate to={"/sign-in"} replace={true} />;

  return <Outlet />;
}
