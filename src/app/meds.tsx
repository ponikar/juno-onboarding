import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fill, S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { customEntry } from '@/lib/search';
import { track } from '@/lib/track';
import { useOnboarding } from '@/state/onboarding';
import { colors, space, type, FONT_CAP } from '@/theme/tokens';
import { Chip, ChipWrap, Tick } from '@/ui/Chip';
import { SearchField } from '@/ui/Fields';
import { haptic } from '@/ui/haptics';
import { JunoReply } from '@/ui/JunoReply';
import { PressableScale } from '@/ui/PressableScale';
import { PrimaryButton, TextLink } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

const shortName = (c: string) => c.replace(/\s*\(.*\)$/, '');

// Screen 8 (from Figma 19 meds). Figma's "Show more" is hidden: the list has no further items.
export default function Meds() {
  const { state, set } = useOnboarding();
  const [query, setQuery] = useState('');
  const [changed, setChanged] = useState(false);
  const picked = state.medicines;
  const q = query.trim().toLowerCase();
  const options = S.meds.options.filter((m) => m.toLowerCase().includes(q));
  const custom = customEntry(query, S.meds.options, picked);
  // Picked items the user added themselves; they sit at the end of the one list, ticked.
  const extras = picked.filter((x) => !(S.meds.options as readonly string[]).includes(x) && x.toLowerCase().includes(q));

  const toggle = (m: string) => {
    const medicines = picked.includes(m) ? picked.filter((x) => x !== m) : [...picked, m];
    set({ medicines, noMedicines: false, medicinesSkipped: false });
    setChanged(true);
    track('answer', { screen: 'meds', medicines });
  };
  const toggleNone = () => {
    haptic.selection();
    set({ noMedicines: !state.noMedicines, medicines: [], medicinesSkipped: false });
    setChanged(true);
    track('answer', { screen: 'meds', noMedicines: !state.noMedicines });
  };
  const later = () => {
    set({ medicinesSkipped: true, noMedicines: false });
    track('answer', { screen: 'meds', medicinesSkipped: true });
    router.push(nextRoute('/meds'));
  };

  const group = state.conditions.length ? fill(S.meds.groupFor, { condition: shortName(state.conditions[0]) }) : S.meds.groupCommon;
  const label = picked.length === 0 ? S.common.continue : picked.length === 1 ? S.meds.add1 : fill(S.meds.addN, { n: picked.length });

  return (
    <ScreenShell
      route="/meds"
      reply={<JunoReply text={changed ? S.meds.reply : null} />}
      footer={
        <>
          {/* Both ways out on one row, so the list keeps its room on small phones. */}
          <View style={styles.escapeRow}>
            <PressableScale
              accessibilityRole="checkbox"
              accessibilityState={{ checked: state.noMedicines }}
              accessibilityLabel={S.meds.none}
              onPress={toggleNone}
              style={styles.escape}>
              <Tick selected={state.noMedicines} />
              <Text maxFontSizeMultiplier={FONT_CAP} style={type.link}>{S.meds.none}</Text>
            </PressableScale>
            <View style={styles.escapeDivider} />
            <TextLink label={S.meds.later} onPress={later} />
          </View>
          <PrimaryButton label={label} disabled={picked.length === 0 && !state.noMedicines} onPress={() => router.push(nextRoute('/meds'))} />
        </>
      }>
      <Title why={S.meds.why}>{S.meds.q}</Title>
      <SearchField placeholder={S.meds.search} value={query} onChangeText={setQuery} accessibilityLabel={S.meds.search} />
      <View style={styles.group}>
        <Text maxFontSizeMultiplier={FONT_CAP} style={styles.groupText}>{group}</Text>
        <View style={styles.rule} />
      </View>
      <ChipWrap>
        {custom && (
          <Chip
            label={fill(S.common.addCustom, { text: custom })}
            selected={false}
            onToggle={() => {
              toggle(custom);
              setQuery('');
            }}
          />
        )}
        {options.map((m) => (
          <Chip key={m} label={m} selected={picked.includes(m)} onToggle={() => toggle(m)} />
        ))}
        {extras.map((x) => (
          <Chip key={x} label={x} selected onToggle={() => toggle(x)} />
        ))}
      </ChipWrap>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: space.gutter, marginTop: 30, marginBottom: 18 },
  groupText: { fontSize: 16, lineHeight: 21, fontWeight: '600', color: colors.muted },
  rule: { flex: 1, height: 1.5, backgroundColor: '#C9CFDA' },
  escapeRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', columnGap: 4 },
  escapeDivider: { width: 1, height: 18, backgroundColor: colors.hairline },
  escape: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 12,
  },
});
