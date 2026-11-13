import { useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import { colors, radius, size, type, FONT_CAP, TITLE_CAP } from '@/theme/tokens';
import { PressableScale } from './PressableScale';

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
  return (
    <PressableScale
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      disabled={off}
      onPress={guarded}
      style={[
        styles.btn,
        { backgroundColor: disabled ? colors.buttonDisabled : tone === 'navy' ? colors.navy : colors.button },
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.buttonText} />
      ) : (
        <Text maxFontSizeMultiplier={TITLE_CAP} style={[type.button, { color: disabled ? colors.buttonDisabledText : colors.buttonText }]} numberOfLines={2}>
          {label}
        </Text>
      )}
    </PressableScale>
  );
}

export function TextLink({ label, onPress, muted, testID }: { label: string; onPress: () => void; muted?: boolean; testID?: string }) {
  const guarded = useOnce(onPress);
  return (
    <PressableScale testID={testID} accessibilityRole="button" onPress={guarded} style={styles.link} hitSlop={10}>
      <Text maxFontSizeMultiplier={FONT_CAP} style={[type.link, muted && { color: colors.muted, fontWeight: '500' }]}>{label}</Text>
    </PressableScale>
  );
}

// A double tap must navigate once (spec section 4): ignore presses for 700 ms after one lands.
function useOnce(fn: () => void) {
  const last = useRef(0);
  return () => {
    const now = Date.now();
    if (now - last.current < 700) return;
    last.current = now;
    fn();
  };
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
