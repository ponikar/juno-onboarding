import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { useOnboarding } from '@/state/onboarding';
import { EnergySlider } from '@/ui/EnergySlider';
import { JunoReply } from '@/ui/JunoReply';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

// From Figma 37 energy-slider.
export default function Energy() {
  const { state, set } = useOnboarding();
  return (
    <ScreenShell
      route="/energy"
      reply={<JunoReply text={state.energy !== null ? S.energy.reply : null} />}
      footer={<PrimaryButton label={S.common.continue} onPress={() => router.push(nextRoute('/energy'))} />}>
      <Title>{S.energy.q}</Title>
      <View style={styles.slider}>
        <EnergySlider
          value={state.energy}
          onChange={(n) => {
            set({ energy: n });
            track('answer', { screen: 'energy', energy: n });
          }}
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  slider: { marginTop: 150, marginBottom: 40 },
});
