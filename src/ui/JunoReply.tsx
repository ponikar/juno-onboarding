import { createContext, useContext, useEffect, useState } from 'react';
import { AccessibilityInfo, Image, Platform, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { REPLY_FADE_MS, TYPING_MS } from '@/motion/tokens';
import { colors, FONT_CAP } from '@/theme/tokens';
import { avatar } from './art';
import { TypingDots } from './TypingDots';

// Set by ScreenShell's bottom dock: there the reply needs no reserved space (it grows the dock upward, nothing on screen moves).
export const InReplyDock = createContext(false);

// One line from Juno beside her avatar: typing dots for 450 ms, then the text fades in (v3 R-11). Never blocks Continue.
// Pass a changing `id` to replay it when the reply changes.
export function JunoReply({ text, id, onSky }: { text: string | null; id?: string; onSky?: boolean }) {
  // accessibilityLiveRegion is Android-only; VoiceOver needs an explicit announcement (eval A-05).
  useEffect(() => {
    if (text && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(text);
  }, [text, id]);
  const docked = useContext(InReplyDock);
  if (!text) return docked ? null : <View style={styles.placeholder} />;
  return <Reply key={id ?? text} text={text} onSky={onSky} bare={docked} />;
}

const fade = FadeIn.duration(REPLY_FADE_MS).easing(Easing.out(Easing.quad));

function Reply({ text, onSky, bare }: { text: string; onSky?: boolean; bare?: boolean }) {
  const reduced = useReducedMotion();
  const [typing, setTyping] = useState(!reduced);
  const shown = useSharedValue(reduced ? 1 : 0);
  useEffect(() => {
    if (!typing) {
      shown.value = withTiming(1, { duration: REPLY_FADE_MS, easing: Easing.out(Easing.quad) });
      return;
    }
    const t = setTimeout(() => setTyping(false), TYPING_MS);
    return () => clearTimeout(t);
  }, [typing, shown]);
  const textStyle = useAnimatedStyle(() => ({ opacity: shown.value }));

  return (
    <Animated.View entering={fade} accessibilityLiveRegion="polite" style={[styles.row, bare && styles.rowBare]}>
      <Image source={avatar} style={[styles.avatar, bare && styles.avatarBare]} />
      {/* The text is laid out from the start (invisible while Juno types) so the bubble never changes size. */}
      {/* In the bottom dock the line is plain text, no bubble: it reads as a quiet aside, not another card. */}
      <View style={bare ? styles.bareWrap : [styles.bubble, onSky && styles.bubbleSky]}>
        <Animated.Text maxFontSizeMultiplier={FONT_CAP} style={[styles.text, bare && styles.textBare, textStyle]}>{text}</Animated.Text>
        {typing && (
          <View style={styles.dots} pointerEvents="none">
            <TypingDots />
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  placeholder: { minHeight: 56 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 16, minHeight: 56 },
  avatar: { width: 30, height: 30, borderRadius: 15 },
  rowBare: { alignItems: 'center', justifyContent: 'center', minHeight: 0, paddingHorizontal: 28, gap: 8 },
  avatarBare: { width: 22, height: 22, borderRadius: 11 },
  bareWrap: { flexShrink: 1, paddingVertical: 2 },
  textBare: { fontSize: 15, lineHeight: 20, color: colors.inkSoft, textAlign: 'center' },
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
  dots: { position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center' },
});
