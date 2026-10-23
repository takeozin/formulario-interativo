-- O app só pode enviar respostas completas. Antes, a policy de INSERT
-- aceitava também as "in_progress": como o app não tem UPDATE, a primeira
-- versão enviada viraria a definitiva.
-- Mantém as checagens de autorização da migration anterior.

drop policy "app insere respostas com autorizacao" on public.responses;

create policy "app insere respostas completas com autorizacao"
  on public.responses
  for insert
  to anon
  with check (
    status = 'completed'
    and completed_at is not null
    and consent_type is not null
    and consent_version is not null
    and consent_at is not null
  );
