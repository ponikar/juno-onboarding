import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { fill, S } from '@/copy/strings';
import { Segment, SEGMENTS } from '@/flow';
import { EASE_IN_OUT, PROGRESS_MS, STATE_MS } from '@/motion/tokens';
import { colors, type, FONT_CAP } from '@/theme/tokens';
import { Icon } from './Icon';

type Seg = Exclude<Segment, null>;

// The bar lives on each screen; remember the last value so the next screen grows from it.
let last: { fraction: number; label: string | null; part: string | null } = { fraction: 0, label: null, part: null };

function labelFor(seg: Seg, done: boolean) {
  if (done && seg === 'health') return S.seg.healthDone;
  if (done && seg === 'days') return S.seg.daysDone;
  return S.seg[seg];
}

// v3 R-07: part name left, "Part n of 7" right, a 6 pt bar below.
export function FlowBar({ seg, fraction, done, onSky }: { seg: Seg; fraction: number; done: boolean; onSky?: boolean }) {
  const reduced = useReducedMotion();
  const [prev] = useState(last);
  const label = labelFor(seg, done);
  const part = fill(S.flow.part, { n: SEGMENTS.indexOf(seg) + 1 });
  const barFill = onSky ? '#FFFFFF' : colors.orange;
  const track = onSky ? 'rgba(255,255,255,0.45)' : colors.track;
  const ink = onSky ? colors.skyText : colors.ink;
  const soft = onSky ? 'rgba(255,255,255,0.9)' : colors.inkSoft;
  const old = prev.label && prev.label !== label ? { label: prev.label, part: prev.part } : null;

  const w = useSharedValue(reduced ? fraction : prev.fraction);
  const swap = useSharedValue(old ? 0 : 1);
  useEffect(() => {
    last = { fraction, label, part };
    w.value = reduced ? fraction : withTiming(fraction, { duration: PROGRESS_MS, easing: EASE_IN_OUT });
    swap.value = withTiming(1, { duration: STATE_MS });
  }, [fraction, label, part, reduced, w, swap]);

  const barAnim = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  const inAnim = useAnimatedStyle(() => ({ opacity: swap.value }));
  const outAnim = useAnimatedStyle(() => ({ opacity: 1 - swap.value }));

  return (
    <View style={styles.wrap} accessibilityRole="progressbar" accessibilityLabel={`${label}, ${part}`} accessibilityValue={{ min: 0, max: 100, now: Math.round(fraction * 100) }}>
      <View>
        {old ? (
          <Animated.View style={[styles.row, styles.old, outAnim]}>
            <Text maxFontSizeMultiplier={FONT_CAP} style={[styles.label, styles.name, { color: ink }]}>{old.label}</Text>
            <Text maxFontSizeMultiplier={FONT_CAP} style={[styles.label, styles.part, { color: soft }]}>{old.part}</Text>
          </Animated.View>
        ) : null}
        <Animated.View style={[styles.row, inAnim]}>
          <View style={[styles.labelRow, styles.name]}>
            {done ? <Icon name="checkmark" size={13} color={ink} weight="bold" /> : null}
            <Text maxFontSizeMultiplier={FONT_CAP} style={[styles.label, { color: ink, flexShrink: 1 }]}>{label}</Text>
          </View>
          <Text maxFontSizeMultiplier={FONT_CAP} style={[styles.label, styles.part, { color: soft }]}>{part}</Text>
        </Animated.View>
      </View>
      <View style={[styles.bar, { backgroundColor: track }]}>
        <Animated.View style={[styles.barFill, { backgroundColor: barFill }, barAnim]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', gap: 6 },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  name: { flexShrink: 1 },
  part: { flexShrink: 1, textAlign: 'right' },
  old: { position: 'absolute', top: 0, left: 0, right: 0 },
  label: { ...type.subtitle, fontWeight: '600' },
  bar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },
});
