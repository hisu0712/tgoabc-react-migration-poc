import { useSession, useSessionUserRoles } from "@/store/session";
import { Navigate, Outlet } from "react-router";

export default function GuestOnlyLayout() {
  const session = useSession();
  const roles = useSessionUserRoles();

  // 회원만 세션이 있는 경우 이동 허용(고객의 경우, 회원 회원가입 시 오류 가능성 있음)
  if (session && roles.includes("member"))
    return <Navigate to={"/"} replace={true} />;

  return <Outlet />;
}
