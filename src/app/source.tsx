import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { STATE_MS } from '@/motion/tokens';
import { useOnboarding } from '@/state/onboarding';
import { colors, font, FONT_CAP, radius, shadow } from '@/theme/tokens';
import { sourceIcons } from '@/ui/art';
import { haptic } from '@/ui/haptics';
import { PressableScale } from '@/ui/PressableScale';
import { PrimaryButton, TextLink } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

// From the Juno app: where did you find Juno.
export default function Source() {
  const { state, set } = useOnboarding();
  const [picked, setPicked] = useState<string | null>(state.foundVia);
  const tileWidth = (useWindowDimensions().width - 16 * 2 - 10 * 2) / 3;
  const next = () => router.push(nextRoute('/source'));
  return (
    <ScreenShell
      route="/source"
      footer={
        <>
          <PrimaryButton
            label={S.common.continue}
            disabled={!picked}
            onPress={() => {
              set({ foundVia: picked });
              track('answer', { screen: 'source', foundVia: picked });
              next();
            }}
          />
          <TextLink label={S.source.skip} onPress={next} />
        </>
      }>
      <Title>{S.source.title}</Title>
      <View style={styles.grid}>
        {S.source.options.map((o) => {
          const selected = picked === o.id;
          return (
            <PressableScale
              key={o.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={o.label}
              selected={selected}
              onPress={() => {
                haptic.selection();
                setPicked(o.id);
              }}
              style={[
                styles.tile,
                { width: tileWidth },
                shadow.card,
                {
                  backgroundColor: selected ? colors.orangeFill : colors.surface,
                  borderColor: selected ? colors.orangeBorder : colors.surface,
                  transitionProperty: ['backgroundColor', 'borderColor'],
                  transitionDuration: STATE_MS,
                } as object,
              ]}>
              <Image source={sourceIcons[o.id]} style={styles.icon} resizeMode="contain" />
              <Text maxFontSizeMultiplier={FONT_CAP} style={styles.label}>{o.label}</Text>
            </PressableScale>
          );
        })}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16, marginBottom: 20 },
  tile: {
    minHeight: 84,
    borderRadius: radius.card,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 10,
    gap: 6,
  },
  icon: { width: 28, height: 28 },
  label: { fontSize: 15, lineHeight: 19, ...font.semibold, color: colors.ink, textAlign: 'center' },
});
