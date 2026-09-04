import AlertModal from "@/components/modal/alert-modal";
import DesignerEditorModal from "@/components/modal/designer-editor-modal";
import LinkCustomerModal from "@/components/modal/link-customer-modal";
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
        </>,
        document.getElementById("modal-root")!,
      )}
      {children}
    </>
  );
}
