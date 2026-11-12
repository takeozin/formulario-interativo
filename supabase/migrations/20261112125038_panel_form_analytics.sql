-- Apenas agregados de respostas concluídas. Não expõe nomes, comentários ou IDs.
create function arena_queue_private.form_analytics(p_start date default null, p_end date default null)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare v_result jsonb;
begin
  if auth.uid() is null or not exists (select 1 from public.panel_admins a where a.user_id = auth.uid()) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;
  if p_start is not null and p_end is not null and p_start > p_end then
    raise exception 'invalid_date_range' using errcode = '22023';
  end if;
  with filtered as (
    select age_range, intent, rating from public.responses
     where status = 'completed' and completed_at is not null
       and (p_start is null or completed_at >= p_start::timestamp at time zone 'America/Sao_Paulo')
       and (p_end is null or completed_at < (p_end + 1)::timestamp at time zone 'America/Sao_Paulo')
  )
  select jsonb_build_object(
    'total', (select count(*) from filtered),
    'average_rating', (select round(avg(rating)::numeric, 1) from filtered),
    'rating_count', (select count(rating) from filtered),
    'ages', coalesce((select jsonb_object_agg(label, amount) from (select coalesce(age_range, 'unknown') label, count(*) amount from filtered group by 1) a), '{}'::jsonb),
    'intents', coalesce((select jsonb_object_agg(label, amount) from (select coalesce(intent, 'unknown') label, count(*) amount from filtered group by 1) i), '{}'::jsonb),
    'ratings', coalesce((select jsonb_object_agg(label, amount) from (select rating::text label, count(*) amount from filtered where rating between 1 and 5 group by 1) r), '{}'::jsonb)
  ) into v_result;
  return v_result;
end;
$$;
revoke all on function arena_queue_private.form_analytics(date, date) from public, anon, authenticated;
grant execute on function arena_queue_private.form_analytics(date, date) to authenticated;

create function public.panel_form_analytics(p_start date default null, p_end date default null)
returns jsonb language sql stable security invoker set search_path = ''
as $$ select arena_queue_private.form_analytics(p_start, p_end); $$;
revoke all on function public.panel_form_analytics(date, date) from public, anon;
grant execute on function public.panel_form_analytics(date, date) to authenticated;
