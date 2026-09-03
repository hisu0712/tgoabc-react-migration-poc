import { REDIRECT_ERROR_MESSAGE } from "@/hooks/use-redirect-to-home";
import { useEffect } from "react";
import { Navigate } from "react-router";
import { toast } from "sonner";

export default function ErrorRedirect({
  to,
  message = REDIRECT_ERROR_MESSAGE,
}: {
  to: string;
  message?: string;
}) {
  useEffect(() => {
    toast.error(message, { position: "top-center" });
  }, [message]);

  return <Navigate to={to} replace />;
}
