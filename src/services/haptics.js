import * as Haptics from 'expo-haptics';

export async function selectionFeedback() {
  try {
    await Haptics.selectionAsync();
  } catch (error) {
    // sem vibração disponível: ignora
  }
}
