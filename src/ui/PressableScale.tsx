import { ReactNode } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { EASE_OUT, PRESS_MS, PRESS_SCALE } from '@/motion/tokens';

const APressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  scaleTo?: number;
};

// Press feedback for every pressable (plan section 8): scale to 0.97 in 120 ms; opacity only under reduced motion.
export function PressableScale({ style, children, scaleTo = PRESS_SCALE, onPressIn, onPressOut, disabled, ...rest }: Props) {
  const reduced = useReducedMotion();
  const p = useSharedValue(0);

  const anim = useAnimatedStyle(() =>
    reduced
      ? { opacity: 1 - p.value * 0.25 }
      : { transform: [{ scale: 1 - p.value * (1 - scaleTo) }] },
  );

  return (
    <APressable
      {...rest}
      disabled={disabled}
      hitSlop={rest.hitSlop ?? 6}
      onPressIn={(e) => {
        p.value = withTiming(1, { duration: PRESS_MS, easing: EASE_OUT });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        p.value = withTiming(0, { duration: PRESS_MS, easing: EASE_OUT });
        onPressOut?.(e);
      }}
      style={[style, anim]}>
      {children}
    </APressable>
  );
}
