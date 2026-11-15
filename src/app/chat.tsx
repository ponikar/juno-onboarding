import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fill, joinList, S } from '@/copy/strings';
import { track } from '@/lib/track';
import { extractSymptoms } from '@/mocks/extractSymptoms';
import { ENTER_MS } from '@/motion/tokens';
import { useOnboarding } from '@/state/onboarding';
import { colors, radius, shadow, FONT_CAP } from '@/theme/tokens';
import { avatar, chatIcons } from '@/ui/art';
import { haptic } from '@/ui/haptics';
import { Icon } from '@/ui/Icon';
import { PressableScale } from '@/ui/PressableScale';
import { useKeyboardOpen } from '@/ui/ScreenShell';
import { WeekDots } from '@/ui/WeekDots';

type Msg = { id: number; from: 'me' | 'juno'; text: string };
type SuggestionId = keyof typeof S.chat.replies;

const TYPING_MS = 900;

// MOCK: canned replies. Free text reuses screen 4's keyword match, so nothing medical is generated.
function replyTo(text: string, id?: SuggestionId) {
  if (id) return S.chat.replies[id];
  const { symptoms } = extractSymptoms(text);
  return symptoms.length ? fill(S.chat.replies.logged, { list: joinList(symptoms.map((x) => x.toLowerCase())) }) : S.chat.replies.saved;
}

