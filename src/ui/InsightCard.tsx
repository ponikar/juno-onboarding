import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { Insight } from '@/copy/facts';
import { S } from '@/copy/strings';
import { FlowRoute, nextRoute } from '@/flow';
import type { KnownRow } from '@/lib/insights';
import { EASE_OUT, ENTER_FROM_SCALE, ENTER_MS, REPLY_FADE_MS } from '@/motion/tokens';
import { colors, radius, shadow, space, type, FONT_CAP, TITLE_CAP } from '@/theme/tokens';
import { DoctorPageMeter } from './DoctorPageMeter';
import { haptic } from './haptics';
import { KnownList } from './KnownList';
import { Mascot } from './Mascot';
import { PrimaryButton } from './PrimaryButton';
import { ScreenShell } from './ScreenShell';

// Screens 10 and 14 on the sky (v3 R-15).
export function InsightCard({ route, insight, known, next, reached }: { route: FlowRoute; insight: Insight; known: KnownRow[]; next: string; reached: 'health' | 'days' }) {
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
      variant="sky"
      route={route}
      footer={<PrimaryButton label={S.card.cta} onPress={() => router.push(nextRoute(route))} />}>
      <View style={styles.content}>
        <Mascot style={styles.mascot} />
        <Animated.View style={[styles.card, shadow.card, cardStyle]}>
          <Text maxFontSizeMultiplier={TITLE_CAP} accessibilityRole="header" style={[type.title, styles.stat]}>{insight.stat}</Text>
          <Text maxFontSizeMultiplier={FONT_CAP} style={type.body}>{insight.label}</Text>
          <Text maxFontSizeMultiplier={FONT_CAP} style={[type.small, styles.source]}>{insight.source}</Text>
        </Animated.View>
        <Animated.Text maxFontSizeMultiplier={FONT_CAP} style={[type.body, styles.kind, kindStyle]}>{insight.kind}</Animated.Text>
        <View style={[styles.panel, shadow.card]}>
          <KnownList rows={known} delay={ENTER_MS + REPLY_FADE_MS} />
        </View>
        <DoctorPageMeter reached={reached} />
        <Text maxFontSizeMultiplier={FONT_CAP} style={[type.subtitle, styles.next]}>{next}</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.cardGutter, gap: space.m },
  mascot: { width: 147, height: 110, alignSelf: 'center', marginTop: -space.s, marginBottom: -space.l },
  card: { backgroundColor: colors.surface, borderRadius: radius.card, paddingHorizontal: space.xl, paddingVertical: space.l, gap: space.xs },
  stat: { fontSize: 34, lineHeight: 40 },
  source: { color: colors.muted, marginTop: space.xs },
  kind: { textAlign: 'center', paddingHorizontal: space.l, color: colors.skyText },
  panel: { backgroundColor: colors.surface, borderRadius: radius.card, paddingHorizontal: space.xl, paddingVertical: space.l },
  next: { textAlign: 'center', color: colors.inkSoft },
});
