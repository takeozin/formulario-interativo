import * as Haptics from 'expo-haptics';

// Vibração leve ao selecionar uma opção. Se o aparelho não suportar,
// o app segue normalmente. Este arquivo também tem a vibração do
// corte e da pincelada (RF06 do DRDA).
export async function selectionFeedback() {
  try {
    await Haptics.selectionAsync();
  } catch (error) {
    // sem vibração disponível: ignora
  }
}

// Dispara e segue: não espera a vibração terminar (sem await), para não
// atrasar a animação nem a navegação. Se o aparelho não suportar, ignora.
function fireImpact(style) {
  try {
    Haptics.impactAsync(style).catch(() => {
      // sem vibração disponível: ignora
    });
  } catch (error) {
    // sem vibração disponível: ignora
  }
}

// Corte: impacto seco, no instante em que a lâmina cruza o alvo.
export function cutFeedback() {
  fireImpact(Haptics.ImpactFeedbackStyle.Rigid);
}

// Pincelada: impacto suave, no instante em que o pincel toca o pergaminho.
export function brushFeedback() {
  fireImpact(Haptics.ImpactFeedbackStyle.Soft);
}
