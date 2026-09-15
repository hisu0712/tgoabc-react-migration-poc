create or replace function get_customer_count_by_age_group(p_member_id uuid)
returns table (age_group text, gender text, count bigint)
language sql
stable
as $$
  select
    case
      when date_part('year', age(c.birth_date)) < 20 then '10대'
      when date_part('year', age(c.birth_date)) < 30 then '20대'
      when date_part('year', age(c.birth_date)) < 40 then '30대'
      when date_part('year', age(c.birth_date)) < 50 then '40대'
      else '50대 이상'
    end as age_group,
    c.gender::text as gender,
    count(*) as count
  from customer c
  join member_customer_mapping mcm on mcm.customer_id = c.id
  where mcm.member_id = p_member_id
  group by age_group, c.gender;
$$;