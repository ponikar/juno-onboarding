import { router, usePathname } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Image, ImageSourcePropType, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { S } from '@/copy/strings';
import { flowBarFor, FlowRoute, prevRoute } from '@/flow';
import { EASE_OUT, REST_DELAY_MS, TITLE_ENTER_MS, TITLE_RISE } from '@/motion/tokens';
import { colors, shadow, size, space, type, FONT_CAP, TITLE_CAP } from '@/theme/tokens';
import { FlowBar } from './FlowBar';
import { InReplyDock } from './JunoReply';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';
import { useTapHaptic } from './PrimaryButton';

// Sky gradient sampled from Figma 14-goals (see theme/tokens skyStops).
export const SKY_GRADIENT =
  'linear-gradient(180deg, #3685D4 0%, #3684D4 31%, #74AAE8 48%, #A9C6F0 65%, #E0E8F5 82%, #F9F7F8 87.5%, #F8F6F7 100%)';

type Props = {
  children: ReactNode;
  variant?: 'plain' | 'sky';
  background?: ImageSourcePropType; // full-bleed art cut from Figma, drawn over the variant colour
  backgroundHeight?: number;
  backgroundTop?: number; // negative crops empty sky off the top of partial art // pt; omit for full screen
  route?: FlowRoute; // shows the flow bar
  back?: boolean | (() => void);
  close?: () => void;
  footer?: ReactNode;
  reply?: ReactNode; // Juno's line, pinned above the footer buttons
  scroll?: boolean;
  headerRight?: ReactNode;
};

// Height the flow bar row adds under the nav (marginTop 6 + label line 20 + gap 6 + bar 6), for screens that size art from the nav.
export const FLOW_BAR_ROW = 38;

export function ScreenShell({ children, variant = 'plain', background, backgroundHeight, backgroundTop = 0, route, back = true, close, footer, reply, scroll = true, headerRight }: Props) {
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboardOpen();
  const onSky = variant === 'sky';
  const bar = route ? flowBarFor(route) : null;
  const { lead, body: enter, footer: footerEnter } = useEnter();
  const pathname = usePathname();
  // After a resume the stack holds one screen, so back walks the flow instead.
  const onBack = typeof back === 'function' ? back : () => (router.canGoBack() ? router.back() : router.replace(prevRoute(pathname) as never));

  const Body = scroll ? ScrollView : View;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[
        styles.root,
        onSky && !backgroundHeight ? { experimental_backgroundImage: SKY_GRADIENT } : { backgroundColor: colors.bg }, // partial art sits on the light page colour
      ]}>
      {background && (
        <Image
          source={background}
          style={[styles.bgArt, { top: backgroundTop }, backgroundHeight ? { height: backgroundHeight } : { bottom: 0 }]}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      )}
      <View style={[styles.nav, { marginTop: insets.top + 10 }]}>
        <View style={styles.navSide}>{back ? <NavButton icon="arrow.left" label={S.common.back} onSky={onSky} onPress={onBack} /> : null}</View>
        <View style={styles.navMid} />
        <View style={[styles.navSide, { alignItems: 'flex-end' }]}>
          {close ? <NavButton icon="xmark" label={S.common.close} onSky={onSky} onPress={close} /> : headerRight}
        </View>
      </View>
      {bar && (
        <View style={styles.barRow}>
          <FlowBar seg={bar.seg} fraction={bar.fraction} done={bar.done} onSky={onSky} />
        </View>
      )}
      <EnterContext value={lead}>
        <Animated.View style={[styles.body, enter]}>
          <Body
            style={styles.body}
            contentContainerStyle={scroll ? styles.scrollContent : undefined}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {children}
          </Body>
          {reply ? (
            <Animated.View style={[styles.dock, { paddingBottom: keyboard ? 12 : Math.max(insets.bottom, 16) }, footerEnter]}>
              <InReplyDock.Provider value>{reply}</InReplyDock.Provider>
              {footer && <View style={styles.dockFooter}>{footer}</View>}
            </Animated.View>
          ) : (
            footer && (
              <Animated.View style={[styles.footer, { paddingBottom: keyboard ? 12 : Math.max(insets.bottom, 16) }, footerEnter]}>{footer}</Animated.View>
            )
          )}
        </Animated.View>
      </EnterContext>
    </KeyboardAvoidingView>
  );
}

