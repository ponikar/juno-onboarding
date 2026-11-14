import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, withTiming } from 'react-native-reanimated';

import { EASE_OUT, STATE_MS } from '@/motion/tokens';
import { colors, FONT_CAP } from '@/theme/tokens';
import { haptic } from './haptics';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';

// The quiet "way out" answer (None right now, Still looking, I don't take any): a plain text label under the main button.
// Picked: the label turns orange and a check slides in.
export function EscapeButton({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const reduced = useReducedMotion();
  const check = useAnimatedStyle(() => ({
    opacity: withTiming(selected ? 1 : 0, { duration: STATE_MS, easing: EASE_OUT }),
    width: withTiming(selected ? 18 : 0, { duration: reduced ? 0 : STATE_MS, easing: EASE_OUT }),
  }));
  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      selected={selected}
      onPress={() => {
        haptic.selection();
        onPress();
      }}
      style={styles.pill}>
      <Animated.View style={[styles.check, check]}>
        <Icon name="checkmark" size={14} color={colors.orangeStrong} weight="bold" />
      </Animated.View>
      <Text maxFontSizeMultiplier={FONT_CAP} style={[styles.label, selected && styles.labelOn]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: 'center', minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12 },
  check: { overflow: 'hidden', alignItems: 'center' },
  label: { fontSize: 16, lineHeight: 21, fontWeight: '600', color: colors.inkSoft },
  labelOn: { color: colors.orangeStrong },
});
