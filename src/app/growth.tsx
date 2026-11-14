import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { addDays, daysUntil, formatDate, fromISODate } from '@/lib/dates';
import { meterFor } from '@/lib/meter';
import { EASE_OUT } from '@/motion/tokens';
import { useOnboarding } from '@/state/onboarding';
import { colors, FONT_CAP } from '@/theme/tokens';
import { haptic } from '@/ui/haptics';
import { Icon } from '@/ui/Icon';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

const CHART_H = 220;
const START_MS = 350;
const STEP_MS = 260;
const GROW_MS = 380;

// Entries by the appointment (N + 1), or 7 for a week when there is none: only numbers the user gave us.
function plan(nextAppointment: string | null, today: Date) {
  const n = nextAppointment ? daysUntil(nextAppointment, today) : null;
  const total = n !== null && n >= 1 ? n + 1 : 7;
  const end = n !== null && n >= 1 ? fromISODate(nextAppointment!) : addDays(today, 6);
  const points = [...new Set([1, Math.ceil(total / 3), Math.ceil((2 * total) / 3), total])].sort((a, b) => a - b);
  return { total, endLabel: formatDate(end), points };
}

// The Juno app's evolving graph, charting what one line a day builds: entries on the doctor page.
// Bars grow in turn with a selection tick each, then one success when the last lands.
export default function Growth() {
  const { state } = useOnboarding();
  const reduced = useReducedMotion();
  const today = useMemo(() => new Date(), []);
  const { total, endLabel, points } = plan(state.nextAppointment, today);
  const forecast = meterFor(state, 'routine', today).forecast;

  useEffect(() => {
    if (reduced) {
      haptic.success();
      return;
    }
    const timers = points.map((_, i) =>
      setTimeout(i === points.length - 1 ? haptic.success : haptic.selection, START_MS + i * STEP_MS + GROW_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [reduced, points]);

  return (
    <ScreenShell
      route="/growth"
      scroll={false}
      footer={<PrimaryButton label={S.card.cta} onPress={() => router.push(nextRoute('/growth'))} />}>
      <Title>{S.growth.title}</Title>
      <View style={styles.chartWrap} accessible accessibilityLabel={`${S.growth.yAxis}: ${forecast}`}>
        <View style={styles.yHead}>
          <Icon name="arrowtriangle.up.fill" size={10} color={colors.ink} />
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.axisLabel}>{S.growth.yAxis}</Text>
        </View>
        <View style={styles.plot}>
          <View style={styles.yAxis} />
          <View style={styles.bars}>
            {points.map((v, i) => (
              <Bar key={v} index={i} value={v} total={total} first={i === 0} reduced={reduced} />
            ))}
          </View>
        </View>
        <View style={styles.xAxis}>
          <View style={styles.xLine} />
          <Icon name="arrowtriangle.right.fill" size={10} color={colors.ink} />
        </View>
        <View style={styles.xLabels}>
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.axisLabel}>{S.growth.today}</Text>
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.axisLabel}>{endLabel}</Text>
        </View>
      </View>
      <Text maxFontSizeMultiplier={FONT_CAP} style={styles.forecast}>{forecast}</Text>
    </ScreenShell>
  );
}

function Bar({ index, value, total, first, reduced }: { index: number; value: number; total: number; first: boolean; reduced: boolean }) {
  const grow = useSharedValue(reduced ? 1 : 0);
  const pulse = useSharedValue(1);
  useEffect(() => {
    if (reduced) return;
    grow.value = withDelay(START_MS + index * STEP_MS, withTiming(1, { duration: GROW_MS, easing: EASE_OUT }));
    if (first)
      pulse.value = withDelay(
        START_MS + GROW_MS,
        withRepeat(withSequence(withTiming(1.18, { duration: 700, easing: Easing.inOut(Easing.sin) }), withTiming(1, { duration: 700, easing: Easing.inOut(Easing.sin) })), -1),
      );
  }, [reduced, index, first, grow, pulse]);

  const height = Math.max(14, (value / total) * (CHART_H - 40));
  const barStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: grow.value }] }));
  const topStyle = useAnimatedStyle(() => ({ opacity: grow.value }));
  const dotStyle = useAnimatedStyle(() => ({ opacity: grow.value, transform: [{ scale: pulse.value }] }));

  return (
    <View style={styles.col}>
      <Animated.View style={[styles.top, topStyle]}>
        {first ? (
          <Animated.View style={[styles.dot, dotStyle]} />
        ) : (
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.count}>{value}</Text>
        )}
      </Animated.View>
      <Animated.View style={[styles.bar, first && styles.barFirst, { height }, barStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrap: { marginHorizontal: 24, marginTop: 28 },
  yHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: -4, marginBottom: 6 },
  plot: { height: CHART_H, flexDirection: 'row' },
  yAxis: { width: 2, backgroundColor: colors.ink, borderRadius: 1 },
  bars: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingHorizontal: 8 },
  col: { alignItems: 'center', justifyContent: 'flex-end' },
  top: { height: 30, justifyContent: 'center', alignItems: 'center' },
  count: { fontSize: 15, lineHeight: 20, fontWeight: '700', color: colors.ink },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.success },
  bar: { width: 10, borderRadius: 5, backgroundColor: colors.orangeBorder, transformOrigin: 'bottom' },
  barFirst: { backgroundColor: colors.orange },
  xAxis: { flexDirection: 'row', alignItems: 'center' },
  xLine: { flex: 1, height: 2, backgroundColor: colors.ink, borderRadius: 1 },
  xLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingLeft: 18, paddingRight: 12 },
  axisLabel: { fontSize: 14, lineHeight: 18, fontWeight: '600', color: colors.inkSoft },
  forecast: { marginTop: 24, marginHorizontal: 24, fontSize: 17, lineHeight: 23, fontWeight: '600', color: colors.ink, textAlign: 'center' },
});
