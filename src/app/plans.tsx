import { router } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { fill, S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { formatDate, trialDates } from '@/lib/dates';
import { track } from '@/lib/track';
import { STATE_MS } from '@/motion/tokens';
import { OnboardingState, Plan, useOnboarding } from '@/state/onboarding';
import { colors, radius, shadow, type } from '@/theme/tokens';
import { bg, key, mascotCardPeek, shield, sparkle } from '@/ui/art';
import { haptic } from '@/ui/haptics';
import { PressableScale } from '@/ui/PressableScale';
import { PrimaryButton, TextLink } from '@/ui/PrimaryButton';
import { ScreenShell } from '@/ui/ScreenShell';
import { Sheet } from '@/ui/Sheet';

type Choice = 'yearly' | 'monthly';
type ExitReason = NonNullable<OnboardingState['paywallExitReason']>;

// Screen 19 (from 62 pw-price + 62b sponsor sheet): yearly leads with the real yearly price; free and sponsored are visible.
export default function Plans() {
  const { state, set } = useOnboarding();
  const [choice, setChoice] = useState<Choice>(state.plan === 'monthly' ? 'monthly' : 'yearly');
  const [buying, setBuying] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [asked, setAsked] = useState(false);
  const repeatBack = useRef<(() => void) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dates = useMemo(() => trialDates(new Date()), []);
  const headline = S.plans.headline[state.goals[0]] ?? S.plans.headline.default;

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // Back (button or swipe) with no plan chosen asks the exit question once, then continues the back action.
  usePreventRemove(state.plan === null && !asked, ({ repeat }) => {
    repeatBack.current = repeat;
    setAsked(true);
    setExitOpen(true);
  });

  const choosePlan = (p: Plan) => {
    set({ plan: p });
    track('answer', { screen: '/plans', plan: p });
    router.push(nextRoute('/plans'));
  };

  const select = (c: Choice) => {
    if (c === choice) return;
    haptic.selection();
    setChoice(c);
  };

  // MOCK purchase: succeeds after a short delay.
  const buy = () => {
    setBuying(true);
    timer.current = setTimeout(() => {
      setBuying(false);
      choosePlan(choice === 'yearly' ? 'trial_yearly' : 'monthly');
    }, 900);
  };

  const leave = (reason: ExitReason | null) => {
    if (reason) {
      set({ paywallExitReason: reason });
      track('answer', { screen: '/plans', paywallExitReason: reason });
    }
    setExitOpen(false);
    repeatBack.current?.();
  };

  const yearly = choice === 'yearly';
  const terms = yearly
    ? fill(S.plans.terms, { chargeDate: formatDate(dates.charge), remindDate: formatDate(dates.remind) })
    : S.plans.termsMonthly;

  return (
    <ScreenShell
      background={bg.plans}
      backgroundHeight={385}
      close={() => choosePlan('free')}
      footer={
        <>
          <Text style={styles.terms}>{terms}</Text>
          <PrimaryButton label={yearly ? S.plans.cta : S.plans.ctaMonthly} loading={buying} onPress={buy} />
          <TextLink label={S.plans.free} onPress={() => choosePlan('free')} />
          <TextLink label={S.plans.cost} muted onPress={() => router.push('/sponsor')} />
          <Text style={styles.legal}>
            <Text style={styles.underline}>{S.plans.restore}</Text>
            {' · '}
            <Text style={styles.underline}>{S.plans.termsLink}</Text>
            {' · '}
            <Text style={styles.underline}>{S.plans.privacy}</Text>
          </Text>
        </>
      }>
      <View style={styles.hero}>
        <Image source={key} style={styles.key} />
        <Image source={sparkle} style={styles.sparkle} />
      </View>
      <Text accessibilityRole="header" style={[type.titleSky, shadow.titleSky, styles.title]}>{headline}</Text>

      <View style={styles.cards}>
        <View>
          <Image source={mascotCardPeek} style={styles.peek} />
          <View style={styles.tab}>
            <Text style={styles.tabText}>{S.plans.badge}</Text>
          </View>
          <PlanCard selected={yearly} onPress={() => select('yearly')} title={S.plans.yearly} sub={S.plans.yearlySub}>
            <Text style={styles.priceYearly}>{S.plans.yearlyPrice}</Text>
          </PlanCard>
        </View>
        <PlanCard selected={!yearly} onPress={() => select('monthly')} title={S.plans.monthly} sub={S.plans.monthlySub}>
          <Text style={styles.price}>
            {S.plans.monthlyPrice}
            <Text style={styles.per}>{S.plans.monthlyPer}</Text>
          </Text>
        </PlanCard>
      </View>

      <View style={styles.refund}>
        <Image source={shield} style={styles.shield} />
        <Text style={styles.refundText}>{S.plans.refund}</Text>
      </View>

      <Sheet visible={exitOpen} onClose={() => leave(null)}>
        <Text accessibilityRole="header" style={[type.title, styles.exitQ]}>{S.plans.exitQ}</Text>
        {S.plans.exitOptions.map((o) => (
          <PressableScale key={o.id} accessibilityRole="button" onPress={() => leave(o.id)} style={styles.exitOption}>
            <Text style={type.label}>{o.label}</Text>
          </PressableScale>
        ))}
        <TextLink label={S.plans.exitSkip} muted onPress={() => leave(null)} />
      </Sheet>
    </ScreenShell>
  );
}

function PlanCard({ selected, onPress, title, sub, children }: {
  selected: boolean;
  onPress: () => void;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${title}, ${sub}`}
      onPress={onPress}
      style={[
        styles.card,
        selected ? styles.cardOn : styles.cardOff,
        { transitionProperty: ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'], transitionDuration: STATE_MS } as object,
      ]}>
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle}>{title}</Text>
        {children}
      </View>
      <Text style={styles.cardSub}>{sub}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  hero: { height: 96, alignItems: 'center' },
  key: { width: 79, height: 96 },
  sparkle: { position: 'absolute', top: 8, left: '60%', width: 20, height: 23 },
  title: { textAlign: 'center', paddingHorizontal: 36, marginTop: 0 },
  cards: { paddingHorizontal: 17, marginTop: 40, gap: 14 },
  peek: { position: 'absolute', right: 23, top: -43, width: 64, height: 43 },
  tab: {
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
    height: 27,
    paddingHorizontal: 14,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#E8783E',
    justifyContent: 'center',
  },
  tabText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', letterSpacing: 1.2 },
  card: { backgroundColor: colors.surface, borderRadius: radius.card - 6, borderWidth: 2.5, paddingHorizontal: 18, paddingVertical: 14 },
  cardOn: { borderLeftColor: '#8F8BF3', borderTopColor: '#C79BE6', borderRightColor: '#F4B272', borderBottomColor: '#E79CC0' },
  cardOff: { borderLeftColor: '#E8E6E7', borderTopColor: '#E8E6E7', borderRightColor: '#E8E6E7', borderBottomColor: '#E8E6E7' },
  cardTop: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  cardTitle: { fontSize: 21, lineHeight: 26, fontWeight: '700', color: colors.ink },
  priceYearly: { fontSize: 22, lineHeight: 27, fontWeight: '700', color: colors.ink },
  price: { fontSize: 24, lineHeight: 29, fontWeight: '700', color: colors.ink },
  per: { fontSize: 15, fontWeight: '400' },
  cardSub: { fontSize: 15, lineHeight: 20, color: colors.inkSoft, marginTop: 6 },
  refund: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14 },
  shield: { width: 14, height: 14 },
  refundText: { fontSize: 15, lineHeight: 20, color: colors.inkSoft },
  terms: { fontSize: 14, lineHeight: 19, color: colors.inkSoft, textAlign: 'center', marginBottom: 8, paddingHorizontal: 4 },
  legal: { fontSize: 13, lineHeight: 18, color: colors.inkSoft, textAlign: 'center' },
  underline: { textDecorationLine: 'underline' },
  exitQ: { textAlign: 'center', marginBottom: 16 },
  exitOption: {
    minHeight: 56,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});
