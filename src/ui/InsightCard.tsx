import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { Insight } from '@/copy/facts';
import { S } from '@/copy/strings';
import { FlowRoute, nextRoute } from '@/flow';
import type { KnownRow } from '@/lib/insights';
import { EASE_OUT, ENTER_FROM_SCALE, ENTER_MS, REPLY_FADE_MS } from '@/motion/tokens';
import { colors, radius, shadow, space, type, FONT_CAP, TITLE_CAP } from '@/theme/tokens';
import { avatar } from './art';
import { haptic } from './haptics';
import { KnownList } from './KnownList';
import { PrimaryButton } from './PrimaryButton';
import { ScreenShell } from './ScreenShell';

// Screens 10 and 14 (spec 5), from Figma 15 goal-recognition: one white card under a centred header.
export function InsightCard({ route, insight, known, next }: { route: FlowRoute; insight: Insight; known: KnownRow[]; next: string }) {
  const reduced = useReducedMotion();
  const card = useSharedValue(0);
  const kind = useSharedValue(0);
  useEffect(() => {
    const landed = () => haptic.success();
    card.value = withTiming(1, { duration: ENTER_MS, easing: EASE_OUT }, (done) => {
      if (done) scheduleOnRN(landed);
    });
    kind.value = withDelay(ENTER_MS, withTiming(1, { duration: REPLY_FADE_MS, easing: EASE_OUT }));
  }, [card, kind]);
  const cardStyle = useAnimatedStyle(() => ({
    opacity: card.value,
    transform: reduced ? [] : [{ scale: ENTER_FROM_SCALE + (1 - ENTER_FROM_SCALE) * card.value }],
  }));
  const kindStyle = useAnimatedStyle(() => ({ opacity: kind.value }));

  return (
    <ScreenShell
      route={route}
      footer={<PrimaryButton label={S.card.cta} onPress={() => router.push(nextRoute(route))} />}>
      <View style={styles.content}>
        <Image source={avatar} style={styles.mascot} accessibilityIgnoresInvertColors />
        <Animated.View style={[styles.card, shadow.card, cardStyle]}>
          <Text maxFontSizeMultiplier={TITLE_CAP} accessibilityRole="header" style={type.title}>{insight.stat}</Text>
          <Text maxFontSizeMultiplier={FONT_CAP} style={type.body}>{insight.label}</Text>
          <Text maxFontSizeMultiplier={FONT_CAP} style={[type.small, styles.source]}>{insight.source}</Text>
        </Animated.View>
        <Animated.Text maxFontSizeMultiplier={FONT_CAP} style={[type.body, styles.kind, kindStyle]}>{insight.kind}</Animated.Text>
        <KnownList rows={known} delay={ENTER_MS + REPLY_FADE_MS} />
        <Text maxFontSizeMultiplier={FONT_CAP} style={[type.subtitle, styles.next]}>{next}</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.cardGutter, paddingTop: space.xl, gap: space.xl },
  mascot: { width: 56, height: 56, borderRadius: 28, alignSelf: 'center' },
  card: { backgroundColor: colors.surface, borderRadius: radius.card, padding: space.xl, gap: space.s },
  source: { color: colors.muted, marginTop: space.xs },
  kind: { textAlign: 'center', paddingHorizontal: space.l },
  next: { color: colors.inkSoft },
});
