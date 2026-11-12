begin;
insert into public.game_queue_entries (session_id, access_token, queue_date, ticket_number, participant_name, joined_at)
values (gen_random_uuid(), gen_random_uuid(), (now() at time zone 'America/Sao_Paulo')::date - 1, 1, 'Anterior', now() - interval '1 hour'),
       (gen_random_uuid(), gen_random_uuid(), (now() at time zone 'America/Sao_Paulo')::date, 1, 'Atual', now());
set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
do $$
declare entries jsonb; called jsonb;
begin
  entries := public.panel_queue_action('list')->'entries';
  if jsonb_array_length(entries) <> 2 or entries->0->>'participant_name' <> 'Anterior' then
    raise exception 'Fila anterior deve aparecer primeiro';
  end if;
  called := public.panel_queue_action('call');
  if not (called->>'changed')::boolean then raise exception 'Chamada falhou'; end if;
  entries := public.panel_queue_action('list')->'entries';
  if entries->0->>'status' <> 'called' or entries->1->>'status' <> 'waiting' then
    raise exception 'A pessoa que chegou primeiro deve ser chamada';
  end if;
end;
$$;
rollback;
