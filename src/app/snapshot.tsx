import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { fill, joinList, S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { EASE_OUT, ENTER_FROM_SCALE, ENTER_MS, staggerAt } from '@/motion/tokens';
import { OnboardingState, useOnboarding } from '@/state/onboarding';
import { colors, radius, shadow } from '@/theme/tokens';
import { haptic } from '@/ui/haptics';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

function rows(s: OnboardingState) {
  const symptom = s.todaySymptoms[0] ?? s.symptoms[0];
  return [
    {
      label: S.snapshot.rowConditions,
      value: s.conditions.length ? joinList(s.conditions) : s.seekingDiagnosis ? S.snapshot.seeking : S.snapshot.noConditions,
    },
    {
      label: S.snapshot.rowToday,
      value: s.todaySymptoms.length ? joinList(s.todaySymptoms) : fill(S.snapshot.todayAsWritten, { entry: s.todayEntry.trim() }),
    },
    { label: S.snapshot.rowMeds, value: s.medicines.length ? joinList(s.medicines) : S.snapshot.noMeds },
    { label: S.snapshot.rowEnergy, value: s.energy !== null ? fill(S.snapshot.energyValue, { n: s.energy }) : S.snapshot.noEnergy },
    { label: null, value: symptom ? fill(S.snapshot.watch, { symptom: symptom.toLowerCase() }) : S.snapshot.watchDefault },
  ];
}

// Screen 15 (from Figma 55 journey-ready). Delight: the card settles in, rows follow.
export default function Snapshot() {
  const { state } = useOnboarding();
  const reduced = useReducedMotion();
  const card = useSharedValue(0);
  const name = state.name.trim();

  useEffect(() => {
    card.value = withTiming(1, { duration: ENTER_MS, easing: EASE_OUT });
    haptic.success();
  }, [card]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: card.value,
    transform: reduced ? [] : [{ scale: ENTER_FROM_SCALE + (1 - ENTER_FROM_SCALE) * card.value }],
  }));

  const list = rows(state);
  return (
    <ScreenShell
      variant="sky"
      route="/snapshot"
      footer={<PrimaryButton label={S.snapshot.cta} onPress={() => router.push(nextRoute('/snapshot'))} />}>
      <Title onSky sub={S.snapshot.sub}>{name ? fill(S.snapshot.title, { name }) : S.snapshot.titleAnon}</Title>
      <Animated.View style={[styles.card, shadow.card, cardStyle]}>
        {list.map((r, i) => (
          <Row key={i} label={r.label} value={r.value} index={i} last={i === list.length - 1} />
        ))}
      </Animated.View>
    </ScreenShell>
  );
}

function Row({ label, value, index, last }: { label: string | null; value: string; index: number; last: boolean }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(staggerAt(index), withTiming(1, { duration: ENTER_MS, easing: EASE_OUT }));
  }, [index, p]);
  const anim = useAnimatedStyle(() => ({ opacity: p.value }));
  return (
    <Animated.View style={[styles.row, !last && styles.divider, anim]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Text style={label ? styles.value : styles.watch}>{value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 22, borderRadius: radius.card, backgroundColor: colors.surface, paddingHorizontal: 22, paddingVertical: 6 },
  row: { paddingVertical: 14, gap: 3 },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.hairline },
  label: { fontSize: 13, lineHeight: 17, fontWeight: '600', color: colors.muted },
  value: { fontSize: 17, lineHeight: 22, fontWeight: '500', color: colors.ink },
  watch: { fontSize: 16, lineHeight: 21, fontWeight: '500', color: colors.inkSoft },
});
