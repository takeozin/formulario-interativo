import React, { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { usePreventRemove } from '@react-navigation/native';
import ScreenLayout from '../../components/ScreenLayout';
import PrimaryButton from '../../components/PrimaryButton';
import { useForm } from '../../contexts/FormContext';
import { cancelGameQueue, joinGameQueue, setGameQueueLearning } from '../../services/queueService';
import { prepareQueueNotifications } from '../../services/queueNotifications';

import {
  Card,
  ErrorText,
  FooterButtons,
  Hint,
  Name,
  Number,
  NumberLabel,
  Status,
  Timer,
  WaitingBadge,
} from './style';

// A fila será habilitada após a revisão e teste da integração compartilhada.
const QUEUE_INTEGRATION_READY = process.env.EXPO_PUBLIC_QUEUE_ENABLED === 'true';

function formatTimer(milliseconds) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function QueueScreen({ navigation, route }) {
  const { answers, queue, setQueue, startQueuePolling } = useForm();
  const [loading, setLoading] = useState(!queue);
  const [error, setError] = useState('');
  const [learningError, setLearningError] = useState('');
  const [savingLearning, setSavingLearning] = useState(false);
  const [pendingExit, setPendingExit] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [now, setNow] = useState(Date.now());

  usePreventRemove(loading || ['waiting', 'called', 'playing'].includes(queue?.status), () => {
    if (loading || !queue?.accessToken) {
      Alert.alert('Aguarde', 'Estamos preparando sua inscrição na fila.');
      return;
    }
    if (queue.status === 'playing') {
      Alert.alert('Partida em andamento', 'Peça à equipe do estande para finalizar sua partida.');
      return;
    }
    Alert.alert('Sair da fila?', 'Sua senha será cancelada e o formulário será reiniciado.', [
      { text: 'Continuar na fila', style: 'cancel' },
      { text: 'Sair da fila', style: 'destructive', onPress: async () => {
        try {
          if (!(await cancelGameQueue(queue.accessToken))) throw new Error('QUEUE_CHANGED');
          setPendingExit(true);
          setQueue({ ...queue, status: 'abandoned' });
        } catch (_) {
          Alert.alert('Não foi possível sair', 'Confira sua conexão ou peça ajuda à equipe do estande.');
        }
      } },
    ]);
  });

  useEffect(() => {
    if (pendingExit && queue?.status === 'abandoned') {
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
      setPendingExit(null);
    }
  }, [navigation, pendingExit, queue?.status]);

  useEffect(() => {
    let active = true;

    async function enterQueue() {
      if (!QUEUE_INTEGRATION_READY) {
        setError('A fila ainda não está disponível. Peça ajuda à equipe do estande.');
        setLoading(false);
        return;
      }
      if (queue?.accessToken) {
        startQueuePolling();
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        try {
          await prepareQueueNotifications();
        } catch (_) {
          // A permissão de notificação não deve impedir a emissão da senha.
        }
        const entry = await joinGameQueue({
          sessionId: answers.id,
          name: answers.name,
        });

        if (!entry) {
          throw new Error('QUEUE_EMPTY_RESPONSE');
        }

        if (active) {
          setQueue(entry);
          startQueuePolling();
          setLoading(false);
        }
      } catch (joinError) {
        console.warn('[Soulstar] Não foi possível entrar na fila:', joinError);
        if (active) {
          setError('Não conseguimos emitir sua senha. Confira a conexão e tente novamente.');
          setLoading(false);
        }
      }
    }

    enterQueue();
    return () => {
      active = false;
    };
  }, [answers.id, answers.name, queue?.accessToken, retryCount, setQueue, startQueuePolling]);

  useEffect(() => {
    if (queue?.status !== 'called' && queue?.status !== 'playing') {
      return undefined;
    }
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [queue?.status]);

  const remaining = useMemo(() => {
    if (!queue?.expiresAt) {
      return 0;
    }
    return new Date(queue.expiresAt).getTime() - (now + (queue.clockOffset || 0));
  }, [now, queue?.expiresAt, queue?.clockOffset]);

  async function handleLearnToo() {
    if (!queue?.accessToken || savingLearning) return;
    setSavingLearning(true);
    setLearningError('');
    try {
      const updated = await setGameQueueLearning(queue.accessToken, true);
      if (!updated) throw new Error('QUEUE_NOT_FOUND');
      setQueue(updated);
    } catch (queueError) {
      setLearningError('Não conseguimos salvar seu interesse. Tente novamente.');
    } finally {
      setSavingLearning(false);
    }
  }

  function handleRetry() {
    setLoading(true);
    setError('');
    setRetryCount((value) => value + 1);
  }

  if (loading) {
    return (
      <ScreenLayout title="Preparando sua jornada..." subtitle="Estamos reservando seu lugar na fila." />
    );
  }

  if (error) {
    return (
      <ScreenLayout
        onBack={() => navigation.goBack()}
        title="A fila está temporariamente indisponível"
        subtitle="Sua resposta ainda não foi enviada para a fila de jogos."
        footer={<PrimaryButton title="Tentar novamente" onPress={handleRetry} />}
      >
        <ErrorText>{error}</ErrorText>
      </ScreenLayout>
    );
  }

  const called = queue?.status === 'called' && remaining > 0;
  const expired = queue?.status === 'expired' || (queue?.status === 'called' && remaining <= 0);
  const playing = queue?.status === 'playing';
  const completed = queue?.status === 'completed';
  const playRemaining = queue?.playEndsAt ? new Date(queue.playEndsAt).getTime() - (now + (queue.clockOffset || 0)) : 0;

  return (
    <ScreenLayout
      step={4}
      onBack={() => navigation.goBack()}
      title={called ? 'É sua vez!' : playing ? 'Hora de jogar!' : completed ? 'Partida finalizada!' : expired ? 'Sua vaga expirou' : 'Você entrou na fila!'}
      subtitle={called ? 'Chegue ao estande antes do tempo acabar.' : playing ? 'Aproveite sua partida no estande.' : completed ? 'Agora conte para a gente como foi sua experiência.' : expired ? 'Fale com a equipe do estande para receber orientações.' : 'Mantenha o app aberto e acompanhe sua senha.'}
      footer={
        <FooterButtons>
          {completed ? <PrimaryButton title="Continuar para o feedback" onPress={() => navigation.navigate('Feedback')} /> : (
            <PrimaryButton
              title={queue?.wantsToLearn ? 'Você também quer aprender' : 'Quero aprender também'}
              onPress={handleLearnToo}
              disabled={Boolean(queue?.wantsToLearn)}
              loading={savingLearning}
              variant="secondary"
            />
          )}
        </FooterButtons>
      }
    >
      <Card $called={called} $expired={expired}>
        <NumberLabel>Sua senha</NumberLabel>
        <Number>{queue?.ticketNumber ? String(queue.ticketNumber).padStart(2, '0') : '--'}</Number>
        <Name>{answers.name}</Name>
        {called ? (
          <>
            <WaitingBadge>CHAMADA</WaitingBadge>
            <Status>Você tem</Status>
            <Timer>{formatTimer(remaining)}</Timer>
            <Status>para chegar ao estande.</Status>
          </>
        ) : playing ? (
          <><WaitingBadge>JOGANDO</WaitingBadge><Status>Tempo de jogo restante</Status><Timer>{formatTimer(playRemaining)}</Timer></>
        ) : completed ? (
          <Status>Partida encerrada pela equipe.</Status>
        ) : expired ? (
          <Status>Peça uma nova senha à equipe do estande.</Status>
        ) : (
          <>
            <WaitingBadge>AGUARDANDO</WaitingBadge>
            <Status>{queue?.positionAhead ? `Ainda há ${queue.positionAhead} pessoa(s) antes de você.` : 'Você é o próximo da fila.'}</Status>
          </>
        )}
      </Card>
      {learningError ? <ErrorText accessibilityRole="alert">{learningError}</ErrorText> : null}
      <Hint>Para acompanhar a chamada, mantenha o aplicativo aberto. O aviso pode não chegar enquanto o celular estiver bloqueado ou o app em segundo plano.</Hint>
      <Hint>Cada rodada tem 20 minutos de jogo e até 5 minutos para o jogador chegar ao estande.</Hint>
    </ScreenLayout>
  );
}
