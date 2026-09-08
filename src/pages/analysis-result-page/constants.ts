import type { PersonalType, Undertone } from "@/lib/analysis";
import typeImageSpringBright from "@/assets/personal-springBright.png";
import typeImageSpringLight from "@/assets/personal-springLight.png";
import typeImageSummerLight from "@/assets/personal-summerLight.png";
import typeImageSummerMute from "@/assets/personal-summerMute.png";
import typeImageAutumnMute from "@/assets/personal-autumnMute.png";
import typeImageAutumnDark from "@/assets/personal-autumnDark.png";
import typeImageWinterBright from "@/assets/personal-winterBright.png";
import typeImageWinterDark from "@/assets/personal-winterDark.png";

export const UNDERTONE = {
  neutral: {
    name: "뉴트럴",
    letter: "N",
    label: "NEUTRAL TONE",
    desc: "자연스럽게",
    hex: "#FFE0C7",
  },
  cool: {
    name: "쿨",
    letter: "C",
    label: "COOL TONE",
    desc: "쿨하게",
    hex: "#FFDFDF",
  },
  warm: {
    name: "웜",
    letter: "W",
    label: "WARM TONE",
    desc: "따뜻하게",
    hex: "#FFEDB1",
  },
} as const satisfies Record<Undertone, Record<string, string>>;

export type AnalysisPreset = {
  engTitle: string;
  tags: readonly string[];
  desc: string;
  image: string;
  axisAvg: { hue: number; lightness: number; chroma: number };
  palette: { bc1: string; bc2: string; tag: string };
  cardClassName?: string;
  descriptionClassName?: string;
};

export const ANALYSIS_PRESET = {
  springBright: {
    engTitle: "SPRING BRIGHT",
    tags: ["생기넘치는", "발랄한", "선명한"],
    desc: "밝고 생기 넘치는 인상이 선명하게 느껴지며,\n화사하고 발랄한 분위기가 돋보이는 타입이에요.",
    image: typeImageSpringBright,
    axisAvg: { hue: 60.3, lightness: 81.2, chroma: 28.5 },
    palette: { bc1: "#FF6A3D", bc2: "#d3bd68", tag: "#FFC27B" },
    cardClassName: "bg-white/40",
  },
  springLight: {
    engTitle: "SPRING LIGHT",
    tags: ["여리여리한", "부드러운", "따뜻한"],
    desc: "순하고 여리여리한 인상이 부드럽게 느껴지며,\n단아하고 청순한 분위기가 돋보이는 타입이에요.",
    image: typeImageSpringLight,
    axisAvg: { hue: 62.2, lightness: 84.6, chroma: 21.9 },
    palette: { bc1: "#FC8D99", bc2: "#FFDABA", tag: "#FEC5C2" },
    cardClassName: "bg-white/40",
  },
  summerLight: {
    engTitle: "SUMMER LIGHT",
    tags: ["시원한", "깨끗한", "은은한"],
    desc: "맑고 깨끗한 인상이 은은하게 느껴지며,\n시원하고 청량한 분위기가 돋보이는 타입이에요.",
    image: typeImageSummerLight,
    axisAvg: { hue: 42.6, lightness: 83.3, chroma: 19.7 },
    palette: { bc1: "#9CCBC1", bc2: "#C8C5F2", tag: "#AFBFE3" },
  },
  summerMute: {
    engTitle: "SUMMER MUTE",
    tags: ["단아한", "지적인", "우아한"],
    desc: "차분하고 단아한 인상이 부드럽게 느껴지며,\n우아하고 세련된 분위기가 돋보이는 타입이에요.",
    image: typeImageSummerMute,
    axisAvg: { hue: 40.9, lightness: 64.7, chroma: 21.2 },
    palette: { bc1: "#B9ACCA", bc2: "#E3C3DC", tag: "#B9ACCA" },
  },
  autumnMute: {
    engTitle: "AUTUMN MUTE",
    tags: ["차분한", "편안한", "분위기 있는"],
    desc: "따뜻하고 부드러운 인상이 편안하게 느껴지며,\n그윽하고 차분한 분위기가 돋보이는 타입이에요.",
    image: typeImageAutumnMute,
    axisAvg: { hue: 60.2, lightness: 63.9, chroma: 23.8 },
    palette: { bc1: "#8D7362", bc2: "#DFA872", tag: "#CA9A6E" },
    descriptionClassName: "text-white",
  },
  autumnDark: {
    engTitle: "AUTUMN DARK",
    tags: ["클래식", "성숙한", "그윽한"],
    desc: "깊고 그윽한 인상이 무게감 있게 느껴지며,\n클래식하고 고급스러운 분위기가 돋보이는 타입이에요.",
    image: typeImageAutumnDark,
    axisAvg: { hue: 60.7, lightness: 64.4, chroma: 29.7 },
    palette: { bc1: "#3C2415", bc2: "#644A39", tag: "#5A4130" },
    descriptionClassName: "text-white",
  },
  winterBright: {
    engTitle: "WINTER BRIGHT",
    tags: ["도도한", "시크한", "화려한"],
    desc: "선명하고 맑은 인상이 또렷하게 느껴지며,\n화려하고 드라마틱한 분위기가 돋보이는 타입이에요.",
    image: typeImageWinterBright,
    axisAvg: { hue: 46.8, lightness: 78.3, chroma: 26 },
    palette: { bc1: "#4C18A1", bc2: "#D33F7A", tag: "#A53288" },
    descriptionClassName: "text-white",
  },
  winterDark: {
    engTitle: "WINTER DARK",
    tags: ["도시적인", "세련된", "과감한"],
    desc: "깊고 강렬한 인상이 차갑게 느껴지며,\n시크하고 카리스마 있는 분위기가 돋보이는 타입이에요.",
    image: typeImageWinterDark,
    axisAvg: { hue: 43.4, lightness: 62.5, chroma: 26.9 },
    palette: { bc1: "#3F3A56", bc2: "#705774", tag: "#615770" },
    descriptionClassName: "text-white",
  },
} as const satisfies Record<PersonalType, AnalysisPreset>;

