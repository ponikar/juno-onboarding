import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fill, S } from '@/copy/strings';
import { STATE_MS } from '@/motion/tokens';
import { colors, radius, shadow, space, type, FONT_CAP } from '@/theme/tokens';
import { Tick } from '@/ui/Chip';
import { SearchField } from '@/ui/Fields';
import { haptic } from '@/ui/haptics';
import { Icon } from '@/ui/Icon';
import { JunoReply } from '@/ui/JunoReply';
import { PressableScale } from '@/ui/PressableScale';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';
import { ALL_CONDITIONS, TOP_CONDITIONS, useConditionPick } from './useConditionPick';

// Screen 6, experiment variant A "Short list": 6 full-width rows, the rest expand in place.
export function ConditionsA() {
  const { picked, seeking, query, setQuery, matches, custom, addCustom, toggle, toggleSeeking, reply, ctaLabel, canContinue, onContinue } =
    useConditionPick();
  const [expanded, setExpanded] = useState(false);
  const searching = query.trim().length > 0;

  // Collapsed list keeps any picked condition outside the top 6 visible, so a selection never hides.
  const pickedCustom = picked.filter((c) => !ALL_CONDITIONS.includes(c));
  const rows = searching
    ? matches
    : expanded
      ? [...ALL_CONDITIONS, ...pickedCustom]
      : [...ALL_CONDITIONS.filter((c) => TOP_CONDITIONS.includes(c) || picked.includes(c)), ...pickedCustom];

  return (
    <ScreenShell route="/conditions" footer={<PrimaryButton label={ctaLabel} disabled={!canContinue} onPress={onContinue} />}>
      <Title why={S.conditions.why}>{S.conditions.q}</Title>
      <SearchField quiet placeholder={S.conditions.search} value={query} onChangeText={setQuery} accessibilityLabel={S.conditions.search} />
      <View style={styles.list}>
        {rows.map((c) => (
          <Row key={c} label={c} selected={picked.includes(c)} onPress={() => toggle(c)} />
        ))}
        {custom && (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={fill(S.common.addCustom, { text: custom })}
            onPress={() => {
              haptic.selection();
              addCustom();
            }}
            style={[styles.row, styles.rowPlain, shadow.card]}>
            <Text maxFontSizeMultiplier={FONT_CAP} style={[type.chip, styles.label]}>{fill(S.common.addCustom, { text: custom })}</Text>
            <Icon name="plus" size={16} color={colors.ink} weight="semibold" />
          </PressableScale>
        )}
        {!searching && (
          <PressableScale
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            accessibilityLabel={expanded ? S.conditions.showFewer : S.conditions.showAll}
            onPress={() => setExpanded(!expanded)}
            style={styles.more}>
            <Text maxFontSizeMultiplier={FONT_CAP} style={type.link}>{expanded ? S.conditions.showFewer : S.conditions.showAll}</Text>
            <Icon name={expanded ? 'chevron.up' : 'chevron.down'} size={13} color={colors.ink} weight="semibold" />
          </PressableScale>
        )}
      </View>
      <View style={styles.divider} />
      <View style={styles.seekingWrap}>
        <Row label={S.conditions.seeking} selected={seeking} onPress={toggleSeeking} quiet />
      </View>
      <View style={styles.reply}>
        <JunoReply text={reply} />
      </View>
    </ScreenShell>
  );
}

function Row({ label, selected, onPress, quiet }: { label: string; selected: boolean; onPress: () => void; quiet?: boolean }) {
  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      onPress={() => {
        haptic.selection();
        onPress();
      }}
      style={[
        styles.row,
        !quiet && shadow.card,
        {
          backgroundColor: selected ? colors.orangeFill : quiet ? 'transparent' : colors.surface,
          borderColor: selected ? colors.orangeBorder : quiet ? colors.hairline : colors.surface,
          transitionProperty: ['backgroundColor', 'borderColor'],
          transitionDuration: STATE_MS,
        } as object,
      ]}>
      <Text maxFontSizeMultiplier={FONT_CAP} style={[quiet ? type.chip : type.label, styles.label]}>{label}</Text>
      <Tick selected={selected} ringless big />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: space.m, gap: space.s },
  row: {
    minHeight: 52,
    marginHorizontal: space.cardGutter,
    borderRadius: radius.card,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.m,
    paddingLeft: 20,
    paddingRight: 16,
    paddingVertical: 8,
  },
  rowPlain: { backgroundColor: colors.surface, borderColor: colors.surface },
  label: { flex: 1 },
  more: {
    minHeight: 44,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.hairline, marginHorizontal: space.cardGutter, marginTop: space.xs },
  seekingWrap: { marginTop: space.m },
  reply: { marginTop: space.l },
});
