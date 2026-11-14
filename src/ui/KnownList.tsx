import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { S } from '@/copy/strings';
import type { KnownRow } from '@/lib/insights';
import { EASE_OUT, STATE_MS } from '@/motion/tokens';
import { colors, space, type, FONT_CAP, TITLE_CAP } from '@/theme/tokens';
import { Tick } from './Chip';

const ROW_GAP_MS = 50;

// Spec 7.2: what the user has given so far. Rows are not tappable.
export function KnownList({ rows, delay }: { rows: KnownRow[]; delay: number }) {
  return (
    <View style={styles.wrap}>
      <Text maxFontSizeMultiplier={TITLE_CAP} accessibilityRole="header" style={type.label}>{S.known.title}</Text>
      {rows.map((r, i) => (
        <Row key={r.key} row={r} delay={delay + i * ROW_GAP_MS} />
      ))}
    </View>
  );
}

function Row({ row, delay }: { row: KnownRow; delay: number }) {
  const reduced = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withTiming(1, { duration: STATE_MS, easing: EASE_OUT }));
  }, [delay, p]);
  const rowStyle = useAnimatedStyle(() => ({ opacity: p.value }));
  const tickStyle = useAnimatedStyle(() => ({ transform: reduced ? [] : [{ scale: 0.9 + 0.1 * p.value }] }));
  return (
    <Animated.View style={[styles.row, rowStyle]}>
      <Animated.View style={tickStyle}>
        <Tick selected={row.given} />
      </Animated.View>
      <Text maxFontSizeMultiplier={FONT_CAP} style={[type.chip, styles.text]}>{row.text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.m },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  text: { flexShrink: 1, color: colors.ink },
});
