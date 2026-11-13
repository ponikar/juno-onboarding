import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { S } from '@/copy/strings';
import { track } from '@/lib/track';
import { EASE_OUT, SPRING_SETTLE } from '@/motion/tokens';
import { colors, shadow } from '@/theme/tokens';
import { bg, laurelLeft, laurelRight, mascotPeek } from '@/ui/art';
import { PrimaryButton, TextLink } from '@/ui/PrimaryButton';

// Screen 1 (from Figma 01 splash). Delight: headline fades up, mascot rises from the cloud, proof follows.
export default function Welcome() {
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const head = useSharedValue(0);
  const rise = useSharedValue(0);
  const proof1 = useSharedValue(0);
  const proof2 = useSharedValue(0);

  useEffect(() => {
    head.value = withTiming(1, { duration: 500, easing: EASE_OUT });
    rise.value = reduced ? withTiming(1, { duration: 300 }) : withDelay(120, withSpring(1, SPRING_SETTLE));
    proof1.value = withDelay(80, withTiming(1, { duration: 300, easing: EASE_OUT }));
    proof2.value = withDelay(140, withTiming(1, { duration: 300, easing: EASE_OUT }));
  }, [head, rise, proof1, proof2, reduced]);

  const headStyle = useAnimatedStyle(() => ({
    opacity: head.value,
    transform: reduced ? [] : [{ translateY: (1 - head.value) * 12 }],
  }));
  const mascotStyle = useAnimatedStyle(() => ({
    opacity: reduced ? rise.value : Math.min(1, rise.value * 1.6),
    transform: reduced ? [] : [{ translateY: (1 - rise.value) * 70 }],
  }));
  const p1 = useAnimatedStyle(() => ({ opacity: proof1.value }));
  const p2 = useAnimatedStyle(() => ({ opacity: proof2.value }));

  return (
    <View style={styles.root}>
      <Image source={bg.welcome} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <View style={[styles.top, { paddingTop: insets.top + 32 }]}>
        <Pressable
          onLongPress={() => router.push('/debug')}
          delayLongPress={600}
          accessibilityRole="header"
          accessibilityHint={S.welcome.debugHint}>
          <Text style={[styles.brand, shadow.titleSky]}>{S.welcome.brand}</Text>
        </Pressable>
        <Animated.View style={headStyle}>
          <Text style={[styles.title, shadow.titleSky]}>{S.welcome.title}</Text>
          <Text style={[styles.sub, shadow.titleSky]}>{S.welcome.sub}</Text>
        </Animated.View>
      </View>

      <View style={styles.mascotClip} pointerEvents="none">
        <Animated.Image source={mascotPeek} style={[styles.mascot, mascotStyle]} resizeMode="contain" />
      </View>

      <View style={styles.proofRow}>
        <Image source={laurelLeft} style={styles.laurel} />
        <Animated.View style={[styles.proof, p1]}>
          <Text style={styles.proofBig}>{S.welcome.proof1Big}</Text>
          <Text style={styles.proofSmall}>{S.welcome.proof1Small}</Text>
        </Animated.View>
        <Animated.View style={[styles.proof, p2]}>
          <Text style={styles.proofBig}>{S.welcome.proof2Big}</Text>
          <Text style={styles.proofSmall}>{S.welcome.proof2Small}</Text>
        </Animated.View>
        <Image source={laurelRight} style={styles.laurel} />
      </View>

      <View style={styles.bottom}>
        <View style={styles.cta}>
          <PrimaryButton
            tone="navy"
            label={S.welcome.cta}
            onPress={() => {
              track('welcome_cta');
              router.push('/consent');
            }}
            testID="welcome-cta"
          />
        </View>
        <TextLink label={S.welcome.haveAccount} onPress={() => track('have_account')} />
        <Text style={styles.terms}>
          {S.welcome.termsLead}
          {'\n'}
          <Text style={styles.termsStrong}>{S.welcome.terms}</Text> {S.welcome.and}{' '}
          <Text style={styles.termsStrong}>{S.welcome.privacy}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  top: { alignItems: 'center', paddingHorizontal: 32 },
  brand: { fontSize: 33, lineHeight: 40, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  title: { marginTop: 36, fontSize: 34, lineHeight: 40, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  sub: { marginTop: 12, fontSize: 18, lineHeight: 23, fontWeight: '500', color: '#FFFFFF', textAlign: 'center' },
  mascotClip: { position: 'absolute', top: 414, left: 0, right: 0, height: 150, alignItems: 'center', overflow: 'hidden' },
  mascot: { width: 200, height: 150 },
  proofRow: { position: 'absolute', top: 584, left: 22, right: 22, flexDirection: 'row', alignItems: 'center' },
  laurel: { width: 30, height: 62 },
  proof: { flex: 1, alignItems: 'center' },
  proofBig: { fontSize: 32, lineHeight: 38, fontWeight: '700', color: '#868485' },
  proofSmall: { fontSize: 14.5, lineHeight: 18, color: '#868485', textAlign: 'center' },
  bottom: { position: 'absolute', left: 0, right: 0, top: 688, alignItems: 'center' },
  cta: { width: 234, marginBottom: 10 },
  terms: { marginTop: 12, fontSize: 14, lineHeight: 19, color: '#868485', textAlign: 'center' },
  termsStrong: { color: '#5E534D', fontWeight: '500' },
});
