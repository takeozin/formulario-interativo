-- A implementação privilegiada fica fora dos schemas expostos pela API.
create schema arena_queue_private;
revoke all on schema arena_queue_private from public, anon, authenticated;
grant usage on schema arena_queue_private to authenticated;

create function arena_queue_private.panel_queue_action(p_action text, p_queue_id uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_rows jsonb;
  v_changed boolean := false;
begin
  if v_user is null or not exists (select 1 from public.panel_admins where user_id = v_user) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if p_action = 'list' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', e.id, 'ticket_number', e.ticket_number, 'participant_name', e.participant_name,
      'status', case when e.status = 'called' and e.expires_at <= now() then 'expired' else e.status end,
      'joined_at', e.joined_at, 'called_at', e.called_at, 'expires_at', e.expires_at,
      'started_at', e.started_at, 'play_ends_at', e.play_ends_at, 'completed_at', e.completed_at
    ) order by e.ticket_number), '[]'::jsonb)
    into v_rows from public.game_queue_entries e
    where e.queue_date = (now() at time zone 'America/Sao_Paulo')::date;
    return jsonb_build_object('entries', v_rows, 'server_time', now());
  elsif p_action = 'call' then
    select exists (select 1 from public.call_next_game_player()) into v_changed;
  elsif p_action = 'start' and p_queue_id is not null then
    select exists (select 1 from public.start_game_session(p_queue_id)) into v_changed;
  elsif p_action = 'finish' and p_queue_id is not null then
    select exists (select 1 from public.finish_game_session(p_queue_id)) into v_changed;
  elsif p_action = 'absent' and p_queue_id is not null then
    update public.game_queue_entries e set status = 'expired', updated_at = now()
      where e.id = p_queue_id and e.status = 'called';
    v_changed := found;
  else
    raise exception 'invalid_action' using errcode = '22023';
  end if;
  return jsonb_build_object('changed', v_changed);
end;
$$;

revoke all on function arena_queue_private.panel_queue_action(text, uuid) from public, anon, authenticated;
grant execute on function arena_queue_private.panel_queue_action(text, uuid) to authenticated;

-- Wrapper exposto não tem privilégios próprios; a função interna valida a conta.
create function public.panel_queue_action(p_action text, p_queue_id uuid default null)
returns jsonb language sql security invoker set search_path = ''
as $$ select arena_queue_private.panel_queue_action(p_action, p_queue_id); $$;
revoke all on function public.panel_queue_action(text, uuid) from public, anon;
grant execute on function public.panel_queue_action(text, uuid) to authenticated;
