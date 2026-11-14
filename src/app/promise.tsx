import { router } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { EASE_OUT } from '@/motion/tokens';
import { OnboardingState, useOnboarding } from '@/state/onboarding';
import { mascotPeekSky } from '@/ui/art';
import { Chip } from '@/ui/Chip';
import { haptic } from '@/ui/haptics';
import { JunoReply } from '@/ui/JunoReply';
import { OptionCard } from '@/ui/OptionCard';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

type Commitment = NonNullable<OnboardingState['commitment']>;
type CheckInTime = NonNullable<OnboardingState['checkInTime']>;

const OPTIONS: { id: Commitment; label: string }[] = [
  { id: 'most_days', label: S.commit.optMost },
  { id: 'good_days', label: S.commit.optGood },
  { id: 'unsure', label: S.commit.optUnsure },
];
const TIMES: { id: CheckInTime; label: string }[] = [
  { id: 'morning', label: S.commit.morning },
  { id: 'afternoon', label: S.commit.afternoon },
  { id: 'evening', label: S.commit.evening },
];
const NOD_MS = 150;

// Screen 17 (from Figma 45 support-circle, the single-select layout): one line a day, and when.
export default function SmallPromise() {
  const { state, set } = useOnboarding();
  const reduced = useReducedMotion();
  const picked = useRef(state.commitment !== null);
  const nod = useSharedValue(0);
  const nodStyle = useAnimatedStyle(() => ({ transform: [{ translateY: nod.value }] }));
  const unsure = state.commitment === 'unsure';

  const pick = (id: Commitment) => {
    set(id === 'unsure' ? { commitment: id, checkInTime: null } : { commitment: id });
    track('answer', { screen: 'promise', commitment: id });
    if (!picked.current) {
      picked.current = true;
      haptic.success();
    }
    if (!reduced) nod.set(withSequence(withTiming(6, { duration: NOD_MS, easing: EASE_OUT }), withTiming(0, { duration: NOD_MS, easing: EASE_OUT })));
  };

  return (
    <ScreenShell
      route="/promise"
      footer={
        <PrimaryButton
          label={unsure ? S.card.cta : S.commit.cta}
          disabled={!state.commitment}
          onPress={() => router.push(nextRoute('/promise'))}
        />
      }>
      <Animated.Image source={mascotPeekSky} style={[styles.mascot, nodStyle]} resizeMode="contain" accessibilityIgnoresInvertColors />
      <Title why={S.commit.sub}>{S.commit.q}</Title>
      <View style={styles.list}>
        {OPTIONS.map((o) => (
          <OptionCard key={o.id} testID={`commit-${o.id}`} label={o.label} multi={false} selected={state.commitment === o.id} onPress={() => pick(o.id)} />
        ))}
      </View>
      {state.commitment && !unsure ? (
        <View style={styles.when}>
          <Title>{S.commit.whenQ}</Title>
          <View style={styles.times}>
            {TIMES.map((t) => (
              <Chip
                key={t.id}
                testID={`time-${t.id}`}
                label={t.label}
                selected={state.checkInTime === t.id}
                onToggle={() => {
                  set({ checkInTime: t.id });
                  track('answer', { screen: 'promise', checkInTime: t.id });
                }}
              />
            ))}
          </View>
        </View>
      ) : null}
      <JunoReply text={state.commitment ? (unsure ? S.commit.replyUnsure : S.commit.reply) : null} id={unsure ? 'unsure' : 'yes'} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  mascot: { alignSelf: 'center', width: 120, height: 90, marginTop: 12, marginBottom: -18 },
  list: { gap: 13, marginBottom: 8 },
  when: { marginTop: -12 },
  times: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, paddingHorizontal: 8, marginBottom: 20 },
});
