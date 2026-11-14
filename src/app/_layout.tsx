import { router, Stack, useGlobalSearchParams, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { track } from '@/lib/track';
import { OnboardingProvider, presetState, useOnboarding } from '@/state/onboarding';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

// Applies ?preset=<name> once per link (debug menu + screenshot evals) and remembers the current screen.
function FlowWatcher() {
  const { ready, reset, set } = useOnboarding();
  const pathname = usePathname();
  const { preset, fresh } = useGlobalSearchParams<{ preset?: string; fresh?: string }>();
  const applied = useRef<string | null>(null);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  useEffect(() => {
    if (!ready || !preset) return;
    const k = `${pathname}?${preset}`;
    if (applied.current === k) return;
    applied.current = k;
    reset(presetState(preset));
    // ?fresh=1 (evals): drop every screen underneath, so the stack holds only this one.
    if (fresh && router.canDismiss()) {
      router.dismissAll();
      router.replace(pathname as never);
    }
  }, [ready, preset, fresh, pathname, reset]);

  useEffect(() => {
    if (!ready || pathname === '/' || pathname === '/debug') return;
    track('screen_view', { screen: pathname });
    if (pathname !== '/sponsor' && pathname !== '/report') set({ lastRoute: pathname }); // never resume on a sheet
  }, [ready, pathname, set]);

  return null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OnboardingProvider>
        <StatusBar style="dark" />
        <FlowWatcher />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
          <Stack.Screen name="report" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.92], sheetGrabberVisible: true, sheetCornerRadius: 28 }} />
          <Stack.Screen name="sponsor" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.82], sheetGrabberVisible: true, sheetCornerRadius: 28 }} />
          <Stack.Screen name="debug" options={{ presentation: 'modal' }} />
          <Stack.Screen name="energy" options={{ gestureEnabled: false }} />
          <Stack.Screen name="building" options={{ gestureEnabled: false }} />
          <Stack.Screen name="chat" options={{ gestureEnabled: false }} />
        </Stack>
      </OnboardingProvider>
    </GestureHandlerRootView>
  );
}
