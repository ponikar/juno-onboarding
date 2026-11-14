import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { fill, S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { useOnboarding } from '@/state/onboarding';
import { groupIcons } from '@/ui/art';
import { OptionCard } from '@/ui/OptionCard';
import { PrimaryButton, TextLink } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

// Screen 15: Juno's group chats, multi-select, with a plain way past.
export default function Community() {
  const { state, set } = useOnboarding();
  const picked = state.groups;
  const n = picked.length;
  const label = n === 0 ? S.common.continue : n === 1 ? S.community.join1 : fill(S.community.joinN, { n });

  const toggle = (id: string) => {
    const groups = picked.includes(id) ? picked.filter((g) => g !== id) : [...picked, id];
    set({ groups });
    track('answer', { screen: 'community', groups });
  };
  const next = () => router.push(nextRoute('/community'));

  return (
    <ScreenShell
      route="/community"
      footer={
        <>
          <PrimaryButton label={label} onPress={next} />
          <TextLink label={S.community.later} onPress={next} />
        </>
      }>
      <Title sub={S.community.sub}>{S.community.title}</Title>
      <View style={styles.list}>
        {S.community.groups.map((g) => (
          <OptionCard key={g.id} label={g.label} icon={groupIcons[g.id]} selected={picked.includes(g.id)} onPress={() => toggle(g.id)} />
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: { gap: 13, marginBottom: 20 },
});
