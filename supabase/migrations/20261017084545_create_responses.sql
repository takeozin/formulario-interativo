-- Espelho da tabela `responses` do SQLite (src/services/database.js).
-- A coluna `synced` fica de fora: ela só existe no aparelho.

create table public.responses (
  id uuid primary key,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed')),
  consent_type text,
  consent_version text,
  consent_at timestamptz,
  avatar text,
  name text,
  age_range text,
  intent text,
  rating smallint check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  completed_at timestamptz
);

comment on table public.responses is
  'Respostas do formulário enviadas pelo app. O app (anon) só insere; leitura pelo painel/service_role.';

alter table public.responses enable row level security;

-- O Supabase concede tudo a anon/authenticated por padrão. Tiramos tudo e
-- devolvemos só o INSERT ao app, para não depender apenas das policies.
revoke all on table public.responses from anon, authenticated;
grant insert on table public.responses to anon;

-- O app só envia respostas que começaram com a autorização registrada.
-- Sem policy de SELECT, UPDATE ou DELETE: para anon, isso é tudo bloqueado.
create policy "app insere respostas com autorizacao"
  on public.responses
  for insert
  to anon
  with check (
    consent_type is not null
    and consent_version is not null
    and consent_at is not null
  );
