export type Undertone = "cool" | "warm" | "neutral";

export type Analysis = {
  personalType: PersonalType;
  axis: {
    chroma: { value: number; min: number; max: number };
    hue: { value: number; min: number; max: number };
    lightness: { value: number; min: number; max: number };
  };
  cheek: { avgRgb: string };
  hair: { avgRgb: string };
  pupil: { avgRgb: string };
  skin: { skinCode: string[]; skinTone: Undertone };
};

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
