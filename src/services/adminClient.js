import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Sessão administrativa em memória, independente da sessão anônima do formulário.
export const adminClient = url && key ? createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: true, detectSessionInUrl: false },
}) : null;
