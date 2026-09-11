import { Card } from "@/components/card";
import { GuideLabel } from "./guide-label";
import { ThumbsUpIcon } from "lucide-react";
import type { Analysis } from "@/lib/analysis";
import { SKIN_CODE_MAP, UNDERTONE } from "@/components/analysis-result/constants";

export default function FoundationSection({
  skin,
}: {
  skin: Analysis["skin"];
}) {
  const skinCodes = skin.skinCode;
  const skinPositionLabels = ["화사하게", "자연스럽게", "차분하게"];
  const foundationSwatches = skinCodes.map((code, index) => ({
    code,
    color: SKIN_CODE_MAP[code].hex,
    label: skinPositionLabels[index],
  }));

  const bestSkinCodeIndex = skinCodes.length === 3 ? 1 : skinCodes.length - 1;
  const bestSkinCode = skinCodes[bestSkinCodeIndex];
  const bestSkin = SKIN_CODE_MAP[bestSkinCode];

  const undertone = UNDERTONE[skin.skinTone];

  return (
    <Card>
      <GuideLabel className="mb-2 rounded-2xl py-1 font-semibold">
        추천 파운데이션 색상
      </GuideLabel>
      <div className="mb-2 text-xl font-semibold">
        {bestSkinCode}호 {undertone.name} {bestSkin.groupLabel}
      </div>
      <p className="leading-snug font-medium break-keep text-foreground/80">
        내 톤에는 {bestSkinCode}호 {bestSkin.groupLabel}가 가장 잘 어울려요.
        밝기는 {skinCodes[0]}~{skinCodes[skinCodes.length - 1]}
        호까지 추천하며, {undertone.name} 톤이 가장 자연스러워요.
      </p>

      <div className="mt-5 grid grid-cols-[minmax(150px,1fr)_1px_minmax(40px,0.6fr)] gap-4">
        <ul className="grid grid-cols-3 gap-2">
          {foundationSwatches.map((swatch, index) => (
            <li key={swatch.code}>
              <div
                className="relative mb-2 aspect-square rounded-xl bg-[url('/foundation-mockup.webp')] bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundColor: swatch.color,
                }}
              >
                {index === bestSkinCodeIndex && (
                  <span className="absolute -top-[8%] -left-[8%] flex size-6.5 items-center justify-center rounded-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)]">
                    <ThumbsUpIcon className="size-3.5 fill-[#DC8E5E] text-transparent" />
                  </span>
                )}
              </div>

              <div className="text-center font-medium">{swatch.code}호</div>
              <div className="text-foreground/80 text-center text-xs">
                {swatch.label}
              </div>
            </li>
          ))}
        </ul>
        <div className="bg-muted-foreground/50 h-full w-px"></div>
        <div className="flex flex-col items-center justify-center">
          <div
            className="mb-2 flex aspect-square w-[10vw] items-center justify-center rounded-2xl"
            style={{
              backgroundColor: undertone.hex,
            }}
          >
            <span className="text-lg font-medium">{undertone.letter}</span>
          </div>

          <div className="text-center font-medium">{undertone.label}</div>
          <div className="text-foreground/80 text-center text-xs">
            {undertone.desc}
          </div>
        </div>
      </div>
    </Card>
  );
}
