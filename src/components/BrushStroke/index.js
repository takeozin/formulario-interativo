import React, { useState } from 'react';
import { Animated } from 'react-native';
import { Clip, Stroke, TIP_SIZE, Tip, Track } from './styles';

// Pincelada da tela Name. Provisória: uma bolinha faz o papel do pincel e uma
// barra faz o da pincelada, até a arte ficar pronta. Quem usa passa os valores
// do useImpactAnimation: approach (0 a 1) é o pincel descendo até tocar o
// campo, e follow (0 a 1) é a pincelada atravessando. A vibração da
// pincelada dispara entre as duas fases, no instante do toque.
export default function BrushStroke({ approach, follow }) {
  const [width, setWidth] = useState(0);

  // Fase 1: o pincel aparece e desce até encostar no começo da pincelada.
  const tipY = approach.interpolate({ inputRange: [0, 1], outputRange: [0, 9] });
  // Fase 2: o pincel acompanha a pincelada até o fim e some.
  const tipX = follow.interpolate({ inputRange: [0, 1], outputRange: [0, Math.max(width - TIP_SIZE, 0)] });
  const tipOpacity = follow.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0] });
  const tipAppear = approach;
  const strokeX = follow.interpolate({ inputRange: [0, 1], outputRange: [-width, 0] });

  return (
    <Track
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Clip>
        <Stroke style={{ transform: [{ translateX: strokeX }] }} />
      </Clip>
      <Tip
        style={{
          opacity: Animated.multiply(tipAppear, tipOpacity),
          transform: [{ translateX: tipX }, { translateY: tipY }],
        }}
      />
    </Track>
  );
}
