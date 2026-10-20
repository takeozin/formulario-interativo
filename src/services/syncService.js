import { supabase } from './supabaseClient';
import { listPendingSync, markAsSynced } from './responseRepository';

// Código do Postgres para chave duplicada: a resposta já foi enviada antes.
const DUPLICATE_KEY_CODE = '23505';

// Evita duas sincronizações ao mesmo tempo (ex.: fim do formulário e
// volta da internet no mesmo instante).
let isSyncing = false;
// Pedido feito durante um envio: roda de novo no fim, para a última
// resposta do evento não ficar presa no aparelho.
let rerunRequested = false;

// Envia ao Supabase as respostas completas que ainda não foram enviadas.
// Nunca lança erro: falha de rede não pode travar o visitante.
export async function syncPendingResponses() {
  if (!supabase) {
    return;
  }
  if (isSyncing) {
    rerunRequested = true;
    return;
  }
  isSyncing = true;
  try {
    do {
      rerunRequested = false;
      await sendPendingResponses();
    } while (rerunRequested);
  } finally {
    isSyncing = false;
  }
}

async function sendPendingResponses() {
  try {
    const pending = await listPendingSync();
    for (const row of pending) {
      await sendResponse(row);
    }
  } catch (error) {
    console.warn('[Soulstar] Falha ao sincronizar respostas:', error);
  }
}

// Uma resposta por vez: se uma falhar, as outras continuam.
// Insert simples, sem .select() e sem upsert: o app (anon) só tem INSERT.
async function sendResponse(row) {
  const { synced, ...response } = row; // "synced" só existe no aparelho
  try {
    const { error } = await supabase.from('responses').insert(response);
    if (error && error.code !== DUPLICATE_KEY_CODE) {
      console.warn(`[Soulstar] Resposta ${row.id} não enviada:`, error.message);
      return;
    }
    await markAsSynced([row.id]);
  } catch (error) {
    console.warn(`[Soulstar] Resposta ${row.id} não enviada:`, error);
  }
}
