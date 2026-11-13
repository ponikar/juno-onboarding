import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { colors, radius, size, FONT_CAP } from '@/theme/tokens';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';

// Figma 17/19/20 search field and 21/36 text field: white pill, peach border, 16pt+ text.
export const TextField = forwardRef<React.ComponentRef<typeof TextInput>, TextInputProps & { onClear?: () => void; right?: React.ReactNode; clearLabel?: string }>(
  function TextField({ style, onClear, right, clearLabel, onFocus, onBlur, ...props }, ref) {
    const [focused, setFocused] = useState(false);
    return (
      <View style={[styles.field, focused && styles.focused]}>
        <TextInput maxFontSizeMultiplier={FONT_CAP}
          ref={ref}
          placeholderTextColor={colors.muted}
          style={[styles.input, style]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {onClear && props.value ? (
          <PressableScale accessibilityRole="button" accessibilityLabel={clearLabel} onPress={onClear} hitSlop={10} style={styles.side}>
            <Icon name="xmark" size={13} color={colors.muted} />
          </PressableScale>
        ) : null}
        {right}
      </View>
    );
  },
);

export function SearchField(props: TextInputProps) {
  return (
    <View style={[styles.field, { borderColor: colors.orangeBorder }]}>
      <View style={styles.searchIcon}>
        <Icon name="magnifyingglass" size={17} color={colors.ink} />
      </View>
      <TextInput maxFontSizeMultiplier={FONT_CAP} placeholderTextColor={colors.muted} style={[styles.input, { paddingLeft: 0 }]} returnKeyType="search" {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: size.field,
    marginHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.orangeBorder,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  focused: { borderColor: colors.orange, borderWidth: 2 },
  input: { flex: 1, fontSize: 17, color: colors.ink, paddingHorizontal: 20, paddingVertical: 14 },
  searchIcon: { paddingLeft: 20, paddingRight: 12 },
  side: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: 4 },
});
