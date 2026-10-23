import { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Animação em duas fases com um "momento do impacto" entre elas.
// Fase 1 (approach, 0 a 1): a lâmina ou o pincel chega ao ponto de contato.
// Quando a fase 1 termina, onImpact roda (é aqui que a vibração dispara) e só
// então começa a fase 2 (follow, 0 a 1): o movimento continua normalmente.
// As duas fases usam o driver nativo, então não dependem da thread do JS, e
// quem chama nunca espera a vibração (sem await).
export function useImpactAnimation({ approachMs = 140, followMs = 240 } = {}) {
  const approach = useRef(new Animated.Value(0)).current;
  const follow = useRef(new Animated.Value(0)).current;
  const runId = useRef(0);
  const active = useRef(null);

  // Invalida os callbacks da execução atual: uma animação interrompida
  // (nova execução, saída da tela) não vibra nem chama onDone.
  const stop = useCallback(() => {
    runId.current += 1;
    if (active.current) {
      active.current.stop();
      active.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    approach.setValue(0);
    follow.setValue(0);
  }, [stop, approach, follow]);

  const play = useCallback(
    ({ onImpact, onDone } = {}) => {
      reset();
      const id = runId.current;

      const toContact = Animated.timing(approach, {
        toValue: 1,
        duration: approachMs,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      });
      active.current = toContact;

      toContact.start(({ finished }) => {
        if (!finished || id !== runId.current) {
          return;
        }
        if (onImpact) {
          onImpact();
        }

        const afterContact = Animated.timing(follow, {
          toValue: 1,
          duration: followMs,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        });
        active.current = afterContact;

        afterContact.start(({ finished: done }) => {
          if (!done || id !== runId.current) {
            return;
          }
          active.current = null;
          if (onDone) {
            onDone();
          }
        });
      });
    },
    [reset, approach, follow, approachMs, followMs]
  );

  // Ao sair da tela, para a animação em andamento.
  useEffect(() => stop, [stop]);

  return { approach, follow, play, reset };
}
