-- Conserva inscrições ativas anteriores à meia-noite, em ordem de chegada.
-- Falha sem aplicar alterações se as funções não tiverem a estrutura esperada.
begin;
do $migration$
declare original text; updated text;
begin
  select pg_get_functiondef('public.call_next_game_player(date)'::regprocedure) into original;
  updated := regexp_replace(original,
    'entry\.queue_date\s*=\s*p_queue_date\s+and\s+entry\.status\s*=\s*''waiting''\s+order\s+by\s+entry\.ticket_number',
    'entry.queue_date <= p_queue_date and entry.status = ''waiting'' order by entry.joined_at, entry.ticket_number', 'i');
  if updated = original then raise exception 'Estrutura inesperada de call_next_game_player'; end if;
  execute updated;

  select pg_get_functiondef('arena_queue_private.panel_queue_action(text,uuid)'::regprocedure) into original;
  updated := regexp_replace(original, 'order\s+by\s+e\.ticket_number', 'order by e.joined_at, e.ticket_number', 'i');
  if updated = original then raise exception 'Ordenação inesperada de panel_queue_action'; end if;
  original := updated;
  updated := regexp_replace(original,
    'where\s+e\.queue_date\s*=\s*\(now\(\)\s+at\s+time\s+zone\s+''America/Sao_Paulo''\)::date',
    'where (e.queue_date = (now() at time zone ''America/Sao_Paulo'')::date or (e.queue_date < (now() at time zone ''America/Sao_Paulo'')::date and e.status in (''waiting'', ''called'', ''playing'')))', 'i');
  if updated = original then raise exception 'Filtro inesperado de panel_queue_action'; end if;
  execute updated;
end;
$migration$;
commit;
