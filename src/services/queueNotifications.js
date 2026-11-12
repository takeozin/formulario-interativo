import * as Notifications from 'expo-notifications';
import { Platform, Vibration } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let permissionRequested = false;

export async function prepareQueueNotifications() {
  if (permissionRequested) {
    return;
  }

  permissionRequested = true;
  const current = await Notifications.getPermissionsAsync();
  if (!current.granted) {
    await Notifications.requestPermissionsAsync();
  }
}

export async function notifyQueueTurn({ name, ticketNumber }) {
  // No Android o padrão alterna pausas e vibrações; no iOS cada entrada é
  // uma pausa entre vibrações de duração definida pelo sistema.
  Vibration.vibrate(Platform.OS === 'ios' ? [0, 800, 800] : [0, 700, 300, 700, 300, 700]);
  try {
    await prepareQueueNotifications();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Sua vez de jogar!',
        body: `${name}, a senha ${ticketNumber} foi chamada. Você tem 5 minutos para chegar ao estande.`,
        sound: 'default',
      },
      trigger: null,
    });
  } catch (error) {
    // A fila continua funcionando mesmo quando o visitante bloqueia notificações.
    console.warn('[Soulstar] Não foi possível enviar a notificação da fila:', error);
  }
}
