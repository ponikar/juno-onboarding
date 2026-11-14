import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fill, S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { formatDate, trialDates } from '@/lib/dates';
import { EASE_OUT } from '@/motion/tokens';
import { colors, shadow, size, type, FONT_CAP } from '@/theme/tokens';
import { bg, honestyIcons } from '@/ui/art';
import { Icon } from '@/ui/Icon';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { FLOW_BAR_ROW, ScreenShell } from '@/ui/ScreenShell';

const ART_H = 362;
const CROP = 70; // empty sky above the title; keeps the charge date above the fold
const POINT_MS = 160;
const RAIL_GRADIENT = 'linear-gradient(180deg, #4E9FE9 0%, #7DB3EE 45%, #BFD7F5 80%, rgba(248,246,247,0) 100%)';
const POINT_GAP_MS = 120; // each point starts 40 ms before the previous one ends: 3 points in 400 ms

// Screen 18 (from 56 honesty + 60 pw-trial): the four honesty rows, then the free-week timeline with real dates.
export default function How() {
  const insets = useSafeAreaInsets();
  const dates = useMemo(() => trialDates(new Date()), []);
  const points = [
    { icon: 'checkmark', title: S.how.t1, sub: S.how.t1Sub },
    { icon: 'bell', title: fill(S.how.t2, { date: formatDate(dates.remind) }), sub: S.how.t2Sub },
    { icon: 'star', title: fill(S.how.t3, { date: formatDate(dates.charge) }), sub: S.how.t3Sub },
  ];

  return (
    <ScreenShell
      route="/how"
      variant="sky"
      background={bg.honesty}
      backgroundHeight={ART_H}
      backgroundTop={-CROP}
      footer={
        <>
          <View style={[styles.pill, shadow.card]}>
            <Icon name="crown.fill" size={16} color={colors.orange} />
            <Text maxFontSizeMultiplier={FONT_CAP} style={styles.pillText}>{S.how.noPayment}</Text>
          </View>
          <PrimaryButton label={S.how.cta} onPress={() => router.push(nextRoute('/how'))} />
        </>
      }>
      <View style={{ height: ART_H - CROP - insets.top - 10 - size.nav - FLOW_BAR_ROW }}>
        <Text maxFontSizeMultiplier={FONT_CAP} accessibilityRole="header" style={[type.titleSky, shadow.titleSky, styles.title]}>{S.how.title}</Text>
      </View>

      <View style={styles.rows}>
        {S.how.rows.map((r, i) => (
          <View key={r.title} style={styles.row}>
            <View style={styles.rail}>
              <Image source={honestyIcons[i]} style={styles.rowIcon} />
              {i < S.how.rows.length - 1 && <View style={styles.connector} />}
            </View>
            <View style={styles.rowText}>
              <Text maxFontSizeMultiplier={FONT_CAP} style={styles.rowTitle}>{r.title}</Text>
              <Text maxFontSizeMultiplier={FONT_CAP} style={styles.rowSub}>{r.sub}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.timeline}>
        <Rail />
        {points.map((p, i) => (
          <TimelinePoint key={i} index={i} last={i === points.length - 1} {...p} />
        ))}
      </View>
    </ScreenShell>
  );
}

// One continuous rail behind the dots, deep blue fading out at the bottom (Figma 60).
function Rail() {
  const reduced = useReducedMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withTiming(1, { duration: 400, easing: EASE_OUT });
  }, [t]);
  const grow = useAnimatedStyle(() => ({ opacity: Math.min(1, t.value * 2), transform: reduced ? [] : [{ scaleY: t.value }] }));
  return <Animated.View pointerEvents="none" style={[styles.rail2, { experimental_backgroundImage: RAIL_GRADIENT } as object, grow]} />;
}

function TimelinePoint({ index, icon, title, sub }: { index: number; icon: string; title: string; sub: string; last: boolean }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(index * POINT_GAP_MS, withTiming(1, { duration: POINT_MS, easing: EASE_OUT }));
  }, [index, t]);
  const dot = useAnimatedStyle(() => ({ opacity: t.value }));

  return (
    <View style={styles.point}>
      <View style={styles.pointRail}>
        <Animated.View style={[styles.dot, dot]}>
          <Icon name={icon} size={14} color="#FFFFFF" weight="semibold" />
        </Animated.View>
      </View>
      <Animated.View style={[styles.pointText, dot]}>
        <Text maxFontSizeMultiplier={FONT_CAP} style={styles.pointTitle}>{title}</Text>
        <Text maxFontSizeMultiplier={FONT_CAP} style={styles.pointSub}>{sub}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { textAlign: 'center', marginTop: 8, paddingHorizontal: 36 },
  rows: { paddingHorizontal: 17, marginTop: 8 },
  row: { flexDirection: 'row', gap: 14 },
  rail: { width: 34, alignItems: 'center' },
  rowIcon: { width: 34, height: 34, borderRadius: 17 },
  connector: { width: 1, flex: 1, minHeight: 6, backgroundColor: colors.hairline, marginVertical: 4 },
  rowText: { flex: 1, paddingBottom: 10 },
  rowTitle: { fontSize: 16, lineHeight: 21, fontWeight: '600', color: colors.ink },
  rowSub: { fontSize: 14, lineHeight: 18, color: colors.muted, marginTop: 2 },
  timeline: { paddingHorizontal: 17, marginTop: 6 },
  point: { flexDirection: 'row', gap: 16 },
  pointRail: { width: 36, alignItems: 'center' },
  rail2: { position: 'absolute', left: 17, top: 18, bottom: -8, width: 36, transformOrigin: 'top' },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A22',
    borderWidth: 1.5,
    borderColor: '#D9DCE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointText: { flex: 1, paddingBottom: 14 },
  pointTitle: { fontSize: 17, lineHeight: 22, fontWeight: '700', color: colors.ink },
  pointSub: { fontSize: 14, lineHeight: 18, color: colors.inkSoft, marginTop: 2 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 8,
  },
  pillText: { fontSize: 15, lineHeight: 20, fontWeight: '600', color: colors.ink },
});
