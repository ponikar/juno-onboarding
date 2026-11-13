import { router, usePathname } from 'expo-router';
import { ReactNode, useEffect, useState } from 'react';
import { Image, ImageSourcePropType, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { S } from '@/copy/strings';
import { FlowRoute, prevRoute, progressFor } from '@/flow';
import { colors, shadow, size, space, type } from '@/theme/tokens';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';
import { ProgressBar } from './ProgressBar';

// Sky gradient sampled from Figma 14-goals (see theme/tokens skyStops).
export const SKY_GRADIENT =
  'linear-gradient(180deg, #3685D4 0%, #3684D4 31%, #74AAE8 48%, #A9C6F0 65%, #E0E8F5 82%, #F9F7F8 87.5%, #F8F6F7 100%)';

type Props = {
  children: ReactNode;
  variant?: 'plain' | 'sky';
  background?: ImageSourcePropType; // full-bleed art cut from Figma, drawn over the variant colour
  backgroundHeight?: number; // pt; omit for full screen
  route?: FlowRoute; // shows the progress bar
  back?: boolean | (() => void);
  close?: () => void;
  footer?: ReactNode;
  scroll?: boolean;
  headerRight?: ReactNode;
};

export function ScreenShell({ children, variant = 'plain', background, backgroundHeight, route, back = true, close, footer, scroll = true, headerRight }: Props) {
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboardOpen();
  const onSky = variant === 'sky';
  const progress = route ? progressFor(route) : null;
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
          style={[styles.bgArt, backgroundHeight ? { height: backgroundHeight } : { bottom: 0 }]}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      )}
      <View style={[styles.nav, { marginTop: insets.top + 10 }]}>
        <View style={styles.navSide}>{back ? <NavButton icon="arrow.left" label={S.common.back} onSky={onSky} onPress={onBack} /> : null}</View>
        <View style={styles.navMid}>{progress && <ProgressBar act={progress.act} fraction={progress.fraction} onSky={onSky} />}</View>
        <View style={[styles.navSide, { alignItems: 'flex-end' }]}>
          {close ? <NavButton icon="xmark" label={S.common.close} onSky={onSky} onPress={close} /> : headerRight}
        </View>
      </View>
      <Body
        style={styles.body}
        contentContainerStyle={scroll ? styles.scrollContent : undefined}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {children}
      </Body>
      {footer && <View style={[styles.footer, { paddingBottom: keyboard ? 12 : Math.max(insets.bottom, 16) }]}>{footer}</View>}
    </KeyboardAvoidingView>
  );
}

function useKeyboardOpen() {
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
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={[styles.navBtn, onSky ? styles.navBtnSky : [styles.navBtnPlain, shadow.nav]]}>
      <Icon name={icon} size={17} color={onSky ? '#FFFFFF' : colors.ink} weight="semibold" />
    </PressableScale>
  );
}

export function Title({ children, onSky, sub, why }: { children: string; onSky?: boolean; sub?: string; why?: string }) {
  return (
    <View style={styles.titleWrap}>
      <Text accessibilityRole="header" style={[onSky ? [type.titleSky, shadow.titleSky] : type.title, styles.center]}>
        {children}
      </Text>
      {sub ? <Text style={[type.subtitle, styles.center, { color: onSky ? 'rgba(255,255,255,0.9)' : colors.inkSoft, marginTop: 10 }]}>{sub}</Text> : null}
      {why ? <Text style={[type.subtitle, styles.center, { color: onSky ? 'rgba(255,255,255,0.9)' : colors.inkSoft, marginTop: 8 }]}>{why}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bgArt: { position: 'absolute', top: 0, left: 0, right: 0, width: '100%' },
  nav: { height: size.nav, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  navSide: { width: 60 },
  navMid: { flex: 1, alignItems: 'center' },
  navBtn: { width: size.nav, height: size.nav, borderRadius: size.nav / 2, alignItems: 'center', justifyContent: 'center' },
  navBtnPlain: { backgroundColor: '#FCFAFB' },
  navBtnSky: { backgroundColor: colors.skyGlass },
  body: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: space.xl },
  footer: { paddingHorizontal: space.buttonGutter, paddingTop: 8, gap: 4 },
  titleWrap: { marginTop: 30, marginBottom: 24, paddingHorizontal: 36 },
  center: { textAlign: 'center' },
});
