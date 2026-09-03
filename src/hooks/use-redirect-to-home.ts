import { roleHomePath, SIGN_IN_PATH } from "@/lib/route";
import { useActiveRole } from "@/store/active-role";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const REDIRECT_ERROR_MESSAGE =
  "문제가 발생했습니다. 잠시 후 다시 시도해주세요.";

export function useRedirectToHome() {
  const navigate = useNavigate();
  const activeRole = useActiveRole();

  return () => {
    toast.error(REDIRECT_ERROR_MESSAGE, { position: "top-center" });
    navigate(activeRole ? roleHomePath(activeRole) : SIGN_IN_PATH, {
      replace: true,
    });
  };
}
