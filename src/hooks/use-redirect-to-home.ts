import { roleHomePath, SIGN_IN_PATH } from "@/lib/route";
import { toastError } from "@/lib/toast";
import { useActiveRole } from "@/store/active-role";
import { useNavigate } from "react-router";

export const REDIRECT_ERROR_MESSAGE =
  "문제가 발생했습니다. 잠시 후 다시 시도해주세요.";

export function useRedirectToHome() {
  const navigate = useNavigate();
  const activeRole = useActiveRole();

  return () => {
    toastError(REDIRECT_ERROR_MESSAGE);
    navigate(activeRole ? roleHomePath(activeRole) : SIGN_IN_PATH, {
      replace: true,
    });
  };
}
