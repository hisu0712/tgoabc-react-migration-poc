import type { Database } from "./database.types";
import type { Analysis } from "../lib/analysis";

// Database (Tables)
export type MemberEntity = Database["public"]["Tables"]["member"]["Row"];
export type ShopEntity = Database["public"]["Tables"]["shop"]["Row"];
export type CustomerEntity = Database["public"]["Tables"]["customer"]["Row"];
export type MemberCustomerMappingEntity =
  Database["public"]["Tables"]["member_customer_mapping"]["Row"];
export type DesignerEntity = Database["public"]["Tables"]["designer"]["Row"];
export type AnalysisEntity = Omit<
  Database["public"]["Tables"]["analysis"]["Row"],
  "result"
> & {
  result: Analysis;
};

// Database (enums)
export type Gender = Database["public"]["Enums"]["gender"];

// CustomerEntity
export type CustomerWithDesigner = CustomerEntity & {
  // 디자이너 다 가지고 올지 id만 가져올지
  designer_id: number | null;
};

export type UserType = "member" | "customer";

export type UseMutationCallback<TData = void> = {
  onSuccess?: (data?: TData) => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};

export type Theme = "system" | "dark" | "light";

export type Image = { file: File; previewUrl: string };

// dashboard
export type Granularity = "month" | "day";
export type AgeGroup = "10대" | "20대" | "30대" | "40대" | "50대 이상";
export type PeriodBucket = {
  bucket_start: string;
  new_count: number;
  cumulative_count: number;
};
