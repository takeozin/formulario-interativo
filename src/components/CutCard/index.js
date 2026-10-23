import React, { useState } from 'react';
import { Animated } from 'react-native';
import OptionCard from '../OptionCard';
import { useImpactAnimation } from '../../hooks/useImpactAnimation';
import { cutFeedback } from '../../services/haptics';
import { Blade, Clip, Wrapper } from './styles';

// Cartão de escolha com o corte (estilo Fruit Ninja): ao escolher uma opção
// nova, uma lâmina atravessa o cartão. A vibração do corte dispara quando a
// lâmina chega ao centro, que é o instante do corte. Por isso o OptionCard
// de dentro não vibra sozinho (feedback=false): cada escolha vibra uma vez só.
// Provisório: a lâmina é uma barra inclinada, até a arte ficar pronta.
export default function CutCard({ label, selected = false, onPress }) {
  const [width, setWidth] = useState(0);
  const { approach, follow, play } = useImpactAnimation({ approachMs: 140, followMs: 240 });

  function handlePress() {
    const isNewChoice = !selected;
    onPress();
    if (isNewChoice) {
      play({ onImpact: cutFeedback });
    }
  }

  // A lâmina entra pela esquerda até o centro (fase 1) e sai pela direita (fase 2).
  const travel = width * 1.2;
  const bladeX = Animated.add(
    approach.interpolate({ inputRange: [0, 1], outputRange: [-travel, 0] }),
    follow.interpolate({ inputRange: [0, 1], outputRange: [0, travel] })
  );
  const bladeOpacity = follow.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  // O cartão "encolhe" no instante do corte e volta ao tamanho normal.
  const cardScale = follow.interpolate({ inputRange: [0, 0.25, 1], outputRange: [1, 0.94, 1] });

  return (
    <Wrapper onLayout={(event) => setWidth(event.nativeEvent.layout.width)} style={{ transform: [{ scale: cardScale }] }}>
      <OptionCard label={label} selected={selected} feedback={false} onPress={handlePress} />
      <Clip
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Blade style={{ opacity: bladeOpacity, transform: [{ translateX: bladeX }, { rotate: '-20deg' }] }} />
      </Clip>
    </Wrapper>
  );
}
