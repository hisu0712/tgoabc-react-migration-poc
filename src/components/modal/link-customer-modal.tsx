import { useLinkCustomerModal } from "@/store/modals/link-customer-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { useOpenSelectCustomerModal } from "@/store/modals/select-customer-modal";

export default function LinkCustomerModal() {
  const navigate = useNavigate();
  const linkCustomerModal = useLinkCustomerModal();
  const openSelectCustomerModal = useOpenSelectCustomerModal();

  if (!linkCustomerModal.isOpen) return null;

  const handleLinkCustomer = () => {
    navigate("/customers/new", {
      state: { analysisId: linkCustomerModal.analysisId },
    });
    linkCustomerModal.actions.close();
  };

  const handleSelectExistingCustomer = () => {
    openSelectCustomerModal(linkCustomerModal.analysisId);
  };

  return (
    <Dialog
      open={linkCustomerModal.isOpen}
      onOpenChange={linkCustomerModal.actions.close}
    >
      <DialogContent>
        <DialogTitle>고객을 추가하시겠어요?</DialogTitle>
        <DialogDescription>
          고객 추가를 하지 않으면 이 결과는 저장되지 않으며 이후 기록에서
          조회하실 수 없습니다.
        </DialogDescription>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={handleSelectExistingCustomer}
          >
            기존 고객
          </Button>
          <Button type="button" className="flex-1" onClick={handleLinkCustomer}>
            고객 추가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
