import type { PersonalType } from "@/lib/analysis";

export type Season = "spring" | "summer" | "autumn" | "winter";

export const PERSONAL_TYPE_SEASON = {
  springBright: "spring",
  springLight: "spring",
  summerLight: "summer",
  summerMute: "summer",
  autumnMute: "autumn",
  autumnDark: "autumn",
  winterBright: "winter",
  winterDark: "winter",
} as const satisfies Record<PersonalType, Season>;

export const SEASON_BADGE_COLOR = {
  spring: { bg: "#FFE3E6", text: "#DB4455" },
  summer: { bg: "#DFDFFF", text: "#5653DF" },
  autumn: { bg: "#FFEBDD", text: "#AC7F5E" },
  winter: { bg: "#F1E6FF", text: "#7229CB" },
} as const satisfies Record<Season, { bg: string; text: string }>;
