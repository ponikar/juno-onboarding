import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { S } from '@/copy/strings';
import { track } from '@/lib/track';
import { useOnboarding } from '@/state/onboarding';
import { colors, type, FONT_CAP } from '@/theme/tokens';
import { sponsorIcons, sponsorTicket } from '@/ui/art';
import { OptionCard } from '@/ui/OptionCard';
import { PrimaryButton } from '@/ui/PrimaryButton';

// Sponsored-plan sheet (from 62b sponsor sheet), opened from "Is cost a problem?" on Plans.
export default function Sponsor() {
  const insets = useSafeAreaInsets();
  const { set } = useOnboarding();
  const [reason, setReason] = useState<string | null>(null);

  const claim = () => {
    set({ plan: 'sponsored' });
    track('answer', { screen: '/sponsor', reason });
    router.dismiss();
    router.push('/done');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.fill, styles.scroll]}>
        <Image source={sponsorTicket} style={styles.ticket} accessibilityLabel={S.sponsor.badge} />
        <Text maxFontSizeMultiplier={FONT_CAP} accessibilityRole="header" style={[type.title, styles.title]}>{S.sponsor.title}</Text>
        <View style={styles.options}>
          {S.sponsor.options.map((o) => (
            <OptionCard
              key={o.id}
              label={o.label}
              icon={sponsorIcons[o.id]}
              selected={reason === o.id}
              multi={false}
              onPress={() => setReason(o.id)}
            />
          ))}
        </View>
      </View>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Text maxFontSizeMultiplier={FONT_CAP} style={styles.note}>{S.sponsor.note}</Text>
        <PrimaryButton label={S.sponsor.cta} disabled={!reason} onPress={claim} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  fill: { flex: 1 },
  scroll: { paddingTop: 28, paddingBottom: 12 },
  ticket: { width: 218, height: 66, alignSelf: 'center' },
  title: { textAlign: 'center', paddingHorizontal: 28, marginTop: 18, marginBottom: 20 },
  options: { gap: 12, paddingHorizontal: 16 },
  footer: { paddingHorizontal: 29, paddingTop: 8 },
  note: { fontSize: 15, lineHeight: 20, color: colors.inkSoft, textAlign: 'center', marginBottom: 12 },
});
