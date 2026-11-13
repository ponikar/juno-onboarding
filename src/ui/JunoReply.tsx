import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn } from 'react-native-reanimated';

import { REPLY_DELAY_MS, REPLY_FADE_MS } from '@/motion/tokens';
import { colors } from '@/theme/tokens';
import { avatar } from './art';

// One line from Juno beside her avatar. Fades in (no movement) ~200 ms after an answer. Never blocks Continue.
// Pass a changing `id` to replay the fade when the reply changes.
export function JunoReply({ text, id, onSky }: { text: string | null; id?: string; onSky?: boolean }) {
  if (!text) return <View style={styles.placeholder} />;
  return (
    <Animated.View
      key={id ?? text}
      entering={FadeIn.duration(REPLY_FADE_MS).delay(REPLY_DELAY_MS).easing(Easing.out(Easing.quad))}
      accessibilityLiveRegion="polite"
      style={styles.row}>
      <Image source={avatar} style={styles.avatar} />
      <View style={[styles.bubble, onSky && styles.bubbleSky]}>
        <Text style={styles.text}>{text}</Text>
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
