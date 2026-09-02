import { useActiveRole } from "@/store/active-role";
import { useSession } from "@/store/session";
import { Navigate, Outlet } from "react-router";

export default function GuestOnlyLayout() {
  const session = useSession();
  const activeRole = useActiveRole();

  if (session && activeRole === "member")
    return <Navigate to={"/"} replace={true} />;
  if (session && activeRole === "customer")
    return <Navigate to={"/portal"} replace={true} />;

  return <Outlet />;
}
