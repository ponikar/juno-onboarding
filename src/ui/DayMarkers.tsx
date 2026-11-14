import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { fill, S } from '@/copy/strings';
import { EASE_OUT } from '@/motion/tokens';
import { colors, FONT_CAP } from '@/theme/tokens';

const STAGGER_MS = 30;
const FADE_MS = 200;

// One marker per day until the appointment (or 7 days): today filled, the rest empty.
export function DayMarkers({ markers, more, label }: { markers: number; more: number; label: string }) {
  return (
    <View accessible accessibilityLabel={more > 0 ? `${label}, ${fill(S.projection.more, { n: more })}` : label}>
      <View style={styles.row}>
        {Array.from({ length: markers }, (_, i) => (
          <Marker key={i} index={i} today={i === 0} />
        ))}
        {more > 0 ? <Text maxFontSizeMultiplier={FONT_CAP} style={styles.more}>{fill(S.projection.more, { n: more })}</Text> : null}
      </View>
      <Text maxFontSizeMultiplier={FONT_CAP} style={styles.label}>{label}</Text>
    </View>
  );
}

function Marker({ index, today }: { index: number; today: boolean }) {
  const reduced = useReducedMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(index * STAGGER_MS, withTiming(1, { duration: FADE_MS, easing: EASE_OUT }));
  }, [index, t]);
  const style = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: today && !reduced ? [{ scale: 0.9 + 0.1 * t.value }] : [],
  }));
  return <Animated.View style={[styles.dot, today ? styles.filled : styles.empty, style]} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  filled: { backgroundColor: colors.orangeStrong },
  empty: { borderWidth: 1.5, borderColor: colors.radio },
  more: { fontSize: 13, lineHeight: 17, color: colors.muted, marginLeft: 2 },
  label: { fontSize: 13, lineHeight: 17, color: colors.muted, marginTop: 6 },
});
