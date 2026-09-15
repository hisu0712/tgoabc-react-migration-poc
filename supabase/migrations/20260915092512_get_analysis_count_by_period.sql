create or replace function get_analysis_count_by_period(  
  p_member_id uuid,
  p_pivot_date date,
  p_granularity text -- 'month' 또는 'day'
)
returns table (bucket_start date, new_count bigint, cumulative_count bigint)
language plpgsql
stable
as $$
declare
  v_interval interval := case p_granularity
    when 'month' then interval '1 month'
    else interval '1 day'
  end;
begin
  return query
  with buckets as (
    select generate_series(
      date_trunc(p_granularity, p_pivot_date::timestamp) - (v_interval * 3),
      date_trunc(p_granularity, p_pivot_date::timestamp) + (v_interval * 3),
      v_interval
    )::date as bucket_start
  )
  select
    b.bucket_start,
    (
      select count(*)
      from analysis a
      where a.member_id = p_member_id
        and a.created_at >= b.bucket_start
        and a.created_at < b.bucket_start + v_interval
    ) as new_count,
    (
      select count(*)
      from analysis a
      where a.member_id = p_member_id
        and a.created_at < b.bucket_start + v_interval
    ) as cumulative_count
  from buckets b
  order by b.bucket_start;
end;
$$;