import { toast } from "sonner";

const opts = { position: "top-center" } as const;

export const toastComingSoon = () => toast.info("준비 중인 기능입니다.", opts);
