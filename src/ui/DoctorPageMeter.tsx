import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { S } from '@/copy/strings';
import { meterFor, MeterReached, MeterTick } from '@/lib/meter';
import { EASE_OUT, ENTER_MS, REPLY_FADE_MS, STATE_MS } from '@/motion/tokens';
import { useOnboarding } from '@/state/onboarding';
import { colors, radius, shadow, space, type, FONT_CAP, TITLE_CAP } from '@/theme/tokens';
import { Tick } from './Chip';

const POP_DELAY_MS = ENTER_MS + REPLY_FADE_MS;
const POP_GAP_MS = 50;

// Ticks that filled since the previous meter (none before the health card).
const NEW_ON: Record<MeterReached, MeterTick['key'][]> = { health: ['today', 'health'], days: ['days'], routine: ['routine'] };

// v3 R-08: "Your doctor page" meter on the insight cards and the demo.
export function DoctorPageMeter({ reached }: { reached: MeterReached }) {
  const { state } = useOnboarding();
  const { ticks, forecast } = meterFor(state, reached, new Date());
  const fresh = ticks.filter((t) => t.filled && NEW_ON[reached].includes(t.key)).map((t) => t.key);
  return (
    <View style={[styles.card, shadow.card]}>
      <Text maxFontSizeMultiplier={TITLE_CAP} accessibilityRole="header" style={type.label}>{S.meter.title}</Text>
      <View style={styles.row}>
        {ticks.map((t) => {
          const i = fresh.indexOf(t.key);
          return <MeterSlot key={t.key} tick={t} delay={i < 0 ? null : POP_DELAY_MS + i * POP_GAP_MS} />;
        })}
      </View>
      <Text maxFontSizeMultiplier={FONT_CAP} style={type.body}>{forecast}</Text>
    </View>
  );
}

function MeterSlot({ tick, delay }: { tick: MeterTick; delay: number | null }) {
  const reduced = useReducedMotion();
  const p = useSharedValue(delay === null ? 1 : 0);
  useEffect(() => {
    if (delay !== null) p.value = withDelay(delay, withTiming(1, { duration: STATE_MS, easing: EASE_OUT }));
  }, [delay, p]);
  const pop = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: reduced ? [] : [{ scale: 0.9 + 0.1 * p.value }],
  }));
  return (
    <View style={styles.slot} accessible accessibilityLabel={tick.label} accessibilityState={{ checked: tick.filled }}>
      <View>
        {delay !== null && <View style={styles.emptyUnder}><Tick selected={false} big /></View>}
        <Animated.View style={delay === null ? undefined : pop}>
          <Tick selected={tick.filled} big />
        </Animated.View>
      </View>
      <Text maxFontSizeMultiplier={FONT_CAP} style={[type.small, styles.label]}>{tick.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.card, paddingHorizontal: space.xl, paddingVertical: space.l, gap: space.m },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  slot: { flex: 1, alignItems: 'center', gap: space.xs },
  emptyUnder: { position: 'absolute' },
  label: { color: colors.inkSoft, textAlign: 'center' },
});
