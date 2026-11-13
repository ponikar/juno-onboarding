import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { S } from '@/copy/strings';
import { FLOW } from '@/flow';
import { presetState, useOnboarding } from '@/state/onboarding';
import { colors, radius, type } from '@/theme/tokens';
import { PressableScale } from '@/ui/PressableScale';

// Walkthrough helper: long-press the Juno logo on Welcome. Not part of the user flow.
export default function Debug() {
  const insets = useSafeAreaInsets();
  const { reset } = useOnboarding();
  const go = (route: string) => {
    router.dismissAll();
    router.replace(route as never);
  };
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
      <Text style={[type.title, { marginVertical: 12 }]}>{S.debug.title}</Text>
      <View style={styles.row}>
        <Btn label={S.debug.demo} onPress={() => reset(presetState('demo'))} />
        <Btn label={S.debug.reset} onPress={() => { reset(); go('/welcome'); }} />
      </View>
      {FLOW.map((s) => (
        <PressableScale key={s.route} onPress={() => go(s.route)} style={styles.item} accessibilityRole="button">
          <Text style={type.body}>{`${s.n}. ${s.route.slice(1)}`}</Text>
          <Text style={[type.small, { color: colors.muted }]}>{s.from}</Text>
        </PressableScale>
      ))}
    </ScrollView>
  );
}

function Btn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} style={styles.btn} accessibilityRole="button">
      <Text style={[type.small, { color: '#fff', fontWeight: '600' }]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  btn: { backgroundColor: colors.button, borderRadius: radius.pill, paddingHorizontal: 14, minHeight: 44, justifyContent: 'center' },
  item: { backgroundColor: colors.surface, borderRadius: 14, padding: 12, marginBottom: 6, minHeight: 44 },
});
