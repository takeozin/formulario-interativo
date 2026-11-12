-- Executar somente em um banco PostgreSQL descartável com a migration aplicada.
begin;

do $$
declare
  i integer;
  v_id uuid;
  v_count integer;
  v_interval interval;
begin
  if has_function_privilege('anon', 'public.call_next_game_player(date)', 'execute')
    or has_function_privilege('anon', 'public.start_game_session(uuid)', 'execute')
    or has_function_privilege('anon', 'public.finish_game_session(uuid)', 'execute') then
    raise exception 'Visitantes não podem controlar a fila';
  end if;

  for i in 1..7 loop
    perform * from public.join_game_queue(gen_random_uuid(), 'Pessoa de teste', false);
  end loop;

  for i in 1..5 loop
    select queue_id into v_id from public.call_next_game_player();
    if v_id is null then raise exception 'A chamada % deveria funcionar', i; end if;
  end loop;

  select count(*) into v_count from public.call_next_game_player();
  if v_count <> 0 then raise exception 'Não pode ocupar uma sexta posição'; end if;

  select id into v_id from public.game_queue_entries where ticket_number = 1;
  select play_ends_at - started_at into v_interval from public.start_game_session(v_id);
  if v_interval is distinct from interval '20 minutes' then
    raise exception 'A partida deve durar 20 minutos';
  end if;

  select count(*) into v_count from public.start_game_session(v_id);
  if v_count <> 0 then raise exception 'Uma partida não pode começar duas vezes'; end if;

  select count(*) into v_count from public.finish_game_session(v_id);
  if v_count <> 1 then raise exception 'A equipe deve poder finalizar a partida'; end if;
  select count(*) into v_count from public.finish_game_session(v_id);
  if v_count <> 0 then raise exception 'Uma partida não pode terminar duas vezes'; end if;

  select count(*) into v_count from public.call_next_game_player();
  if v_count <> 1 then raise exception 'Uma vaga liberada deve permitir outra chamada'; end if;

  select id into v_id from public.game_queue_entries where ticket_number = 2;
  update public.game_queue_entries set expires_at = now() - interval '1 second' where id = v_id;
  select count(*) into v_count from public.start_game_session(v_id);
  if v_count <> 0 then raise exception 'Uma chamada expirada não pode iniciar uma partida'; end if;
  select count(*) into v_count from public.call_next_game_player();
  if v_count <> 1 then raise exception 'A chamada expirada deve liberar uma vaga'; end if;
  if (select status from public.game_queue_entries where id = v_id) <> 'expired' then
    raise exception 'A chamada vencida deve ficar expirada';
  end if;
end;
$$;

rollback;
