import { Card } from "@/components/card";
import { GuideLabel } from "./guide-label";
import { PERSONAL_TYPE_LABEL, type Analysis } from "@/lib/analysis";
import {
  getChromaAdjective,
  getHueAdjective,
  getLightnessAdjective,
  type AnalysisPreset,
} from "@/components/analysis-result/constants";

export default function SkinToneSection({
  analysis,
  analysisPreset,
}: {
  analysis: Analysis;
  analysisPreset: AnalysisPreset;
}) {
  const axisBars = [
    {
      name: "hue",
      typeTitle: PERSONAL_TYPE_LABEL[analysis.personalType],
      startLabel: "웜",
      endLabel: "쿨",
      value: analysis.axis.hue.value,
      min: analysis.axis.hue.min,
      max: analysis.axis.hue.max,
      avg: analysisPreset.axisAvg.hue,
      background: "linear-gradient(90deg, #FFBA7D 0%, #A4D9FF 100%)",
    },
    {
      name: "lightness",
      typeTitle: PERSONAL_TYPE_LABEL[analysis.personalType],
      startLabel: "다크",
      endLabel: "라이트",
      value: analysis.axis.lightness.value,
      min: analysis.axis.lightness.min,
      max: analysis.axis.lightness.max,
      avg: analysisPreset.axisAvg.lightness,
      background: "linear-gradient(90deg, #333 0%, #CCCCCC 53%, #fff 100%)",
    },
    {
      name: "chroma",
      typeTitle: PERSONAL_TYPE_LABEL[analysis.personalType],
      startLabel: "탁함",
      endLabel: "맑음",
      value: analysis.axis.chroma.value,
      min: analysis.axis.chroma.min,
      max: analysis.axis.chroma.max,
      avg: analysisPreset.axisAvg.chroma,
      background:
        "linear-gradient(90deg, #767676 12%, #D1D1DF 56%, #DFDFFF 90%)",
    },
  ];

  return (
    <Card className="mb-3">
      <GuideLabel className="mb-2 rounded-2xl py-1 font-semibold">
        스킨톤 상세
      </GuideLabel>
      <p className="mb-11 leading-snug font-medium break-keep text-[#565656]">
        {PERSONAL_TYPE_LABEL[analysis.personalType]}에서 나타나는{" "}
        {getHueAdjective(analysis.axis.hue.value)} 기운이 느껴지며,{" "}
        {getLightnessAdjective(analysis.axis.lightness.value)} 밝기와{" "}
        {getChromaAdjective(analysis.axis.chroma.value)} 색감이 확인돼요.
      </p>

      <div className="flex flex-col gap-4">
        {axisBars.map(
          ({
            typeTitle,
            name,
            background,
            avg,
            max,
            min,
            value,
            startLabel,
            endLabel,
          }) => (
            <div key={name}>
              <div
                className="relative mb-2 h-4.5 rounded-2xl"
                style={{ background }}
              >
                <div
                  style={{
                    left: `${Math.round(((avg - min) / (max - min)) * 100)}%`,
                  }}
                  className="absolute bottom-[calc(100%+8px)] -translate-x-1/2 rounded-sm bg-white px-1.5 py-0.5 leading-none whitespace-nowrap text-[#DC8E5E] shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                >
                  <span></span>
                  <span className="text-xs font-medium">{typeTitle} 평균</span>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-x-[7px] border-t-[6px] border-x-transparent border-t-white"></span>
                </div>
                <span
                  style={{
                    left: `clamp(3%, ${Math.round(((value - min) / (max - min)) * 100)}%, 97%)`,
                  }}
                  className={`absolute top-1/2 aspect-square size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#DC8E5E] bg-white`}
                ></span>
              </div>

              <div className="text-muted-foreground flex justify-between font-medium">
                <span>{startLabel}</span>
                <span>{endLabel}</span>
              </div>
            </div>
          ),
        )}
      </div>
    </Card>
  );
}
