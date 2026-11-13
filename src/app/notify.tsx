import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, Keyframe } from 'react-native-reanimated';

import { S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { EASE_OUT } from '@/motion/tokens';
import { useOnboarding } from '@/state/onboarding';
import { colors } from '@/theme/tokens';
import { bg } from '@/ui/art';
import { PressableScale } from '@/ui/PressableScale';
import { PrimaryButton, TextLink } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

// Screen 20 (from 61 bell + 63 bell-after-plans): one notification ask, after the plan choice.
export default function Notify() {
  const { state, set } = useOnboarding();
  const [prompt, setPrompt] = useState(false);
  const paid = state.plan === 'trial_yearly' || state.plan === 'monthly';

  const finish = (allowed: boolean) => {
    set({ notificationsAllowed: allowed });
    track('answer', { screen: '/notify', notificationsAllowed: allowed });
    setPrompt(false);
    router.push(nextRoute('/notify'));
  };

  return (
    <ScreenShell
      background={bg.bell}
      scroll={false}
      footer={
        <>
          <PrimaryButton label={S.notify.allow} onPress={() => setPrompt(true)} />
          <TextLink label={S.notify.later} onPress={() => finish(false)} />
        </>
      }>
      <Title onSky>{paid ? S.notify.trial : S.notify.free}</Title>

      {/* MOCK system prompt, styled after the iOS alert in 61-more-bell--os-notification-prompt */}
      <Modal visible={prompt} transparent animationType="none" onRequestClose={() => finish(false)} statusBarTranslucent>
        {prompt && (
          <Animated.View entering={FadeIn.duration(150)} style={styles.dim}>
            <Animated.View entering={ALERT_IN} style={styles.alert} accessibilityViewIsModal>
              <Text style={styles.alertTitle}>{S.notify.mockTitle}</Text>
              <Text style={styles.alertBody}>{S.notify.mockBody}</Text>
              <View style={styles.alertRow}>
                <PressableScale accessibilityRole="button" onPress={() => finish(false)} style={styles.alertBtn}>
                  <Text style={styles.alertBtnText}>{S.notify.mockDeny}</Text>
                </PressableScale>
                <PressableScale accessibilityRole="button" onPress={() => finish(true)} style={styles.alertBtn}>
                  <Text style={styles.alertBtnText}>{S.notify.mockAllow}</Text>
                </PressableScale>
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </Modal>
    </ScreenShell>
  );
}

// Entrances start at 0.95, never 0 (plan section 8).
const ALERT_IN = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.95 }] },
  100: { opacity: 1, transform: [{ scale: 1 }], easing: EASE_OUT },
}).duration(200);

const styles = StyleSheet.create({
  dim: { flex: 1, backgroundColor: 'rgba(10,30,70,0.25)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 42 },
  alert: {
    width: '100%',
    borderRadius: 32,
    backgroundColor: 'rgba(214,236,252,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  alertTitle: { fontSize: 17, lineHeight: 22, fontWeight: '600', color: '#000000', paddingHorizontal: 14 },
  alertBody: { fontSize: 15, lineHeight: 20, color: colors.inkSoft, marginTop: 6, paddingHorizontal: 14 },
  alertRow: { flexDirection: 'row', gap: 8, marginTop: 20 },
  alertBtn: { flex: 1, height: 48, borderRadius: 24, backgroundColor: 'rgba(120,140,160,0.22)', alignItems: 'center', justifyContent: 'center' },
  alertBtnText: { fontSize: 17, lineHeight: 22, fontWeight: '500', color: '#000000' },
});
