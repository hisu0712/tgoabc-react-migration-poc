import { useShareAnalysisModal } from "@/store/modals/share-analysis-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import useEnableAnalysisShare from "@/hooks/mutations/analysis/use-enable-analysis-share";
import { toastError } from "@/lib/toast";

export default function ShareAnalysisModal() {
  const shareAnalysisModal = useShareAnalysisModal();
  const [copied, setCopied] = useState(false);

  const { mutate: enableAnalysisShare } = useEnableAnalysisShare({
    onError: () => {
      toastError("공유 링크 생성에 실패했어요. 잠시 후 다시 시도해 주세요.");
      shareAnalysisModal.actions.close();
    },
  });

  const isOpen = shareAnalysisModal.isOpen;
  const analysisId = shareAnalysisModal.isOpen
    ? shareAnalysisModal.analysisId
    : undefined;

  useEffect(() => {
    if (isOpen && analysisId) {
      enableAnalysisShare(analysisId);
      setCopied(false);
    }
  }, [isOpen, analysisId]);

  if (!isOpen) return null;

  const shareUrl = `${import.meta.env.VITE_PUBLIC_URL}/share/analysis/${analysisId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 접근 실패 시 무시
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={shareAnalysisModal.actions.close}>
      <DialogContent>
        <div className="flex justify-center pb-2">
          <div className="rounded-lg border p-3">
            <QRCodeSVG value={shareUrl} className="size-30" />
          </div>
        </div>

        <DialogTitle>진단 결과 공유하기</DialogTitle>
        <DialogDescription>
          QR 코드 또는 링크로 결과를 전달할 수 있어요. 링크는 7일간 유효합니다
        </DialogDescription>

        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="text-muted-foreground min-w-0 flex-1 rounded-md border px-3 text-sm"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleCopy}
            className="cursor-pointer"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "복사됨" : "복사"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
