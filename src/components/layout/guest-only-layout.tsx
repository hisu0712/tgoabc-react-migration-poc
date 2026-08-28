import { useSession, useSessionUserRoles } from "@/store/session";
import { useState } from "react";
import { Navigate, Outlet } from "react-router";

export default function GuestOnlyLayout() {
  const session = useSession();
  const roles = useSessionUserRoles();

  // 페이지 진입 시점에 이미 세션이 있었는지만 판단 (로그인 진행 중 생기는 세션 변화는 무시)
  const [hadSessionOnMount] = useState(() => !!session); // boolean으로 강제 변환

  if (hadSessionOnMount && roles.includes("member"))
    return <Navigate to={"/"} replace={true} />;
  if (hadSessionOnMount && roles.includes("customer"))
    return <Navigate to={"/portal"} replace={true} />;

  return <Outlet />;
}
