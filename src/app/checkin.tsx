import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Keyframe } from 'react-native-reanimated';

import { S } from '@/copy/strings';
import { track } from '@/lib/track';
import { EASE_OUT, STATE_MS } from '@/motion/tokens';
import { useOnboarding } from '@/state/onboarding';
import { colors, radius, FONT_CAP } from '@/theme/tokens';
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
const ICONS = ['bubble.left.fill', 'hand.tap.fill', 'cloud.rain.fill'];
const TIME_ICON: Record<Time, string> = { morning: 'sunrise.fill', afternoon: 'sun.max.fill', evening: 'moon.fill' };

// The list and the time picker arrive together just after the title (choreograph: one lead, the rest as one).
const groupIn = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: 8 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }], easing: EASE_OUT },
})
  .duration(260)
  .delay(80);

// The commitment, right before the first chat: what the user does, when Juno reminds them, then the permission.
export default function CheckIn() {
  const { state, set } = useOnboarding();
  const [time, setTime] = useState<Time>(state.checkInTime ?? 'evening');
  const [prompt, setPrompt] = useState(false);
  const compact = useWindowDimensions().height < 740; // iPhone SE and similar: keep everything above the buttons

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
      scroll={false}
      footer={
        <>
          <PrimaryButton label={S.checkin.cta} onPress={commit} testID="checkin-cta" />
          <TextLink label={S.checkin.later} onPress={() => finish(false)} />
        </>
      }>
      <View style={styles.body}>
        <Mascot style={[styles.mascot, compact && styles.mascotCompact]} />
        <Title sub={S.checkin.sub}>{S.checkin.title}</Title>

        <Animated.View entering={groupIn} style={[styles.group, compact && styles.groupCompact]}>
          <View style={[styles.list, compact && styles.listCompact]}>
            {S.checkin.you.map((line, i) => (
              <View key={line} style={styles.row}>
                <View style={styles.icon}>
                  <Icon name={ICONS[i]} size={17} color={colors.orangeStrong} />
                </View>
                <Text maxFontSizeMultiplier={FONT_CAP} style={styles.rowText}>{line}</Text>
              </View>
            ))}
          </View>

          <View style={styles.remind}>
            <Text maxFontSizeMultiplier={FONT_CAP} style={styles.remindLabel}>{S.checkin.remind}</Text>
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
                    <Icon name={TIME_ICON[t]} size={16} color={on ? colors.orangeStrong : colors.muted} />
                    <Text maxFontSizeMultiplier={FONT_CAP} style={[styles.timeLabel, on && styles.timeOn]}>{S.checkin.clock[t]}</Text>
                  </PressableScale>
                );
              })}
            </View>
          </View>
        </Animated.View>
      </View>

      <NotificationPrompt visible={prompt} onAnswer={finish} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', paddingBottom: 12 },
  mascot: { alignSelf: 'center', width: 120, height: 90, marginBottom: 6 },
  mascotCompact: { width: 80, height: 60, marginBottom: 0 },
  group: { marginTop: 32, paddingHorizontal: 24, gap: 36 },
  groupCompact: { marginTop: 16, gap: 18 },
  list: { gap: 18, alignSelf: 'center' },
  listCompact: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.orangeFill, alignItems: 'center', justifyContent: 'center' },
  rowText: { fontSize: 18, lineHeight: 23, fontWeight: '500', color: colors.ink },
  remind: { gap: 12 },
  remindLabel: { fontSize: 15, lineHeight: 20, fontWeight: '600', color: colors.inkSoft, textAlign: 'center' },
  times: { flexDirection: 'row', gap: 10 },
  time: { flex: 1, minHeight: 48, borderRadius: radius.pill, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  timeLabel: { fontSize: 16, lineHeight: 20, fontWeight: '600', color: colors.inkSoft },
  timeOn: { color: colors.ink },
});
