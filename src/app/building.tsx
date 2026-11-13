import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { fill, joinList, S } from '@/copy/strings';
import { formatDate, fromISODate } from '@/lib/dates';
import { EASE_OUT, ENTER_FROM_SCALE, ENTER_MS } from '@/motion/tokens';
import { OnboardingState, useOnboarding } from '@/state/onboarding';
import { colors, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { ScreenShell } from '@/ui/ScreenShell';

const ITEM_GAP_MS = 700;
const TOTAL_MS = 4000;

function items(s: OnboardingState) {
  const name = s.name.trim();
  const today = s.todaySymptoms.length ? joinList(s.todaySymptoms.map((x) => x.toLowerCase())) : s.todayEntry.trim();
  return [
    name ? fill(S.building.name, { name }) : S.building.nameAnon,
    s.conditions.length ? fill(S.building.conditions, { list: joinList(s.conditions) }) : S.building.seeking,
    today ? fill(S.building.symptoms, { list: today }) : null,
    s.medicines.length ? fill(S.building.medicines, { list: joinList(s.medicines) }) : S.building.noMeds,
    s.nextAppointment ? fill(S.building.appt, { date: formatDate(fromISODate(s.nextAppointment)) }) : S.building.noAppt,
  ].filter((x): x is string => !!x);
}

// Screen 14 (from Figma 54 analyzing). Shows the user's real answers one by one, then moves on.
export default function Building() {
  const { state } = useOnboarding();
  const list = items(state);

  useEffect(() => {
    const t = setTimeout(() => router.replace('/snapshot'), TOTAL_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <ScreenShell variant="sky" route="/building" back={false} scroll={false}>
      <View style={styles.head} accessibilityLiveRegion="polite">
        <ActivityIndicator color={colors.skyText} />
        <Text accessibilityRole="header" style={[styles.title, shadow.titleSky]}>{S.building.title}</Text>
      </View>
      <View style={styles.list}>
        {list.map((text, i) => (
          <Item key={i} text={text} delay={i * ITEM_GAP_MS} />
        ))}
      </View>
    </ScreenShell>
  );
}

function Item({ text, delay }: { text: string; delay: number }) {
  const reduced = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withTiming(1, { duration: ENTER_MS, easing: EASE_OUT }));
  }, [delay, p]);
  const anim = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: reduced ? [] : [{ scale: ENTER_FROM_SCALE + (1 - ENTER_FROM_SCALE) * p.value }],
  }));
  return (
    <Animated.View style={[styles.item, anim]}>
      <Icon name="checkmark" size={14} color={colors.skyText} weight="bold" />
      <Text style={styles.itemText}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20, paddingHorizontal: 24 },
  title: { fontSize: 16, lineHeight: 21, fontWeight: '600', color: colors.skyText },
  list: { marginTop: 44, gap: 14, paddingHorizontal: 40 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(255,236,200,0.7)',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  itemText: { flex: 1, fontSize: 17, lineHeight: 22, fontWeight: '600', color: colors.skyText },
});
