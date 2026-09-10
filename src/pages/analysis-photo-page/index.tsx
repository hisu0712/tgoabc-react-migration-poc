import { useEffect, useRef, useState } from "react";
import AnalysisPhotoIntro from "./components/analysis-photo-intro";
import HeaderNav from "@/components/layout/header-nav";
import defaultImage from "/face.png";
import { Button } from "@/components/ui/button";
import type { Image } from "@/types";
import { useUploadImage } from "@/hooks/mutations/image/use-upload-image";
import { useSession } from "@/store/session";
import { useNavigate, useSearchParams } from "react-router";
import { Layout } from "@/components/layout/global-layout";
import { cn } from "@/lib/utils";
import { useActiveRole } from "@/store/active-role";
import { useRedirectToHome } from "@/hooks/use-redirect-to-home";
import { toastError, toastInfo } from "@/lib/toast";

export default function AnalysisPhotoPage() {
  const session = useSession();
  const activeRole = useActiveRole();
  const navigate = useNavigate();
  const redirectToHome = useRedirectToHome();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");

  const [showIntro, setShowIntro] = useState(true);
  const [count, setCount] = useState(3);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [faceImage, setFaceImage] = useState<Image | null>(null);

  const { mutate: uploadImage, isPending: isUploadImagePending } =
    useUploadImage({
      onError: () => {
        toastError("이미지 업로드에 실패했습니다.");
      },
    });

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showIntro || count <= 0) return;
    const timer = setTimeout(() => setCount((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [showIntro, count]);

  if (showIntro) return <AnalysisPhotoIntro />;

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (faceImage) {
      URL.revokeObjectURL(faceImage.previewUrl);
    }

    setFaceImage({
      file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleSubmit = () => {
    if (!faceImage) {
      toastInfo("업로드된 이미지가 없습니다. 이미지를 업로드해 주세요.");
      return;
    }

    const analysisId = crypto.randomUUID();

    let ownerId: string;

    if (activeRole === "member") {
      ownerId = customerId ?? session!.user.id;
    } else if (activeRole === "customer") {
      ownerId = session!.user.id;
    } else {
      redirectToHome();
      return;
    }

    uploadImage(
      {
        file: faceImage.file,
        filePath: `${ownerId}/analysis/${analysisId}/original.png`, // 파일의 실제 Content-Type은 업로드 시 넘기는 File 객체의 type 속성으로 결정됨
      },
      {
        onSuccess: (imageUrl) => {
          URL.revokeObjectURL(faceImage.previewUrl);

          const params = new URLSearchParams({ imageUrl });
          if (customerId) params.set("customerId", customerId);

          navigate(`/analysis/${analysisId}/process?${params.toString()}`, {
            replace: true,
          });
        },
      },
    );
  };

  return (
    <Layout className="from-background min-h-[100vh] bg-linear-to-b to-[#ffe9e9]">
      <HeaderNav className="mb-0!" />

      <div className="flex flex-1 flex-col items-center">
        <div className="mb-4 h-7 text-xl font-semibold">
          {count > 0 && <span>3초 뒤 촬영이 시작돼요</span>}
          {/* <span>가이드 영역에 얼굴을 맞춰주세요</span> */}
          {/* <span>더 가까이 촬영해 주세요</span> */}
        </div>

        <div
          className="relative mb-10 aspect-[1/1.15] h-[55vh] max-h-[70vh] max-w-[90vw]"
          onClick={() => count === 0 && fileInputRef.current?.click()}
        >
          <div className="flex h-full w-full justify-center">
            <img
              src={faceImage?.previewUrl || defaultImage}
              alt="촬영된 얼굴 이미지"
              className={cn(
                "rounded-[50%] object-cover",
                faceImage && "outline-primary outline-4",
              )}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleSelectImage}
              className="hidden"
            />
          </div>

          {count > 0 && (
            <span className="absolute top-1/2 left-1/2 -translate-1/2">
              <span className="text-[13vh] font-semibold text-white">
                {count}
              </span>
            </span>
          )}
        </div>
        <div className="text-lg font-medium">
          얼굴의 방향이 <span className="text-destructive">정면</span>을 향하게
          찍어주세요
        </div>

        {/* 프로젝트 예외: 실제 앱에서는 가이드에 맞는 사진을 촬영했을 때 자동으로 결과 페이지로 이동함 */}
        <Button
          disabled={isUploadImagePending}
          onClick={handleSubmit}
          variant={"ghost"}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 cursor-pointer"
        >
          분석 시작
        </Button>
      </div>
    </Layout>
  );
}
