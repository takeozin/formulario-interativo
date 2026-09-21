import { getDatabase } from './database';

// Repository Pattern (DRDA 2.6): as telas nunca escrevem SQL. Elas falam
// com o contexto, e o contexto fala com este arquivo.

// Grava a resposta inteira. Se o id já existe, atualiza (upsert).
// Toda gravação marca a resposta como "não sincronizada" (synced = 0).
export async function saveResponse(response) {
  const db = await getDatabase();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO responses (
       id, status, consent_type, consent_version, consent_at, avatar, name,
       age_range, intent, rating, comment, created_at, updated_at, completed_at, synced
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
     ON CONFLICT(id) DO UPDATE SET
       status = excluded.status,
       consent_type = excluded.consent_type,
       consent_version = excluded.consent_version,
       consent_at = excluded.consent_at,
       avatar = excluded.avatar,
       name = excluded.name,
       age_range = excluded.age_range,
       intent = excluded.intent,
       rating = excluded.rating,
       comment = excluded.comment,
       updated_at = excluded.updated_at,
       completed_at = excluded.completed_at,
       synced = 0`,
    [
      response.id,
      response.status,
      response.consentType ?? null,
      response.consentVersion ?? null,
      response.consentAt ?? null,
      response.avatar ?? null,
      response.name || null,
      response.ageRange ?? null,
      response.intent ?? null,
      response.rating ?? null,
      response.comment || null,
      now,
      now,
      response.completedAt ?? null,
    ]
  );
}

export async function deleteResponse(id) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM responses WHERE id = ?', [id]);
}

export async function listResponses() {
  const db = await getDatabase();
  return db.getAllAsync('SELECT * FROM responses ORDER BY created_at DESC');
}

// Usados na fase 2, quando o envio ao Supabase for implementado.
export async function listPendingSync() {
  const db = await getDatabase();
  return db.getAllAsync('SELECT * FROM responses WHERE synced = 0 ORDER BY created_at ASC');
}

export async function markAsSynced(ids) {
  if (!ids.length) {
    return;
  }
  const db = await getDatabase();
  const placeholders = ids.map(() => '?').join(', ');
  await db.runAsync(`UPDATE responses SET synced = 1 WHERE id IN (${placeholders})`, ids);
}
