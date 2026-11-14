import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { STATE_MS } from '@/motion/tokens';
import { OnboardingState, useOnboarding } from '@/state/onboarding';
import { colors, radius, shadow, size, type, FONT_CAP } from '@/theme/tokens';
import { Tick } from '@/ui/Chip';
import { haptic } from '@/ui/haptics';
import { PressableScale } from '@/ui/PressableScale';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

type CheckInTime = NonNullable<OnboardingState['checkInTime']>;

const TIMES: { id: CheckInTime; label: string; hint: string }[] = [
  { id: 'morning', label: S.commit.morning, hint: S.when.morningHint },
  { id: 'afternoon', label: S.commit.afternoon, hint: S.when.afternoonHint },
  { id: 'evening', label: S.commit.evening, hint: S.when.eveningHint },
];

// Screen 18 When (v3 R-04, R-16): the only place the check-in time is picked.
export default function When() {
  const { state, set } = useOnboarding();

  const pick = (id: CheckInTime) => {
    set({ checkInTime: id });
    track('answer', { screen: 'when', checkInTime: id });
  };

  return (
    <ScreenShell
      route="/when"
      footer={<PrimaryButton label={S.when.cta} disabled={!state.checkInTime} onPress={() => router.push(nextRoute('/when'))} testID="when-cta" />}>
      <Title>{S.when.q}</Title>
      <View style={styles.list}>
        {TIMES.map((t) => (
          <TimeRow key={t.id} label={t.label} hint={t.hint} selected={state.checkInTime === t.id} onPress={() => pick(t.id)} testID={`time-${t.id}`} />
        ))}
      </View>
    </ScreenShell>
  );
}

// OptionCard's look with a second line for the hint.
function TimeRow({ label, hint, selected, onPress, testID }: { label: string; hint: string; selected: boolean; onPress: () => void; testID: string }) {
  return (
    <PressableScale
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}, ${hint}`}
      onPress={() => {
        haptic.selection();
        onPress();
      }}
      style={[
        styles.card,
        shadow.card,
        {
          backgroundColor: selected ? colors.orangeFill : colors.surface,
          borderColor: selected ? colors.orangeBorder : colors.surface,
          transitionProperty: ['backgroundColor', 'borderColor'],
          transitionDuration: STATE_MS,
        } as object,
      ]}>
      <View style={styles.text}>
        <Text maxFontSizeMultiplier={FONT_CAP} style={type.label}>{label}</Text>
        <Text maxFontSizeMultiplier={FONT_CAP} style={styles.hint}>{hint}</Text>
      </View>
      <Tick selected={selected} big />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  list: { gap: 13 },
  card: {
    minHeight: size.card,
    marginHorizontal: 16,
    borderRadius: radius.card,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  text: { flex: 1, gap: 2 },
  hint: { ...type.subtitle, color: colors.inkSoft },
});
