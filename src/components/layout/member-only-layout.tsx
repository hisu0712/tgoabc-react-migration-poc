import { useActiveRole } from "@/store/active-role";
import { useSession, useSessionUserRoles } from "@/store/session";
import { Navigate, Outlet } from "react-router";

export default function MemberOnlyLayout() {
  const session = useSession();
  const roles = useSessionUserRoles();
  const activeRole = useActiveRole();

  if (!session) return <Navigate to={"/sign-in"} replace={true} />;
  if (activeRole === "customer" && roles.includes("customer"))
    return <Navigate to={"/portal"} replace={true} />;
  if (activeRole !== "member" || !roles.includes("member"))
    return <Navigate to={"/sign-in"} replace={true} />;

  return <Outlet />;
}
