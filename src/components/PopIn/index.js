import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { Wrapper } from './styles';

// Animação dos cartões de personagem: entram em sequência (index escalona a
// entrada) e o cartão escolhido dá um pequeno "pulo". Não tem vibração própria:
// quem vibra ao escolher é o OptionCard de dentro.
export default function PopIn({ index = 0, selected = false, children }) {
  const enter = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;
  const mounted = useRef(false);

  useEffect(() => {
    const entrance = Animated.timing(enter, {
      toValue: 1,
      duration: 280,
      delay: index * 90,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    entrance.start();
    return () => entrance.stop();
  }, [enter, index]);

  useEffect(() => {
    // Na primeira renderização não há "pulo", mesmo que o cartão já venha escolhido.
    if (!mounted.current) {
      mounted.current = true;
      return undefined;
    }
    if (!selected) {
      pop.setValue(1);
      return undefined;
    }
    const bounce = Animated.sequence([
      Animated.timing(pop, { toValue: 1.04, duration: 90, useNativeDriver: true }),
      Animated.spring(pop, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]);
    bounce.start();
    return () => bounce.stop();
  }, [selected, pop]);

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  return <Wrapper style={{ opacity: enter, transform: [{ translateY }, { scale: pop }] }}>{children}</Wrapper>;
}
