import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { fill, joinList, S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { extractSymptoms } from '@/mocks/extractSymptoms';
import { EASE_OUT, ENTER_FROM_SCALE, ENTER_MS } from '@/motion/tokens';
import { useOnboarding } from '@/state/onboarding';
import { colors, radius, shadow, type, FONT_CAP } from '@/theme/tokens';
import { Tick } from '@/ui/Chip';
import { haptic } from '@/ui/haptics';
import { Icon } from '@/ui/Icon';
import { JunoReply } from '@/ui/JunoReply';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

const CHIP_MS = ENTER_MS;
const CHIP_GAP = ENTER_MS - 60; // 300 ms each with 60 ms overlap
const START = 350;

// Screen 4 (from Figma 35 tracking-demo, new content). Explanation: the words become a log.
export default function Heard() {
  const { state } = useOnboarding();
  const entry = state.todayEntry;
  const { symptoms, matches } = useMemo(() => extractSymptoms(entry), [entry]);
  const [highlight, setHighlight] = useState(false);
  const [settled, setSettled] = useState(false);
  const items = symptoms.length ? symptoms : [null];

  useEffect(() => {
    const t = setTimeout(() => setHighlight(true), 150);
    return () => clearTimeout(t);
  }, []);

  const onSettled = () => {
    setSettled(true);
    haptic.light();
    track('heard_logged', { symptoms });
  };

  const reply = symptoms.length
    ? fill(S.heard.reply, { symptoms: joinList(symptoms.map((s, i) => (i === 0 ? s : s.toLowerCase()))) })
    : S.heard.replyNone;

  return (
    <ScreenShell
      route="/heard"
      footer={<PrimaryButton label={S.common.continue} onPress={() => router.push(nextRoute('/heard'))} testID="heard-continue" />}>
      <Title sub={S.heard.sub}>{S.heard.title}</Title>

      <View style={styles.userRow}>
        <View style={styles.userBubble}>
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.userText}>
            {segments(entry, matches).map((seg, i) =>
              seg.hit ? (
                <Text maxFontSizeMultiplier={FONT_CAP} key={i} style={[styles.hit, highlight && styles.hitOn]}>{seg.text}</Text>
              ) : (
                <Text maxFontSizeMultiplier={FONT_CAP} key={i}>{seg.text}</Text>
              ),
            )}
          </Text>
        </View>
      </View>

      <View style={[styles.card, shadow.card]}>
        <View style={styles.cardHead}>
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.cardTitle}>{S.heard.today}</Text>
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.cardDate}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
        </View>
        <View style={styles.chips}>
          {items.map((s, i) => (
            <LogItem key={s ?? 'entry'} index={i} last={i === items.length - 1} full={!s} onSettled={onSettled}>
              {s ? (
                <View style={styles.chip}>
                  <Tick selected big={false} />
                  <Text maxFontSizeMultiplier={FONT_CAP} style={type.chip}>{s}</Text>
                </View>
              ) : (
                <View style={styles.asWritten}>
                  <Text maxFontSizeMultiplier={FONT_CAP} style={[type.body, { flex: 1 }]}>{fill(S.snapshot.todayAsWritten, { entry })}</Text>
                  <View style={styles.logged}>
                    <Icon name="checkmark" size={11} color="#FFFFFF" weight="bold" />
                  </View>
                </View>
              )}
            </LogItem>
          ))}
        </View>
      </View>

      <View style={styles.replyWrap}>
        <JunoReply text={settled ? reply : null} id="heard" />
      </View>
    </ScreenShell>
  );
}

function LogItem({ index, last, full, onSettled, children }: { index: number; last: boolean; full?: boolean; onSettled: () => void; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(
      START + index * CHIP_GAP,
      withTiming(1, { duration: CHIP_MS, easing: EASE_OUT }, (done) => {
        if (done && last) runOnJS(onSettled)();
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: reduced
      ? []
      : [{ translateY: (1 - p.value) * -28 }, { scale: ENTER_FROM_SCALE + (1 - ENTER_FROM_SCALE) * p.value }],
  }));
  return <Animated.View style={[full && { width: '100%' }, style]}>{children}</Animated.View>;
}

function segments(entry: string, matches: { start: number; end: number }[]) {
  const out: { text: string; hit: boolean }[] = [];
  let at = 0;
  for (const m of matches) {
    if (m.start > at) out.push({ text: entry.slice(at, m.start), hit: false });
    out.push({ text: entry.slice(m.start, m.end), hit: true });
    at = m.end;
  }
  if (at < entry.length) out.push({ text: entry.slice(at), hit: false });
  return out;
}

const styles = StyleSheet.create({
  userRow: { alignItems: 'flex-end', paddingHorizontal: 16 },
  userBubble: {
    maxWidth: '82%',
    backgroundColor: colors.userBubble,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userText: { fontSize: 18, lineHeight: 24, color: '#FFFFFF' },
  hit: { fontWeight: '400' },
  hitOn: { fontWeight: '700', textDecorationLine: 'underline', textDecorationColor: '#FFD6BF' },
  card: { marginTop: 22, marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: radius.panel, padding: 16 },
  cardHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 8 },
  cardTitle: { fontSize: 18, lineHeight: 23, fontWeight: '700', color: colors.ink },
  cardDate: { ...type.small, color: colors.muted, flexShrink: 1, textAlign: 'right' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 10,
    paddingRight: 14,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.orangeBorder,
    backgroundColor: colors.orangeFill,
  },
  asWritten: { flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%' },
  logged: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  replyWrap: { marginTop: 18 },
});

