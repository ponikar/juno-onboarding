import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { TYPING_MS } from '@/motion/tokens';
import { useOnboarding } from '@/state/onboarding';
import { colors, FONT_CAP, radius, shadow, type } from '@/theme/tokens';
import { healthCluster } from '@/ui/art';
import { Icon } from '@/ui/Icon';
import { JunoReply } from '@/ui/JunoReply';
import { PrimaryButton, TextLink } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

const CONTINUE_AFTER_REPLY_MS = 900 + TYPING_MS;

// Screen 13 (from Figma 43 health-connect and 42 wearables).
export default function Health() {
  const { state, set } = useOnboarding();
  const [connected, setConnected] = useState(false);
  const [clusterY, setClusterY] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const later = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    set({ healthAnswered: true, healthDataConnected: false });
    track('answer', { screen: 'health', connected: false });
    router.push(nextRoute('/health'));
  };

  const allow = () => {
    if (timer.current) return;
    set({ healthAnswered: true, healthDataConnected: true });
    track('answer', { screen: 'health', connected: true });
    setConnected(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      router.push(nextRoute('/health'));
    }, CONTINUE_AFTER_REPLY_MS);
  };

  // MOCK: stands in for the HealthKit permission sheet.
  const connect = () =>
    Alert.alert(S.health.mockTitle, undefined, [
      { text: S.health.mockDeny, style: 'cancel', onPress: later },
      { text: S.health.mockAllow, onPress: allow },
    ]);

  const synced = connected || state.healthDataConnected;

  return (
    <ScreenShell
      variant="sky"
      route="/health"
      reply={<JunoReply text={synced ? S.health.reply : null} />}
      footer={
        <>
          {synced ? (
            <PrimaryButton label={S.common.continue} onPress={() => router.push(nextRoute('/health'))} />
          ) : (
            <>
              <TextLink label={S.health.later} onPress={later} />
              <PrimaryButton label={S.health.connect} onPress={connect} />
            </>
          )}
        </>
      }>
      <View style={styles.fill}>
        {clusterY !== null && <View style={[StyleSheet.absoluteFill, { experimental_backgroundImage: backdrop(clusterY) }]} />}
        <Title onSky>{S.health.q}</Title>
        <View style={styles.cluster} onLayout={(e) => setClusterY(e.nativeEvent.layout.y)}>
          {synced ? (
            <Animated.View entering={FadeIn.duration(200)} style={styles.synced}>
              <View style={styles.check}>
                <Icon name="checkmark" size={22} color="#FFFFFF" weight="bold" />
              </View>
              <Text maxFontSizeMultiplier={FONT_CAP} style={type.label}>{S.healthSynced}</Text>
            </Animated.View>
          ) : (
            <Image source={healthCluster} style={StyleSheet.absoluteFill} resizeMode="contain" accessibilityIgnoresInvertColors />
          )}
        </View>
        <View style={styles.bullets}>
          <Bullet icon="heart.fill" text={S.health.bullet1} />
          <Bullet icon="arrow.up.arrow.down" text={S.health.bullet2} />
        </View>
      </View>
    </ScreenShell>
  );
}

// Figma 43's sky behind the cluster (sampled), so the cut-out art has no visible edge.
function backdrop(y: number) {
  return `linear-gradient(180deg, #3685D4 0px, #6AABEB ${y}px, #7EB2EC ${y + 68}px, #A6C3ED ${y + 168}px, #FFFEFC ${y + 248}px, #F8F6F7 ${y + 560}px)`;
}

function Bullet({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.dot}>
        <Icon name={icon} size={13} color="#A49C98" />
      </View>
      <Text maxFontSizeMultiplier={FONT_CAP} style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flexGrow: 1 },
  cluster: { width: 334, height: 264, alignSelf: 'center', marginTop: -8, alignItems: 'center', justifyContent: 'center' },
  synced: { ...shadow.card, backgroundColor: colors.surface, borderRadius: radius.card, paddingVertical: 28, paddingHorizontal: 32, alignItems: 'center', gap: 14 },
  check: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  bullets: { gap: 16, marginTop: 12, marginBottom: 16, paddingLeft: 39, paddingRight: 30 },
  row: { flexDirection: 'row', gap: 14 },
  dot: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(38,25,16,0.06)', alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, fontSize: 16, lineHeight: 20, color: colors.inkSoft },
});
