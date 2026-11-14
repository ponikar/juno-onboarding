import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Keyframe } from 'react-native-reanimated';

import { S } from '@/copy/strings';
import { track } from '@/lib/track';
import { EASE_OUT } from '@/motion/tokens';
import { useOnboarding } from '@/state/onboarding';
import { colors, FONT_CAP } from '@/theme/tokens';
import { haptic } from '@/ui/haptics';
import { Icon } from '@/ui/Icon';
import { Mascot } from '@/ui/Mascot';
import { NotificationPrompt } from '@/ui/NotificationPrompt';
import { OptionCard } from '@/ui/OptionCard';
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
    if (t !== time) setTime(t);
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
      variant="sky"
      scroll={false}
      footer={
        <>
          <PrimaryButton label={S.checkin.cta} onPress={commit} testID="checkin-cta" />
          <TextLink label={S.checkin.later} onPress={() => finish(false)} />
        </>
      }>
      <View style={styles.body}>
        {!compact && <Mascot style={styles.mascot} />}
        <Title onSky sub={S.checkin.sub}>{S.checkin.title}</Title>

        <Animated.View entering={groupIn} style={[styles.group, compact && styles.groupCompact]}>
          <View style={[styles.list, compact && styles.listCompact]}>
            {S.checkin.you.map((line, i) => (
              <View key={line} style={styles.row}>
                <View style={styles.icon}>
                  <Icon name={ICONS[i]} size={16} color={colors.skyText} />
                </View>
                <Text maxFontSizeMultiplier={FONT_CAP} style={styles.rowText}>{line}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.remind, compact && styles.remindCompact]} accessibilityRole="radiogroup" accessibilityLabel={S.checkin.remind}>
            {!compact && <Text maxFontSizeMultiplier={FONT_CAP} style={styles.remindLabel}>{S.checkin.remind}</Text>}
            {TIMES.map((t) => (
              <OptionCard
                key={t}
                multi={false}
                label={`${LABEL[t]} · ${S.checkin.clock[t]}`}
                iconNode={<Icon name={TIME_ICON[t]} size={22} color={colors.orange} />}
                selected={t === time}
                onPress={() => pick(t)}
              />
            ))}
          </View>
        </Animated.View>
      </View>

      <NotificationPrompt visible={prompt} onAnswer={finish} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', paddingBottom: 8 },
  mascot: { alignSelf: 'center', width: 112, height: 84, marginBottom: 4 },
  group: { marginTop: 22, gap: 22 },
  groupCompact: { marginTop: 10, gap: 14 },
  list: { gap: 12, alignSelf: 'center' },
  listCompact: { gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  rowText: { fontSize: 17, lineHeight: 22, fontWeight: '600', color: colors.skyText },
  remind: { gap: 10 },
  remindCompact: { gap: 8 },
  remindLabel: { fontSize: 15, lineHeight: 20, fontWeight: '600', color: colors.skyText, marginLeft: 22 },
});
