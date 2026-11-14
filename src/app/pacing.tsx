import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  Keyframe,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { EASE_OUT } from '@/motion/tokens';
import { colors, FONT_CAP, radius, shadow } from '@/theme/tokens';
import { JunoReply } from '@/ui/JunoReply';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

const REST = 'Rest';
const BUSY_DAY = 'Wed';
const HIGHLIGHT_MS = 400;

const cardIn = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: 8 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }], easing: EASE_OUT },
})
  .duration(260)
  .delay(80);

// Screen 13: what the energy answer is for, shown as an example week with Juno's nudge.
export default function Pacing() {
  return (
    <ScreenShell
      route="/pacing"
      variant="sky"
      reply={<JunoReply text={S.pacing.nudge} />}
      footer={<PrimaryButton label={S.common.continue} onPress={() => router.push(nextRoute('/pacing'))} />}>
      <Title onSky>{S.pacing.title}</Title>
      <Animated.View entering={cardIn} style={styles.card}>
        <Text maxFontSizeMultiplier={FONT_CAP} style={styles.example}>{S.pacing.example}</Text>
        {S.pacing.week.map((d, i) => (
          <DayRow key={d.day} day={d.day} items={d.items} first={i === 0} />
        ))}
      </Animated.View>
    </ScreenShell>
  );
}

function DayRow({ day, items, first }: { day: string; items: readonly string[]; first: boolean }) {
  const reduced = useReducedMotion();
  const glow = useSharedValue(0);
  const busy = day === BUSY_DAY;
  useEffect(() => {
    if (!busy || reduced) return;
    glow.value = withDelay(
      700,
      withSequence(withTiming(1, { duration: HIGHLIGHT_MS, easing: EASE_OUT }), withDelay(900, withTiming(0, { duration: HIGHLIGHT_MS, easing: EASE_OUT }))),
    );
  }, [busy, reduced, glow]);
  const border = useAnimatedStyle(() => ({ borderColor: interpolateColor(glow.value, [0, 1], ['transparent', colors.orange]) }));
  return (
    <>
      {!first && <View style={styles.rule} />}
      <Animated.View style={[styles.row, border]}>
        <Text maxFontSizeMultiplier={FONT_CAP} style={styles.day}>{day}</Text>
        <View style={styles.items}>
          {items.map((it) => (
            <View key={it} style={[styles.pill, it === REST && styles.pillRest]}>
              <Text maxFontSizeMultiplier={FONT_CAP} style={styles.pillText}>{it}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, paddingTop: 12, paddingBottom: 8, paddingHorizontal: 8, borderRadius: radius.card, backgroundColor: colors.surface, ...shadow.card },
  example: { alignSelf: 'flex-end', marginRight: 10, marginBottom: 4, fontSize: 13, lineHeight: 17, fontWeight: '500', color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, paddingHorizontal: 8, borderWidth: 1.5, borderRadius: 14 },
  rule: { height: StyleSheet.hairlineWidth, marginHorizontal: 8, backgroundColor: colors.hairline },
  day: { width: 48, paddingTop: 5, fontSize: 15, lineHeight: 20, fontWeight: '600', color: colors.ink },
  items: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: colors.replyBubble },
  pillRest: { backgroundColor: `${colors.success}26` },
  pillText: { fontSize: 14, lineHeight: 19, color: colors.ink },
});
