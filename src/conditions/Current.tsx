import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { fill, S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { customEntry } from '@/lib/search';
import { track } from '@/lib/track';
import { useOnboarding } from '@/state/onboarding';
import { space, type, FONT_CAP, size } from '@/theme/tokens';
import { Chip, ChipWrap, Tick } from '@/ui/Chip';
import { SearchField } from '@/ui/Fields';
import { haptic } from '@/ui/haptics';
import { JunoReply } from '@/ui/JunoReply';
import { PressableScale } from '@/ui/PressableScale';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

const shortName = (c: string) => c.replace(/\s*\(.*\)$/, '');

// Screen 6 (from Figma 17 conditions; "Still looking for answers" replaces screen 18).
export function ConditionsCurrent() {
  const { state, set } = useOnboarding();
  const [query, setQuery] = useState('');
  const picked = state.conditions;
  const q = query.trim().toLowerCase();
  const options = S.conditions.options.filter((c) => c.toLowerCase().includes(q));
  const custom = customEntry(query, S.conditions.options, picked);

  const toggle = (c: string) => {
    const conditions = picked.includes(c) ? picked.filter((x) => x !== c) : [...picked, c];
    set({ conditions });
    track('answer', { screen: 'conditions', conditions });
  };
  const toggleSeeking = () => {
    haptic.selection();
    set({ seekingDiagnosis: !state.seekingDiagnosis });
    track('answer', { screen: 'conditions', seekingDiagnosis: !state.seekingDiagnosis });
  };

  const reply = picked.length
    ? fill(S.conditions.reply, { condition: shortName(picked[0]) })
    : state.seekingDiagnosis
      ? S.conditions.replyNone
      : null;
  const label =
    picked.length === 0 ? S.common.continue : picked.length === 1 ? S.conditions.add1 : fill(S.conditions.addN, { n: picked.length });

  return (
    <ScreenShell
      route="/conditions"
      footer={
        <PrimaryButton
          label={label}
          disabled={picked.length === 0 && !state.seekingDiagnosis}
          onPress={() => router.push(nextRoute('/conditions'))}
        />
      }>
      <Title why={S.conditions.why}>{S.conditions.q}</Title>
      <SearchField placeholder={S.conditions.search} value={query} onChangeText={setQuery} accessibilityLabel={S.conditions.search} />
      {/* Always reserves the row (as in Figma), so picking never pushes the list down. */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={styles.pickedRow} contentContainerStyle={styles.pickedContent}>
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
          {picked.map((c) => (
            <Chip key={c} label={shortName(c)} selected onToggle={() => toggle(c)} />
          ))}
      </ScrollView>
      <View style={styles.list}>
        <ChipWrap>
          {options.map((c) => (
            <Chip key={c} label={c} selected={picked.includes(c)} onToggle={() => toggle(c)} />
          ))}
        </ChipWrap>
      </View>
      <PressableScale
        accessibilityRole="checkbox"
        accessibilityState={{ checked: state.seekingDiagnosis }}
        accessibilityLabel={S.conditions.seeking}
        onPress={toggleSeeking}
        style={styles.seeking}>
        <Tick selected={state.seekingDiagnosis} />
        <Text maxFontSizeMultiplier={FONT_CAP} style={type.link}>{S.conditions.seeking}</Text>
      </PressableScale>
      <View style={styles.reply}>
        <JunoReply text={reply} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  pickedRow: { marginTop: 18, flexGrow: 0, minHeight: size.chip },
  pickedContent: { paddingHorizontal: space.gutter, gap: 9 },
  list: { marginTop: 14 },
  seeking: {
    minHeight: 44,
    marginTop: 4,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
  },
  reply: { marginTop: 16 },
});
