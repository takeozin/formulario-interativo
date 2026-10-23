import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

const LENGTH = 150;

export default function SlashEffect({ trigger }) {
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!trigger.n) return;
    progress.value = 0;
    opacity.value = 1;
    progress.value = withTiming(1, { duration: 160 });
    opacity.value = withDelay(160, withTiming(0, { duration: 280 }));
  }, [trigger.n]);

  const lineStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ rotate: '-28deg' }, { scaleX: progress.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
    transform: [{ rotate: '-28deg' }, { scaleX: progress.value }],
  }));

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            left: trigger.x - LENGTH / 2,
            top: trigger.y - 7,
            width: LENGTH,
            height: 14,
            borderRadius: 7,
            backgroundColor: '#FFFFFF',
          },
          glowStyle,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            left: trigger.x - LENGTH / 2,
            top: trigger.y - 2,
            width: LENGTH,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#FFFFFF',
            shadowColor: '#FFFFFF',
            shadowOpacity: 1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 0 },
            elevation: 8,
          },
          lineStyle,
        ]}
      />
    </>
  );
}