import type { Analysis } from "@/lib/analysis";

export const SAMPLE_ANALYSIS: Analysis = {
  cheek: { avgRgb: "#d2b0a7" },
  pupil: { avgRgb: "#2d292a" },
  hair: { avgRgb: "#141413" },
  personalType: "summerLight",
  axis: {
    hue: { value: 40.19, min: 22.5, max: 71.2 },
    lightness: { value: 74.54, min: 54.6, max: 90 },
    chroma: { value: 14.26, min: 14.2, max: 37.1 },
  },
  skin: {
    skinCode: ["17", "19", "21"],
    skinTone: "cool",
  },
};

export const SAMPLE_RESULT_IMAGE_URL = "/sample-analysis-result.png";
