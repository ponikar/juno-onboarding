import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { colors } from '@/theme/tokens';

// Juno's typing indicator: three dots rising in turn. Callers skip it under reduced motion.
export function TypingDots({ color = colors.muted }: { color?: string }) {
  return (
    <View style={styles.row} accessibilityLabel="Juno is typing">
      {[0, 1, 2].map((i) => (
        <Dot key={i} index={i} color={color} />
      ))}
    </View>
  );
}

function Dot({ index, color }: { index: number; color: string }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      index * 120,
      withRepeat(withSequence(withTiming(1, { duration: 260, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: 260, easing: Easing.in(Easing.quad) })), -1),
    );
  }, [index, t]);
  const anim = useAnimatedStyle(() => ({ opacity: 0.4 + 0.6 * t.value, transform: [{ translateY: -3 * t.value }] }));
  return <Animated.View style={[styles.dot, { backgroundColor: color }, anim]} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 5, paddingVertical: 6, paddingHorizontal: 2 },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
});
