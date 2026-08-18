import { useSession, useSessionUserRoles } from "@/store/session";
import { Navigate, Outlet } from "react-router";

export default function MemberOnlyLayout() {
  const session = useSession();
  const roles = useSessionUserRoles();

  if (!session) return <Navigate to={"/sign-in"} replace={true} />;
  if (!roles.includes("member"))
    return <Navigate to={"/sign-in"} replace={true} />;

  return <Outlet />;
}
