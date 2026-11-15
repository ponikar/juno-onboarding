import { router, useFocusEffect } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { S } from '@/copy/strings';
import { nextRoute, prevRoute } from '@/flow';
import { EASE_OUT } from '@/motion/tokens';
import { shadow, type, FONT_CAP, TITLE_CAP } from '@/theme/tokens';
import { Mascot } from '@/ui/Mascot';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell } from '@/ui/ScreenShell';

type Line = { text: string; kind: 'title' | 'body' | 'source' };

const BEATS: Line[][] = [
  [
    { text: S.story.b1Title, kind: 'title' },
    { text: S.story.b1Body, kind: 'body' },
    { text: S.story.b1Source, kind: 'source' },
  ],
  [
    { text: S.story.b2Title, kind: 'title' },
    { text: S.story.b2Isaac, kind: 'body' },
    { text: S.story.b2Marshall, kind: 'body' },
  ],
  [
    { text: S.story.b3Title, kind: 'title' },
    { text: S.story.b3Body, kind: 'body' },
  ],
];
const LAST = BEATS.length - 1;
const OUT_MS = 120;
const IN_MS = 320;
const LINE_GAP_MS = 60;
const RISE = 12;

// The story in three beats on one route.
export default function Story() {
  const reduced = useReducedMotion();
  const [beat, setBeat] = useState(0);
  const [shown, setShown] = useState(0);
  const [nods, setNods] = useState(0);
  const out = useSharedValue(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const go = (to: number) => {
    setBeat(to);
    setNods((n) => n + 1);
    if (timer.current) clearTimeout(timer.current);
    out.value = withTiming(0, { duration: OUT_MS, easing: EASE_OUT });
    timer.current = setTimeout(() => {
      setShown(to);
      out.value = 1;
    }, OUT_MS);
  };

  const back = () => {
    if (beat > 0) go(beat - 1);
    else if (router.canGoBack()) router.back();
    else router.replace(prevRoute('/story') as never);
  };

  // Only while the story is on screen: it stays mounted under later screens.
  useFocusEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      back();
      return true;
    });
    return () => sub.remove();
  });

  const outStyle = useAnimatedStyle(() => ({ opacity: out.value }));

  return (
    <ScreenShell
      variant="sky"
      back={back}
      footer={
        beat < LAST ? (
          <PrimaryButton label={S.story.next} onPress={() => go(beat + 1)} testID="story-next" />
        ) : (
          <PrimaryButton label={S.story.cta} onPress={() => router.push(nextRoute('/story'))} testID="story-cta" />
        )
      }>
      <View style={styles.wrap}>
        <Mascot style={styles.mascot} nod={nods} />
        <View style={styles.pager} accessible accessibilityLabel={`${beat + 1} of ${BEATS.length}`}>
          {BEATS.map((_, i) => (
            <View key={i} style={[styles.dot, i === beat && styles.dotOn]} />
          ))}
        </View>
        <Animated.View style={[styles.beat, outStyle]} key={shown}>
          {BEATS[shown].map((l, i) => (
            <BeatLine key={i} i={i} line={l} reduced={reduced} />
          ))}
        </Animated.View>
      </View>
    </ScreenShell>
  );
}

function BeatLine({ i, line, reduced }: { i: number; line: Line; reduced: boolean }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(i * LINE_GAP_MS, withTiming(1, { duration: IN_MS, easing: EASE_OUT }));
  }, [i, p]);
  const anim = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: reduced || i > 0 ? [] : [{ translateY: (1 - p.value) * RISE }],
  }));
  return (
    <Animated.View style={anim}>
      {line.kind === 'title' ? (
        <Text maxFontSizeMultiplier={TITLE_CAP} accessibilityRole="header" style={[type.titleSky, shadow.titleSky, styles.center]}>{line.text}</Text>
      ) : (
        <Text maxFontSizeMultiplier={FONT_CAP} style={[line.kind === 'body' ? styles.body : styles.source, styles.center]}>{line.text}</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 36, paddingTop: 16 },
  mascot: { alignSelf: 'center', width: 200, height: 150 },
  pager: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 14, marginBottom: 22 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotOn: { backgroundColor: '#FFFFFF' },
  beat: { gap: 14 },
  center: { textAlign: 'center' },
  body: { ...type.body, color: 'rgba(255,255,255,0.9)' },
  source: { ...type.small, color: 'rgba(255,255,255,0.8)' },
});
