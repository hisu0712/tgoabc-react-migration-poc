import loadingImage from "@/assets/loading_jaemi.gif";
import { Layout } from "@/components/layout/global-layout";

export default function AnalysisResultLoading() {
  return (
    <Layout className="from-background min-h-[100vh] bg-linear-to-b to-[#ffe9e9] px-7">
      <div className="flex flex-1 flex-col gap-[10vh] pt-[10vh]">
        <div>
          <div
            className="mb-3 flex flex-col text-2xl font-bold"
            data-username="티고뷰티샵"
          >
            <span>AI가 퍼스널 컬러를</span>
            <span>분석하고 있어요</span>
          </div>
          <div className="text-muted-foreground flex flex-col leading-tight font-medium">
            <span>잠시만 기다려주세요...</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative aspect-square h-[35vh] max-w-[70vw] justify-center md:h-[40vh]">
            <img
              src={loadingImage}
              alt="촬영하는 캐릭터 이미지"
              className="absolute left-1/2 block h-full w-full -translate-x-1/2 object-contain"
            />
            <svg
              viewBox="0 0 120 120"
              className="absolute -inset-2 animate-spin [animation-duration:1.5s]"
            >
              <defs>
                <linearGradient
                  id="ringGradient"
                  gradientUnits="userSpaceOnUse"
                  x1="20"
                  y1="8"
                  x2="112"
                  y2="60"
                >
                  <stop offset="0%" stopColor="#FF6B6B" />
                  <stop offset="50%" stopColor="#FF9E9E" />
                  <stop offset="80%" stopColor="#FFC2C2" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ffe8e8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#ffe3e3"
                strokeWidth="7"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="text-muted-foreground flex flex-col text-center text-sm leading-tight font-medium">
          <span>개인정보 보호를 위해</span>
          <span>촬영 사진은 매장에 저장되지 않아요</span>
        </div>
      </div>
    </Layout>
  );
}
