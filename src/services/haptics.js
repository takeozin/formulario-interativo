import * as Haptics from 'expo-haptics';

// Vibração leve ao selecionar uma opção. Se o aparelho não suportar,
// o app segue normalmente. Na fase 2 este arquivo ganha a vibração do
// corte e da pincelada (RF06 do DRDA).
export async function selectionFeedback() {
  try {
    await Haptics.selectionAsync();
  } catch (error) {
    // sem vibração disponível: ignora
  }
}
