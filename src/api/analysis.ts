import { supabase } from "@/lib/supabase";
import type { Analysis } from "@/pages/analysis-result-page/constants";

export async function fetchAnalysis(analysisId: string) {
  const { data, error } = await supabase
    .from("analysis")
    .select("*")
    .eq("id", analysisId)
    .single();

  if (error) throw error;
  return data;
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
