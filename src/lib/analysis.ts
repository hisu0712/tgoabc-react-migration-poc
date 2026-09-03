export type PersonalType =
  | "springBright"
  | "springLight"
  | "summerLight"
  | "summerMute"
  | "autumnMute"
  | "autumnDark"
  | "winterBright"
  | "winterDark";

export type PersonalTypeLabel =
  | "봄 브라이트"
  | "봄 라이트"
  | "여름 라이트"
  | "여름 뮤트"
  | "가을 뮤트"
  | "가을 다크"
  | "겨울 브라이트"
  | "겨울 다크";

export const PERSONAL_TYPE_LABEL = {
  springBright: "봄 브라이트",
  springLight: "봄 라이트",
  summerLight: "여름 라이트",
  summerMute: "여름 뮤트",
  autumnMute: "가을 뮤트",
  autumnDark: "가을 다크",
  winterBright: "겨울 브라이트",
  winterDark: "겨울 다크",
} as const satisfies Record<PersonalType, PersonalTypeLabel>;

// analysis-list-page
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
