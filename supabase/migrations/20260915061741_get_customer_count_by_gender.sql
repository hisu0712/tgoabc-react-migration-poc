create or replace function get_customer_count_by_gender(p_member_id uuid)
returns table (gender text, count bigint)
language sql
stable
as $$
  select
    c.gender::text as gender,
    count(*) as count
  from customer c
  join member_customer_mapping mcm on mcm.customer_id = c.id
  where mcm.member_id = p_member_id
  group by c.gender;
$$;