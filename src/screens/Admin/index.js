import React, { useCallback, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { adminClient } from '../../services/adminClient';

const ages = [['under_12', 'Até 11 anos'], ['12_14', '12 a 14 anos'], ['15_17', '15 a 17 anos'], ['18_24', '18 a 24 anos'], ['25_34', '25 a 34 anos'], ['35_plus', '35 anos ou mais'], ['unknown', 'Não informado']];
const intents = [['casual_player', 'Quero jogar'], ['wants_to_learn', 'Quero criar jogos'], ['unknown', 'Não informado']];
const ratings = [['5', '5 estrelas'], ['4', '4 estrelas'], ['3', '3 estrelas'], ['2', '2 estrelas'], ['1', '1 estrela']];

function Button({ title, onPress, disabled, secondary }) {
  return <TouchableOpacity accessibilityRole="button" accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress} style={[s.button, secondary && s.secondary, disabled && s.disabled]}><Text style={[s.buttonText, secondary && s.secondaryText]}>{title}</Text></TouchableOpacity>;
}

export function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function login() {
    if (!adminClient) { setError('Conexão não configurada. Peça ajuda à equipe.'); return; }
    if (!email.trim() || !password) { setError('Preencha o e-mail e a senha.'); return; }
    setBusy(true); setError('');
    try {
      const result = await adminClient.auth.signInWithPassword({ email: email.trim(), password });
      if (result.error) throw result.error;
      const permission = await adminClient.rpc('is_panel_admin');
      if (permission.error || permission.data !== true) {
        await adminClient.auth.signOut({ scope: 'local' });
        setError('Esta conta não tem acesso ao painel.');
        return;
      }
      setPassword('');
      navigation.replace('AdminPanel');
    } catch (_) { setError('Não foi possível entrar. Confira seus dados e a conexão.'); }
    finally { setBusy(false); }
  }

  return <SafeAreaView style={s.safe}><StatusBar style="light" /><KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><ScrollView contentContainerStyle={s.loginContent} keyboardShouldPersistTaps="handled">
    <Text style={s.brand}>ARENA ITINERANTE</Text><Text style={s.loginTitle}>Acesso da equipe</Text><Text style={s.loginSubtitle}>Entre para acompanhar a fila e os resultados.</Text>
    <View style={s.card}><Text style={s.label}>E-mail</Text><TextInput style={s.input} value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" accessibilityLabel="E-mail" />
      <Text style={s.label}>Senha</Text><TextInput style={s.input} value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" accessibilityLabel="Senha" onSubmitEditing={login} />
      {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}<Button title={busy ? 'Entrando...' : 'Entrar'} onPress={login} disabled={busy} /><Button title="Voltar ao formulário" secondary onPress={() => navigation.goBack()} disabled={busy} />
    </View></ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

function Chart({ title, options, values, total }) {
  return <View style={s.card}><Text style={s.cardTitle}>{title}</Text>{options.filter(([key]) => key !== 'unknown' || Number(values?.[key] || 0) > 0).map(([key, label]) => {
    const n = Number(values?.[key] || 0); const pct = total ? Math.round(n * 100 / total) : 0;
    return <View key={key} style={s.chartRow} accessibilityLabel={`${label}: ${n}, ${pct} por cento`}><View style={s.rowBetween}><Text style={s.body}>{label}</Text><Text style={s.bodyStrong}>{n} · {pct}%</Text></View><View style={s.track}><View style={[s.fill, { width: `${pct}%` }]} /></View></View>;
  })}</View>;
}

