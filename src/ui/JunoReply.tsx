import { useEffect, useState } from 'react';
import { AccessibilityInfo, Image, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, useReducedMotion } from 'react-native-reanimated';

import { REPLY_FADE_MS, TYPING_MS } from '@/motion/tokens';
import { colors, FONT_CAP } from '@/theme/tokens';
import { avatar } from './art';
import { TypingDots } from './TypingDots';

// One line from Juno beside her avatar: typing dots for 450 ms, then the text fades in (v3 R-11). Never blocks Continue.
// Pass a changing `id` to replay it when the reply changes.
export function JunoReply({ text, id, onSky }: { text: string | null; id?: string; onSky?: boolean }) {
  // accessibilityLiveRegion is Android-only; VoiceOver needs an explicit announcement (eval A-05).
  useEffect(() => {
    if (text && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(text);
  }, [text, id]);
  if (!text) return <View style={styles.placeholder} />;
  return <Reply key={id ?? text} text={text} onSky={onSky} />;
}

const fade = FadeIn.duration(REPLY_FADE_MS).easing(Easing.out(Easing.quad));

function Reply({ text, onSky }: { text: string; onSky?: boolean }) {
  const reduced = useReducedMotion();
  const [typing, setTyping] = useState(!reduced);
  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => setTyping(false), TYPING_MS);
    return () => clearTimeout(t);
  }, [typing]);

  return (
    <Animated.View entering={fade} accessibilityLiveRegion="polite" style={styles.row}>
      <Image source={avatar} style={styles.avatar} />
      <View style={[styles.bubble, onSky && styles.bubbleSky]}>
        {typing ? (
          <TypingDots />
        ) : (
          <Animated.View entering={reduced ? undefined : fade}>
            <Text maxFontSizeMultiplier={FONT_CAP} style={styles.text}>{text}</Text>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  placeholder: { minHeight: 56 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 16, minHeight: 56 },
  avatar: { width: 30, height: 30, borderRadius: 15 },
  bubble: {
    flexShrink: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderBottomLeftRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleSky: { backgroundColor: 'rgba(255,255,255,0.95)' },
  text: { fontSize: 16, lineHeight: 21, color: colors.ink },
});
