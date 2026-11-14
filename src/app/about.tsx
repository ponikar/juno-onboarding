import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fill, S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { useOnboarding } from '@/state/onboarding';
import { colors, FONT_CAP } from '@/theme/tokens';
import { Chip, ChipWrap } from '@/ui/Chip';
import { TextField } from '@/ui/Fields';
import { JunoReply } from '@/ui/JunoReply';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

const REPLY_AFTER_TYPING_MS = 600;

// Screen 12 (from Figma 21 name, 31 sex, 33 age). Every input is optional.
export default function About() {
  const { state, set } = useOnboarding();
  const name = state.name.trim();
  const [greeted, setGreeted] = useState(name);

  useEffect(() => {
    const t = setTimeout(() => setGreeted(name), REPLY_AFTER_TYPING_MS);
    return () => clearTimeout(t);
  }, [name]);

  return (
    <ScreenShell
      route="/about"
      footer={<PrimaryButton label={S.common.continue} onPress={() => router.push(nextRoute('/about'))} />}>
      <Title>{S.about.q}</Title>
      <TextField
        value={state.name}
        onChangeText={(t) => set({ name: t })}
        onBlur={() => {
          setGreeted(name);
          if (name) track('answer', { screen: 'about', name: true });
        }}
        onClear={() => set({ name: '' })}
        clearLabel={S.about.clear}
        placeholder={S.about.namePlaceholder}
        autoCapitalize="words"
        autoCorrect={false}
        textContentType="givenName"
        returnKeyType="done"
      />
      <Text maxFontSizeMultiplier={FONT_CAP} style={styles.label}>{S.about.sexLabel}</Text>
      <ChipWrap>
        {S.about.sex.map((o) => (
          <Chip
            key={o.id}
            label={o.label}
            selected={state.sexAtBirth === o.id}
            onToggle={() => {
              const next = state.sexAtBirth === o.id ? null : o.id;
              set({ sexAtBirth: next });
              track('answer', { screen: 'about', sexAtBirth: next });
            }}
          />
        ))}
      </ChipWrap>
      <Text maxFontSizeMultiplier={FONT_CAP} style={styles.label}>{S.about.ageLabel}</Text>
      <ChipWrap>
        {S.about.ages.map((a) => (
          <Chip
            key={a}
            label={a}
            selected={state.ageRange === a}
            onToggle={() => {
              const next = state.ageRange === a ? null : a;
              set({ ageRange: next });
              track('answer', { screen: 'about', ageRange: next });
            }}
          />
        ))}
      </ChipWrap>
      <View style={styles.reply}>
        <JunoReply text={greeted && greeted === name ? fill(S.about.reply, { name }) : null} id={greeted} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 15, lineHeight: 20, fontWeight: '600', color: colors.inkSoft, marginTop: 26, marginBottom: 12, marginHorizontal: 20 },
  reply: { marginTop: 24 },
});
