import { useUploadImage } from "@/hooks/mutations/image/use-upload-image";
import { useSession } from "@/store/session";
import { useEffect, useRef, useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import AnalysisLoading from "./analysis-loading";
import analysisScriptUrl from "./personal-analysis.iife.js?url"; // module
import analysisStyleUrl from "./personal-analysis.css?url"; // module
import type { Analysis } from "../analysis-result-page/constants";
import useCreateAnalysis from "@/hooks/mutations/analysis/use-create-analysis";
import { toast } from "sonner";

const ANALYSIS_ELEMENT_NAME = "skin-analysis";
const ANALYSIS_EVENT = "personal-analysis-complete";

function captureResultImage(el: HTMLElement): Promise<File> {
  const imageCanvas = el.querySelector<HTMLCanvasElement>(".el_imageCanvas");
  const overlayCanvas = el.querySelector<HTMLCanvasElement>(
    ".el_overlayCanvas:not([style*='opacity:0'])",
  );

  if (!imageCanvas || !overlayCanvas)
    return Promise.reject(new Error("결과 캔버스를 찾을 수 없습니다."));

  const mergedCanvas = document.createElement("canvas");
  mergedCanvas.width = imageCanvas.width;
  mergedCanvas.height = imageCanvas.height;

  const ctx = mergedCanvas.getContext("2d")!;
  ctx.drawImage(imageCanvas, 0, 0);
  ctx.drawImage(overlayCanvas, 0, 0);

  return new Promise((resolve, reject) => {
    // canvas.toBlob() : 캔버스 내용을 이미지 파일(Blob)로 비동기 변환(콜백 기반 비동기 API)
    mergedCanvas.toBlob((blob) => {
      if (!blob) return reject(new Error("캔버스 변환에 실패했습니다."));
      resolve(new File([blob], "result.png", { type: "image/png" }));
    }, "image/png");
  });
}

export default function AnalysisProcessPage() {
  const navigate = useNavigate();
  const session = useSession();
  const { analysisId } = useParams();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  const imageUrl = searchParams.get("imageUrl");

  const [isModuleLoaded, setIsModuleLoaded] = useState(
    !!customElements.get(ANALYSIS_ELEMENT_NAME),
  );
  const analysisRef = useRef<HTMLElement>(null);

  const { mutate: uploadResultImage } = useUploadImage({
    onError: () => {
      toast.error("문제가 발생했습니다. 잠시 후 다시 시도해주세요.", {
        position: "top-center",
      });
      navigate("/", { replace: true });
    },
  });

  const { mutate: createAnalysis } = useCreateAnalysis({
    onError: () => {
      console.error("분석 결과 저장에 실패했습니다.");
    },
  });

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = analysisStyleUrl;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (customElements.get(ANALYSIS_ELEMENT_NAME)) return; // 이전에 이 페이지 왔다 가서 이미 등록된 경우 → 스크립트 새로 안 만들고 끝

    const script = document.createElement("script");
    script.src = analysisScriptUrl;
    script.onload = () => setIsModuleLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const el = analysisRef.current;
    if (!el) return;

    const handleComplete = async (event: Event) => {
      const analysis = (event as CustomEvent<Analysis>).detail;

      try {
        const resultImageFile = await captureResultImage(el);
        const ownerId = customerId ?? session!.user.id; // customerId가 없으면 userId로 fallback

        uploadResultImage(
          {
            file: resultImageFile,
            filePath: `${ownerId}/analysis/${analysisId}/result.png`,
          },
          {
            onSuccess: (resultImageUrl) => {
              createAnalysis({
                id: analysisId!,
                customerId,
                memberId: session!.user.id,
                originalImageUrl: imageUrl!,
                resultImageUrl,
                result: analysis,
              });

              navigate(`/analysis/${analysisId}`, {
                state: { analysis, resultImageUrl },
                replace: true,
              });
            },
          },
        );
      } catch (error) {
        console.error("결과 이미지 캡처 실패", error);
      }
    };

    el.addEventListener(ANALYSIS_EVENT, handleComplete);
    return () => {
      el.removeEventListener(ANALYSIS_EVENT, handleComplete);
    };
  }, [isModuleLoaded]);

  if (!analysisId || !imageUrl) return <Navigate to={"/"} />;

  return (
    <div className="fixed inset-0 z-50">
      <AnalysisLoading />
      {isModuleLoaded && (
        <skin-analysis
          aria-hidden
          ref={analysisRef}
          image-src={imageUrl}
        ></skin-analysis>
      )}
    </div>
  );
}
