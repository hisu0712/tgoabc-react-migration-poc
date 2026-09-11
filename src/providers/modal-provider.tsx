import AlertModal from "@/components/modal/alert-modal";
import DesignerEditorModal from "@/components/modal/designer-editor-modal";
import LinkCustomerModal from "@/components/modal/link-customer-modal";
import SelectCustomerModal from "@/components/modal/select-customer-modal";
import ShareAnalysisModal from "@/components/modal/share-analysis-modal";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export default function ModalProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {createPortal(
        <>
          <AlertModal />
          <DesignerEditorModal />
          <LinkCustomerModal />
          <SelectCustomerModal />
          <ShareAnalysisModal />
        </>,
        // Dialog/AlertDialog는 자체 Portal에 container="#modal-root"를 명시해서 들어옴
        document.getElementById("modal-root")!,
      )}
      {children}
    </>
  );
}
