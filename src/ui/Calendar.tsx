import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { S } from '@/copy/strings';
import { fromISODate, startOfDay, toISODate } from '@/lib/dates';
import { STATE_MS } from '@/motion/tokens';
import { colors, radius, shadow, FONT_CAP } from '@/theme/tokens';
import { haptic } from './haptics';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';

const CELL = 42;

// Month card from Figma 28 appointment: past days muted, today orange, selected day an orange disc.
export function Calendar({ value, onChange, today }: { value: string | null; onChange: (iso: string) => void; today: Date }) {
  const first = startOfDay(today);
  const [month, setMonth] = useState(() => {
    const d = value ? fromISODate(value) : first;
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const atFirstMonth = month.getFullYear() === first.getFullYear() && month.getMonth() === first.getMonth();
  const lead = month.getDay();
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, i) => (i >= lead && i < lead + days ? i - lead + 1 : null));
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));

  return (
    <View style={[styles.card, shadow.card]}>
      <View style={styles.head}>
        <Text maxFontSizeMultiplier={FONT_CAP} style={styles.month} accessibilityRole="header">
          {`${S.appt.months[month.getMonth()]} ${month.getFullYear()}`}
        </Text>
        <PressableScale accessibilityRole="button" accessibilityLabel={S.appt.prevMonth} disabled={atFirstMonth} onPress={() => shift(-1)} hitSlop={4} style={styles.chev}>
          <Icon name="chevron.left" size={18} color={atFirstMonth ? colors.hairline : colors.orange} weight="semibold" />
        </PressableScale>
        <PressableScale accessibilityRole="button" accessibilityLabel={S.appt.nextMonth} onPress={() => shift(1)} hitSlop={4} style={styles.chev}>
          <Icon name="chevron.right" size={18} color={colors.orange} weight="semibold" />
        </PressableScale>
      </View>
      <View style={styles.row}>
        {S.appt.weekdays.map((w) => (
          <Text maxFontSizeMultiplier={FONT_CAP} key={w} style={styles.weekday}>
            {w}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((day, i) => {
          if (day === null) return <View key={i} style={styles.cell} />;
          const date = new Date(month.getFullYear(), month.getMonth(), day);
          const iso = toISODate(date);
          const past = date < first;
          const isToday = date.getTime() === first.getTime();
          const selected = iso === value;
          return (
            <PressableScale
              key={i}
              accessibilityRole="button"
              accessibilityLabel={iso}
              accessibilityState={{ selected, disabled: past }}
              disabled={past}
              hitSlop={2}
              onPress={() => {
                haptic.selection();
                onChange(iso);
              }}
              style={styles.cell}>
              <View
                style={[
                  styles.disc,
                  { backgroundColor: selected ? colors.orange : 'transparent', transitionProperty: 'backgroundColor', transitionDuration: STATE_MS } as object,
                ]}>
                <Text maxFontSizeMultiplier={FONT_CAP} style={[styles.day, past && styles.past, isToday && styles.today, selected && styles.selected]}>{day}</Text>
              </View>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, borderRadius: radius.card, backgroundColor: colors.surface, paddingHorizontal: 14, paddingTop: 8, paddingBottom: 16 },
  head: { flexDirection: 'row', alignItems: 'center', paddingLeft: 8, marginBottom: 6 },
  month: { flex: 1, fontSize: 17, lineHeight: 22, fontWeight: '600', color: colors.ink },
  chev: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row' },
  weekday: { flex: 1, textAlign: 'center', fontSize: 13, lineHeight: 18, fontWeight: '500', color: colors.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  cell: { width: `${100 / 7}%`, height: CELL, alignItems: 'center', justifyContent: 'center' },
  disc: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  day: { fontSize: 20, color: colors.ink, fontVariant: ['tabular-nums'] },
  past: { color: '#BDBBBC' },
  today: { color: colors.orange, fontWeight: '600' },
  selected: { color: '#FFFFFF', fontWeight: '600' },
});
