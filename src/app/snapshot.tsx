import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { fill, joinList, S } from '@/copy/strings';
import { useFlag } from '@/experiments/flags';
import { nextRoute } from '@/flow';
import { projection } from '@/lib/projection';
import { formatDate, fromISODate } from '@/lib/dates';
import { EASE_OUT, ENTER_FROM_SCALE, ENTER_MS, staggerAt } from '@/motion/tokens';
import { OnboardingState, useOnboarding } from '@/state/onboarding';
import { FONT_CAP } from '@/theme/tokens';
import { haptic } from '@/ui/haptics';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

function rows(s: OnboardingState, projected: boolean) {
  const symptom = s.todaySymptoms[0] ?? s.symptoms[0];
  return [
    {
      label: S.snapshot.rowConditions,
      value: s.conditions.length ? joinList(s.conditions) : s.seekingDiagnosis ? S.snapshot.seeking : S.snapshot.noConditions,
    },
    ...(s.todaySymptoms.length || s.todayEntry.trim()
      ? [
          {
            label: S.snapshot.rowToday,
            value: s.todaySymptoms.length ? joinList(s.todaySymptoms) : fill(S.snapshot.todayAsWritten, { entry: s.todayEntry.trim() }),
          },
        ]
      : []),
    { label: S.snapshot.rowMeds, value: s.medicines.length ? joinList(s.medicines) : S.snapshot.noMeds },
    ...(s.nextAppointment ? [{ label: S.snapshot.rowAppt, value: formatDate(fromISODate(s.nextAppointment)) }] : []),
    { label: S.snapshot.rowEnergy, value: s.energy !== null ? fill(S.snapshot.energyValue, { n: s.energy }) : S.snapshot.noEnergy },
    {
      label: null,
      // Experiment: a line computed from the appointment date (or 7 days) instead of the generic watch line.
      value: projected ? projection(s, new Date()).line : symptom ? fill(S.snapshot.watch, { symptom: symptom.toLowerCase() }) : S.snapshot.watchDefault,
    },
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

  const projected = useFlag('projection');
  const list = rows(state, projected);
  return (
    <ScreenShell
      variant="sky"
      route="/snapshot"
      footer={<PrimaryButton label={S.snapshot.cta} onPress={() => router.push(nextRoute('/snapshot'))} />}>
      <Title onSky>{name ? fill(S.snapshot.title, { name }) : S.snapshot.titleAnon}</Title>
      <Animated.View style={[styles.card, cardStyle]}>
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
    <Animated.View style={[styles.row, anim]}>
      {label ? <Text maxFontSizeMultiplier={FONT_CAP} style={styles.label}>{label}</Text> : null}
      <Text maxFontSizeMultiplier={FONT_CAP} style={label ? styles.value : styles.watch}>{value}</Text>
    </Animated.View>
  );
}

// Figma 55: each row is a glass pill on the sky.
const styles = StyleSheet.create({
  card: { marginHorizontal: 34, gap: 10 },
  row: {
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: 'rgba(40,104,190,0.92)', // near-solid blue: white text stays 4.5:1+ over the pale lower sky (A-02)
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 2,
  },
  label: { fontSize: 13, lineHeight: 17, fontWeight: '600', color: '#FFFFFF' },
  value: { fontSize: 16, lineHeight: 21, fontWeight: '600', color: '#FFFFFF' },
  watch: { fontSize: 16, lineHeight: 21, fontWeight: '600', color: '#FFFFFF' },
});
