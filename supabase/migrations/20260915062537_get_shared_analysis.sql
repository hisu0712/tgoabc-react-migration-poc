-- 공개(anon) 조회용 함수: 만료 안 지난 행의 result / 이미지 URL만 반환
CREATE OR REPLACE FUNCTION public.get_shared_analysis(p_analysis_id uuid)
 RETURNS TABLE(result jsonb, result_image_url text)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO ''
AS $$
  select a.result, a.result_image_url
  from public.analysis a
  where a.id = p_analysis_id
    and a.share_expires_at is not null
    and a.share_expires_at > now();
$$
