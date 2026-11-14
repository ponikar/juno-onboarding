import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fill, S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { customEntry } from '@/lib/search';
import { track } from '@/lib/track';
import { useOnboarding } from '@/state/onboarding';
import { colors, space, FONT_CAP } from '@/theme/tokens';
import { Chip, ChipWrap } from '@/ui/Chip';
import { EscapeButton } from '@/ui/EscapeButton';
import { SearchField } from '@/ui/Fields';
import { JunoReply } from '@/ui/JunoReply';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

const shortName = (c: string) => c.replace(/\s*\(.*\)$/, '');

// Screen 7 (from Figma 20 symptoms). Arrives with screen 4's symptoms ticked (R-05).
export default function Symptoms() {
  const { state, set } = useOnboarding();
  const [query, setQuery] = useState('');
  const [changed, setChanged] = useState(false);
  const [seedingNow] = useState(!state.symptomsSeeded);
  const picked = state.symptomsSeeded ? state.symptoms : state.todaySymptoms;

  useEffect(() => {
    if (!state.symptomsSeeded) set({ symptoms: state.todaySymptoms, symptomsSeeded: true });
  }, [state.symptomsSeeded, state.todaySymptoms, set]);

  const q = query.trim().toLowerCase();
  const options = S.symptoms.options.filter((s) => s.toLowerCase().includes(q));
  const custom = customEntry(query, S.symptoms.options, picked);
  // Picked items the user added themselves; they sit at the end of the one list, ticked.
  const extras = picked.filter((x) => !(S.symptoms.options as readonly string[]).includes(x) && x.toLowerCase().includes(q));

  const toggle = (s: string) => {
    const symptoms = picked.includes(s) ? picked.filter((x) => x !== s) : [...picked, s];
    set({ symptoms, noSymptoms: false, symptomsSeeded: true });
    setChanged(true);
    track('answer', { screen: 'symptoms', symptoms });
  };
  const toggleNone = () => {
    set({ noSymptoms: !state.noSymptoms, symptoms: [], symptomsSeeded: true });
    setChanged(true);
    track('answer', { screen: 'symptoms', noSymptoms: !state.noSymptoms });
  };

  const group = state.conditions.length ? fill(S.symptoms.groupFor, { condition: shortName(state.conditions[0]) }) : S.symptoms.groupCommon;
  const label = picked.length === 0 ? S.common.continue : picked.length === 1 ? S.symptoms.add1 : fill(S.symptoms.addN, { n: picked.length });

  return (
    <ScreenShell
      route="/symptoms"
      reply={<JunoReply text={changed ? S.symptoms.reply : null} />}
      footer={
        <>
          <PrimaryButton label={label} disabled={picked.length === 0 && !state.noSymptoms} onPress={() => router.push(nextRoute('/symptoms'))} />
          <EscapeButton label={S.symptoms.none} selected={state.noSymptoms} onPress={toggleNone} />
        </>
      }>
      <Title why={S.symptoms.why}>{S.symptoms.q}</Title>
      <SearchField placeholder={S.symptoms.search} value={query} onChangeText={setQuery} accessibilityLabel={S.symptoms.search} />
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
        {options.map((s) => (
          <Chip
            key={s}
            label={s}
            selected={picked.includes(s)}
            preTicked={seedingNow && state.todaySymptoms.includes(s)}
            onToggle={() => toggle(s)}
          />
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
});
