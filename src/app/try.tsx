import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Keyboard } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { extractSymptoms } from '@/mocks/extractSymptoms';
import { EASE_OUT } from '@/motion/tokens';
import { useOnboarding } from '@/state/onboarding';
import { colors, radius, type, FONT_CAP } from '@/theme/tokens';
import { TextField } from '@/ui/Fields';
import { haptic } from '@/ui/haptics';
import { Icon } from '@/ui/Icon';
import { PressableScale } from '@/ui/PressableScale';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

// From Figma 36 try-logging. No account needed. The entry is saved to state as typed.
export default function Try() {
  const { state, set } = useOnboarding();
  const input = useRef<React.ComponentRef<typeof TextInput>>(null);
  const [micHint, setMicHint] = useState(false);
  const entry = state.todayEntry;
  const ready = entry.trim().length > 0;

  const save = (text: string) => set({ todayEntry: text });
  const go = () => {
    const todaySymptoms = extractSymptoms(entry.trim()).symptoms;
    // A new entry re-seeds the symptoms screen's pre-ticks.
    set((s) => ({ todayEntry: entry.trim(), todaySymptoms, symptomsSeeded: s.todaySymptoms.join('|') === todaySymptoms.join('|') ? s.symptomsSeeded : false }));
    track('answer', { screen: 'try', length: entry.trim().length, matched: todaySymptoms.length });
    Keyboard.dismiss(); // close it before the next screen lays out, so nothing there moves as it hides
    router.push(nextRoute('/try'));
  };

  return (
    <ScreenShell
      route="/try"
      footer={<PrimaryButton label={S.common.continue} disabled={!ready} onPress={go} testID="try-continue" />}>
      <Title>{S.try.q}</Title>
      <TextField
        ref={input}
        value={entry}
        onChangeText={save}
        placeholder={S.try.placeholder}
        accessibilityLabel={S.try.q}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={() => ready && go()}
        style={styles.input}
        right={
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={S.try.mic}
            onPress={() => {
              input.current?.focus();
              setMicHint(true);
            }}
            style={styles.mic}
            hitSlop={6}>
            <Icon name="mic.fill" size={16} color="#FFFFFF" />
          </PressableScale>
        }
      />
      {micHint && <Text maxFontSizeMultiplier={FONT_CAP} style={styles.hint}>{S.try.micUnavailable}</Text>}
      <View style={styles.suggestions}>
        {S.try.suggestions.map((sugg, i) => (
          <Animated.View key={sugg} entering={FadeIn.duration(220).delay(120 + i * 40).easing(EASE_OUT)}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={sugg}
              onPress={() => {
                haptic.selection();
                save(sugg);
              }}
              hitSlop={4}
              style={[styles.sugg, entry === sugg && styles.suggOn]}>
              <Icon name="bubble.left" size={15} color={colors.orange} />
              <Text maxFontSizeMultiplier={FONT_CAP} style={styles.suggText}>{sugg}</Text>
            </PressableScale>
          </Animated.View>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  input: { fontSize: 18 },
  mic: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1E7CF2', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  hint: { ...type.small, color: colors.muted, textAlign: 'center', marginTop: 8, paddingHorizontal: 24 },
  suggestions: { marginTop: 14, alignItems: 'center', gap: 10 },
  sugg: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: '#C5CEDC',
    backgroundColor: '#F3F6F9',
  },
  suggOn: { borderColor: colors.orangeBorder, backgroundColor: colors.orangeFill },
  suggText: { fontSize: 16, lineHeight: 21, fontWeight: '600', color: colors.ink },
});