export function AdminPanelScreen({ navigation }) {
  const [people, setPeople] = useState([]); const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false); const [now, setNow] = useState(Date.now()); const [offset, setOffset] = useState(0);
  const [report, setReport] = useState(null); const [reportError, setReportError] = useState('');
  const [start, setStart] = useState(''); const [end, setEnd] = useState('');
  const refresh = useCallback(async () => {
    const { data, error } = await adminClient.rpc('panel_queue_action', { p_action: 'list', p_queue_id: null });
    if (error) { setConnected(false); return; }
    setPeople(data.entries || []); setOffset(Date.parse(data.server_time) - Date.now()); setConnected(true);
  }, []);
  const loadReport = useCallback(async (from, to) => {
    const validDate = (value) => { if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false; const d = new Date(`${value}T00:00:00Z`); return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value; };
    if ((from && !validDate(from)) || (to && !validDate(to)) || (from && to && from > to)) { setReportError('Use datas válidas no formato AAAA-MM-DD, com início anterior ao fim.'); return; }
    setReportError('Carregando resultados...'); setReport(null);
    const { data, error } = await adminClient.rpc('panel_form_analytics', { p_start: from || null, p_end: to || null });
    if (error) { setReportError('Não foi possível carregar os resultados.'); return; }
    setReport(data); setReportError(data.total ? '' : 'Nenhuma resposta concluída neste período.');
  }, []);
  useFocusEffect(useCallback(() => { let active = true; if (active) { refresh(); loadReport('', ''); } const poll = setInterval(refresh, 5000); const clock = setInterval(() => setNow(Date.now()), 1000); return () => { active = false; clearInterval(poll); clearInterval(clock); adminClient.auth.signOut({ scope: 'local' }); }; }, [refresh, loadReport]));
  async function action(name, id = null) {
    if (busy || !connected) return; setBusy(true);
    try { const { data, error } = await adminClient.rpc('panel_queue_action', { p_action: name, p_queue_id: id }); if (error || !data?.changed) Alert.alert('Fila', 'Não foi possível alterar a senha. A fila será atualizada.'); }
    catch (_) { Alert.alert('Conexão', 'Não foi possível concluir a operação.'); }
    finally { await refresh(); setBusy(false); }
  }
  const waiting = people.filter((p) => p.status === 'waiting'); const active = people.filter((p) => p.status === 'called' || p.status === 'playing');
  const counts = [['Na fila', waiting.length], ['Chamados', people.filter((p) => p.status === 'called').length], ['Jogando', people.filter((p) => p.status === 'playing').length], ['Finalizados', people.filter((p) => p.status === 'completed').length]];
  const ticket = (n) => `#${String(n).padStart(3, '0')}`;
  function remaining(p) { const deadline = Date.parse(p.status === 'called' ? p.expires_at : p.play_ends_at); if (!Number.isFinite(deadline)) return '—'; const seconds = Math.max(0, Math.ceil((deadline - now - offset) / 1000)); return seconds ? `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}` : 'Tempo encerrado'; }
  return <SafeAreaView style={s.panelSafe}><StatusBar style="dark" /><ScrollView contentContainerStyle={s.panel} keyboardShouldPersistTaps="handled">
    <View style={s.rowBetween}><Text style={s.brandDark}>ARENA ITINERANTE</Text><TouchableOpacity accessibilityRole="button" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] })}><Text style={s.link}>Sair</Text></TouchableOpacity></View>
    <Text accessibilityRole="header" style={s.title}>Painel do estande</Text><Text style={s.muted}>Acompanhe a fila e organize as partidas.</Text>
    <View style={s.notice}><Text style={s.bodyStrong}>{connected ? 'Fila conectada' : 'Fila indisponível'}</Text><Text style={s.muted}>{connected ? 'Atualização automática a cada 5 segundos.' : 'Confira a conexão e tente atualizar.'}</Text><Button title="Atualizar" secondary onPress={refresh} /></View>
    <View style={s.metrics}>{counts.map(([label, count]) => <View key={label} style={s.metric}><Text style={s.muted}>{label}</Text><Text style={s.number}>{count}</Text></View>)}</View>
    <View style={s.card}><Text style={s.cardTitle}>Fila de espera · {waiting.length}</Text><Text style={s.muted}>Uma fila para todos os jogos.</Text><Button title="Chamar próximo" onPress={() => action('call')} disabled={busy || !connected || !waiting.length || active.length >= 5} />
      {!waiting.length && <Text style={s.muted}>{connected ? 'Ninguém aguardando no momento.' : 'Aguardando conexão.'}</Text>}{waiting.map((p) => <View key={p.id} style={s.person}><Text style={s.bodyStrong}>{ticket(p.ticket_number)}  {p.participant_name}</Text><Text style={s.muted}>Espera: {Math.max(0, Math.floor((now + offset - Date.parse(p.joined_at)) / 60000))} min</Text></View>)}</View>
    <View style={s.card}><Text style={s.cardTitle}>Em atendimento · {active.length} / 5</Text>{!active.length && <Text style={s.muted}>Nenhuma pessoa em atendimento.</Text>}{active.map((p) => <View key={p.id} style={s.person}><View style={s.rowBetween}><Text style={s.bodyStrong}>{ticket(p.ticket_number)}  {p.participant_name}</Text><Text style={s.link}>{p.status === 'called' ? 'Chamado' : 'Jogando'}</Text></View><Text style={s.muted}>{p.status === 'called' ? 'Tempo para chegar' : 'Tempo de jogo'}: {remaining(p)}</Text><Button secondary title={p.status === 'called' ? 'Confirmar chegada' : 'Finalizar partida'} onPress={() => action(p.status === 'called' ? 'start' : 'finish', p.id)} disabled={busy || !connected} />{p.status === 'called' && <Button secondary title="Não compareceu" onPress={() => action('absent', p.id)} disabled={busy || !connected} />}</View>)}</View>
    <Text style={s.sectionTitle}>Resultados do formulário</Text><Text style={s.muted}>Respostas concluídas e sincronizadas. Sem filtro, inclui todos os períodos e testes.</Text>
    <View style={s.card}><Text style={s.label}>De (AAAA-MM-DD)</Text><TextInput style={s.input} value={start} onChangeText={setStart} placeholder="Ex.: 2026-11-01" accessibilityLabel="Data inicial, ano mês dia" /><Text style={s.label}>Até (AAAA-MM-DD)</Text><TextInput style={s.input} value={end} onChangeText={setEnd} placeholder="Ex.: 2026-11-30" accessibilityLabel="Data final, ano mês dia" /><Button title="Aplicar período" onPress={() => loadReport(start, end)} /><Button secondary title="Todo o período" onPress={() => { setStart(''); setEnd(''); loadReport('', ''); }} /></View>
    {!!reportError && <Text accessibilityLiveRegion="polite" style={s.muted}>{reportError}</Text>}{report && <><View style={s.metrics}><View style={s.metric}><Text style={s.muted}>Respostas concluídas</Text><Text style={s.number}>{report.total || 0}</Text></View><View style={s.metric}><Text style={s.muted}>Nota média</Text><Text style={s.number}>{report.rating_count ? `${Number(report.average_rating).toFixed(1).replace('.', ',')} / 5` : '—'}</Text><Text style={s.muted}>{report.rating_count || 0} avaliações</Text></View></View><Chart title="Faixa etária" options={ages} values={report.ages} total={Number(report.total)} /><Chart title="Interesse principal" options={intents} values={report.intents} total={Number(report.total)} /><Text style={s.muted}>Quem escolheu jogar e depois aprender permanece em “Quero jogar” nesta pergunta.</Text><Chart title="Avaliações" options={ratings} values={report.ratings} total={Number(report.rating_count)} /></>}
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#24132f' }, flex: { flex: 1 }, loginContent: { flexGrow: 1, justifyContent: 'center', padding: 24 }, brand: { color: '#d9c9e8', fontWeight: '800', letterSpacing: 1, marginBottom: 28 }, loginTitle: { color: '#fff', fontSize: 30, fontWeight: '800' }, loginSubtitle: { color: '#e0d4e9', marginTop: 8, marginBottom: 24 }, panelSafe: { flex: 1, backgroundColor: '#f7f5f2' }, panel: { padding: 20, paddingBottom: 48, maxWidth: 680, width: '100%', alignSelf: 'center' }, brandDark: { color: '#5f37ad', fontWeight: '800', letterSpacing: 1 }, title: { color: '#25172e', fontSize: 30, fontWeight: '800', marginTop: 24, marginBottom: 6 }, sectionTitle: { color: '#25172e', fontSize: 23, fontWeight: '800', marginTop: 20, marginBottom: 8 }, card: { backgroundColor: '#fff', borderRadius: 14, padding: 18, marginVertical: 10, borderWidth: 1, borderColor: '#e8e2e9' }, cardTitle: { color: '#25172e', fontWeight: '800', fontSize: 18, marginBottom: 8 }, label: { color: '#25172e', fontWeight: '700', marginBottom: 7, marginTop: 8 }, input: { minHeight: 50, borderWidth: 1, borderColor: '#d8cfdd', borderRadius: 9, paddingHorizontal: 12, marginBottom: 12, color: '#25172e', backgroundColor: '#fff' }, button: { minHeight: 48, backgroundColor: '#7650c9', borderRadius: 9, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, marginVertical: 5 }, secondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d8cfdd' }, disabled: { opacity: 0.45 }, buttonText: { color: '#fff', fontWeight: '800', textAlign: 'center' }, secondaryText: { color: '#5f37ad' }, error: { color: '#a31c37', marginBottom: 10 }, muted: { color: '#6e5c73', lineHeight: 20, fontSize: 13 }, body: { color: '#514356', fontSize: 13 }, bodyStrong: { color: '#25172e', fontWeight: '700', fontSize: 14 }, link: { color: '#6540ac', fontWeight: '800' }, notice: { backgroundColor: '#eee8fa', padding: 15, borderRadius: 12, marginTop: 20 }, metrics: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 10 }, metric: { width: '48.5%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e8e2e9', borderRadius: 12, padding: 15, marginBottom: 10 }, number: { fontSize: 25, fontWeight: '800', color: '#6540ac', marginTop: 5 }, rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }, person: { paddingVertical: 14, borderTopWidth: 1, borderColor: '#eeeaf0', gap: 7 }, chartRow: { marginTop: 15 }, track: { height: 9, borderRadius: 5, backgroundColor: '#eeeaf1', overflow: 'hidden', marginTop: 7 }, fill: { height: '100%', backgroundColor: '#7650c9', borderRadius: 5 } });
