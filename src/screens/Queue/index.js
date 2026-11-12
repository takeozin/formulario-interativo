import React, { useEffect, useMemo, useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import PrimaryButton from '../../components/PrimaryButton';
import { useForm } from '../../contexts/FormContext';
import { joinGameQueue, setGameQueueLearning } from '../../services/queueService';
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
const QUEUE_INTEGRATION_READY = false;

function formatTimer(milliseconds) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function QueueScreen({ navigation, route }) {
  const { answers, queue, setQueue, startQueuePolling } = useForm();
  const [loading, setLoading] = useState(!queue);
  const [error, setError] = useState('');
  const [now, setNow] = useState(Date.now());

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
        await prepareQueueNotifications();
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
  }, [answers.id, answers.name, queue?.accessToken, setQueue, startQueuePolling]);

  useEffect(() => {
    if (queue?.status !== 'called') {
      return undefined;
    }
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [queue?.status]);

  const remaining = useMemo(() => {
    if (!queue?.expiresAt) {
      return 0;
    }
    return new Date(queue.expiresAt).getTime() - now;
  }, [now, queue?.expiresAt]);

  function handleLearnToo() {
    if (queue?.accessToken) {
      setGameQueueLearning(queue.accessToken, true).catch((queueError) => {
        console.warn('[Soulstar] Não foi possível registrar o interesse em aprender:', queueError);
      });
      setQueue({ ...queue, wantsToLearn: true });
    }
  }

  function handleRetry() {
    setLoading(true);
    setError('');
    navigation.replace('Queue', route.params);
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

  return (
    <ScreenLayout
      step={4}
      onBack={() => navigation.goBack()}
      title={called ? 'É sua vez!' : expired ? 'Sua vaga expirou' : 'Você entrou na fila!'}
      subtitle={called ? 'Chegue ao estande antes do tempo acabar.' : 'Fique de olho: vamos avisar quando sua senha for chamada.'}
      footer={
        <FooterButtons>
          <PrimaryButton
            title={queue?.wantsToLearn ? 'Você também quer aprender' : 'Quero aprender também'}
            onPress={handleLearnToo}
            disabled={Boolean(queue?.wantsToLearn)}
            variant="secondary"
          />
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
        ) : expired ? (
          <Status>Peça uma nova senha à equipe do estande.</Status>
        ) : (
          <>
            <WaitingBadge>AGUARDANDO</WaitingBadge>
            <Status>{queue?.positionAhead ? `Ainda há ${queue.positionAhead} pessoa(s) antes de você.` : 'Você é o próximo da fila.'}</Status>
          </>
        )}
      </Card>
      <Hint>Não feche o aplicativo enquanto espera. Você pode bloquear o celular ou deixar o aplicativo em segundo plano.</Hint>
      <Hint>Cada rodada tem 20 minutos de jogo e até 5 minutos para o jogador chegar ao estande.</Hint>
    </ScreenLayout>
  );
}
