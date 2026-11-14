import { SymbolView } from 'expo-symbols';
import { Text } from 'react-native';
import { FONT_CAP } from '@/theme/tokens';

const FALLBACK: Record<string, string> = {
  'arrow.left': '←',
  xmark: '✕',
  checkmark: '✓',
  magnifyingglass: '⌕',
  'mic.fill': '🎤',
  plus: '+',
  'chevron.left': '‹',
  'chevron.right': '›',
  'arrow.up': '↑',
  'envelope': '✉',
  'checkmark.shield.fill': '✓',
  'bell.fill': '🔔',
  'star.fill': '★',
  'bubble.left': '💬',
  stethoscope: '+',
  'text.bubble.fill': '💬',
  'pills.fill': '💊',
  calendar: '📅',
  'battery.75': '🔋',
  sparkles: '✨',
};

export function Icon({ name, size = 18, color = '#261910', weight = 'medium' }: {
  name: string;
  size?: number;
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}) {
  return (
    <SymbolView
      name={name as never}
      size={size}
      tintColor={color}
      weight={weight}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      fallback={<Text maxFontSizeMultiplier={FONT_CAP} style={{ fontSize: size, color, lineHeight: size + 2 }}>{FALLBACK[name] ?? '•'}</Text>}
    />
  );
}
