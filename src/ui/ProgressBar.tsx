import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { EASE_IN_OUT, PROGRESS_MS } from '@/motion/tokens';
import { colors } from '@/theme/tokens';

const BAR_W = 40;
const ACTS = 4;

// The bar lives on each screen; remember the last value so the next screen grows from it.
let last = { act: 0, fraction: 0 };
const segValue = (i: number, act: number, fraction: number) => (i < act ? 1 : i === act ? fraction : 0);

// Figma's bar is segments joined by milestone dots. v0 has one segment per act (Try, Tell, See, Choose).
export function ProgressBar({ act, fraction, onSky }: { act: number; fraction: number; onSky?: boolean }) {
  const fill = onSky ? '#FFFFFF' : colors.orange;
  const track = onSky ? 'rgba(255,255,255,0.45)' : colors.track;
  const prev = last;
  useEffect(() => {
    last = { act, fraction };
  }, [act, fraction]);
  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: ACTS, now: act + fraction }}>
      {Array.from({ length: ACTS }).map((_, i) => (
        <View key={i} style={styles.group}>
          <Segment from={segValue(i, prev.act, prev.fraction)} value={segValue(i, act, fraction)} fill={fill} track={track} />
          <View style={[styles.dot, { backgroundColor: i < act ? fill : track }]} />
        </View>
      ))}
    </View>
  );
}

function Segment({ from, value, fill, track }: { from: number; value: number; fill: string; track: string }) {
  const reduced = useReducedMotion();
  const w = useSharedValue(reduced ? value : from);
  useEffect(() => {
    w.value = reduced ? value : withTiming(value, { duration: PROGRESS_MS, easing: EASE_IN_OUT });
  }, [value, reduced, w]);
  const anim = useAnimatedStyle(() => ({ width: w.value * BAR_W }));
  return (
    <View style={[styles.bar, { backgroundColor: track }]}>
      <Animated.View style={[styles.barFill, { backgroundColor: fill }, anim]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  group: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bar: { width: BAR_W, height: 7, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 7, borderRadius: 4 },
  dot: { width: 13, height: 13, borderRadius: 7 },
});
