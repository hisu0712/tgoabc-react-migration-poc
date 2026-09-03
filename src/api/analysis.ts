import type { PersonalType } from "@/lib/analysis";
import { supabase } from "@/lib/supabase";
import type { Analysis } from "@/pages/analysis-result-page/constants";
import type { AnalysisEntity } from "@/type";

export async function fetchAnalysis(analysisId: string) {
  const { data, error } = await supabase
    .from("analysis")
    .select("*")
    .eq("id", analysisId)
    .single();

  if (error) throw error;
  return data as unknown as AnalysisEntity;
}

export async function fetchAnalysesByCustomer({
  from,
  to,
  customerId,
  personalType,
}: {
  from: number;
  to: number;
  customerId: string;
  personalType?: string;
}) {
  let query = supabase
    .from("analysis")
    .select("id, created_at, personalType:result->>personalType")
    .eq("customer_id", customerId);

  if (personalType) {
    query = query.eq("result->>personalType", personalType);
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data as {
    id: string;
    created_at: string;
    personalType: PersonalType;
  }[];
}

export async function fetchAnalysesCountByCustomer({
  customerId,
  personalType,
}: {
  customerId: string;
  personalType?: string;
}) {
  let query = supabase
    .from("analysis")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("customer_id", customerId);

  if (personalType) {
    query = query.eq("result->>personalType", personalType);
  }

  const { count, error } = await query;

  if (error) throw error;
  return count;
}

export async function createAnalysis({
  id,
  customerId,
  memberId,
  originalImageUrl,
  resultImageUrl,
  result,
}: {
  id: string;
  customerId: string | null;
  memberId: string | null;
  originalImageUrl: string;
  resultImageUrl: string;
  result: Analysis;
}) {
  const { data, error } = await supabase
    .from("analysis")
    .insert({
      id,
      customer_id: customerId,
      member_id: memberId,
      original_image_url: originalImageUrl,
      result_image_url: resultImageUrl,
      result,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