// First chat (from next-first-chat): today's entry already logged, Juno's opening line, suggestions and a working (mocked) input.
export default function Chat() {
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboardOpen();
  const { state } = useOnboarding();
  const logged = state.todayEntry || state.todaySymptoms.length > 0;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const nextId = useRef(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scroller = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const input = useRef<React.ComponentRef<typeof TextInput>>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const push = (from: Msg['from'], text: string) => setMessages((m) => [...m, { id: nextId.current++, from, text }]);

  const junoSays = (text: string) => {
    if (timer.current) clearTimeout(timer.current);
    setTyping(true);
    timer.current = setTimeout(() => {
      setTyping(false);
      push('juno', text);
      if (Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(text);
      haptic.light();
    }, TYPING_MS);
  };

  const send = (text: string, id?: SuggestionId) => {
    const t = text.trim();
    if (!t || typing) return;
    haptic.selection();
    setShowSuggestions(false);
    push('me', t);
    setDraft('');
    track('chat_message', { suggestion: id ?? null });
    junoSays(replyTo(t, id));
  };

  const skip = () => {
    if (!showSuggestions || typing) return;
    haptic.selection();
    setShowSuggestions(false);
    track('chat_skip', {});
    junoSays(S.chat.replies.skip);
  };

  const canSend = draft.trim().length > 0 && !typing;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.root, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <View style={[styles.junoPill, shadow.nav]}>
          <Image source={avatar} style={styles.headAvatar} />
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.junoName}>{S.chat.juno}</Text>
        </View>
        {showSuggestions && !typing && (
          <PressableScale accessibilityRole="button" accessibilityLabel={S.chat.skip} onPress={skip} hitSlop={6} style={[styles.skip, shadow.nav]}>
            <Text maxFontSizeMultiplier={FONT_CAP} style={styles.skipText}>{S.chat.skip}</Text>
          </PressableScale>
        )}
      </View>
      <View style={styles.week}>
        <WeekDots caption={S.chat.day} center />
      </View>

      <ScrollView
        ref={scroller}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        onContentSizeChange={() => scroller.current?.scrollToEnd({ animated: true })}>
        {logged ? (
          <View style={[styles.logCard, shadow.card]}>
            <View style={styles.logHead}>
              <View style={styles.check}>
                <Icon name="checkmark" size={10} color="#FFFFFF" weight="bold" />
              </View>
              <Text maxFontSizeMultiplier={FONT_CAP} style={styles.logLabel}>{S.chat.loggedToday}</Text>
            </View>
            {state.todayEntry ? <Text maxFontSizeMultiplier={FONT_CAP} style={styles.entry}>{fill(S.snapshot.todayAsWritten, { entry: state.todayEntry })}</Text> : null}
            {state.todaySymptoms.length > 0 && (
              <View style={styles.chips}>
                {state.todaySymptoms.map((s) => (
                  <View key={s} style={styles.chip}>
                    <Text maxFontSizeMultiplier={FONT_CAP} style={styles.chipText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : null}

        <View style={styles.junoRow}>
          <Image source={avatar} style={styles.bubbleAvatar} />
          <View style={[styles.bubble, shadow.card]}>
            <Text maxFontSizeMultiplier={FONT_CAP} style={styles.bubbleText}>{S.chat.open}</Text>
          </View>
        </View>

        {showSuggestions && (
          <Animated.View exiting={FadeOut.duration(150)} style={styles.suggestions}>
            {S.chat.suggestions.map((s) => (
              <PressableScale
                key={s.id}
                accessibilityRole="button"
                accessibilityLabel={s.label}
                onPress={() => send(s.label, s.id as SuggestionId)}
                style={[styles.suggestion, shadow.card]}>
                <Image source={chatIcons[s.id]} style={styles.suggestionIcon} />
                <Text maxFontSizeMultiplier={FONT_CAP} style={styles.suggestionText}>{s.label}</Text>
              </PressableScale>
            ))}
          </Animated.View>
        )}

        {messages.map((m) =>
          m.from === 'me' ? (
            <Animated.View key={m.id} entering={FadeInDown.duration(ENTER_MS).easing(Easing.out(Easing.quad))} style={styles.meBubble}>
              <Text maxFontSizeMultiplier={FONT_CAP} style={styles.meText}>{m.text}</Text>
            </Animated.View>
          ) : (
            <Animated.View key={m.id} entering={FadeIn.duration(ENTER_MS)} style={styles.junoRow} accessibilityLiveRegion="polite">
              <Image source={avatar} style={styles.bubbleAvatar} />
              <View style={[styles.bubble, shadow.card]}>
                <Text maxFontSizeMultiplier={FONT_CAP} style={styles.bubbleText}>{m.text}</Text>
              </View>
            </Animated.View>
          ),
        )}

        {typing && (
          <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(100)} style={styles.junoRow} accessibilityLabel={S.chat.typing}>
            <Image source={avatar} style={styles.bubbleAvatar} />
            <View style={[styles.bubble, styles.typing, shadow.card]}>
              {[0, 1, 2].map((i) => (
                <Animated.View key={i} entering={FadeIn.delay(i * 150).duration(300)} style={styles.dot} />
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <View style={[styles.inputWrap, { paddingBottom: keyboard ? 8 : Math.max(insets.bottom, 16) }]}>
        <View style={[styles.input, shadow.card]}>
          <PressableScale accessibilityRole="button" accessibilityLabel={S.chat.attach} hitSlop={12} onPress={() => input.current?.focus()}>
            <Icon name="plus" size={20} color={colors.inkSoft} />
          </PressableScale>
          <TextInput
            ref={input}
            value={draft}
            onChangeText={setDraft}
            placeholder={S.chat.placeholder}
            placeholderTextColor={colors.muted}
            maxFontSizeMultiplier={FONT_CAP}
            style={styles.field}
            returnKeyType="send"
            submitBehavior="submit"
            onSubmitEditing={() => send(draft)}
            accessibilityLabel={S.chat.placeholder}
          />
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={S.chat.send}
            accessibilityState={{ disabled: !canSend }}
            disabled={!canSend}
            onPress={() => send(draft)}
            style={[styles.send, canSend && styles.sendOn]}>
            <Icon name="arrow.up" size={16} color={canSend ? '#FFFFFF' : colors.muted} weight="semibold" />
          </PressableScale>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F4F7' },
  header: { height: 44, alignItems: 'center', justifyContent: 'center' },
  week: { marginTop: 10 },
  junoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingLeft: 6,
    paddingRight: 16,
    height: 44,
  },
  headAvatar: { width: 32, height: 32, borderRadius: 16 },
  junoName: { fontSize: 17, fontWeight: '500', color: '#111111' },
  skip: { position: 'absolute', right: 16, height: 40, borderRadius: radius.pill, backgroundColor: colors.surface, paddingHorizontal: 14, justifyContent: 'center' },
  skipText: { fontSize: 17, fontWeight: '500', color: '#111111' },
  scroll: { paddingHorizontal: 16, paddingTop: 28, paddingBottom: 24, gap: 18 },
  logCard: { alignSelf: 'flex-end', maxWidth: '86%', backgroundColor: colors.surface, borderRadius: radius.panel, padding: 14, gap: 8 },
  logHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  check: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  logLabel: { fontSize: 13, lineHeight: 17, fontWeight: '600', color: colors.muted },
  entry: { fontSize: 16, lineHeight: 21, color: colors.ink },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: colors.orangeFill, borderColor: colors.orangeBorder, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 14, lineHeight: 18, color: colors.ink },
  junoRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '88%' },
  bubbleAvatar: { width: 30, height: 30, borderRadius: 15 },
  bubble: { flexShrink: 1, backgroundColor: colors.surface, borderRadius: radius.panel, borderBottomLeftRadius: 6, paddingHorizontal: 14, paddingVertical: 12 },
  bubbleText: { fontSize: 17, lineHeight: 23, color: colors.ink },
  suggestions: { alignItems: 'center', gap: 12, marginTop: 18 },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingLeft: 8,
    paddingRight: 22,
    height: 52,
  },
  suggestionIcon: { width: 36, height: 36, borderRadius: 18 },
  suggestionText: { fontSize: 17, fontWeight: '500', color: '#111111' },
  inputWrap: { paddingHorizontal: 24, paddingTop: 8 },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FAF9F9',
    borderRadius: radius.pill,
    height: 58,
    paddingLeft: 18,
    paddingRight: 6,
  },
  field: { flex: 1, fontSize: 17, color: colors.ink, paddingVertical: 10 },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEECEB', alignItems: 'center', justifyContent: 'center' },
  sendOn: { backgroundColor: '#111111' },
  meBubble: { alignSelf: 'flex-end', maxWidth: '80%', backgroundColor: colors.userBubble, borderRadius: radius.panel, borderBottomRightRadius: 6, paddingHorizontal: 14, paddingVertical: 10 },
  meText: { fontSize: 17, lineHeight: 23, color: '#FFFFFF' },
  typing: { flexDirection: 'row', gap: 5, paddingVertical: 16 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.muted },
});
