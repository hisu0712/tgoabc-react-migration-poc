import { roleHomePath, SIGN_IN_PATH } from "@/lib/route";
import { useActiveRole } from "@/store/active-role";
import { Navigate, Outlet } from "react-router";

export default function MemberOnlyLayout() {
  const activeRole = useActiveRole();

  if (activeRole !== "member") {
    return (
      <Navigate
        to={activeRole ? roleHomePath(activeRole) : SIGN_IN_PATH}
        replace
      />
    );
  }

  return <Outlet />;
}
