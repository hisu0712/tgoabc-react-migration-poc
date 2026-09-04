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

export async function fetchRecentAnalyses(memberId: string, limit = 7) {
  const { data, error } = await supabase
    .from("analysis")
    .select("id, created_at, customer_id, customer!inner(name)") // inner join이라 customer_id가 null인 행은 조인 상대가 없어서 제외됨
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .limit(limit * 5);

  if (error) throw error;

  const seen = new Set<string>();
  const result: {
    id: string;
    created_at: string;
    customer_id: string;
    customer_name: string;
  }[] = [];

  for (const row of data ?? []) {
    if (!row.customer_id || seen.has(row.customer_id)) continue;
    seen.add(row.customer_id);
    result.push({
      id: row.id,
      created_at: row.created_at,
      customer_id: row.customer_id!,
      customer_name: row.customer.name,
    });
    if (result.length >= limit) break;
  }

  return result;
}

export async function fetchAnalysisCount({
  memberId,
  customerId,
  personalType,
}: {
  memberId?: string;
  customerId?: string;
  personalType?: string;
}) {
  let query = supabase.from("analysis").select("*", {
    count: "exact",
    head: true,
  });

  if (memberId) {
    query = query.eq("member_id", memberId);
  }
  if (customerId) {
    query = query.eq("customer_id", customerId);
  }
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
