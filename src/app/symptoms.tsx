import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { fill, S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { useOnboarding } from '@/state/onboarding';
import { colors, space, type } from '@/theme/tokens';
import { Chip, ChipWrap, Tick } from '@/ui/Chip';
import { SearchField } from '@/ui/Fields';
import { haptic } from '@/ui/haptics';
import { JunoReply } from '@/ui/JunoReply';
import { PressableScale } from '@/ui/PressableScale';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

const shortName = (c: string) => c.replace(/\s*\(.*\)$/, '');

// Screen 7 (from Figma 20 symptoms). Arrives with screen 4's symptoms ticked (R-05).
export default function Symptoms() {
  const { state, set } = useOnboarding();
  const [query, setQuery] = useState('');
  const [changed, setChanged] = useState(false);
  const seedingNow = useRef(!state.symptomsSeeded).current;
  const picked = state.symptomsSeeded ? state.symptoms : state.todaySymptoms;

  useEffect(() => {
    if (!state.symptomsSeeded) set({ symptoms: state.todaySymptoms, symptomsSeeded: true });
  }, [state.symptomsSeeded, state.todaySymptoms, set]);

  const q = query.trim().toLowerCase();
  const options = S.symptoms.options.filter((s) => s.toLowerCase().includes(q));

  const toggle = (s: string) => {
    const symptoms = picked.includes(s) ? picked.filter((x) => x !== s) : [...picked, s];
    set({ symptoms, noSymptoms: false, symptomsSeeded: true });
    setChanged(true);
    track('answer', { screen: 'symptoms', symptoms });
  };
  const toggleNone = () => {
    haptic.selection();
    set({ noSymptoms: !state.noSymptoms, symptoms: [], symptomsSeeded: true });
    setChanged(true);
    track('answer', { screen: 'symptoms', noSymptoms: !state.noSymptoms });
  };

  const group = state.conditions.length ? fill(S.symptoms.groupFor, { condition: shortName(state.conditions[0]) }) : S.symptoms.groupCommon;
  const label = picked.length === 0 ? S.common.continue : picked.length === 1 ? S.symptoms.add1 : fill(S.symptoms.addN, { n: picked.length });

  return (
    <ScreenShell
      route="/symptoms"
      footer={
        <PrimaryButton label={label} disabled={picked.length === 0 && !state.noSymptoms} onPress={() => router.push(nextRoute('/symptoms'))} />
      }>
      <Title why={S.symptoms.why}>{S.symptoms.q}</Title>
      <SearchField placeholder={S.symptoms.search} value={query} onChangeText={setQuery} accessibilityLabel={S.symptoms.search} />
      {picked.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickedRow} contentContainerStyle={styles.pickedContent}>
          {picked.map((s) => (
            <Chip key={s} label={s} selected onToggle={() => toggle(s)} />
          ))}
        </ScrollView>
      )}
      <View style={styles.group}>
        <Text style={styles.groupText}>{group}</Text>
        <View style={styles.rule} />
      </View>
      <ChipWrap>
        {options.map((s) => (
          <Chip
            key={s}
            label={s}
            selected={picked.includes(s)}
            preTicked={seedingNow && state.todaySymptoms.includes(s)}
            onToggle={() => toggle(s)}
          />
        ))}
      </ChipWrap>
      <PressableScale
        accessibilityRole="checkbox"
        accessibilityState={{ checked: state.noSymptoms }}
        accessibilityLabel={S.symptoms.none}
        onPress={toggleNone}
        style={styles.toggleLink}>
        <Tick selected={state.noSymptoms} />
        <Text style={type.link}>{S.symptoms.none}</Text>
      </PressableScale>
      <View style={styles.reply}>
        <JunoReply text={changed ? S.symptoms.reply : null} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  pickedRow: { marginTop: 18, flexGrow: 0 },
  pickedContent: { paddingHorizontal: space.gutter, gap: 9 },
  group: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: space.gutter, marginTop: 30, marginBottom: 18 },
  groupText: { fontSize: 16, lineHeight: 21, fontWeight: '600', color: colors.muted },
  rule: { flex: 1, height: 1.5, backgroundColor: '#C9CFDA' },
  toggleLink: {
    minHeight: 44,
    marginTop: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
  },
  reply: { marginTop: 16 },
});
