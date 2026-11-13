import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { fill, S } from '@/copy/strings';
import { SPRING_SETTLE } from '@/motion/tokens';
import { colors, shadow, FONT_CAP } from '@/theme/tokens';
import { haptic } from './haptics';

const STEPS = 7;
const INSET = 21; // first/last dot centre from the track edge (Figma 37)
const TRACK_H = 32;
const THUMB = 33;
const BAR_H = [79, 47, 32, 24, 32, 47, 79];
const YELLOW = '#F1C94B';
const YELLOW_GRADIENT = 'linear-gradient(180deg, #F6DE8E 0%, #F1C94B 100%)';

// Figma 37: seven bars over a yellow track. Thumb follows the finger, snaps to a step on release.
export function EnergySlider({ value, onChange }: { value: number | null; onChange: (n: number) => void }) {
  'use no memo'; // keep React Compiler away from the gesture worklets
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const shown = value ?? 4;
  const x = useSharedValue(0);
  const step = useSharedValue(shown);
  const w = useSharedValue(0);
  const drag = useSharedValue(false);

  const span = Math.max(width - INSET * 2, 1);
  useEffect(() => {
    w.value = width;
    step.value = shown;
    if (width && !drag.value) x.value = INSET + ((shown - 1) / (STEPS - 1)) * span;
  }, [width, shown, span, w, x, step, drag]);

  const pick = (n: number) => {
    haptic.selection();
    onChange(n);
  };

  // Every worklet below is self-contained: no calls to component-scope helpers on the UI thread.
  const pan = usePanGesture({
    minDistance: 0,
    onBegin: (e) => {
      'worklet';
      drag.value = true;
      const clamped = Math.min(Math.max(e.x, INSET), w.value - INSET);
      x.value = clamped;
      const n = Math.round(((clamped - INSET) / Math.max(w.value - INSET * 2, 1)) * (STEPS - 1)) + 1;
      if (n !== step.value) {
        step.value = n;
        scheduleOnRN(pick, n);
      }
    },
    onUpdate: (e) => {
      'worklet';
      const clamped = Math.min(Math.max(e.x, INSET), w.value - INSET);
      x.value = clamped;
      const n = Math.round(((clamped - INSET) / Math.max(w.value - INSET * 2, 1)) * (STEPS - 1)) + 1;
      if (n !== step.value) {
        step.value = n;
        scheduleOnRN(pick, n);
      }
    },
    onFinalize: () => {
      'worklet';
      drag.value = false;
      const target = INSET + ((step.value - 1) / (STEPS - 1)) * (w.value - INSET * 2);
      x.value = reduced ? target : withSpring(target, SPRING_SETTLE);
    },
  });

  const fillStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value - w.value }] }));
  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value - THUMB / 2 }] }));

  const set = (n: number) => {
    const c = Math.min(Math.max(n, 1), STEPS);
    if (c !== value) pick(c);
  };

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={fill(S.energy.a11y, { n: shown })}
      accessibilityValue={{ min: 1, max: STEPS, now: shown }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => set(shown + (e.nativeEvent.actionName === 'increment' ? 1 : -1))}>
      <View style={styles.bars}>
        {BAR_H.map((h, i) => (
          <View key={i} style={[styles.bar, { height: h, backgroundColor: value !== null && i < shown ? YELLOW : colors.track }]} />
        ))}
      </View>
      <GestureDetector gesture={pan}>
        <View style={styles.hit} onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
          <View style={styles.track}>
            <Animated.View style={[StyleSheet.absoluteFill, { experimental_backgroundImage: YELLOW_GRADIENT }, fillStyle]} />
            <View style={styles.dots} pointerEvents="none">
              {BAR_H.map((_, i) => (
                <View key={i} style={[styles.dot, { backgroundColor: i < shown - 1 ? 'rgba(150,110,20,0.35)' : '#CFCFD4' }]} />
              ))}
            </View>
          </View>
          <Animated.View style={[styles.thumb, shadow.card, thumbStyle]} />
        </View>
      </GestureDetector>
      <View style={styles.labels}>
        <Text maxFontSizeMultiplier={FONT_CAP} style={styles.label}>{S.energy.low}</Text>
        <Text maxFontSizeMultiplier={FONT_CAP} style={[styles.label, { textAlign: 'right' }]}>{S.energy.high}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginHorizontal: 19 + INSET - 4, height: 79 },
  bar: { width: 8, borderRadius: 4 },
  hit: { marginHorizontal: 19, marginTop: 24, height: 44, justifyContent: 'center' },
  track: { height: TRACK_H, borderRadius: TRACK_H / 2, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  dots: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: INSET - 3 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  thumb: { position: 'absolute', left: 0, width: THUMB, height: THUMB, borderRadius: THUMB / 2, backgroundColor: '#FFFFFF' },
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 26, marginTop: 22 },
  label: { fontSize: 15, lineHeight: 20, fontWeight: '500', color: '#7A6253' },
});
