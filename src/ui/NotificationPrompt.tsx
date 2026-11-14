import { Modal, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, Keyframe } from 'react-native-reanimated';

import { S } from '@/copy/strings';
import { EASE_OUT } from '@/motion/tokens';
import { colors, FONT_CAP } from '@/theme/tokens';
import { PressableScale } from './PressableScale';

// MOCK iOS notification permission alert (styled after 61-more-bell--os-notification-prompt).
export function NotificationPrompt({ visible, onAnswer }: { visible: boolean; onAnswer: (allowed: boolean) => void }) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={() => onAnswer(false)} statusBarTranslucent>
      {visible && (
        <Animated.View entering={FadeIn.duration(150)} style={styles.dim}>
          <Animated.View entering={ALERT_IN} style={styles.alert} accessibilityViewIsModal>
            <Text maxFontSizeMultiplier={FONT_CAP} style={styles.alertTitle}>{S.notify.mockTitle}</Text>
            <Text maxFontSizeMultiplier={FONT_CAP} style={styles.alertBody}>{S.notify.mockBody}</Text>
            <View style={styles.alertRow}>
              <PressableScale accessibilityRole="button" onPress={() => onAnswer(false)} style={styles.alertBtn}>
                <Text maxFontSizeMultiplier={FONT_CAP} style={styles.alertBtnText}>{S.notify.mockDeny}</Text>
              </PressableScale>
              <PressableScale accessibilityRole="button" onPress={() => onAnswer(true)} style={styles.alertBtn}>
                <Text maxFontSizeMultiplier={FONT_CAP} style={styles.alertBtnText}>{S.notify.mockAllow}</Text>
              </PressableScale>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </Modal>
  );
}

// Entrances start at 0.95, never 0.
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
