import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';

const images = {
  masculino: require('../../assets/ninja/ninja-masculino.jpeg'),
  feminino: require('../../assets/ninja/ninja-feminino.jpeg'),
};

const NinjaAnimation = forwardRef(function NinjaAnimation(
  { gender = 'masculino', size = 200, idle = true },
  ref
) {
  const rotate = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (idle) {
      translateY.value = withRepeat(
        withSequence(withTiming(-8, { duration: 700 }), withTiming(0, { duration: 700 })),
        -1
      );
    }
  }, [idle]);

  useImperativeHandle(ref, () => ({
    corte: () => {
      rotate.value = withSequence(
        withTiming(-25, { duration: 100 }),
        withTiming(25, { duration: 120 }),
        withTiming(0, { duration: 150 })
      );
    },
    pulo: () => {
      translateY.value = withSequence(
        withTiming(-40, { duration: 200 }),
        withTiming(0, { duration: 200 })
      );
    },
  }));

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.Image
      source={images[gender]}
      style={[{ width: size, height: size, resizeMode: 'contain' }, style]}
    />
  );
});

export default NinjaAnimation;