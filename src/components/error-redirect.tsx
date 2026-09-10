import { REDIRECT_ERROR_MESSAGE } from "@/hooks/use-redirect-to-home";
import { toastError } from "@/lib/toast";
import { useEffect } from "react";
import { Navigate } from "react-router";

export default function ErrorRedirect({
  to,
  message = REDIRECT_ERROR_MESSAGE,
}: {
  to: string;
  message?: string;
}) {
  useEffect(() => {
    toastError(message);
  }, [message]);

  return <Navigate to={to} replace />;
}
