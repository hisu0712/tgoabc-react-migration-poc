import { roleHomePath, SIGN_IN_PATH } from "@/lib/route";
import { useActiveRole } from "@/store/active-role";
import { Navigate, Outlet } from "react-router";

export default function CustomerOnlyLayout() {
  const activeRole = useActiveRole();

  if (activeRole !== "customer") {
    return (
      <Navigate
        to={activeRole ? roleHomePath(activeRole) : SIGN_IN_PATH}
        replace
      />
    );
  }

  return <Outlet />;
}
