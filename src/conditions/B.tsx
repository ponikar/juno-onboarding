import { useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { fill, S } from '@/copy/strings';
import { STATE_MS } from '@/motion/tokens';
import { colors, radius, space, type, FONT_CAP } from '@/theme/tokens';
import { Tick } from '@/ui/Chip';
import { SearchField } from '@/ui/Fields';
import { haptic } from '@/ui/haptics';
import { Icon } from '@/ui/Icon';
import { JunoReply } from '@/ui/JunoReply';
import { PressableScale } from '@/ui/PressableScale';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';
import { Sheet } from '@/ui/Sheet';
import { ALL_CONDITIONS, shortName, TOP_CONDITIONS, useConditionPick } from './useConditionPick';

const DONE = 'Done'; // NEW string
const CHIP_H = 44;

function useStateTransition(props: string[]) {
  const reduced = useReducedMotion();
  return { transitionProperty: props, transitionDuration: reduced ? 0 : STATE_MS } as object;
}

// The tick slot is always part of the width; unselected text sits centred in it, so picking never resizes or rewraps a chip.
function PickChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const transition = useStateTransition(['backgroundColor', 'borderColor', 'paddingLeft', 'paddingRight']);
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
        styles.chip,
        selected ? styles.pickOn : styles.pickOff,
        { backgroundColor: selected ? colors.orangeFill : colors.surface, borderColor: selected ? colors.orangeBorder : colors.hairline },
        transition,
      ]}>
      <View style={styles.tickSlot}>
        <Tick selected={selected} ringless />
      </View>
      <Text maxFontSizeMultiplier={FONT_CAP} style={[type.chip, styles.shrink]}>{label}</Text>
    </PressableScale>
  );
}

function ActionChip({ label, icon, onPress }: { label: string; icon: string; onPress: () => void }) {
  return (
    <PressableScale accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={[styles.chip, styles.actionChip]}>
      <Icon name={icon} size={14} color={colors.ink} weight="semibold" />
      <Text maxFontSizeMultiplier={FONT_CAP} style={[type.link, styles.shrink]}>{label}</Text>
    </PressableScale>
  );
}

function RemoveChip({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={fill(S.conditions.remove, { name })}
      onPress={() => {
        haptic.selection();
        onRemove();
      }}
      hitSlop={8}
      style={[styles.chip, styles.removeChip]}>
      <Text maxFontSizeMultiplier={FONT_CAP} numberOfLines={1} style={type.chip}>{name}</Text>
      <Icon name="xmark" size={11} color={colors.ink} weight="bold" />
    </PressableScale>
  );
}

function SheetRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const transition = useStateTransition(['backgroundColor']);
  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      scaleTo={0.99}
      onPress={() => {
        haptic.selection();
        onPress();
      }}
      style={[styles.sheetRow, { backgroundColor: selected ? colors.orangeFill : colors.surface }, transition]}>
      <Text maxFontSizeMultiplier={FONT_CAP} style={[type.body, styles.shrink]}>{label}</Text>
      <Tick selected={selected} ringless />
    </PressableScale>
  );
}

