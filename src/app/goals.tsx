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
  const full = picked.length >= MAX_GOALS;

  const toggle = (goal: string) => {
    if (full && !picked.includes(goal)) return;
    const goals = picked.includes(goal) ? picked.filter((g) => g !== goal) : [...picked, goal];
    set({ goals });
    track('answer', { screen: 'goals', goals });
  };

  return (
    <ScreenShell
      variant="sky"
      route="/goals"
      reply={<JunoReply text={picked.length ? S.goals.reply : null} onSky />}
      footer={<PrimaryButton label={S.common.continue} disabled={picked.length === 0} onPress={() => router.push(nextRoute('/goals'))} />}>
      <Title onSky sub={S.goals.limit} why={picked.length ? fill(S.goals.selected, { n: picked.length }) : S.goals.noneSelected}>
        {S.goals.q}
      </Title>
      <View style={styles.list}>
        {S.goals.options.map((goal) => {
          const off = full && !picked.includes(goal);
          return (
            <View
              key={goal}
              style={off && styles.off}
              pointerEvents={off ? 'none' : 'auto'}
              accessible={off}
              accessibilityRole={off ? 'checkbox' : undefined}
              accessibilityLabel={off ? goal : undefined}
              accessibilityState={off ? { disabled: true, checked: false } : undefined}>
              <OptionCard label={goal} icon={goalIcons[goal]} selected={picked.includes(goal)} onPress={() => toggle(goal)} />
            </View>
          );
        })}
      </View>
    </ScreenShell>
  );
}

const MAX_GOALS = 3;

const styles = StyleSheet.create({
  list: { gap: 14 },
  off: { opacity: 0.4 },
});
