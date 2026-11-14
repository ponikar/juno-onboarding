import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { S } from '@/copy/strings';
import { Segment } from '@/flow';
import { EASE_IN_OUT, PROGRESS_MS, STATE_MS } from '@/motion/tokens';
import { colors, type, FONT_CAP } from '@/theme/tokens';
import { Icon } from './Icon';

type Seg = Exclude<Segment, null>;

// The bar lives on each screen; remember the last value so the next screen grows from it.
let last: { fraction: number; label: string | null } = { fraction: 0, label: null };

function labelFor(seg: Seg, done: boolean) {
  if (done && seg === 'health') return S.seg.healthDone;
  if (done && seg === 'days') return S.seg.daysDone;
  return S.seg[seg];
}

// Spec 7.1: segment label above a thin full-width bar.
export function FlowBar({ seg, fraction, done, onSky }: { seg: Seg; fraction: number; done: boolean; onSky?: boolean }) {
  const reduced = useReducedMotion();
  const [prev] = useState(last);
  const label = labelFor(seg, done);
  const fill = onSky ? '#FFFFFF' : colors.orange;
  const track = onSky ? 'rgba(255,255,255,0.45)' : colors.track;
  const ink = onSky ? colors.skyText : colors.ink;
  const oldLabel = prev.label && prev.label !== label ? prev.label : null;

  const w = useSharedValue(reduced ? fraction : prev.fraction);
  const swap = useSharedValue(oldLabel ? 0 : 1);
  useEffect(() => {
    last = { fraction, label };
    w.value = reduced ? fraction : withTiming(fraction, { duration: PROGRESS_MS, easing: EASE_IN_OUT });
    swap.value = withTiming(1, { duration: STATE_MS });
  }, [fraction, label, reduced, w, swap]);

  const barAnim = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  const inAnim = useAnimatedStyle(() => ({ opacity: swap.value }));
  const outAnim = useAnimatedStyle(() => ({ opacity: 1 - swap.value }));

  return (
    <View style={styles.wrap} accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: 100, now: Math.round(fraction * 100) }}>
      <View>
        {oldLabel ? (
          <Animated.View style={[styles.labelRow, styles.old, outAnim]}>
            <Text maxFontSizeMultiplier={FONT_CAP} numberOfLines={1} style={[styles.label, { color: ink }]}>{oldLabel}</Text>
          </Animated.View>
        ) : null}
        <Animated.View style={[styles.labelRow, inAnim]}>
          {done ? <Icon name="checkmark" size={11} color={ink} weight="bold" /> : null}
          <Text maxFontSizeMultiplier={FONT_CAP} numberOfLines={1} style={[styles.label, { color: ink }]}>{label}</Text>
        </Animated.View>
      </View>
      <View style={[styles.bar, { backgroundColor: track }]}>
        <Animated.View style={[styles.barFill, { backgroundColor: fill }, barAnim]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', gap: 5 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  old: { position: 'absolute', top: 0, left: 0, right: 0 },
  label: { ...type.small, fontWeight: '600', flexShrink: 1 },
  bar: { height: 3, borderRadius: 1.5, overflow: 'hidden' },
  barFill: { height: 3, borderRadius: 1.5 },
});
