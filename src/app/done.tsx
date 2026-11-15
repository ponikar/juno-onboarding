import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { S } from '@/copy/strings';
import { EASE_OUT, SPRING_SETTLE } from '@/motion/tokens';
import { useOnboarding } from '@/state/onboarding';
import { colors, type, FONT_CAP } from '@/theme/tokens';
import { bg } from '@/ui/art';
import { haptic } from '@/ui/haptics';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell } from '@/ui/ScreenShell';

// From 64 subscribe-success / free variant: no mascot, as in Figma; the welcome text settles in, then into the first chat.
export default function Done() {
  const { state } = useOnboarding();
  const reduced = useReducedMotion();
  const free = state.plan === 'free' || state.plan === null;
  const rise = useSharedValue(0);

  useEffect(() => {
    rise.value = reduced ? withTiming(1, { duration: 250, easing: EASE_OUT }) : withSpring(1, SPRING_SETTLE);
    haptic.success();
  }, [reduced, rise]);

  const text = useAnimatedStyle(() => ({
    opacity: rise.value,
    transform: reduced ? [] : [{ translateY: (1 - rise.value) * 16 }],
  }));

  return (
    <ScreenShell
      variant="sky"
      background={bg.junoCloud}
      back={false}
      scroll={false}
      footer={<PrimaryButton label={free ? S.done.freeCta : S.done.trialCta} onPress={() => router.push('/checkin')} />}>
      <Animated.View style={[styles.body, text]}>
        <Text maxFontSizeMultiplier={FONT_CAP} accessibilityRole="header" style={[type.title, styles.center]}>{free ? S.done.freeTitle : S.done.trialTitle}</Text>
        <Text maxFontSizeMultiplier={FONT_CAP} style={[type.subtitle, styles.center, styles.sub]}>{free ? S.done.freeSub : S.done.trialSub}</Text>
      </Animated.View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'flex-end', paddingBottom: 24 },
  center: { textAlign: 'center', paddingHorizontal: 32 },
  sub: { color: colors.inkSoft, marginTop: 10 },
});
