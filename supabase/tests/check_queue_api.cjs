// Verifica a API pública sem criar, alterar ou consultar dados de participantes.
global.window = {};
require('../../painel-atendente/config.js');
const { supabaseUrl, supabasePublishableKey } = window.PANEL_CONFIG;

async function rpc(name, body) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: supabasePublishableKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: response.status, data: await response.json() };
}

(async () => {
  const ownTicket = await rpc('get_game_queue_status', { p_access_token: '00000000-0000-0000-0000-000000000000' });
  if (ownTicket.status !== 200 || !Array.isArray(ownTicket.data) || ownTicket.data.length !== 0) {
    throw new Error(`Consulta anônima da própria senha indisponível (HTTP ${ownTicket.status})`);
  }
  const adminPanel = await rpc('panel_queue_action', { p_action: 'list' });
  if (![401, 403].includes(adminPanel.status)) {
    throw new Error(`Consulta anônima do painel não foi bloqueada (HTTP ${adminPanel.status})`);
  }
  const { createClient } = require('@supabase/supabase-js');
  const client = createClient(supabaseUrl, supabasePublishableKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const mobileCheck = await client.rpc('get_game_queue_status', { p_access_token: '00000000-0000-0000-0000-000000000000' });
  if (mobileCheck.error || !Array.isArray(mobileCheck.data) || mobileCheck.data.length !== 0) {
    throw new Error(`Consulta com a biblioteca do aplicativo falhou: ${mobileCheck.error?.message || 'resposta inesperada'}`);
  }
  console.log('API da fila disponível; acesso anônimo ao painel bloqueado.');
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
