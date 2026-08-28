import HeaderNav from "@/components/header-nav";
import AnalysisResultLoading from "./analysis-result-loading";
import { Navigate, useParams, useSearchParams } from "react-router";
import { Card } from "@/components/card";
import { Layout } from "@/components/layout/global-layout";
import {
  ArrowRightIcon,
  DropletIcon,
  EyeIcon,
  Share2Icon,
  ThumbsUpIcon,
  WavesIcon,
} from "lucide-react";
import BottomNav from "@/components/layout/bottom-nav";
import { MEMBER_NAV_ITEMS } from "@/lib/constants";
import { AxisBar, GuideLabel } from "./components";
import {
  getChromaAdjective,
  getHueAdjective,
  getLightnessAdjective,
  PERSONAL_TYPE_INFO,
  SKIN_CODE_MAP,
  UNDERTONE,
} from "./constants";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import analysisScriptUrl from "./personal-analysis.iife.js?url";
import analysisStyleUrl from "./personal-analysis.css?url";
import { useEffect, useRef, useState } from "react";
import type { AnalysisResult } from "@/type";

const ANALYSIS_ELEMENT_NAME = "skin-analysis";
const ANALYSIS_EVENT = "personal-analysis-complete";

export default function AnalysisResultPage() {
  const { analysisId } = useParams();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  const imageUrl = searchParams.get("imageUrl");

  const [isModuleLoaded, setIsModuleLoaded] = useState(
    !!customElements.get(ANALYSIS_ELEMENT_NAME),
  );
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const analysisRef = useRef<HTMLElement>(null);
  const { ref, inView } = useInView({
    initialInView: true,
    rootMargin: "-100px 0px 0px 0px",
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

    const handleComplete = (event: Event) => {
      const detail = (event as CustomEvent<AnalysisResult>).detail;
      setResult(detail);
      setIsAnalysisComplete(true);
    };

    el.addEventListener(ANALYSIS_EVENT, handleComplete);
    return () => {
      el.removeEventListener(ANALYSIS_EVENT, handleComplete);
    };
  }, [isModuleLoaded]);

  if (!analysisId || !customerId || !imageUrl) return <Navigate to={"/"} />;

  // 퍼스널컬러 타입에 맞는 결과 가져오기
  const typeInfo = PERSONAL_TYPE_INFO[result?.personalType ?? "summerLight"];

  // 결과: 신체색
  const resultBodyColorList = [
    {
      icon: DropletIcon,
      name: "피부색",
      hex: result?.cheek.avgRgb ?? "#000000",
    },
    { icon: EyeIcon, name: "눈동자색", hex: result?.pupil.avgRgb ?? "#000000" },
    { icon: WavesIcon, name: "모발색", hex: result?.hair.avgRgb ?? "#000000" },
  ];

  // 결과: 컬러축
  const resultAxisList = [
    {
      name: "hue",
      axis_1: "웜",
      axis_2: "쿨",
      value: result?.axis.hue.value ?? 0,
      min: result?.axis.hue.min ?? 0,
      max: result?.axis.hue.max ?? 1,
      avg: typeInfo.axisAvg.hue,
      background: "linear-gradient(90deg, #FFBA7D 0%, #A4D9FF 100%)",
    },
    {
      name: "lightness",
      axis_1: "다크",
      axis_2: "라이트",
      value: result?.axis.lightness.value ?? 0,
      min: result?.axis.lightness.min ?? 0,
      max: result?.axis.lightness.max ?? 1,
      avg: typeInfo.axisAvg.lightness,
      background: "linear-gradient(90deg, #333 0%, #CCCCCC 53%, #fff 100%)",
    },
    {
      name: "chroma",
      axis_1: "탁함",
      axis_2: "맑음",
      value: result?.axis.chroma.value ?? 0,
      min: result?.axis.chroma.min ?? 0,
      max: result?.axis.chroma.max ?? 1,
      avg: typeInfo.axisAvg.chroma,
      background:
        "linear-gradient(90deg, #767676 12%, #D1D1DF 56%, #DFDFFF 90%)",
    },
  ];
  const axisDescription = `${typeInfo.title}에서 나타나는 ${getHueAdjective(result?.axis.hue.value ?? 0)} 기운이 느껴지며, ${getLightnessAdjective(
    result?.axis.lightness.value ?? 0,
  )} 밝기와 ${getChromaAdjective(result?.axis.chroma.value ?? 0)} 색감이 확인돼요.`;

  // 결과: 파운데이션
  const skinCodeList = result?.skin.skinCode ?? ["19", "21", "22"];
  const skinPositionLabels = ["화사하게", "자연스럽게", "차분하게"];
  const resultSkinList = skinCodeList.map((code, index) => ({
    code,
    color: SKIN_CODE_MAP[code]?.hex ?? "#000000",
    label: skinPositionLabels[index],
  }));

  const bestSkinCodeIndex =
    skinCodeList.length === 3 ? 1 : skinCodeList.length - 1;
  const bestSkinCode = skinCodeList[bestSkinCodeIndex];
  const bestSkin = SKIN_CODE_MAP[bestSkinCode];

  // 결과: 톤
  const tone = UNDERTONE[result?.skin.skinTone ?? "neutral"];

  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${typeInfo.palette.bc1}, ${typeInfo.palette.bc2})`,
      }}
    >
      {!isAnalysisComplete && (
        <div className="fixed inset-0 z-50">
          <AnalysisResultLoading />
        </div>
      )}

      <HeaderNav
        className={cn(
          "layout transition-colors duration-300",
          inView
            ? "bg-transparent text-white backdrop-blur-none"
            : "text-black",
        )}
        rightSlot={<Share2Icon className="size-6" strokeWidth={1.8} />}
      />
      <div
        style={{
          background: `linear-gradient(to bottom, ${typeInfo.palette.bc1}, ${typeInfo.palette.bc2})`,
        }}
      >
        <Layout className="relative pb-8 md:px-10">
          <div className="relative flex flex-col gap-1 pt-5 pb-17 text-white">
            <img
              className="md: absolute -right-1 bottom-0 block h-[calc(100%+20px)] md:hidden"
              src={typeInfo.image}
              alt={`${typeInfo.title} 타입 이미지`}
            />
            <span className="font-medium">{typeInfo.engTitle}</span>
            <h2 className="text-3xl font-bold">{typeInfo.title}</h2>
            <button
              type="button"
              className="flex w-max items-center gap-0.5 text-sm opacity-70"
            >
              더 많은 타입 보기
              <ArrowRightIcon className="size-4" strokeWidth={1.6} />
            </button>
          </div>

          <img
            className="absolute -right-1 bottom-0 hidden h-full md:block"
            src={typeInfo.image}
            alt={`${typeInfo.title} 타입 이미지`}
          />

          <Card
            className={cn(
              "relative z-[2] bg-white/20 p-5 md:w-max",
              typeInfo.cardClassName,
            )}
          >
            <ul className="mb-2 flex gap-2">
              {typeInfo.tags.map((tag) => (
                <li
                  key={tag}
                  style={{ backgroundColor: typeInfo.palette.tag }}
                  className="rounded-3xl px-3 py-2 text-sm leading-none font-medium text-white"
                >
                  #{tag}
                </li>
              ))}
            </ul>
            <div
              className={cn(
                "leading-snug font-medium text-[#565656]",
                typeInfo.descriptionClassName,
              )}
            >
              {typeInfo.desc.split("\n").map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </Card>
        </Layout>
      </div>

      <div ref={ref} aria-hidden className="h-px"></div>

      <Layout className="bg-[#FFFAF6] pt-12 pb-30">
        <p className="mb-4 text-xl font-bold">나의 신체색 분석 결과</p>

        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <div className="relative w-full overflow-hidden rounded-xl outline-3 outline-white">
            <div className="aspect-[5/6] w-full">
              {isModuleLoaded && (
                <skin-analysis
                  ref={analysisRef}
                  image-src={imageUrl}
                ></skin-analysis>
              )}
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
              {resultBodyColorList.map(({ name, icon: Icon, hex }) => (
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

        <Card className="mb-3">
          <GuideLabel className="mb-2 rounded-2xl py-1 font-semibold">
            스킨톤 상세
          </GuideLabel>
          <p className="mb-11 leading-snug font-medium break-keep text-[#565656]">
            {axisDescription}
          </p>

          <div className="flex flex-col gap-4">
            {resultAxisList.map((axis) => (
              <AxisBar key={axis.name} {...axis} />
            ))}
          </div>
        </Card>

        <Card>
          <GuideLabel className="mb-2 rounded-2xl py-1 font-semibold">
            추천 파운데이션 색상
          </GuideLabel>
          <div className="mb-2 text-xl font-semibold">
            {bestSkinCode}호 {tone.name} {bestSkin.groupLabel}
          </div>
          <p className="leading-snug font-medium break-keep text-[#565656]">
            내 톤에는 {bestSkinCode}호 {bestSkin.groupLabel}가 가장 잘 어울려요.
            밝기는 {skinCodeList[0]}~{skinCodeList[skinCodeList.length - 1]}
            호까지 추천하며, {tone.name} 톤이 가장 자연스러워요.
          </p>

          <div className="mt-5 grid grid-cols-[minmax(150px,1fr)_1px_minmax(40px,0.6fr)] gap-4">
            <ul className="grid grid-cols-3 gap-2">
              {resultSkinList.map((skin, index) => (
                <li key={skin.code}>
                  <div
                    className="relative mb-2 aspect-square rounded-xl bg-[url('/foundation-mockup.webp')] bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundColor: skin.color,
                    }}
                  >
                    {index === bestSkinCodeIndex && (
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
                style={{
                  backgroundColor: tone.hex,
                }}
              >
                <span className="text-lg font-medium">{tone.letter}</span>
              </div>

              <div className="text-center font-medium">{tone.label}</div>
              <div className="text-foreground/80 text-center text-xs">
                {tone.desc}
              </div>
            </div>
          </div>
        </Card>
      </Layout>

      <BottomNav navItems={MEMBER_NAV_ITEMS} />
    </div>
  );
}
