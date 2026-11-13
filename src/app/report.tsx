import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fill, joinList, S } from '@/copy/strings';
import { daysUntil } from '@/lib/dates';
import { useOnboarding } from '@/state/onboarding';
import { colors, radius, shadow, type } from '@/theme/tokens';
import { haptic } from '@/ui/haptics';
import { PrimaryButton } from '@/ui/PrimaryButton';

// Screen 16 (from 09 story-report + 29 reply-care-team): a sample one-page summary, shown as a native sheet.
export default function Report() {
  const insets = useSafeAreaInsets();
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
  const days = state.nextAppointment ? Math.max(0, daysUntil(state.nextAppointment, new Date())) : null;
  const countdown =
    days === null ? null : days === 0 ? S.report.countdown0 : days === 1 ? S.report.countdown1 : fill(S.report.countdown, { days });

  const onContinue = () => {
    router.dismiss();
    router.push('/save');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.fill, styles.scroll]}>
        <Text accessibilityRole="header" style={[type.title, styles.center]}>{S.report.title}</Text>

        <View style={[styles.doc, shadow.card]}>
          <View style={styles.docHead}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{S.report.patient}</Text>
              {state.name ? <Text style={styles.name}>{state.name}</Text> : null}
              {state.ageRange ? <Text style={styles.value}>{fill(S.report.age, { age: state.ageRange })}</Text> : null}
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{S.report.badge}</Text>
            </View>
          </View>

          <View style={styles.rule} />
          <Text style={styles.label}>{S.report.conditions}</Text>
          <Text style={styles.value}>{conditions}</Text>

          <View style={styles.rule} />
          <Text style={styles.label}>{S.report.medicines}</Text>
          <Text style={styles.value}>{state.medicines.length ? joinList(state.medicines) : S.report.none}</Text>

          <View style={styles.rule} />
          <Text style={styles.label}>{S.report.recent}</Text>
          <View style={styles.dayRow}>
            <Text style={styles.dayLabel}>{S.report.todayLabel}</Text>
            <View style={{ flex: 1, gap: 8 }}>
              {state.todayEntry ? <Text style={styles.value}>{fill(S.snapshot.todayAsWritten, { entry: state.todayEntry })}</Text> : null}
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
          </View>
          <Text style={styles.note}>{S.report.sampleNote}</Text>
        </View>

        {countdown ? <Text style={styles.countdown}>{countdown}</Text> : null}
        <Text style={[type.subtitle, styles.center, styles.footerText]}>{S.report.footer}</Text>
      </View>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton label={S.report.cta} onPress={onContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  fill: { flex: 1 },
  scroll: { paddingTop: 36, paddingHorizontal: 20, paddingBottom: 24 },
  center: { textAlign: 'center' },
  doc: { marginTop: 24, backgroundColor: colors.surface, borderRadius: radius.panel, padding: 20 },
  docHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  badge: { backgroundColor: colors.orange, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '600', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 },
  name: { fontSize: 20, lineHeight: 25, fontWeight: '700', color: colors.ink },
  value: { fontSize: 16, lineHeight: 21, color: colors.ink },
  rule: { height: StyleSheet.hairlineWidth, backgroundColor: colors.hairline, marginVertical: 14 },
  dayRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  dayLabel: { width: 52, fontSize: 15, lineHeight: 21, fontWeight: '600', color: colors.ink },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: colors.orangeFill, borderColor: colors.orangeBorder, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 14, lineHeight: 18, color: colors.ink },
  note: { marginTop: 14, fontSize: 13, lineHeight: 17, color: colors.muted },
  countdown: { marginTop: 20, textAlign: 'center', fontSize: 17, lineHeight: 22, fontWeight: '600', color: colors.ink },
  footerText: { color: colors.inkSoft, marginTop: 10, paddingHorizontal: 12 },
  footer: { paddingHorizontal: 29, paddingTop: 8 },
});
