import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { EASE_OUT, STATE_MS } from '@/motion/tokens';
import { colors, FONT_CAP } from '@/theme/tokens';

// Day 1 of 7. Seven equal dots, the first filled. Not tappable.
export function WeekDots({ caption, label, center }: { caption?: string; label?: string; center?: boolean }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withTiming(1, { duration: STATE_MS, easing: EASE_OUT });
  }, [t]);
  const filled = useAnimatedStyle(() => ({ opacity: t.value }));

  return (
    <View accessible accessibilityLabel={caption ?? label} style={center ? styles.wrapCenter : styles.wrap}>
      <View style={styles.row}>
        {Array.from({ length: 7 }, (_, i) => (
          <View key={i} style={[styles.dot, styles.empty]}>
            {i === 0 ? <Animated.View style={[styles.fill, filled]} /> : null}
          </View>
        ))}
      </View>
      {caption ? <Text maxFontSizeMultiplier={FONT_CAP} style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'flex-start' },
  wrapCenter: { alignItems: 'center' },
  row: { flexDirection: 'row', gap: 6 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  empty: { borderWidth: 1.5, borderColor: colors.radio },
  fill: { position: 'absolute', top: -1.5, left: -1.5, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.orange },
  caption: { fontSize: 13, lineHeight: 17, color: colors.muted, marginTop: 6 },
});
