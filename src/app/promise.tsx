import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { OnboardingState, useOnboarding } from '@/state/onboarding';
import { haptic } from '@/ui/haptics';
import { JunoReply } from '@/ui/JunoReply';
import { Mascot } from '@/ui/Mascot';
import { OptionCard } from '@/ui/OptionCard';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

type Commitment = NonNullable<OnboardingState['commitment']>;

const OPTIONS: { id: Commitment; label: string }[] = [
  { id: 'most_days', label: S.commit.optMost },
  { id: 'good_days', label: S.commit.optGood },
  { id: 'unsure', label: S.commit.optUnsure },
];

// Screen 17 Commit (v3 R-03): one line a day. "Not sure yet" skips When.
export default function Commit() {
  const { state, set } = useOnboarding();
  const picked = useRef(state.commitment !== null);
  const [nods, setNods] = useState(0);
  const unsure = state.commitment === 'unsure';

  const pick = (id: Commitment) => {
    set(id === 'unsure' ? { commitment: id, checkInTime: null } : { commitment: id });
    track('answer', { screen: 'promise', commitment: id });
    if (!picked.current) {
      picked.current = true;
      haptic.success();
    }
    setNods((n) => n + 1);
  };

  const next = () => {
    if (unsure) {
      set({ checkInTime: null });
      router.push('/demo');
    } else router.push(nextRoute('/promise'));
  };

  return (
    <ScreenShell
      route="/promise"
      reply={<JunoReply text={state.commitment ? (unsure ? S.commit.replyUnsure : S.commit.reply) : null} id={unsure ? 'unsure' : 'yes'} />}
      footer={<PrimaryButton label={unsure ? S.card.cta : S.commit.cta} disabled={!state.commitment} onPress={next} testID="commit-cta" />}>
      <Mascot style={styles.mascot} nod={nods} />
      <Title why={S.commit.sub}>{S.commit.q}</Title>
      <View style={styles.list}>
        {OPTIONS.map((o) => (
          <OptionCard key={o.id} testID={`commit-${o.id}`} label={o.label} multi={false} selected={state.commitment === o.id} onPress={() => pick(o.id)} />
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  mascot: { alignSelf: 'flex-start', marginLeft: 12, width: 120, height: 90, marginTop: 12, marginBottom: -18 },
  list: { gap: 13, marginBottom: 8 },
});
