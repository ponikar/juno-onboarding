import { router } from 'expo-router';
import { ReactNode, useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { EASE_OUT, ENTER_MS, staggerAt } from '@/motion/tokens';
import { shadow, type, FONT_CAP, TITLE_CAP } from '@/theme/tokens';
import { mascotPeekSky } from '@/ui/art';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell } from '@/ui/ScreenShell';

// Screen 2 (from Figma 09 story-report, 1:516): why we built Juno.
export default function Story() {
  return (
    <ScreenShell variant="sky" footer={<PrimaryButton label={S.story.cta} onPress={() => router.push(nextRoute('/story'))} testID="story-cta" />}>
      <View style={styles.wrap}>
        <Image source={mascotPeekSky} style={styles.mascot} resizeMode="contain" accessibilityIgnoresInvertColors />
        <Line i={0}>
          <Text maxFontSizeMultiplier={TITLE_CAP} accessibilityRole="header" style={[type.titleSky, shadow.titleSky, styles.center]}>{S.story.title}</Text>
        </Line>
        <Line i={1}>
          <Text maxFontSizeMultiplier={FONT_CAP} style={[styles.body, styles.center]}>{S.story.body1}</Text>
        </Line>
        <Line i={2}>
          <Text maxFontSizeMultiplier={FONT_CAP} style={[styles.body, styles.center]}>{S.story.body2}</Text>
        </Line>
        <Line i={3}>
          <Text maxFontSizeMultiplier={FONT_CAP} style={[type.label, styles.close, styles.center]}>{S.story.close}</Text>
        </Line>
      </View>
    </ScreenShell>
  );
}

function Line({ i, children }: { i: number; children: ReactNode }) {
  const reduced = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(staggerAt(i), withTiming(1, { duration: ENTER_MS, easing: EASE_OUT }));
  }, [i, p]);
  const anim = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: reduced ? [] : [{ translateY: (1 - p.value) * 8 }],
  }));
  return <Animated.View style={anim}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 36, paddingTop: 24, gap: 14 },
  mascot: { alignSelf: 'center', width: 200, height: 150, marginBottom: 10 },
  center: { textAlign: 'center' },
  body: { ...type.body, color: 'rgba(255,255,255,0.9)' },
  close: { color: '#FFFFFF', marginTop: 6 },
});
