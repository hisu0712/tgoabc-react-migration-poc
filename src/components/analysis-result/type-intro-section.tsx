import { Card } from "@/components/card";
import { Layout } from "@/components/layout/global-layout";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import type { AnalysisPreset } from "../constants";
import { PERSONAL_TYPE_LABEL, type PersonalType } from "@/lib/analysis";

export default function TypeIntroSection({
  personalType,
  analysisPreset,
}: {
  personalType: PersonalType;
  analysisPreset: AnalysisPreset;
}) {
  const {
    palette,
    image,
    tags,
    engTitle,
    cardClassName,
    desc,
    descriptionClassName,
  } = analysisPreset;

  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${palette.bc1}, ${palette.bc2})`,
      }}
    >
      <Layout className="relative pb-8 md:px-10">
        <div className="relative flex flex-col gap-1 pt-5 pb-17 text-white">
          <img
            className="md: absolute -right-1 bottom-0 block h-[calc(100%+20px)] md:hidden"
            src={image}
            alt={`${PERSONAL_TYPE_LABEL[personalType]} 타입 이미지`}
          />
          <span className="font-medium">{engTitle}</span>
          <h2 className="text-3xl font-bold">
            {PERSONAL_TYPE_LABEL[personalType]}
          </h2>
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
          src={image}
          alt={`${PERSONAL_TYPE_LABEL[personalType]} 타입 이미지`}
        />

        <Card
          className={cn(
            "relative z-[2] bg-white/20 p-5 md:w-max",
            cardClassName,
          )}
        >
          <ul className="mb-2 flex gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                style={{ backgroundColor: palette.tag }}
                className="rounded-3xl px-3 py-2 text-sm leading-none font-medium text-white"
              >
                #{tag}
              </li>
            ))}
          </ul>
          <div
            className={cn(
              "leading-snug font-medium text-[#565656]",
              descriptionClassName,
            )}
          >
            {desc.split("\n").map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </Card>
      </Layout>
    </div>
  );
}
