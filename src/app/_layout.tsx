import { router, Stack, useGlobalSearchParams, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CONDITIONS_VARIANTS, ConditionsVariant, setConditionsVariant } from '@/experiments/conditionsVariant';
import { Flag, FLAGS, setFlag } from '@/experiments/flags';
import { addDays, toISODate } from '@/lib/dates';
import { track } from '@/lib/track';
import { OnboardingProvider, presetState, useOnboarding } from '@/state/onboarding';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

// Applies ?preset=<name> once per link (debug menu + screenshot evals) and remembers the current screen.
function FlowWatcher() {
  const { ready, reset, set } = useOnboarding();
  const pathname = usePathname();
  const { preset, fresh, variant, appt, exp } = useGlobalSearchParams<{ preset?: string; fresh?: string; variant?: string; appt?: string; exp?: string }>();
  const applied = useRef<string | null>(null);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // ?exp=on|off flips every experiment flag (screenshots).
  useEffect(() => {
    if (__DEV__ && (exp === 'on' || exp === 'off')) (Object.keys(FLAGS) as Flag[]).forEach((f) => setFlag(f, exp === 'on'));
  }, [exp]);

  // ?variant=current|A|B|C picks the conditions experiment variant (screenshots, evals).
  useEffect(() => {
    if (__DEV__ && variant && (CONDITIONS_VARIANTS as readonly string[]).includes(variant)) setConditionsVariant(variant as ConditionsVariant);
  }, [variant]);

  useEffect(() => {
    if (!ready || !__DEV__) return; // debug links (presets, evals) only work in development builds
    if (!preset) {
      applied.current = null; // so the same debug link applies again next time
      return;
    }
    const k = `${pathname}?${preset}`;
    if (applied.current === k) return;
    applied.current = k;
    const s = presetState(preset);
    // ?appt=<days>|none (screenshots): appointment that many days from today.
    if (appt === 'none') s.nextAppointment = null;
    else if (appt && Number.isFinite(Number(appt))) s.nextAppointment = toISODate(addDays(new Date(), Number(appt)));
    reset(s);
    // ?fresh=1 (evals): drop every screen underneath, so the stack holds only this one.
    if (fresh && router.canDismiss()) {
      router.dismissAll();
      router.replace(pathname as never);
    }
  }, [ready, preset, fresh, appt, pathname, reset]);

  useEffect(() => {
    if (!ready || pathname === '/' || pathname === '/debug') return;
    track('screen_view', { screen: pathname });
    if (pathname !== '/sponsor') set({ lastRoute: pathname }); // never resume on a sheet
  }, [ready, pathname, set]);

  return null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OnboardingProvider>
        <StatusBar style="dark" />
        <FlowWatcher />
        <Stack screenOptions={{ headerShown: false, animation: 'fade', animationDuration: 280, contentStyle: { backgroundColor: colors.bg } }}>
          <Stack.Screen name="sponsor" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.82], sheetGrabberVisible: true, sheetCornerRadius: 28 }} />
          <Stack.Screen name="debug" options={{ presentation: 'modal' }} />
          <Stack.Screen name="story" options={{ gestureEnabled: false }} />
          <Stack.Screen name="demo" options={{ gestureEnabled: false }} />
          <Stack.Screen name="energy" options={{ gestureEnabled: false }} />
          <Stack.Screen name="building" options={{ gestureEnabled: false }} />
          <Stack.Screen name="chat" options={{ gestureEnabled: false }} />
        </Stack>
      </OnboardingProvider>
    </GestureHandlerRootView>
  );
}
