import { Stack, useGlobalSearchParams, usePathname } from 'expo-router';
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
  const { preset } = useGlobalSearchParams<{ preset?: string }>();
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
  }, [ready, preset, pathname, reset]);

  useEffect(() => {
    if (!ready || pathname === '/' || pathname === '/debug') return;
    set({ lastRoute: pathname });
    track('screen_view', { screen: pathname });
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
          <Stack.Screen name="building" options={{ gestureEnabled: false }} />
          <Stack.Screen name="chat" options={{ gestureEnabled: false }} />
        </Stack>
      </OnboardingProvider>
    </GestureHandlerRootView>
  );
}