const EnterContext = createContext<SharedValue<number> | null>(null);

// v3 R-13: the Title leads (fade + 12 pt rise, read from EnterContext); the footer fades in 60 ms later, no rise.
// Body siblings share the Title's container, so they fade with it: a child cannot be more opaque than its parent.
function useEnter() {
  const lead = useSharedValue(0);
  const rest = useSharedValue(0);
  useEffect(() => {
    lead.value = withTiming(1, { duration: TITLE_ENTER_MS, easing: EASE_OUT });
    rest.value = withDelay(REST_DELAY_MS, withTiming(1, { duration: TITLE_ENTER_MS, easing: EASE_OUT }));
  }, [lead, rest]);
  const body = useAnimatedStyle(() => ({ opacity: lead.value }));
  const footer = useAnimatedStyle(() => ({ opacity: rest.value }));
  return { lead, body, footer };
}

function useTitleEnter() {
  const reduced = useReducedMotion();
  const lead = useContext(EnterContext);
  return useAnimatedStyle(() => ({
    transform: reduced || !lead ? [] : [{ translateY: (1 - lead.value) * TITLE_RISE }],
  }));
}

export function useKeyboardOpen() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const a = Keyboard.addListener('keyboardWillShow', () => setOpen(true));
    const b = Keyboard.addListener('keyboardWillHide', () => setOpen(false));
    return () => {
      a.remove();
      b.remove();
    };
  }, []);
  return open;
}

export function NavButton({ icon, label, onPress, onSky }: { icon: string; label: string; onPress: () => void; onSky?: boolean }) {
  const tap = useTapHaptic();
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPressIn={tap}
      onPress={onPress}
      hitSlop={8}
      style={[styles.navBtn, onSky ? styles.navBtnSky : [styles.navBtnPlain, shadow.nav]]}>
      <Icon name={icon} size={17} color={onSky ? '#FFFFFF' : colors.ink} weight="semibold" />
    </PressableScale>
  );
}

export function Title({ children, onSky, sub, why }: { children: string; onSky?: boolean; sub?: string; why?: string }) {
  const rise = useTitleEnter();
  return (
    <View style={styles.titleWrap}>
      <Animated.Text maxFontSizeMultiplier={TITLE_CAP} accessibilityRole="header" style={[onSky ? [type.titleSky, shadow.titleSky] : type.title, styles.center, rise]}>
        {children}
      </Animated.Text>
      {sub ? <Text maxFontSizeMultiplier={FONT_CAP} style={[type.subtitle, styles.center, { color: onSky ? 'rgba(255,255,255,0.9)' : colors.inkSoft, marginTop: 10 }]}>{sub}</Text> : null}
      {why ? <Text maxFontSizeMultiplier={FONT_CAP} style={[type.subtitle, styles.center, { color: onSky ? 'rgba(255,255,255,0.9)' : colors.inkSoft, marginTop: 8 }]}>{why}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bgArt: { position: 'absolute', top: 0, left: 0, right: 0, width: '100%' },
  nav: { height: size.nav, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  navSide: { width: 60 },
  navMid: { flex: 1 },
  barRow: { paddingHorizontal: 16, marginTop: 6 }, // spec 7.1: full width, under the nav row
  navBtn: { width: size.nav, height: size.nav, borderRadius: size.nav / 2, alignItems: 'center', justifyContent: 'center' },
  navBtnPlain: { backgroundColor: '#FCFAFB' },
  navBtnSky: { backgroundColor: colors.skyGlass },
  body: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: space.xl },
  footer: { paddingHorizontal: space.buttonGutter, paddingTop: 8, gap: 4 },
  dock: { backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.hairline, paddingTop: 12, gap: 8 },
  dockFooter: { paddingHorizontal: space.buttonGutter, gap: 4 },
  titleWrap: { marginTop: 30, marginBottom: 24, paddingHorizontal: 36 },
  center: { textAlign: 'center' },
});
