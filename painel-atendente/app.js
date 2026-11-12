const el = (id) => document.getElementById(id);
let people = [];
let connected = false;
let busy = false;
let pollTimer = null;
let clockOffset = 0;
let sessionGeneration = 0;
const currentTime = () => Date.now() + clockOffset;
const ticket = (n) => `#${String(n).padStart(3, '0')}`;
const time = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
let toastTimer;
function toast(message) { el('toast').textContent = message; el('toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el('toast').classList.remove('show'), 2800); }

function render() {
  const now = currentTime();
  const waiting = people.filter((p) => p.status === 'waiting');
  const active = people.filter((p) => p.status === 'called' || p.status === 'playing');
  el('waiting-count').textContent = waiting.length;
  el('waiting-pill').textContent = waiting.length;
  el('called-count').textContent = people.filter((p) => p.status === 'called').length;
  el('playing-count').replaceChildren(document.createTextNode(String(people.filter((p) => p.status === 'playing').length)), Object.assign(document.createElement('i'), { textContent: ' / 5' }));
  el('done-count').textContent = people.filter((p) => p.status === 'completed').length;
  el('capacity').textContent = `${active.length} / 5`;
  el('call-next').disabled = !connected || busy || waiting.length === 0 || active.length >= 5;
  el('queue-empty').hidden = waiting.length > 0;
  el('queue-empty').textContent = connected ? 'Ninguém aguardando no momento.' : 'Fila indisponível. Verifique a conexão e tente atualizar.';
  el('queue-body').replaceChildren(...waiting.map((p) => {
    const row = document.createElement('tr');
    [ticket(p.ticket_number), p.participant_name, `${Math.max(0, Math.floor((now - Date.parse(p.joined_at)) / 60000))} min`, 'Aguardando'].forEach((value, index) => {
      const cell = document.createElement('td'); const text = document.createElement(index === 0 ? 'strong' : 'span');
      text.textContent = value; if (index === 3) text.className = 'status'; cell.append(text); row.append(cell);
    }); return row;
  }));
  el('active-list').replaceChildren(...active.map((p) => {
    const item = document.createElement('article'); item.className = 'person';
    const top = document.createElement('div'); top.className = 'person-top';
    const identity = document.createElement('div'); const name = document.createElement('div'); name.className = 'person-name'; name.textContent = p.participant_name;
    const number = document.createElement('div'); number.className = 'person-ticket'; number.textContent = `Senha ${ticket(p.ticket_number)}`; identity.append(name, number);
    const badge = document.createElement('span'); badge.className = `status ${p.status}`; badge.textContent = p.status === 'called' ? 'Chamado' : 'Jogando'; top.append(identity, badge);
    const info = document.createElement('div'); info.className = 'person-info'; const label = document.createElement('span'); label.className = 'person-ticket'; label.textContent = p.status === 'called' ? 'Tempo para chegar' : 'Tempo de jogo';
    const timer = document.createElement('span'); timer.className = 'timer'; timer.dataset.id = p.id; info.append(label, timer);
    const actions = document.createElement('div'); actions.className = 'person-actions'; const button = document.createElement('button'); button.className = 'button button-secondary'; button.type = 'button'; button.disabled = !connected || busy; button.textContent = p.status === 'called' ? 'Confirmar chegada' : 'Finalizar partida';
    button.addEventListener('click', () => perform(p.status === 'called' ? 'start' : 'finish', p.id));
    actions.append(button);
    if (p.status === 'called') { const absent = document.createElement('button'); absent.className = 'button button-quiet'; absent.type = 'button'; absent.disabled = !connected || busy; absent.textContent = 'Não compareceu'; absent.addEventListener('click', () => perform('absent', p.id)); actions.append(absent); }
    item.append(top, info, actions); return item;
  }));
  if (!active.length) { const empty = document.createElement('div'); empty.className = 'empty'; empty.textContent = connected ? 'Nenhuma pessoa em atendimento.' : 'Aguardando conexão com a fila.'; el('active-list').append(empty); }
  updateTimers();
}

function updateTimers() {
  const now = currentTime();
  document.querySelectorAll('.timer').forEach((timer) => {
    const p = people.find((entry) => entry.id === timer.dataset.id);
    if (!p) return;
    const deadline = Date.parse(p.status === 'called' ? p.expires_at : p.play_ends_at);
    timer.textContent = deadline <= now ? 'Tempo encerrado' : time(deadline - now);
  });
}

async function refresh() {
  const generation = sessionGeneration;
  const previous = JSON.stringify(people);
  const wasConnected = connected;
  try {
    const result = await window.panelApi.queueAction('list');
    if (generation !== sessionGeneration) return;
    people = result.entries;
    clockOffset = Date.parse(result.server_time) - Date.now();
    connected = true;
    el('connection-status').textContent = 'Fila conectada. Os dados são atualizados automaticamente.';
  } catch (_) {
    if (generation !== sessionGeneration) return;
    connected = false;
    people = [];
    el('connection-status').textContent = 'Não foi possível carregar a fila. Verifique a conexão ou peça ajuda à equipe responsável.';
  }
  if (previous !== JSON.stringify(people) || wasConnected !== connected) render();
  else updateTimers();
}

async function perform(action, id = null) {
  if (!connected || busy) return;
  busy = true;
  render();
  try {
    const result = await window.panelApi.queueAction(action, id);
    toast(result.changed ? 'Operação realizada.' : 'Não foi possível alterar esta senha. A fila será atualizada.');
  } catch (_) {
    toast('Não foi possível concluir a operação. Confira a conexão.');
  } finally {
    busy = false;
    await refresh();
  }
}

el('call-next').addEventListener('click', () => perform('call'));
el('refresh').addEventListener('click', refresh);
window.addEventListener('panel:login', () => { sessionGeneration++; refresh(); clearInterval(pollTimer); pollTimer = setInterval(refresh, 5000); });
window.addEventListener('panel:logout', () => { sessionGeneration++; clearInterval(pollTimer); pollTimer = null; people = []; connected = false; render(); });
el('today').textContent = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
render();
setInterval(updateTimers, 1000);