export const SKIN_CODE_MAP: Record<
  string,
  { hex: string; groupLabel: string }
> = {
  "13": { hex: "#F4D7BB", groupLabel: "포슬린" },
  "15": { hex: "#EFCBAA", groupLabel: "포슬린" },
  "17": { hex: "#ECC39E", groupLabel: "아이보리" },
  "19": { hex: "#E9BA92", groupLabel: "아이보리" },
  "21": { hex: "#E2B48B", groupLabel: "베이지" },
  "23": { hex: "#DEAC7E", groupLabel: "베이지" },
  "24": { hex: "#DBA271", groupLabel: "베이지" },
  "25": { hex: "#D79D71", groupLabel: "베이지" },
  "27": { hex: "#CF9568", groupLabel: "샌드 베이지" },
  "28": { hex: "#C98C5E", groupLabel: "샌드 베이지" },
  "29": { hex: "#C38256", groupLabel: "샌드 베이지" },
  "30": { hex: "#AD6E43", groupLabel: "탠 베이지" },
  "31": { hex: "#A5653C", groupLabel: "탠 베이지" },
  "33": { hex: "#9D5D35", groupLabel: "카라멜 베이지" },
  "34": { hex: "#96562F", groupLabel: "카라멜 베이지" },
  "35": { hex: "#8D4F2A", groupLabel: "카라멜 베이지" },
  "37": { hex: "#82492A", groupLabel: "체스넛" },
  "40": { hex: "#774429", groupLabel: "체스넛" },
  "43": { hex: "#6D3E26", groupLabel: "에스프레소" },
  "45": { hex: "#663621", groupLabel: "에스프레소" },
  "47": { hex: "#5B2B19", groupLabel: "에스프레소" },
};

export function getHueAdjective(value: number) {
  if (value < 50.1) return "차가운";
  if (value <= 59.9) return "자연스러운";
  return "따뜻한";
}

export function getLightnessAdjective(value: number) {
  if (value < 70.2) return "깊이감 있는";
  if (value <= 77.8) return "차분하게 정돈된";
  return "화사한";
}

export function getChromaAdjective(value: number) {
  if (value < 23.1) return "은은한";
  if (value <= 27.8) return "부드러운";
  return "선명한";
}
