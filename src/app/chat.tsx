import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fill, S } from '@/copy/strings';
import { useOnboarding } from '@/state/onboarding';
import { colors, radius, shadow } from '@/theme/tokens';
import { avatar, chatIcons } from '@/ui/art';
import { Icon } from '@/ui/Icon';

// First chat (from next-first-chat): today's entry already logged, Juno's opening line, static suggestions and input.
export default function Chat() {
  const insets = useSafeAreaInsets();
  const { state } = useOnboarding();
  const logged = state.todayEntry || state.todaySymptoms.length > 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <View style={[styles.junoPill, shadow.nav]}>
          <Image source={avatar} style={styles.headAvatar} />
          <Text style={styles.junoName}>{S.chat.juno}</Text>
        </View>
        <View style={[styles.skip, shadow.nav]}>
          <Text style={styles.skipText}>{S.chat.skip}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {logged ? (
          <View style={[styles.logCard, shadow.card]}>
            <View style={styles.logHead}>
              <View style={styles.check}>
                <Icon name="checkmark" size={10} color="#FFFFFF" weight="bold" />
              </View>
              <Text style={styles.logLabel}>{S.chat.loggedToday}</Text>
            </View>
            {state.todayEntry ? <Text style={styles.entry}>{fill(S.snapshot.todayAsWritten, { entry: state.todayEntry })}</Text> : null}
            {state.todaySymptoms.length > 0 && (
              <View style={styles.chips}>
                {state.todaySymptoms.map((s) => (
                  <View key={s} style={styles.chip}>
                    <Text style={styles.chipText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : null}

        <View style={styles.junoRow}>
          <Image source={avatar} style={styles.bubbleAvatar} />
          <View style={[styles.bubble, shadow.card]}>
            <Text style={styles.bubbleText}>{S.chat.open}</Text>
          </View>
        </View>

        <View style={styles.suggestions}>
          {S.chat.suggestions.map((s) => (
            <View key={s.id} style={[styles.suggestion, shadow.card]}>
              <Image source={chatIcons[s.id]} style={styles.suggestionIcon} />
              <Text style={styles.suggestionText}>{s.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.inputWrap, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={[styles.input, shadow.card]}>
          <Icon name="plus" size={20} color={colors.inkSoft} />
          <Text style={styles.placeholder}>{S.chat.placeholder}</Text>
          <View style={styles.send}>
            <Icon name="arrow.up" size={16} color={colors.muted} weight="semibold" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F4F7' },
  header: { height: 44, alignItems: 'center', justifyContent: 'center' },
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
  placeholder: { flex: 1, fontSize: 17, color: colors.muted },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEECEB', alignItems: 'center', justifyContent: 'center' },
});
