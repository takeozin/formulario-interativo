-- Fila compartilhada de jogadores da Arena.
-- As funções públicas recebem apenas os dados mínimos e devolvem somente
-- a inscrição vinculada ao token privado criado pelo app.

create table public.game_queue_counters (
  queue_date date primary key,
  next_ticket integer not null check (next_ticket > 0)
);

create table public.game_queue_entries (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique,
  access_token uuid not null unique,
  queue_date date not null,
  ticket_number integer not null,
  participant_name text not null check (char_length(trim(participant_name)) between 1 and 40),
  wants_to_learn boolean not null default false,
  status text not null default 'waiting' check (status in ('waiting', 'called', 'playing', 'expired', 'completed', 'abandoned')),
  joined_at timestamptz not null default now(),
  called_at timestamptz,
  expires_at timestamptz,
  started_at timestamptz,
  play_ends_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (queue_date, ticket_number)
);

create index game_queue_entries_waiting_idx
  on public.game_queue_entries (queue_date, status, ticket_number);

alter table public.game_queue_counters enable row level security;
alter table public.game_queue_entries enable row level security;

revoke all on table public.game_queue_counters from anon, authenticated;
revoke all on table public.game_queue_entries from anon, authenticated;

-- O app não recebe acesso direto às tabelas. Só as funções abaixo são API.
create or replace function public.join_game_queue(
  p_session_id uuid,
  p_name text,
  p_wants_to_learn boolean default false
)
returns table (
  queue_id uuid,
  access_token uuid,
  queue_date date,
  ticket_number integer,
  participant_name text,
  wants_to_learn boolean,
  status text,
  joined_at timestamptz,
  called_at timestamptz,
  expires_at timestamptz,
  play_ends_at timestamptz,
  server_time timestamptz,
  position_ahead bigint
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_queue_date date := (now() at time zone 'America/Sao_Paulo')::date;
  v_ticket integer;
  v_entry public.game_queue_entries%rowtype;
begin
  if p_session_id is null or char_length(trim(coalesce(p_name, ''))) not between 1 and 40 then
    raise exception 'invalid_queue_data' using errcode = '22023';
  end if;

  -- Repetições simultâneas da mesma inscrição aguardam a primeira terminar.
  perform pg_advisory_xact_lock(hashtextextended(p_session_id::text, 0));

  select * into v_entry
    from public.game_queue_entries
   where session_id = p_session_id;

  if found then
    if p_wants_to_learn and not v_entry.wants_to_learn then
      update public.game_queue_entries
         set wants_to_learn = true, updated_at = now()
       where id = v_entry.id
      returning * into v_entry;
    end if;

    return query
      select v_entry.id, v_entry.access_token, v_entry.queue_date, v_entry.ticket_number,
             v_entry.participant_name, v_entry.wants_to_learn, v_entry.status,
             v_entry.joined_at, v_entry.called_at, v_entry.expires_at, v_entry.play_ends_at, now(),
             (select count(*) from public.game_queue_entries ahead
               where ahead.queue_date = v_entry.queue_date
                 and ahead.status = 'waiting'
                 and ahead.ticket_number < v_entry.ticket_number);
    return;
  end if;

  -- O conflito é protegido por lock de linha: duas pessoas nunca recebem a mesma senha.
  insert into public.game_queue_counters(queue_date, next_ticket)
       values (v_queue_date, 2)
  on conflict on constraint game_queue_counters_pkey do update
        set next_ticket = public.game_queue_counters.next_ticket + 1
  returning public.game_queue_counters.next_ticket - 1 into v_ticket;

  insert into public.game_queue_entries (
    session_id, access_token, queue_date, ticket_number, participant_name, wants_to_learn
  ) values (
    p_session_id, gen_random_uuid(), v_queue_date, v_ticket, trim(p_name), p_wants_to_learn
  ) returning * into v_entry;

  return query
    select v_entry.id, v_entry.access_token, v_entry.queue_date, v_entry.ticket_number,
           v_entry.participant_name, v_entry.wants_to_learn, v_entry.status,
           v_entry.joined_at, v_entry.called_at, v_entry.expires_at, v_entry.play_ends_at, now(),
           (select count(*) from public.game_queue_entries ahead
             where ahead.queue_date = v_entry.queue_date
               and ahead.status = 'waiting'
               and ahead.ticket_number < v_entry.ticket_number);
end;
$$;

create or replace function public.get_game_queue_status(p_access_token uuid)
returns table (
  queue_id uuid,
  access_token uuid,
  queue_date date,
  ticket_number integer,
  participant_name text,
  wants_to_learn boolean,
  status text,
  joined_at timestamptz,
  called_at timestamptz,
  expires_at timestamptz,
  play_ends_at timestamptz,
  server_time timestamptz,
  position_ahead bigint
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_entry public.game_queue_entries%rowtype;
begin
  update public.game_queue_entries as entry
     set status = 'expired', updated_at = now()
   where entry.access_token = p_access_token
     and entry.status = 'called'
     and entry.expires_at <= now();

  select entry.* into v_entry
    from public.game_queue_entries as entry
   where entry.access_token = p_access_token;

  if not found then
    return;
  end if;

  return query
    select v_entry.id, v_entry.access_token, v_entry.queue_date, v_entry.ticket_number,
           v_entry.participant_name, v_entry.wants_to_learn, v_entry.status,
           v_entry.joined_at, v_entry.called_at, v_entry.expires_at, v_entry.play_ends_at, now(),
           (select count(*) from public.game_queue_entries ahead
             where ahead.queue_date = v_entry.queue_date
               and ahead.status = 'waiting'
               and ahead.ticket_number < v_entry.ticket_number);
end;
$$;

create or replace function public.set_game_queue_learning(
  p_access_token uuid,
  p_wants_to_learn boolean
)
returns table (
  queue_id uuid,
  access_token uuid,
  queue_date date,
  ticket_number integer,
  participant_name text,
  wants_to_learn boolean,
  status text,
  joined_at timestamptz,
  called_at timestamptz,
  expires_at timestamptz,
  play_ends_at timestamptz,
  server_time timestamptz,
  position_ahead bigint
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_entry public.game_queue_entries%rowtype;
begin
  update public.game_queue_entries as entry
     set wants_to_learn = p_wants_to_learn, updated_at = now()
   where entry.access_token = p_access_token
  returning entry.* into v_entry;

  if not found then
    return;
  end if;

  return query
    select v_entry.id, v_entry.access_token, v_entry.queue_date, v_entry.ticket_number,
           v_entry.participant_name, v_entry.wants_to_learn, v_entry.status,
           v_entry.joined_at, v_entry.called_at, v_entry.expires_at, v_entry.play_ends_at, now(),
           (select count(*) from public.game_queue_entries ahead
             where ahead.queue_date = v_entry.queue_date
               and ahead.status = 'waiting'
               and ahead.ticket_number < v_entry.ticket_number);
end;
$$;

-- O participante pode desistir usando o token da própria inscrição.
create or replace function public.cancel_game_queue(p_access_token uuid)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.game_queue_entries as entry
     set status = 'abandoned', updated_at = now()
   where entry.access_token = p_access_token and entry.status in ('waiting', 'called');
  return found;
end;
$$;

-- Chamada do próximo jogador: só o service_role/painel do stand pode executar.
create or replace function public.call_next_game_player(p_queue_date date default (now() at time zone 'America/Sao_Paulo')::date)
returns table (
  queue_id uuid,
  ticket_number integer,
  participant_name text,
  called_at timestamptz,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_entry public.game_queue_entries%rowtype;
begin
  -- Serializa chamadas dos atendentes e protege as cinco posições do estande.
  perform pg_advisory_xact_lock(hashtextextended('arena_queue_capacity', 0));

  update public.game_queue_entries as entry
     set status = 'expired', updated_at = now()
   where entry.status = 'called'
     and entry.expires_at <= now();

  if (select count(*) from public.game_queue_entries as active
       where active.status in ('called', 'playing')) >= 5 then
    return;
  end if;

  select entry.* into v_entry
    from public.game_queue_entries as entry
   where entry.queue_date = p_queue_date
     and entry.status = 'waiting'
   order by entry.ticket_number
   for update skip locked
   limit 1;

  if not found then
    return;
  end if;

  update public.game_queue_entries
     set status = 'called', called_at = now(), expires_at = now() + interval '5 minutes', updated_at = now()
   where id = v_entry.id
  returning * into v_entry;

  return query select v_entry.id, v_entry.ticket_number, v_entry.participant_name,
                       v_entry.called_at, v_entry.expires_at;
end;
$$;

-- A equipe confirma a chegada e inicia os 20 minutos de jogo.
-- Chamada expirada não pode ser iniciada; o horário é definido pelo servidor.
create or replace function public.start_game_session(p_queue_id uuid)
returns table (queue_id uuid, started_at timestamptz, play_ends_at timestamptz)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_entry public.game_queue_entries%rowtype;
begin
  update public.game_queue_entries as entry
     set status = 'playing', started_at = now(),
         play_ends_at = now() + interval '20 minutes', updated_at = now()
   where entry.id = p_queue_id and entry.status = 'called' and entry.expires_at > now()
  returning entry.* into v_entry;

  if found then
    return query select v_entry.id, v_entry.started_at, v_entry.play_ends_at;
  end if;
end;
$$;

-- A posição só é liberada após confirmação do término pela equipe.
create or replace function public.finish_game_session(p_queue_id uuid)
returns table (queue_id uuid, completed_at timestamptz)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_entry public.game_queue_entries%rowtype;
begin
  update public.game_queue_entries as entry
     set status = 'completed', completed_at = now(), updated_at = now()
   where entry.id = p_queue_id and entry.status = 'playing'
  returning entry.* into v_entry;

  if found then
    return query select v_entry.id, v_entry.completed_at;
  end if;
end;
$$;

revoke all on function public.join_game_queue(uuid, text, boolean) from public;
revoke all on function public.get_game_queue_status(uuid) from public;
revoke all on function public.set_game_queue_learning(uuid, boolean) from public;
revoke all on function public.call_next_game_player(date) from public;
revoke all on function public.cancel_game_queue(uuid) from public;
revoke all on function public.start_game_session(uuid) from public;
revoke all on function public.finish_game_session(uuid) from public;

grant execute on function public.join_game_queue(uuid, text, boolean) to anon, authenticated;
grant execute on function public.get_game_queue_status(uuid) to anon, authenticated;
grant execute on function public.set_game_queue_learning(uuid, boolean) to anon, authenticated;
grant execute on function public.call_next_game_player(date) to service_role;
grant execute on function public.cancel_game_queue(uuid) to anon, authenticated;
grant execute on function public.start_game_session(uuid) to service_role;
grant execute on function public.finish_game_session(uuid) to service_role;
