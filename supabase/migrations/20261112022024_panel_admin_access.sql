-- Lista de administradores do painel, vinculada ao UUID de autenticação.
-- A migration falha sem criar permissões se a conta solicitada não existir
-- ou se o e-mail ainda não estiver confirmado no Supabase Auth.
begin;
create table if not exists public.panel_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.panel_admins enable row level security;
revoke all on public.panel_admins from public, anon, authenticated;
grant select on public.panel_admins to authenticated;

do $$
begin
  if not exists (select 1 from pg_catalog.pg_policies where schemaname = 'public' and tablename = 'panel_admins' and policyname = 'panel admins read their own membership') then
    create policy "panel admins read their own membership"
      on public.panel_admins for select to authenticated
      using (user_id = (select auth.uid()));
  end if;
end;
$$;

create or replace function public.is_panel_admin()
returns boolean
language sql stable security invoker
set search_path = ''
as $$
  select exists (select 1 from public.panel_admins where user_id = (select auth.uid()));
$$;

revoke all on function public.is_panel_admin() from public, anon;
grant execute on function public.is_panel_admin() to authenticated;

do $$
declare
  v_user_id uuid;
begin
  select id into v_user_id from auth.users
   where lower(email) = 'marcoaandre7@gmail.com'
     and email_confirmed_at is not null;
  if v_user_id is null then
    raise exception 'Crie e confirme a conta de administrador no Supabase Auth antes de executar a migration';
  end if;
  insert into public.panel_admins (user_id) values (v_user_id) on conflict (user_id) do nothing;
end;
$$;

commit;
