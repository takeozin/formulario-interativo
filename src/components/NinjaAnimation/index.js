import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { NinjaImage } from './styles';

// Imagens provisórias dos ninjas, até a arte final ficar pronta.
const IMAGES = {
  ninja_male: require('../../../assets/ninja/ninja-masculino.jpeg'),
  ninja_female: require('../../../assets/ninja/ninja-feminino.jpeg'),
};

// Ninja da tela Character. O escolhido flutua devagar; ao trocar de escolha,
// o anterior para e volta ao lugar. O "pulo" da escolha fica com o PopIn.
export default function NinjaAnimation({ avatar, size = 120, idle = false }) {
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!idle) {
      float.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -8, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => {
      loop.stop();
      float.setValue(0);
    };
  }, [idle, float]);

  if (!IMAGES[avatar]) {
    return null;
  }

  return (
    <NinjaImage
      source={IMAGES[avatar]}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
      style={{ width: size, height: size, transform: [{ translateY: float }] }}
    />
  );
}
