// A autorização é consultada no servidor; não há senha ou token persistido no painel.
(() => {
  const loginForm = document.getElementById('login-form');
  const email = document.getElementById('login-email');
  const password = document.getElementById('login-password');
  const errorBox = document.getElementById('login-error');
  const submit = document.getElementById('login-submit');
  const loginScreen = document.getElementById('login-screen');
  const header = document.getElementById('panel-header');
  const panel = document.getElementById('inicio');
  const logout = document.getElementById('logout');
  let session = null;
  let expirationTimer = null;

  window.panelApi = {
    async queueAction(action, queueId = null) {
      if (!session) throw new Error('SESSION_EXPIRED');
      const { supabaseUrl, supabasePublishableKey } = window.PANEL_CONFIG;
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/panel_queue_action`, {
        method: 'POST',
        headers: { apikey: supabasePublishableKey, Authorization: `Bearer ${session}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_action: action, p_queue_id: queueId }),
      });
      if (!response.ok) throw new Error('QUEUE_UNAVAILABLE');
      return response.json();
    },
  };

  function showLogin(message = '') {
    session = null;
    window.dispatchEvent(new Event('panel:logout'));
    clearTimeout(expirationTimer);
    password.value = '';
    header.hidden = true;
    panel.hidden = true;
    loginScreen.hidden = false;
    errorBox.textContent = message;
    errorBox.hidden = !message;
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const { supabaseUrl, supabasePublishableKey } = window.PANEL_CONFIG || {};
    if (!supabaseUrl || !supabasePublishableKey) {
      showLogin('O acesso ainda não foi configurado. Peça ajuda à equipe responsável.');
      return;
    }
    submit.disabled = true;
    errorBox.hidden = true;
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { apikey: supabasePublishableKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value.trim(), password: password.value }),
      });
      password.value = '';
      if (!response.ok) throw new Error('AUTH_FAILED');
      const result = await response.json();
      if (!result.access_token || !result.expires_in) throw new Error('AUTH_FAILED');
      const permission = await fetch(`${supabaseUrl}/rest/v1/rpc/is_panel_admin`, {
        method: 'POST',
        headers: { apikey: supabasePublishableKey, Authorization: `Bearer ${result.access_token}`, 'Content-Type': 'application/json' },
        body: '{}',
      });
      if (!permission.ok || await permission.json() !== true) throw new Error('NOT_AUTHORIZED');
      session = result.access_token;
      loginScreen.hidden = true;
      header.hidden = false;
      panel.hidden = false;
      window.dispatchEvent(new Event('panel:login'));
      expirationTimer = setTimeout(() => showLogin('Sua sessão expirou. Entre novamente.'), Math.max(0, (result.expires_in - 5) * 1000));
      document.getElementById('inicio').focus();
    } catch (error) {
      showLogin(error.message === 'NOT_AUTHORIZED' ? 'Sua conta não tem acesso ao painel. Fale com a equipe responsável.' : 'Não foi possível entrar. Confira seus dados e a conexão.');
    } finally {
      submit.disabled = false;
    }
  });

  logout.addEventListener('click', async () => {
    const token = session;
    const { supabaseUrl, supabasePublishableKey } = window.PANEL_CONFIG || {};
    showLogin();
    if (token) {
      try {
        await fetch(`${supabaseUrl}/auth/v1/logout`, { method: 'POST', headers: { apikey: supabasePublishableKey, Authorization: `Bearer ${token}` } });
      } catch (_) { /* a sessão local já foi descartada */ }
    }
  });
})();
