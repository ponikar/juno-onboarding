import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, Keyframe, useReducedMotion } from 'react-native-reanimated';

import { fill, S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { track } from '@/lib/track';
import { EASE_OUT, ENTER_MS, TYPING_MS } from '@/motion/tokens';
import { useOnboarding } from '@/state/onboarding';
import { colors, radius, shadow, type, FONT_CAP } from '@/theme/tokens';
import { avatar } from '@/ui/art';
import { Chip } from '@/ui/Chip';
import { haptic } from '@/ui/haptics';
import { Mascot } from '@/ui/Mascot';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';
import { TypingDots } from '@/ui/TypingDots';

// Stages: 0 notification, 1 Juno typing, 2 ask + replies, 3 reply sent + Juno typing, 4 logged.
type Stage = 0 | 1 | 2 | 3 | 4;
const NOTIFY_LANDS_MS = 320;
const NOTIFY_HOLD_MS = 1400;
const AUTO_PICK_MS = 1500;

// Screen 19 Demo (v3 R-05): tomorrow's check-in, rehearsed in three automatic steps.
export default function Demo() {
  const { state } = useOnboarding();
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>(0);
  const [picked, setPicked] = useState<number | null>(null);
  const time = state.checkInTime ?? 'none';

  useEffect(() => {
    if (stage === 4) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const typing = reduced ? 0 : TYPING_MS;
    if (stage === 0) {
      timers.push(setTimeout(haptic.light, reduced ? 0 : NOTIFY_LANDS_MS));
      timers.push(setTimeout(() => setStage(1), NOTIFY_HOLD_MS));
    } else if (stage === 1) timers.push(setTimeout(() => setStage(2), typing));
    else if (stage === 2)
      timers.push(
        setTimeout(() => {
          setPicked((p) => p ?? 0);
          setStage(3);
        }, AUTO_PICK_MS),
      );
    else timers.push(setTimeout(() => setStage(4), typing));
    return () => timers.forEach(clearTimeout);
  }, [stage, reduced]);

  const send = (i: number) => {
    if (stage > 2) return;
    setPicked(i);
    setStage(3);
    track('answer', { screen: '/demo', reply: i });
  };

  const skip = () => {
    if (stage === 0 || stage === 1) setStage(2);
    else if (stage === 2) send(0);
    else if (stage === 3) setStage(4);
  };

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace(state.commitment === 'unsure' ? '/promise' : '/when');
  };

  const fade = FadeIn.duration(ENTER_MS).easing(EASE_OUT);

  return (
    <ScreenShell route="/demo" back={back} footer={<PrimaryButton label={S.demo.cta} onPress={() => router.push(nextRoute('/demo'))} testID="demo-cta" />}>
      <Mascot style={styles.mascot} />
      <Title>{S.demo.title.replace('-', '\u2011')}</Title>
      <Pressable onPress={skip} accessible={false} style={styles.stage} testID="demo-stage">
        <Animated.View entering={reduced ? fade : NOTIFY_IN} style={[styles.notify, shadow.card]}>
          <View style={styles.notifyHead}>
            <Image source={avatar} style={styles.notifyIcon} />
            <Text maxFontSizeMultiplier={FONT_CAP} style={styles.notifyTitle}>{S.demo.notifyTitle}</Text>
            <Text maxFontSizeMultiplier={FONT_CAP} style={styles.notifyWhen}>{S.demo.when[time]}</Text>
          </View>
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.notifyBody}>{S.demo.notification}</Text>
        </Animated.View>

        {stage >= 1 && (
          <Animated.View entering={fade} style={styles.chat}>
            {stage === 1 && !reduced ? (
              <Typing />
            ) : (
              <Juno text={fill(S.demo.ask, { greet: S.demo.greet[time] })} />
            )}
            {stage === 2 && (
              <Animated.View entering={fade} style={styles.replies}>
                {S.demo.replies.map((r, i) => (
                  <Chip key={r} label={r} selected={false} onToggle={() => send(i)} testID={`demo-reply-${i}`} />
                ))}
              </Animated.View>
            )}
            {stage >= 3 && picked !== null && (
              <Animated.View entering={fade} style={styles.me}>
                <Text maxFontSizeMultiplier={FONT_CAP} style={styles.meText}>{S.demo.replies[picked]}</Text>
              </Animated.View>
            )}
            {stage === 3 && !reduced && <Typing />}
            {stage === 4 && (
              <Animated.View entering={fade} style={styles.logged}>
                <Juno text={S.demo.logged} />
              </Animated.View>
            )}
          </Animated.View>
        )}
      </Pressable>
    </ScreenShell>
  );
}

function Juno({ text }: { text: string }) {
  return (
    <View style={styles.row}>
      <Image source={avatar} style={styles.avatar} />
      <View style={[styles.bubble, shadow.card]}>
        <Text maxFontSizeMultiplier={FONT_CAP} style={styles.bubbleText}>{text}</Text>
      </View>
    </View>
  );
}

function Typing() {
  return (
    <View style={styles.row}>
      <Image source={avatar} style={styles.avatar} />
      <View style={[styles.bubble, shadow.card]}>
        <TypingDots />
      </View>
    </View>
  );
}

const NOTIFY_IN = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: -24 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }], easing: EASE_OUT },
}).duration(NOTIFY_LANDS_MS);

const styles = StyleSheet.create({
  mascot: { alignSelf: 'flex-start', marginLeft: 12, width: 96, height: 72, marginTop: 8, marginBottom: -22 },
  stage: { marginHorizontal: 16, padding: 12, borderRadius: radius.card, backgroundColor: colors.replyBubble, gap: 12 },
  notify: { backgroundColor: colors.surface, borderRadius: radius.panel, padding: 14, gap: 4 },
  notifyHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  notifyIcon: { width: 22, height: 22, borderRadius: 6 },
  notifyTitle: { ...type.subtitle, fontWeight: '600', color: colors.ink, flex: 1 },
  notifyWhen: { ...type.small, color: colors.muted },
  notifyBody: { ...type.subtitle, color: colors.ink },
  chat: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  avatar: { width: 30, height: 30, borderRadius: 15 },
  bubble: { flexShrink: 1, backgroundColor: colors.surface, borderRadius: radius.panel, borderBottomLeftRadius: 6, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleText: { fontSize: 17, lineHeight: 23, color: colors.ink },
  replies: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingLeft: 38 },
  me: { alignSelf: 'flex-end', maxWidth: '80%', backgroundColor: colors.userBubble, borderRadius: radius.panel, borderBottomRightRadius: 6, paddingHorizontal: 14, paddingVertical: 10 },
  meText: { fontSize: 17, lineHeight: 23, color: '#FFFFFF' },
  logged: { gap: 10 },
  dots: { flexDirection: 'row', gap: 6, paddingLeft: 38 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: colors.radio },
  dotFill: { position: 'absolute', top: -1.5, left: -1.5, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.orange },
  after: { marginTop: 14, gap: 12 },
  caption: { ...type.subtitle, color: colors.inkSoft, textAlign: 'center', paddingHorizontal: 36 },
});
