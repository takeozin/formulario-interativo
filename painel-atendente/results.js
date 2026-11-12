(() => {
  const byId = (id) => document.getElementById(id);
  const ages = [['under_12', 'Até 11 anos'], ['12_14', '12 a 14 anos'], ['15_17', '15 a 17 anos'], ['18_24', '18 a 24 anos'], ['25_34', '25 a 34 anos'], ['35_plus', '35 anos ou mais'], ['unknown', 'Não informado']];
  const intents = [['casual_player', 'Quero jogar'], ['wants_to_learn', 'Quero criar jogos'], ['unknown', 'Não informado']];
  const ratings = [['5', '5 estrelas'], ['4', '4 estrelas'], ['3', '3 estrelas'], ['2', '2 estrelas'], ['1', '1 estrela']];
  let generation = 0;
  function chart(id, options, values, total) {
    const container = byId(id);
    const rows = options.filter(([key]) => key !== 'unknown' || (values[key] || 0) > 0).map(([key, label]) => {
      const n = Number(values[key] || 0);
      const pct = total ? Math.round((n / total) * 100) : 0;
      const row = document.createElement('div'); row.className = 'chart-row'; row.dataset.key = key; row.style.setProperty('--chart-pct', `${pct}%`);
      const heading = document.createElement('div'); heading.className = 'chart-row-heading';
      const name = document.createElement('span'); name.textContent = label;
      const count = document.createElement('strong'); count.textContent = `${n} · ${pct}%`;
      heading.append(name, count);
      const track = document.createElement('div'); track.className = 'chart-track'; track.setAttribute('aria-hidden', 'true');
      const fill = document.createElement('div'); fill.className = 'chart-fill'; fill.style.width = `${pct}%`; track.append(fill);
      row.append(heading, track); return row;
    });
    container.replaceChildren(...rows);
  }
  async function load() {
    const start = byId('report-start').value;
    const end = byId('report-end').value;
    const current = ++generation;
    if (start && end && start > end) { byId('report-message').textContent = 'A data inicial deve ser anterior à data final.'; return; }
    byId('report-message').textContent = 'Carregando resultados...';
    byId('report-content').hidden = true;
    byId('report-submit').disabled = true;
    try {
      const data = await window.panelApi.formAnalytics(start, end);
      if (current !== generation) return;
      const total = Number(data.total || 0); const rated = Number(data.rating_count || 0);
      byId('report-total').textContent = total.toLocaleString('pt-BR');
      byId('report-average').textContent = rated ? `${Number(data.average_rating).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} / 5` : '—';
      byId('report-rating-count').textContent = rated === 1 ? '1 avaliação' : `${rated} avaliações`;
      chart('chart-age', ages, data.ages || {}, total);
      chart('chart-intent', intents, data.intents || {}, total);
      chart('chart-rating', ratings, data.ratings || {}, rated);
      byId('report-message').textContent = total ? '' : 'Ainda não há respostas concluídas neste período.';
      byId('report-content').hidden = false;
    } catch (_) {
      if (current !== generation) return;
      byId('report-message').textContent = 'Não foi possível carregar os resultados. Confira a conexão ou procure a equipe responsável.';
    } finally { if (current === generation) byId('report-submit').disabled = false; }
  }
  byId('report-filters').addEventListener('submit', (event) => { event.preventDefault(); load(); });
  byId('report-clear').addEventListener('click', () => { byId('report-start').value = ''; byId('report-end').value = ''; load(); });
  window.addEventListener('panel:login', load);
  window.addEventListener('panel:logout', () => { generation++; byId('report-content').hidden = true; byId('report-message').textContent = 'Entre para carregar os resultados.'; byId('report-submit').disabled = false; });
})();
