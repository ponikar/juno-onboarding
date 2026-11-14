import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { S } from '@/copy/strings';
import { flowBarFor, nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { useOnboarding } from '@/state/onboarding';
import { colors, radius, size, type, FONT_CAP } from '@/theme/tokens';
import { authIcons, bg, mascotPeek } from '@/ui/art';
import { FlowBar } from '@/ui/FlowBar';
import { PressableScale } from '@/ui/PressableScale';
import { NavButton } from '@/ui/ScreenShell';
import { sheetStyles } from '@/ui/Sheet';

type Method = 'google' | 'apple' | 'email';

// Screen 17 (from 01b auth + email sheet 1:1935): save the snapshot with a sign-up option.
export default function Save() {
  const insets = useSafeAreaInsets();
  const { set } = useOnboarding();
  const [busy, setBusy] = useState<Method | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // MOCK auth: every option succeeds after a short delay.
  const signUp = (method: Method) => {
    if (busy) return;
    setBusy(method);
    track('answer', { screen: '/save', method });
    timer.current = setTimeout(() => {
      set({ signedIn: true });
      setBusy(null);
      router.push(nextRoute('/save'));
    }, 900);
  };

  const bar = flowBarFor('/save');
  return (
    <View style={styles.root}>
      <Image source={bg.welcome} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <View style={[styles.behind, { paddingTop: insets.top + 32 }]} importantForAccessibility="no-hide-descendants">
        <Text maxFontSizeMultiplier={FONT_CAP} style={styles.brand}>{S.welcome.brand}</Text>
        <Text maxFontSizeMultiplier={FONT_CAP} style={styles.headline}>{S.welcome.title}</Text>
      </View>
      <Image source={mascotPeek} style={styles.mascot} resizeMode="contain" />
      <View style={[StyleSheet.absoluteFill, styles.dim]} />
      <View style={[styles.nav, { marginTop: insets.top + 10 }]}>
        <View style={styles.navSide}>
          <NavButton icon="arrow.left" label={S.common.back} onSky onPress={() => (router.canGoBack() ? router.back() : router.replace('/snapshot'))} />
        </View>
        <View style={styles.navMid}>
          {bar && <FlowBar seg={bar.seg} fraction={bar.fraction} done={bar.done} onSky />}
        </View>
        <View style={styles.navSide} />
      </View>
      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <Text maxFontSizeMultiplier={FONT_CAP} accessibilityRole="header" style={[styles.title, styles.center]}>{S.save.title}</Text>
        <Text maxFontSizeMultiplier={FONT_CAP} style={[type.subtitle, styles.center, styles.sub]}>{S.save.sub}</Text>
        <AuthButton icon={authIcons.google} label={S.save.google} loading={busy === 'google'} onPress={() => signUp('google')} />
        <AuthButton icon={authIcons.apple} label={S.save.apple} loading={busy === 'apple'} onPress={() => signUp('apple')} />
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.or}>{S.save.or}</Text>
          <View style={styles.orLine} />
        </View>
        <PressableScale accessibilityRole="button" accessibilityLabel={S.save.email} onPress={() => signUp('email')} style={styles.email}>
          {busy === 'email' ? (
            <ActivityIndicator color={colors.ink} />
          ) : (
            <>
              <Image source={authIcons.mail} style={styles.icon} />
              <Text maxFontSizeMultiplier={FONT_CAP} style={styles.btnText}>{S.save.email}</Text>
            </>
          )}
        </PressableScale>
      </View>
    </View>
  );
}

function AuthButton({ icon, label, loading, onPress }: { icon: ImageSourcePropType; label: string; loading: boolean; onPress: () => void }) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ busy: loading }}
      onPress={onPress}
      style={styles.authBtn}>
      {loading ? (
        <ActivityIndicator color={colors.ink} />
      ) : (
        <>
          <Image source={icon} style={styles.icon} />
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.btnText}>{label}</Text>
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  dim: { backgroundColor: 'rgba(0,0,0,0.25)' },
  nav: { position: 'absolute', top: 0, left: 15, right: 15, height: size.nav, flexDirection: 'row', alignItems: 'center' },
  navSide: { width: 60 },
  navMid: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  sheet: { ...sheetStyles.panel, height: 437, margin: 6, marginTop: 0, borderRadius: 34, paddingHorizontal: 22, paddingTop: 8 },
  behind: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center', paddingHorizontal: 32 },
  brand: { fontSize: 33, lineHeight: 40, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  headline: { marginTop: 36, fontSize: 34, lineHeight: 40, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  mascot: { position: 'absolute', top: 414, alignSelf: 'center', width: 200, height: 150 },
  grabber: { alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: '#D4D2D3', marginBottom: 22 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700', color: '#111111' },
  sub: { color: colors.inkSoft, marginTop: 6, marginBottom: 26 },
  center: { textAlign: 'center' },
  authBtn: {
    height: 53,
    borderRadius: radius.pill,
    backgroundColor: '#F3F3F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 6,
  },
  icon: { width: 20, height: 20 },
  btnText: { fontSize: 17, lineHeight: 22, fontWeight: '500', color: '#111111' },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginVertical: 16 },
  orLine: { flex: 1, height: 1, backgroundColor: '#E6E4E5' },
  or: { fontSize: 15, color: colors.muted },
  email: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, alignSelf: 'center', paddingHorizontal: 12 },
});
