import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { EASE_OUT, STATE_MS } from '@/motion/tokens';
import { colors, radius, size, type, FONT_CAP } from '@/theme/tokens';
import { haptic } from './haptics';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';

// Pill chip with a radio/tick, as on Figma 17 conditions and 20 symptoms.
export function Chip({ label, selected, onToggle, preTicked, testID }: {
  label: string;
  selected: boolean;
  onToggle: () => void;
  preTicked?: boolean; // ticked by Juno from screen 4: fades from 60% to full once
  testID?: string;
}) {
  return (
    <PressableScale
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      onPress={() => {
        haptic.selection();
        onToggle();
      }}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.orangeFill : colors.surface,
          borderColor: selected ? colors.orangeBorder : colors.hairline,
          transitionProperty: ['backgroundColor', 'borderColor'],
          transitionDuration: STATE_MS,
        } as object,
      ]}>
      <Tick selected={selected} preTicked={preTicked} />
      <Text maxFontSizeMultiplier={FONT_CAP} style={[type.chip, { flexShrink: 1 }]}>{label}</Text>
    </PressableScale>
  );
}

export function Tick({ selected, preTicked, big }: { selected: boolean; preTicked?: boolean; big?: boolean }) {
  const reduced = useReducedMotion();
  const s = useSharedValue(selected ? 1 : 0);
  const o = useSharedValue(preTicked && selected ? 0.6 : 1);
  useEffect(() => {
    s.value = reduced ? (selected ? 1 : 0) : withTiming(selected ? 1 : 0, { duration: STATE_MS, easing: EASE_OUT });
  }, [selected, reduced, s]);
  useEffect(() => {
    if (preTicked) o.value = withDelay(250, withTiming(1, { duration: 300, easing: EASE_OUT }));
  }, [preTicked, o]);
  const d = big ? size.cardTick : size.tick;
  const anim = useAnimatedStyle(() => ({
    opacity: s.value * o.value,
    transform: reduced ? [] : [{ scale: 0.9 + 0.1 * s.value }],
  }));
  return (
    <View style={[styles.ring, { width: d, height: d, borderRadius: d / 2 }]}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.tick, { borderRadius: d / 2 }, anim]}>
        <Icon name="checkmark" size={big ? 12 : 10} color="#FFFFFF" weight="bold" />
      </Animated.View>
    </View>
  );
}

export function ChipWrap({ children }: { children: React.ReactNode }) {
  return <View style={styles.wrap}>{children}</View>;
}

const styles = StyleSheet.create({
  chip: {
    maxWidth: '100%',
    minHeight: size.chip,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingLeft: 12,
    paddingRight: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ring: { borderWidth: 1.5, borderColor: colors.radio, backgroundColor: colors.surface },
  tick: { margin: -1.5, backgroundColor: colors.orangeTick, alignItems: 'center', justifyContent: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, paddingHorizontal: 14 },
});
