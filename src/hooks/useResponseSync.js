import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { syncPendingResponses } from '../services/syncService';

// Sincroniza as respostas pendentes ao abrir o app e sempre que a internet
// volta (no evento a rede pode cair e voltar várias vezes).
export function useResponseSync() {
  // Último estado conhecido da internet (null = ainda não sabemos).
  const wasReachable = useRef(null);

  useEffect(() => {
    syncPendingResponses();

    const unsubscribe = NetInfo.addEventListener((state) => {
      // isInternetReachable, e não isConnected: o Wi-Fi do evento pode
      // conectar sem ter internet de verdade.
      const reachable = state.isInternetReachable;
      // null/undefined = ainda não verificado: não dispara nem esquece o
      // último estado conhecido.
      if (reachable == null) {
        return;
      }
      // Só a passagem de sem internet para com internet dispara o envio.
      if (wasReachable.current === false && reachable === true) {
        syncPendingResponses();
      }
      wasReachable.current = reachable;
    });

    return unsubscribe;
  }, []);
}
