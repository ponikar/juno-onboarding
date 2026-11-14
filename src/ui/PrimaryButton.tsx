import { useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';

import { ENABLE_MS } from '@/motion/tokens';
import { colors, radius, size, type, FONT_CAP, TITLE_CAP } from '@/theme/tokens';
import { haptic } from './haptics';
import { PressableScale } from './PressableScale';

const GUARD_MS = 700;

export function PrimaryButton({ label, onPress, disabled, loading, tone = 'black', testID }: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: 'black' | 'navy';
  testID?: string;
}) {
  const off = disabled || loading;
  const guarded = useOnce(onPress);
  const tap = useTapHaptic();
  return (
    <PressableScale
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      disabled={off}
      onPressIn={tap}
      onPress={guarded}
      style={[
        styles.btn,
        { backgroundColor: disabled ? colors.buttonDisabled : tone === 'navy' ? colors.navy : colors.button, ...fade },
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.buttonText} />
      ) : (
        <Animated.Text
          maxFontSizeMultiplier={TITLE_CAP}
          style={[type.button, { color: disabled ? colors.buttonDisabledText : colors.buttonText, ...fade }]}
          numberOfLines={2}>
          {label}
        </Animated.Text>
      )}
    </PressableScale>
  );
}

export function TextLink({ label, onPress, muted, testID }: { label: string; onPress: () => void; muted?: boolean; testID?: string }) {
  const guarded = useOnce(onPress);
  const tap = useTapHaptic();
  return (
    <PressableScale testID={testID} accessibilityRole="button" onPressIn={tap} onPress={guarded} style={styles.link} hitSlop={10}>
      <Text maxFontSizeMultiplier={FONT_CAP} style={[type.link, muted && { color: colors.muted, fontWeight: '500' }]}>{label}</Text>
    </PressableScale>
  );
}

const fade = { transitionProperty: ['backgroundColor', 'color'], transitionDuration: ENABLE_MS } as object;

// A double tap must navigate once (spec section 4): ignore presses for 700 ms after one lands.
function useOnce(fn: () => void) {
  const last = useRef(0);
  return () => {
    const now = Date.now();
    if (now - last.current < GUARD_MS) return;
    last.current = now;
    fn();
  };
}

// Light haptic on press-in (v3 R-09), once per press under the same 700 ms guard as useOnce.
export function useTapHaptic() {
  return useOnce(haptic.light);
}

const styles = StyleSheet.create({
  btn: {
    minHeight: size.button,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  link: { minHeight: 44, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', paddingHorizontal: 12 },
});
