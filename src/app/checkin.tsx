import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, Keyframe } from 'react-native-reanimated';

import { fill, S } from '@/copy/strings';
import { track } from '@/lib/track';
import { EASE_OUT, STATE_MS } from '@/motion/tokens';
import { useOnboarding } from '@/state/onboarding';
import { colors, radius, shadow, type, FONT_CAP } from '@/theme/tokens';
import { avatar, chatIcons } from '@/ui/art';
import { haptic } from '@/ui/haptics';
import { Icon } from '@/ui/Icon';
import { Mascot } from '@/ui/Mascot';
import { NotificationPrompt } from '@/ui/NotificationPrompt';
import { PressableScale } from '@/ui/PressableScale';
import { PrimaryButton, TextLink } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

type Time = 'morning' | 'afternoon' | 'evening';
const TIMES: Time[] = ['morning', 'afternoon', 'evening'];
const LABEL: Record<Time, string> = { morning: S.commit.morning, afternoon: S.commit.afternoon, evening: S.commit.evening };
const YOU_ICONS = [avatar, chatIcons.log, chatIcons.vent];

// Cards arrive in reading order: "What you do" then "What Juno does" overlapping it (choreograph: overlap, one lead).
const cardIn = (delay: number) =>
  new Keyframe({
    0: { opacity: 0, transform: [{ translateY: 10 }] },
    100: { opacity: 1, transform: [{ translateY: 0 }], easing: EASE_OUT },
  })
    .duration(280)
    .delay(delay);

// The commitment, right before the first chat: what the user does each day, when Juno checks in, then the reminder permission.
export default function CheckIn() {
  const { state, set } = useOnboarding();
  const [time, setTime] = useState<Time>(state.checkInTime ?? 'evening');
  const [prompt, setPrompt] = useState(false);

  const pick = (t: Time) => {
    if (t === time) return;
    haptic.selection();
    setTime(t);
  };

  const commit = () => {
    haptic.success();
    set({ checkInTime: time, commitment: state.commitment ?? 'most_days' });
    track('commitment', { checkInTime: time });
    setPrompt(true);
  };

  const finish = (allowed: boolean) => {
    set({ notificationsAllowed: allowed });
    track('answer', { screen: '/checkin', notificationsAllowed: allowed });
    setPrompt(false);
    router.replace('/chat');
  };

  return (
    <ScreenShell
      route="/checkin"
      footer={
        <>
          <PrimaryButton label={S.checkin.cta} onPress={commit} testID="checkin-cta" />
          <TextLink label={S.checkin.later} onPress={() => finish(false)} />
        </>
      }>
      <Mascot style={styles.mascot} />
      <Title sub={S.checkin.sub}>{S.checkin.title}</Title>

      <Animated.View entering={cardIn(120)} style={[styles.card, shadow.card]}>
        <Text maxFontSizeMultiplier={FONT_CAP} style={styles.cardTitle}>{S.checkin.youTitle}</Text>
        {S.checkin.you.map((line, i) => (
          <View key={line} style={styles.row}>
            <Image source={YOU_ICONS[i]} style={styles.rowIcon} />
            <Text maxFontSizeMultiplier={FONT_CAP} style={styles.rowText}>{line}</Text>
          </View>
        ))}
      </Animated.View>

      <Animated.View entering={cardIn(200)} style={[styles.card, styles.junoCard, shadow.card]}>
        <View style={styles.junoHead}>
          <View style={styles.bell}>
            <Icon name="bell.fill" size={16} color="#FFFFFF" />
          </View>
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.cardTitle}>{S.checkin.junoTitle}</Text>
        </View>
        <Animated.Text key={time} entering={FadeIn.duration(STATE_MS).easing(Easing.out(Easing.quad))} maxFontSizeMultiplier={FONT_CAP} style={styles.junoLine}>
          {fill(S.checkin.junoLine, { time: LABEL[time].toLowerCase(), clock: S.checkin.clock[time] })}
        </Animated.Text>
        <View style={styles.times} accessibilityRole="radiogroup">
          {TIMES.map((t) => {
            const on = t === time;
            return (
              <PressableScale
                key={t}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                accessibilityLabel={`${LABEL[t]}, ${S.checkin.clock[t]}`}
                selected={on}
                onPress={() => pick(t)}
                style={[
                  styles.time,
                  {
                    backgroundColor: on ? colors.orangeFill : colors.surface,
                    borderColor: on ? colors.orangeBorder : colors.hairline,
                    transitionProperty: ['backgroundColor', 'borderColor'],
                    transitionDuration: STATE_MS,
                  } as object,
                ]}>
                <Text maxFontSizeMultiplier={FONT_CAP} style={[styles.timeLabel, on && styles.timeOn]}>{LABEL[t]}</Text>
                <Text maxFontSizeMultiplier={FONT_CAP} style={styles.timeClock}>{S.checkin.clock[t]}</Text>
              </PressableScale>
            );
          })}
        </View>
        <Text maxFontSizeMultiplier={FONT_CAP} style={styles.junoLine2}>{S.checkin.junoLine2}</Text>
      </Animated.View>

      <NotificationPrompt visible={prompt} onAnswer={finish} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  mascot: { alignSelf: 'center', width: 96, height: 72 },
  card: { marginHorizontal: 16, marginTop: 14, backgroundColor: colors.surface, borderRadius: radius.card, paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  junoCard: { gap: 10 },
  cardTitle: { ...type.label, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowIcon: { width: 28, height: 28, borderRadius: 14 },
  rowText: { flex: 1, fontSize: 15, lineHeight: 20, color: colors.ink },
  junoHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bell: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
  junoLine: { fontSize: 17, lineHeight: 23, fontWeight: '600', color: colors.ink },
  junoLine2: { fontSize: 15, lineHeight: 20, color: colors.inkSoft },
  times: { flexDirection: 'row', gap: 8 },
  time: { flex: 1, minHeight: 52, borderRadius: radius.pill, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', paddingVertical: 6 },
  timeLabel: { fontSize: 15, lineHeight: 19, fontWeight: '600', color: colors.inkSoft },
  timeOn: { color: colors.ink },
  timeClock: { fontSize: 13, lineHeight: 17, color: colors.muted },
});
