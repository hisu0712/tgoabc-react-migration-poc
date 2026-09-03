import { roleHomePath, SIGN_IN_PATH } from "@/lib/route";
import { useActiveRole } from "@/store/active-role";
import { Navigate } from "react-router";

export default function FallbackRedirect() {
  const activeRole = useActiveRole();

  return (
    <Navigate
      to={activeRole ? roleHomePath(activeRole) : SIGN_IN_PATH}
      replace
    />
  );
}
