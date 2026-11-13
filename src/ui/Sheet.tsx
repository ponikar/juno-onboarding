import { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EASE_OUT, ENTER_MS } from '@/motion/tokens';
import { colors, radius } from '@/theme/tokens';

// Simple bottom sheet over a dimmed screen (exit question on plans). Reanimated drops the slide under reduced motion.
export function Sheet({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {visible && (
        <View style={styles.root}>
          <Animated.View entering={FadeIn.duration(200)} style={StyleSheet.absoluteFill}>
            <Pressable style={[StyleSheet.absoluteFill, styles.dim]} onPress={onClose} accessibilityRole="button" />
          </Animated.View>
          <Animated.View
            entering={SlideInDown.duration(ENTER_MS).easing(EASE_OUT)}
            style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
            <View style={styles.grabber} />
            {children}
          </Animated.View>
        </View>
      )}
    </Modal>
  );
}

export const sheetStyles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
  },
});

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  dim: { backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { ...sheetStyles.panel, paddingHorizontal: 20, paddingTop: 8 },
  grabber: { alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: '#D4D2D3', marginBottom: 16 },
});
