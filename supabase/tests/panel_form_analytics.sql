-- Apenas para um banco isolado com usuário administrador de teste.
begin;
insert into public.responses (id, status, age_range, intent, rating, created_at, updated_at, completed_at)
values (gen_random_uuid(), 'completed', '12_14', 'casual_player', 5, now(), now(), '2026-11-12 13:00:00+00'),
       (gen_random_uuid(), 'completed', '18_24', 'wants_to_learn', 3, now(), now(), '2026-11-13 13:00:00+00'),
       (gen_random_uuid(), 'in_progress', 'under_12', 'casual_player', null, now(), now(), null);
set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
do $$
declare all_data jsonb; first_day jsonb;
begin
  all_data := public.panel_form_analytics();
  if (all_data->>'total')::integer <> 2 or (all_data->>'average_rating')::numeric <> 4 then raise exception 'Totais incorretos'; end if;
  if (all_data->'ages'->>'12_14')::integer <> 1 or (all_data->'intents'->>'wants_to_learn')::integer <> 1 then raise exception 'Distribuições incorretas'; end if;
  if all_data ? 'name' or all_data ? 'comment' then raise exception 'Dados identificáveis não devem ser retornados'; end if;
  first_day := public.panel_form_analytics('2026-11-12', '2026-11-12');
  if (first_day->>'total')::integer <> 1 or (first_day->'ratings'->>'5')::integer <> 1 then raise exception 'Filtro de período incorreto'; end if;
end;
$$;
rollback;
