import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { useOnboarding } from '@/state/onboarding';
import { supportIcons } from '@/ui/art';
import { JunoReply } from '@/ui/JunoReply';
import { OptionCard } from '@/ui/OptionCard';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

// Screen 11 (from Figma 45 support-circle; the 46 reply line shows on the same screen).
export default function Support() {
  const { state, set } = useOnboarding();
  return (
    <ScreenShell
      route="/support"
      reply={<JunoReply text={state.support ? S.support.reply : null} />}
      footer={
        <PrimaryButton label={S.common.continue} disabled={!state.support} onPress={() => router.push(nextRoute('/support'))} />
      }>
      <Title>{S.support.q}</Title>
      <View style={styles.list}>
        {S.support.options.map((o) => (
          <OptionCard
            key={o.id}
            label={o.label}
            icon={supportIcons[o.id]}
            multi={false}
            selected={state.support === o.id}
            onPress={() => {
              set({ support: o.id });
              track('answer', { screen: 'support', support: o.id });
            }}
          />
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: { gap: 13, marginBottom: 20 },
});
