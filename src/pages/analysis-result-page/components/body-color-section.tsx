import type { Analysis } from "../constants";
import { DropletIcon, EyeIcon, WavesIcon } from "lucide-react";

export default function BodyColorSection({
  analysis,
  resultImageUrl,
}: {
  analysis: Analysis;
  resultImageUrl: string;
}) {
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
    <div className="mb-4 flex flex-col gap-4 md:flex-row">
      <div className="relative w-full overflow-hidden rounded-xl outline-3 outline-white">
        <div className="aspect-[5/6] w-full">
          <img
            src={resultImageUrl}
            alt="분석 결과 이미지"
            className="h-full w-full object-cover"
          />
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
              <div style={{ backgroundColor: hex }} className="py-4 md:py-6">
                <div className="text-center font-medium text-white">{hex}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
