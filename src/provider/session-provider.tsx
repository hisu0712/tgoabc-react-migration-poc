import GlobalLoader from "@/components/global-loader";
import { supabase } from "@/lib/supabase";
import { useClearActiveRole, useSetActiveRole } from "@/store/active-role";
import { useIsSessionLoaded, useSetSession } from "@/store/session";
import { useEffect, type ReactNode } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const setSession = useSetSession();
  const isSessionLoaded = useIsSessionLoaded();
  const setActiveRole = useSetActiveRole();
  const clearActiveRole = useClearActiveRole();

  useEffect(() => {
    // Supabase가 Auth State 변경 이벤트가 생길 때마다 자기가 들고 있는 그 콜백 함수를 알아서 호출해줌
    // supabase.auth.onAuthStateChange(...)에 인자로 넘기는 화살표 함수 전체가 콜백
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (!session) {
        clearActiveRole();
        return;
      }

      if (event === "PASSWORD_RECOVERY") {
        setActiveRole("member"); // 비밀번호 재설정은 회원 전용 플로우
        return;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isSessionLoaded) return <GlobalLoader />;

  return children;
}
