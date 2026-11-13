import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { fill, S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { useOnboarding } from '@/state/onboarding';
import { goalIcons } from '@/ui/art';
import { JunoReply } from '@/ui/JunoReply';
import { OptionCard } from '@/ui/OptionCard';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

// Screen 5 (from Figma 14 goals). goals[0] is the first goal picked.
export default function Goals() {
  const { state, set } = useOnboarding();
  const picked = state.goals;

  const toggle = (goal: string) => {
    const goals = picked.includes(goal) ? picked.filter((g) => g !== goal) : [...picked, goal];
    set({ goals });
    track('answer', { screen: 'goals', goals });
  };

  return (
    <ScreenShell
      variant="sky"
      route="/goals"
      footer={<PrimaryButton label={S.common.continue} disabled={picked.length === 0} onPress={() => router.push(nextRoute('/goals'))} />}>
      <Title onSky sub={picked.length ? fill(S.goals.selected, { n: picked.length }) : S.goals.noneSelected}>
        {S.goals.q}
      </Title>
      <View style={styles.list}>
        {S.goals.options.map((goal) => (
          <OptionCard key={goal} label={goal} icon={goalIcons[goal]} selected={picked.includes(goal)} onPress={() => toggle(goal)} />
        ))}
      </View>
      <View style={styles.reply}>
        <JunoReply text={picked.length ? S.goals.reply : null} onSky />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: { gap: 14 },
  reply: { marginTop: 16 },
});
