import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { useOnboarding } from '@/state/onboarding';
import { colors, type, FONT_CAP } from '@/theme/tokens';
import { bg } from '@/ui/art';
import { Tick } from '@/ui/Chip';
import { haptic } from '@/ui/haptics';
import { PressableScale } from '@/ui/PressableScale';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell } from '@/ui/ScreenShell';

// Screen 2 (from Figma 12 consent). Consent comes before any health data is typed on screen 3.
export default function Consent() {
  const insets = useSafeAreaInsets();
  const { state, set } = useOnboarding();
  const agreed = state.consentGiven;

  return (
    <ScreenShell variant="sky" background={bg.lock} scroll={false}>
      <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom - 6, 12) }]}>
        <Text maxFontSizeMultiplier={FONT_CAP} accessibilityRole="header" style={[type.title, styles.title]}>{S.consent.title}</Text>
        <Text maxFontSizeMultiplier={FONT_CAP} style={styles.body}>{S.consent.body}</Text>
        <View style={styles.panel}>
          <PressableScale
            accessibilityRole="checkbox"
            accessibilityState={{ checked: agreed }}
            onPress={() => {
              haptic.selection();
              set({ consentGiven: !agreed });
              track('answer', { screen: 'consent', value: !agreed });
            }}
            style={styles.agree}
            scaleTo={0.99}>
            <Tick selected={agreed} big />
            <Text maxFontSizeMultiplier={FONT_CAP} style={styles.agreeText}>
              {S.consent.agreeLead} <Text maxFontSizeMultiplier={FONT_CAP} style={styles.strong}>{S.consent.privacy}</Text> {S.consent.and}{' '}
              <Text maxFontSizeMultiplier={FONT_CAP} style={styles.strong}>{S.consent.terms}</Text>
            </Text>
          </PressableScale>
          <PrimaryButton label={S.common.continue} disabled={!agreed} onPress={() => router.push(nextRoute('/consent'))} testID="consent-continue" />
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  bottom: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 10 },
  title: { textAlign: 'center', fontSize: 27, lineHeight: 33, paddingHorizontal: 40 },
  body: { marginTop: 12, marginBottom: 18, fontSize: 17, lineHeight: 23, color: '#6E5A50', textAlign: 'center', paddingHorizontal: 30 },
  panel: { backgroundColor: '#EFEFEF', borderRadius: 30, paddingHorizontal: 19, paddingTop: 8, paddingBottom: 6 },
  agree: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 50, paddingHorizontal: 6 },
  agreeText: { flex: 1, fontSize: 16, lineHeight: 21, color: '#6E5A50' },
  strong: { color: colors.ink, fontWeight: '600' },
});
