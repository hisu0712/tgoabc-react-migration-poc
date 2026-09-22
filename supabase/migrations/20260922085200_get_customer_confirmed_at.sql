CREATE OR REPLACE FUNCTION public.get_customer_confirmed_at(p_customer_id uuid)
 RETURNS timestamptz
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO ''
AS $$
  select confirmed_at from auth.users where id = p_customer_id;
$$