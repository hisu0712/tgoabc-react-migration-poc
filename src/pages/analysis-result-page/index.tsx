import HeaderNav from "@/components/header-nav";
import AnalysisResultLoading from "./analysis-result-loading";
import { Navigate, useParams, useSearchParams } from "react-router";
import { Card } from "@/components/card";
import { Layout } from "@/components/layout/global-layout";
import {
  ArrowRightIcon,
  CircleQuestionMarkIcon,
  DropletIcon,
  EyeIcon,
  Share2Icon,
  ThumbsUpIcon,
  WavesIcon,
} from "lucide-react";
import typeImage_SummerLight from "@/assets/personal-summerLight.png";
import BottomNav from "@/components/layout/bottom-nav";
import { MEMBER_NAV_ITEMS } from "@/lib/constants";
import { AxisBar, GuideLabel } from "./components";
import { UNDERTONE } from "./constants";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import personalAnalysisScriptUrl from "./personal-analysis.iife.js?url";
import { useState } from "react";

const PERSONAL_ANALYSIS_ELEMENT_NAME = "skin-analysis";

export default function AnalysisResultPage() {
  const { ref, inView } = useInView({
    initialInView: true,
    rootMargin: "-100px 0px 0px 0px",
  });
  // if (true) return <AnalysisResultLoading />;

  const [isModuleLoaded, setIsModuleLoaded] = useState(
    !!customElements.get(PERSONAL_ANALYSIS_ELEMENT_NAME),
  );

  const { analysisId } = useParams();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  const imageUrl = searchParams.get("imageUrl");

  if (!analysisId || !customerId || !imageUrl) return <Navigate to={"/"} />;

  const tagList = ["시원한", "깨끗한", "은은한"];
  const toneList = [
    { icon: DropletIcon, name: "피부색", hex: "D2b0A7" },
    { icon: EyeIcon, name: "눈동자색", hex: "2F2A2B" },
    { icon: WavesIcon, name: "모발색", hex: "141514" },
  ];
  const axisList = [
    {
      name: "hue",
      axis_1: "웜",
      axis_2: "쿨",
      value: 14.26,
      min: 14.2,
      max: 37.1,
      avg: 16.2,
      background: "linear-gradient(90deg, #FFBA7D 0%, #A4D9FF 100%)",
    },
    {
      name: "lightness",
      axis_1: "라이트",
      axis_2: "다크",
      value: 14.23,
      min: 14.2,
      max: 37.1,
      avg: 16.2,
      background: "linear-gradient(90deg, #fff 0%, #CCCCCC 53%, #333 100%)",
    },
    {
      name: "chroma",
      axis_1: "탁함",
      axis_2: "맑음",
      value: 14.23,
      min: 14.2,
      max: 37.1,
      avg: 16.2,
      background:
        "linear-gradient(90deg, #767676 12%, #D1D1DF 56%, #DFDFFF 90%)",
    },
  ];
  const skinList = [
    { code: "19", color: "b77957", label: "화사하게" },
    { code: "21", color: "b77957", label: "자연스럽게" },
    { code: "22", color: "b77957", label: "차분하게" },
  ];

  return (
    <div className="bg-amber-500">
      <HeaderNav
        className={cn(
          "layout transition-colors duration-300",
          inView
            ? "bg-transparent text-white backdrop-blur-none"
            : "text-black",
        )}
        rightSlot={<Share2Icon className="size-6" strokeWidth={1.8} />}
      />

      <Layout className="relative pb-8 md:px-10">
        <div className="relative flex flex-col gap-1 pt-5 pb-17 text-white">
          <img
            className="md: absolute -right-1 bottom-0 block h-[calc(100%+20px)] md:hidden"
            src={typeImage_SummerLight}
            alt="여름 라이트 타입 이미지"
          />
          <span className="font-medium">SUMMER LIGHT</span>
          <h2 className="text-3xl font-bold">여름 라이트</h2>
          <button
            type="button"
            className="flex w-max items-center gap-0.5 text-sm opacity-70"
          >
            더 많은 타입 보기
            <ArrowRightIcon className="size-4" strokeWidth={1.6} />
          </button>
        </div>

        <img
          className="md: absolute -right-1 bottom-0 hidden h-full md:block"
          src={typeImage_SummerLight}
          alt="여름 라이트 타입 이미지"
        />

        <Card className="relative z-[2] bg-white/20 p-5 md:w-max">
          <ul className="mb-2 flex gap-2">
            {tagList.map((tag) => (
              <li
                key={tag}
                className="rounded-3xl bg-[#AFBFE3] px-3 py-2 text-sm leading-none font-medium text-white"
              >
                #{tag}
              </li>
            ))}
          </ul>
          <div className="leading-snug font-medium text-[#565656]">
            <p>맑고 깨끗한 인상이 은은하게 느껴지며,</p>
            <p>시원하고 청량한 분위기가 돋보이는 타입이에요.</p>
          </div>
        </Card>
      </Layout>

      <div ref={ref} aria-hidden className="h-px"></div>

      <Layout className="bg-[#FFFAF6] pt-12 pb-30">
        <div className="mb-4 flex items-center gap-1">
          <p className="text-xl font-bold">나의 신체색 분석 결과</p>
          <CircleQuestionMarkIcon className="size-5" strokeWidth={1.6} />
        </div>

        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <div className="relative w-full overflow-hidden rounded-xl outline-3 outline-white">
            <div className="aspect-[5/6] w-full">
              <div className="h-full w-full bg-amber-300">임시 캔버스</div>
              {/* <skin-analysis id="skinAnalysis" image-src="./modules/face_test.png"></skin-analysis> */}
            </div>

            <div className="absolute right-0 bottom-0 left-0 flex justify-between bg-white/80 px-4 py-3">
              <label className="text-sm font-bold">피부톤 추출 영역</label>
              <span className="text-muted-foreground text-sm">
                왼쪽 볼, 오른쪽 볼 영역
              </span>
            </div>
          </div>

          <div className="flex md:w-[60%] md:justify-center">
            <ul className="flex w-full gap-2 md:w-[75%] md:flex-col md:justify-evenly">
              {toneList.map(({ name, icon: Icon, hex }) => (
                <li
                  key={name}
                  className="flex flex-1 flex-col overflow-hidden rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)] md:flex-none"
                >
                  <span className="flex items-center justify-center gap-1 bg-white py-2">
                    <Icon strokeWidth={1.5} className="size-5" />
                    <span className="text-sm font-medium">{name}</span>
                  </span>
                  <div
                    style={{ backgroundColor: `#${hex}` }}
                    className="py-4 md:py-6"
                  >
                    <div className="text-center font-medium text-white">
                      #{hex}
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

        <Card className="mb-3">
          <GuideLabel className="mb-2 rounded-2xl py-1 font-semibold">
            스킨톤 상세
          </GuideLabel>
          <p className="mb-11 leading-snug font-medium break-keep text-[#565656]">
            여름 라이트에서 나타나는 따뜻한 기운과 밝고 맑은 피부 특성이
            확인돼요.
          </p>

          <div className="flex flex-col gap-4">
            {axisList.map((axis) => (
              <AxisBar key={axis.name} {...axis} />
            ))}
          </div>
        </Card>

        <Card>
          <GuideLabel className="mb-2 rounded-2xl py-1 font-semibold">
            추천 파운데이션 색상
          </GuideLabel>
          <div className="mb-2 text-xl font-semibold">21호 뉴트럴 베이지</div>
          <p className="leading-snug font-medium break-keep text-[#565656]">
            내 톤에는 21호 뉴트럴 베이지가 가장 잘 어울려요. 밝기는 19~22호까지
            추천하며, 뉴트럴 톤이 가장 자연스러워요.
          </p>

          <div className="mt-5 grid grid-cols-[minmax(150px,1fr)_1px_minmax(40px,0.6fr)] gap-4">
            <ul className="grid grid-cols-3 gap-2">
              {skinList.map((skin, index) => (
                <li key={skin.code}>
                  <div
                    className="relative mb-2 aspect-square rounded-xl bg-[url('/foundation-mockup.webp')] bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundColor: `#${skin.color}`,
                    }}
                  >
                    {index === 1 && (
                      <span className="absolute -top-[8%] -left-[8%] flex size-6.5 items-center justify-center rounded-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)]">
                        <ThumbsUpIcon className="size-3.5 fill-[#DC8E5E] text-transparent" />
                      </span>
                    )}
                  </div>

                  <div className="text-center font-medium">{skin.code}호</div>
                  <div className="text-foreground/80 text-center text-xs">
                    {skin.label}
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-muted-foreground/50 h-full w-px"></div>
            <div className="flex flex-col items-center justify-center">
              <div
                className="mb-2 flex aspect-square w-[10vw] items-center justify-center rounded-2xl"
                style={{ backgroundColor: `#${UNDERTONE["cool"].hex}` }}
              >
                <span className="text-lg font-medium">
                  {UNDERTONE["cool"].letter}
                </span>
              </div>

              <div className="text-center font-medium">
                {UNDERTONE["cool"].label}
              </div>
              <div className="text-foreground/80 text-center text-xs">
                {UNDERTONE["cool"].desc}
              </div>
            </div>
          </div>
        </Card>
      </Layout>

      <BottomNav navItems={MEMBER_NAV_ITEMS} />
    </div>
  );
}
