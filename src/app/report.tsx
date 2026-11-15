import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { fill, joinList, S } from '@/copy/strings';
import { useOnboarding } from '@/state/onboarding';
import { colors, radius, shadow, type, FONT_CAP, TITLE_CAP } from '@/theme/tokens';
import { haptic } from '@/ui/haptics';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell } from '@/ui/ScreenShell';

// Screen 20 (from 09 story-report + 29 reply-care-team): a sample one-page summary and what it becomes.
export default function Report() {
  const { state } = useOnboarding();

  useEffect(() => {
    const t = setTimeout(() => haptic.light(), 350);
    return () => clearTimeout(t);
  }, []);

  const conditions = state.conditions.length
    ? joinList(state.conditions)
    : state.seekingDiagnosis
      ? S.report.seeking
      : S.report.none;
  const sex = state.sexAtBirth && state.sexAtBirth !== 'undisclosed' ? S.about.sex.find((o) => o.id === state.sexAtBirth)?.label : null;
  const details = [state.ageRange ? fill(S.report.age, { age: state.ageRange }) : null, sex].filter(Boolean).join(' · ');


  return (
    <ScreenShell route="/report" scroll={false} footer={<PrimaryButton label={S.project.cta} onPress={() => router.push('/save')} />}>
      <ScrollView
        style={styles.fill}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
>
        <View style={styles.titleRow}>
          <Text maxFontSizeMultiplier={TITLE_CAP} accessibilityRole="header" style={[type.title, styles.center]}>{S.report.title}</Text>
          <View style={styles.badge}>
            <Text maxFontSizeMultiplier={FONT_CAP} style={styles.badgeText}>{S.report.badge}</Text>
          </View>
        </View>

        <View style={[styles.doc, shadow.card]}>
          {state.name || details ? <Text maxFontSizeMultiplier={FONT_CAP} style={styles.label}>{S.report.patient}</Text> : null}
          {state.name ? <Text maxFontSizeMultiplier={FONT_CAP} style={styles.name}>{state.name}</Text> : null}
          {details ? <Text maxFontSizeMultiplier={FONT_CAP} style={styles.value}>{details}</Text> : null}

          {state.name || details ? <View style={styles.rule} /> : null}
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.label}>{S.report.conditions}</Text>
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.value}>{conditions}</Text>

          <View style={styles.rule} />
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.label}>{S.report.medicines}</Text>
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.value}>{state.medicines.length ? joinList(state.medicines) : S.report.none}</Text>

          <View style={styles.rule} />
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.label}>{S.report.recent}</Text>
          <View style={styles.dayRow}>
            <Text maxFontSizeMultiplier={FONT_CAP} style={styles.dayLabel}>{S.report.todayLabel}</Text>
            <View style={{ flex: 1, gap: 8 }}>
              {state.todayEntry ? <Text maxFontSizeMultiplier={FONT_CAP} style={styles.value}>{fill(S.snapshot.todayAsWritten, { entry: state.todayEntry })}</Text> : null}
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
          </View>
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.note}>{S.report.sampleNote}</Text>
        </View>

      </ScrollView>
    </ScreenShell>
  );
}


const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: { paddingTop: 24, paddingHorizontal: 20, paddingBottom: 24 },
  titleRow: { alignItems: 'center', gap: 10, paddingHorizontal: 16 },
  center: { textAlign: 'center' },
  doc: { marginTop: 24, backgroundColor: colors.surface, borderRadius: radius.panel, padding: 20 },
  badge: { backgroundColor: colors.orangeStrong, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  label: { fontSize: 13, lineHeight: 17, fontWeight: '600', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 },
  name: { fontSize: 20, lineHeight: 25, fontWeight: '700', color: colors.ink },
  value: { fontSize: 16, lineHeight: 21, color: colors.ink },
  rule: { height: StyleSheet.hairlineWidth, backgroundColor: colors.hairline, marginVertical: 14 },
  dayRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  dayLabel: { width: 52, fontSize: 15, lineHeight: 21, fontWeight: '600', color: colors.ink },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: colors.orangeFill, borderColor: colors.orangeBorder, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 14, lineHeight: 18, color: colors.ink },
  note: { marginTop: 14, fontSize: 13, lineHeight: 17, color: colors.muted },
});
