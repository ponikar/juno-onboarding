import { ReactNode, useEffect, useRef } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { EASE_OUT, POP_FROM, PRESS_MS, PRESS_SCALE, SPRING_POP } from '@/motion/tokens';

const APressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  scaleTo?: number;
  selected?: boolean; // pops 0.96 -> 1 when it turns true
};

// Press feedback for every pressable: scale to 0.97 in 120 ms; opacity only under reduced motion.
export function PressableScale({ style, children, scaleTo = PRESS_SCALE, selected, onPressIn, onPressOut, disabled, ...rest }: Props) {
  const reduced = useReducedMotion();
  const p = useSharedValue(0);
  const pop = useSharedValue(1);
  const wasSelected = useRef(selected);

  useEffect(() => {
    if (selected && !wasSelected.current && !reduced) {
      pop.value = POP_FROM;
      pop.value = withSpring(1, SPRING_POP);
    }
    wasSelected.current = selected;
  }, [selected, reduced, pop]);

  const anim = useAnimatedStyle(() =>
    reduced
      ? { opacity: 1 - p.value * 0.25 }
      : { transform: [{ scale: (1 - p.value * (1 - scaleTo)) * pop.value }] },
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
