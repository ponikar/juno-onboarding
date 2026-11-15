import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { fill, S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { customEntry } from '@/lib/search';
import { track } from '@/lib/track';
import { useOnboarding } from '@/state/onboarding';
import { Chip, ChipWrap } from '@/ui/Chip';
import { EscapeButton } from '@/ui/EscapeButton';
import { SearchField } from '@/ui/Fields';
import { JunoReply } from '@/ui/JunoReply';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

const shortName = (c: string) => c.replace(/\s*\(.*\)$/, '');

// Screen 6 (from Figma 17 conditions; "Still looking for answers" replaces screen 18).
export default function Conditions() {
  const { state, set } = useOnboarding();
  const [query, setQuery] = useState('');
  const picked = state.conditions;
  const q = query.trim().toLowerCase();
  const options = S.conditions.options.filter((c) => c.toLowerCase().includes(q));
  const custom = customEntry(query, S.conditions.options, picked);
  // Picked items the user added themselves; they sit at the end of the one list, ticked.
  const extras = picked.filter((x) => !(S.conditions.options as readonly string[]).includes(x) && x.toLowerCase().includes(q));

  const toggle = (c: string) => {
    const conditions = picked.includes(c) ? picked.filter((x) => x !== c) : [...picked, c];
    set({ conditions });
    track('answer', { screen: 'conditions', conditions });
  };
  const toggleSeeking = () => {
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
      variant="sky"
      route="/conditions"
      reply={<JunoReply text={reply} />}
      footer={
        <>
          <PrimaryButton
            label={label}
            disabled={picked.length === 0 && !state.seekingDiagnosis}
            onPress={() => router.push(nextRoute('/conditions'))}
          />
          <EscapeButton label={S.conditions.seeking} selected={state.seekingDiagnosis} onPress={toggleSeeking} />
        </>
      }>
      <Title onSky why={S.conditions.why}>{S.conditions.q}</Title>
      <SearchField placeholder={S.conditions.search} value={query} onChangeText={setQuery} accessibilityLabel={S.conditions.search} />
      <View style={styles.list}>
        <ChipWrap onSky>
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
          {options.map((c) => (
            <Chip key={c} label={c} selected={picked.includes(c)} onToggle={() => toggle(c)} />
          ))}
          {extras.map((x) => (
            <Chip key={x} label={x} selected onToggle={() => toggle(x)} />
          ))}
        </ChipWrap>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: 14 },
});
