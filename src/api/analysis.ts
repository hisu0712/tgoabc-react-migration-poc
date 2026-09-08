import type { Analysis, PersonalType } from "@/lib/analysis";
import { supabase } from "@/lib/supabase";
import type { AnalysisEntity } from "@/types";
import { moveImage } from "./image";

export async function fetchAnalysis(analysisId: string) {
  const { data, error } = await supabase
    .from("analysis")
    .select("*")
    .eq("id", analysisId)
    .maybeSingle();

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

export async function linkAnalysisToCustomer({
  analysisId,
  memberId,
  customerId,
}: {
  analysisId: string;
  memberId: string;
  customerId: string;
}) {
  const fromBase = `${memberId}/analysis/${analysisId}`;
  const toBase = `${customerId}/analysis/${analysisId}`;

  const originalImageUrl = await moveImage(
    `${fromBase}/original.png`,
    `${toBase}/original.png`,
  );

  let resultImageUrl: string;
  try {
    resultImageUrl = await moveImage(
      `${fromBase}/result.png`,
      `${toBase}/result.png`,
    );
  } catch (error) {
    await moveImage(`${toBase}/original.png`, `${fromBase}/original.png`);
    throw error;
  }

  const { data, error } = await supabase
    .from("analysis")
    .update({
      customer_id: customerId,
      original_image_url: originalImageUrl,
      result_image_url: resultImageUrl,
    })
    .eq("id", analysisId)
    .select()
    .single();

  if (error) {
    await Promise.all([
      moveImage(`${toBase}/original.png`, `${fromBase}/original.png`),
      moveImage(`${toBase}/result.png`, `${fromBase}/result.png`),
    ]);
    throw error;
  }
  return data;
}

export async function fetchSharedAnalysis(analysisId: string) {
  const { data, error } = await supabase
    .rpc("get_shared_analysis", { p_analysis_id: analysisId })
    .maybeSingle(); // 공유 안 한 분석, 만료된 링크 → 0행 반환 가능성 있음

  if (error) throw error;
  return data
    ? {
        result: data.result as Analysis,
        result_image_url: data.result_image_url,
      }
    : null;
}

export async function enableAnalysisShare(analysisId: string) {
  const { data, error } = await supabase
    .from("analysis")
    .select("share_expires_at")
    .eq("id", analysisId)
    .single();

  if (error) throw error;

  const hasValidLink =
    !!data.share_expires_at &&
    new Date(data.share_expires_at).getTime() > Date.now();

  if (hasValidLink) return;

  const shareExpiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  ).toISOString(); // 만료 기간 7일 설정

  const { error: updateError } = await supabase
    .from("analysis")
    .update({ share_expires_at: shareExpiresAt })
    .eq("id", analysisId);

  if (updateError) throw updateError;
}
