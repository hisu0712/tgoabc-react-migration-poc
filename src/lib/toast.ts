import { toast } from "sonner";

const opts = { position: "top-center" } as const;

export const toastSuccess = (msg: string) => toast.success(msg, opts);
export const toastError = (msg: string) => toast.error(msg, opts);
export const toastInfo = (msg: string) => toast.info(msg, opts);

export const toastComingSoon = () => toastInfo("준비 중인 기능입니다.");
export const toastNoChange = () => toastInfo("변경된 내용이 없습니다.");
