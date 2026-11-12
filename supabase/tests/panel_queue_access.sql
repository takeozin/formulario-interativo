-- Banco descartável com as migrations e uma conta de teste no auth.users.
begin;
set local role anon;
select public.join_game_queue('50000000-0000-4000-8000-000000000001', 'Pessoa de teste', false);
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
do $$
declare
  v_id uuid;
  v_entries jsonb;
  v_token uuid;
  v_status text;
begin
  v_entries := public.panel_queue_action('list')->'entries';
  if jsonb_array_length(v_entries) <> 1 then raise exception 'A fila deve mostrar um participante'; end if;
  if (v_entries->0) ? 'access_token' or (v_entries->0) ? 'session_id' then
    raise exception 'O painel não deve receber credenciais do participante';
  end if;
  v_id := (v_entries->0->>'id')::uuid;
  if not (public.panel_queue_action('call')->>'changed')::boolean then raise exception 'Chamada falhou'; end if;
  if not (public.panel_queue_action('start', v_id)->>'changed')::boolean then raise exception 'Início falhou'; end if;
  if not (public.panel_queue_action('finish', v_id)->>'changed')::boolean then raise exception 'Finalização falhou'; end if;
  select access_token into v_token from public.join_game_queue('50000000-0000-4000-8000-000000000001', 'Pessoa de teste', false);
  select status into v_status from public.get_game_queue_status(v_token);
  if v_status <> 'completed' then raise exception 'O participante deve ver a partida finalizada'; end if;
  if public.cancel_game_queue(v_token) then raise exception 'Partida concluída não deve ser cancelada'; end if;
  select access_token into v_token from public.join_game_queue('50000000-0000-4000-8000-000000000002', 'Segunda pessoa', false);
  if not public.cancel_game_queue(v_token) then raise exception 'Participante deve poder sair da fila'; end if;
  select status into v_status from public.get_game_queue_status(v_token);
  if v_status <> 'abandoned' then raise exception 'A desistência deve ser registrada'; end if;
end;
$$;
rollback;
