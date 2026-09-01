import HeaderNav from "@/components/header-nav";
import { Navigate, useLocation, useParams } from "react-router";
import { Layout } from "@/components/layout/global-layout";
import { DropletIcon, EyeIcon, Share2Icon, WavesIcon } from "lucide-react";
import BottomNav from "@/components/layout/bottom-nav";
import { MEMBER_NAV_ITEMS } from "@/lib/constants";
import { ANALYSIS_PRESET, type Analysis } from "./constants";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { GuideLabel } from "./components/guide-label";
import TypeIntroSection from "./components/type-intro-section";
import SkinToneSection from "./components/skin-tone-section";
import FoundationSection from "./components/foundation-section";

type LocationState = {
  analysis: Analysis;
  resultImageUrl: string;
};

export default function AnalysisResultPage() {
  const { analysisId } = useParams();
  const location = useLocation();
  // {이쪽에 분석 기록 페이지에서 접근시 처리}
  const { analysis, resultImageUrl } = (location.state ??
    {}) as Partial<LocationState>;

  const { ref, inView } = useInView({
    initialInView: true,
    rootMargin: "-100px 0px 0px 0px",
  });

  if (!analysisId || !analysis || !resultImageUrl) return <Navigate to={"/"} />;

  // 퍼스널컬러 타입에 맞는 결과 가져오기
  const analysisPreset =
    ANALYSIS_PRESET[analysis.personalType as keyof typeof ANALYSIS_PRESET];

  if (!analysisPreset) return <Navigate to={"/"} />;

  // 결과: 신체색
  const bodyColors = [
    {
      icon: DropletIcon,
      name: "피부색",
      hex: analysis.cheek.avgRgb,
    },
    {
      icon: EyeIcon,
      name: "눈동자색",
      hex: analysis.pupil.avgRgb,
    },
    {
      icon: WavesIcon,
      name: "모발색",
      hex: analysis.hair.avgRgb,
    },
  ];

  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${analysisPreset.palette.bc1}, ${analysisPreset.palette.bc2})`,
      }}
    >
      <HeaderNav
        className={cn(
          "layout transition-colors duration-300",
          inView
            ? "bg-transparent text-white backdrop-blur-none"
            : "text-black",
        )}
        rightSlot={<Share2Icon className="size-6" strokeWidth={1.8} />}
      />
      <TypeIntroSection analysisPreset={analysisPreset} />

      <div ref={ref} aria-hidden className="h-px"></div>

      <Layout className="bg-[#FFFAF6] pt-12 pb-30">
        <p className="mb-4 text-xl font-bold">나의 신체색 분석 결과</p>

        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <div className="relative w-full overflow-hidden rounded-xl outline-3 outline-white">
            <div className="aspect-[5/6] w-full">
              <img
                src={resultImageUrl}
                alt="분석 결과 이미지"
                className="h-full w-full object-cover"
              ></img>
            </div>

            <div className="absolute right-0 bottom-0 left-0 flex justify-between bg-white/80 px-4 py-3">
              <span className="text-sm font-bold">피부톤 추출 영역</span>
              <span className="text-muted-foreground text-sm">
                왼쪽 볼, 오른쪽 볼 영역
              </span>
            </div>
          </div>

          <div className="flex md:w-[60%] md:justify-center">
            <ul className="flex w-full gap-2 md:w-[75%] md:flex-col md:justify-evenly">
              {bodyColors.map(({ name, icon: Icon, hex }) => (
                <li
                  key={name}
                  className="flex flex-1 flex-col overflow-hidden rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)] md:flex-none"
                >
                  <span className="flex items-center justify-center gap-1 bg-white py-2">
                    <Icon strokeWidth={1.5} className="size-5" />
                    <span className="text-sm font-medium">{name}</span>
                  </span>
                  <div
                    style={{ backgroundColor: hex }}
                    className="py-4 md:py-6"
                  >
                    <div className="text-center font-medium text-white">
                      {hex}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-7">
          <GuideLabel className="w-full rounded-md py-2">
            <p className="md:inline">
              신체색은 타고난 피부색, 모발색, 눈동자색을 말하며,{" "}
            </p>
            <p className="md:inline">퍼스널 컬러 진단의 기준이 됩니다.</p>
          </GuideLabel>
        </div>

        <SkinToneSection analysis={analysis} analysisPreset={analysisPreset} />

        <FoundationSection skin={analysis.skin} />
      </Layout>

      <BottomNav navItems={MEMBER_NAV_ITEMS} />
    </div>
  );
}