// Screen 6, experiment variant B "Tidy chips": six chips up front, the rest in a sheet or via search.
export function ConditionsB() {
  const { picked, seeking, query, setQuery, matches, custom, addCustom, toggle, remove, toggleSeeking, reply, ctaLabel, canContinue, onContinue } =
    useConditionPick();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { height } = useWindowDimensions();
  const yoursFade = useStateTransition(['opacity']);
  const seekingTransition = useStateTransition(['backgroundColor', 'borderColor', 'paddingLeft']);
  const searching = query.trim().length > 0;
  const shown = searching ? matches : TOP_CONDITIONS;
  const hasPicked = picked.length > 0;

  return (
    <ScreenShell route="/conditions" footer={<PrimaryButton label={ctaLabel} disabled={!canContinue} onPress={onContinue} />}>
      <Title why={S.conditions.why}>{S.conditions.q}</Title>
      <SearchField quiet placeholder={S.conditions.search} value={query} onChangeText={setQuery} accessibilityLabel={S.conditions.search} />
      {/* Height is always reserved and only opacity changes, so the chips below never move on the first pick. */}
      <View
        style={[styles.yours, { opacity: hasPicked ? 1 : 0 }, yoursFade]}
        pointerEvents={hasPicked ? 'auto' : 'none'}
        accessibilityElementsHidden={!hasPicked}
        importantForAccessibility={hasPicked ? 'auto' : 'no-hide-descendants'}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.yoursRow}>
          <Text maxFontSizeMultiplier={FONT_CAP} style={[type.small, styles.yoursLabel]}>{S.conditions.yours}</Text>
          {picked.map((c) => (
            <RemoveChip key={c} name={shortName(c)} onRemove={() => remove(c)} />
          ))}
        </ScrollView>
      </View>
      <View style={styles.wrap}>
        {shown.map((c) => (
          <PickChip key={c} label={c} selected={picked.includes(c)} onPress={() => toggle(c)} />
        ))}
        {custom && <ActionChip icon="plus" label={fill(S.common.addCustom, { text: custom })} onPress={addCustom} />}
        {!searching && <ActionChip icon="plus" label={S.conditions.more} onPress={() => setSheetOpen(true)} />}
      </View>
      <View style={styles.divider} />
      <PressableScale
        accessibilityRole="checkbox"
        accessibilityState={{ checked: seeking }}
        accessibilityLabel={S.conditions.seeking}
        onPress={() => {
          haptic.selection();
          toggleSeeking();
        }}
        style={[styles.seeking, seeking ? styles.seekingOn : styles.seekingOff, seekingTransition]}>
        <View style={styles.tickSlot}>
          <Tick selected={seeking} ringless />
        </View>
        <Text maxFontSizeMultiplier={FONT_CAP} style={[type.chip, styles.shrink]}>{S.conditions.seeking}</Text>
      </PressableScale>
      <View style={styles.reply}>
        <JunoReply text={reply} />
      </View>
      <Sheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <View style={styles.sheetHead}>
          <Text maxFontSizeMultiplier={FONT_CAP} accessibilityRole="header" style={type.label}>{S.conditions.more}</Text>
          <PressableScale accessibilityRole="button" accessibilityLabel={DONE} onPress={() => setSheetOpen(false)} style={styles.done}>
            <Text maxFontSizeMultiplier={FONT_CAP} style={[type.link, { color: colors.orangeStrong }]}>{DONE}</Text>
          </PressableScale>
        </View>
        <ScrollView style={{ maxHeight: height * 0.6 }} contentContainerStyle={styles.sheetList} showsVerticalScrollIndicator={false}>
          {ALL_CONDITIONS.map((c) => (
            <SheetRow key={c} label={c} selected={picked.includes(c)} onPress={() => toggle(c)} />
          ))}
        </ScrollView>
      </Sheet>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  shrink: { flexShrink: 1 },
  chip: {
    maxWidth: '100%',
    minHeight: CHIP_H,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tickSlot: { position: 'absolute', left: 12 },
  pickOn: { paddingLeft: 38, paddingRight: 14 },
  pickOff: { paddingLeft: 26, paddingRight: 26 },
  actionChip: { backgroundColor: 'transparent', borderColor: colors.hairline, borderStyle: 'dashed', paddingLeft: 14 },
  removeChip: { backgroundColor: colors.orangeFill, borderColor: colors.orangeBorder, paddingLeft: 16, paddingRight: 14, gap: 8 },
  yours: { marginTop: 12, minHeight: CHIP_H },
  yoursLabel: { color: colors.inkSoft, marginRight: 3 },
  yoursRow: { paddingHorizontal: space.gutter + 4, gap: 9, alignItems: 'center' },
  wrap: { marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 9, paddingHorizontal: space.gutter },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.hairline, marginHorizontal: space.gutter, marginTop: 18 },
  seeking: {
    minHeight: 52,
    marginTop: 10,
    marginHorizontal: space.gutter,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  seekingOn: { backgroundColor: colors.orangeFill, borderColor: colors.orangeBorder, paddingLeft: 38 },
  seekingOff: { paddingLeft: 16 },
  reply: { marginTop: 12 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  done: { minHeight: 44, minWidth: 44, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', marginRight: -8 },
  sheetList: { gap: 2 },
  sheetRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
});
