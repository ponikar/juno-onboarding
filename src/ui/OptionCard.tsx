import { ReactNode } from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

import { STATE_MS } from '@/motion/tokens';
import { colors, radius, shadow, size, type, FONT_CAP } from '@/theme/tokens';
import { Tick } from './Chip';
import { haptic } from './haptics';
import { PressableScale } from './PressableScale';

// Full-width option row (Figma 14 goals, 31 sex, 33 age, 45 support).
export function OptionCard({ label, icon, iconNode, selected, onPress, multi = true, testID }: {
  label: string;
  icon?: ImageSourcePropType;
  iconNode?: ReactNode;
  selected: boolean;
  onPress: () => void;
  multi?: boolean;
  testID?: string;
}) {
  return (
    <PressableScale
      testID={testID}
      accessibilityRole={multi ? 'checkbox' : 'radio'}
      accessibilityState={multi ? { checked: selected } : { selected }}
      accessibilityLabel={label}
      onPress={() => {
        haptic.selection();
        onPress();
      }}
      style={[
        styles.card,
        shadow.card,
        {
          backgroundColor: selected ? colors.orangeFill : colors.surface,
          borderColor: selected ? colors.orangeBorder : colors.surface,
          transitionProperty: ['backgroundColor', 'borderColor'],
          transitionDuration: STATE_MS,
        } as object,
      ]}>
      <View style={styles.icon}>
        {icon ? <Image source={icon} style={styles.iconImg} resizeMode="contain" /> : iconNode}
      </View>
      <Text maxFontSizeMultiplier={FONT_CAP} style={[type.label, styles.label]}>{label}</Text>
      <Tick selected={selected} big />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: size.card,
    marginHorizontal: 16,
    borderRadius: radius.card,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 10,
  },
  icon: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  iconImg: { width: 28, height: 28 },
  label: { flex: 1 },
});
