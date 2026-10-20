import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Client único do app. Sem login: só insere respostas com a chave anon,
// então não há sessão para guardar nem renovar.
// Sem as variáveis do .env o client fica null e o formulário segue offline.
function createSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[Soulstar] Supabase não configurado (.env): as respostas ficam só no aparelho.');
    return null;
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export const supabase = createSupabaseClient();
