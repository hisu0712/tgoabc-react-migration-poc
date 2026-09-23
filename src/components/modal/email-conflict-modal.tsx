import { useEmailConflictModal } from "@/store/modals/email-conflict-modal";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRequestCustomerEmailChange } from "@/hooks/mutations/customer/use-request-customer-email-change";
import { toastError, toastSuccess } from "@/lib/toast";
import { useConfirmCustomerEmailChange } from "@/hooks/mutations/customer/use-confirm-customer-email-change";

export default function EmailConflictModal() {
  const emailConflictModal = useEmailConflictModal();

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const { mutate: requestEmailChange, isPending: isRequestEmailChangePending } =
    useRequestCustomerEmailChange({
      onSuccess: (data) => {
        setIsOtpSent(true);
        toastSuccess(
          data?.otp
            ? `(POC) 인증번호: ${data.otp}`
            : "인증번호를 발송했습니다.",
        );
      },
      onError: (error) => {
        toastError(error.message || "인증 코드 발송에 실패했습니다.");
      },
    });

  const { mutate: ConfirmEmailChange, isPending: isConfirmEmailChangePending } =
    useConfirmCustomerEmailChange({
      onSuccess: () => {
        toastSuccess("이메일이 변경되었습니다.");
        emailConflictModal.actions.close();
      },
      onError: (error) => {
        toastError(error.message || "이메일 변경에 실패했습니다.");
      },
    });

  useEffect(() => {
    if (!emailConflictModal.isOpen) return;
    setOtp("");
    setIsOtpSent(false);
  }, [emailConflictModal.isOpen]);

  if (!emailConflictModal.isOpen) return null;

  const handleRequestOtp = () => {
    requestEmailChange({
      customerId: emailConflictModal.customerId,
      newEmail: emailConflictModal.newEmail,
    });
  };

  const handleConfirm = () => {
    ConfirmEmailChange({
      customerId: emailConflictModal.customerId,
      newEmail: emailConflictModal.newEmail,
      otp,
    });
  };

  return (
    <Dialog
      open={emailConflictModal.isOpen}
      onOpenChange={(open) => !open && emailConflictModal.actions.close()}
    >
      <DialogContent>
        {!isOtpSent ? (
          <>
            <DialogTitle>이미 등록된 이메일입니다</DialogTitle>
            <p className="text-muted-foreground text-sm">
              이미 등록된 이메일입니다. 본인이 맞다면 인증을 진행해주세요.
            </p>
            <Button
              disabled={isRequestEmailChangePending}
              loading={isRequestEmailChangePending}
              onClick={handleRequestOtp}
              className="w-full"
            >
              인증 진행
            </Button>
          </>
        ) : (
          <>
            <DialogTitle>이메일 인증</DialogTitle>
            <Input
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              inputMode="numeric"
              maxLength={6}
              placeholder="인증번호 6자리 입력"
            />
            <Button
              disabled={otp.length !== 6 || isConfirmEmailChangePending}
              loading={isConfirmEmailChangePending}
              onClick={handleConfirm}
              className="w-full"
            >
              확인
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
