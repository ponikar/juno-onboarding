import { addDays, formatDate, toISODate } from '@/lib/dates';
import { meterFor } from '@/lib/meter';
import type { OnboardingState } from '@/state/onboarding';

let failed = 0;
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : ` got=${JSON.stringify(got)} want=${JSON.stringify(want)}`}`);
}

const today = new Date(2026, 10, 14);
const base: Pick<OnboardingState, 'commitment' | 'nextAppointment'> = { commitment: null, nextAppointment: null };
const filled = (s: typeof base, r: 'health' | 'days' | 'routine') => meterFor(s, r, today).ticks.map((t) => t.filled);

check('ticks health', filled(base, 'health'), [true, true, false, false]);
check('ticks days', filled(base, 'days'), [true, true, true, false]);
check('ticks routine, no commitment', filled(base, 'routine'), [true, true, true, false]);
check('ticks routine, unsure', filled({ ...base, commitment: 'unsure' }, 'routine'), [true, true, true, true]);
check('ticks routine, most days', filled({ ...base, commitment: 'most_days' }, 'routine'), [true, true, true, true]);
check('ticks days, most days', filled({ ...base, commitment: 'most_days' }, 'days'), [true, true, true, false]);
check('tick labels', meterFor(base, 'health', today).ticks.map((t) => t.label), ['Today', 'Health', 'Days', 'Routine']);

const appt = (n: number) => ({ ...base, nextAppointment: toISODate(addDays(today, n)) });
const week = `7 entries by ${formatDate(addDays(today, 6))}`;
check('forecast none', meterFor(base, 'days', today).forecast, week);
check('forecast past', meterFor(appt(-2), 'days', today).forecast, week);
check('forecast day 0', meterFor(appt(0), 'days', today).forecast, "Today's entry is already on it");
check('forecast 1 day', meterFor(appt(1), 'days', today).forecast, `Up to 2 entries by ${formatDate(addDays(today, 1))}`);
check('forecast 3 days', meterFor(appt(3), 'routine', today).forecast, `Up to 4 entries by ${formatDate(addDays(today, 3))}`);
check('forecast 12 days', meterFor(appt(12), 'days', today).forecast, `Up to 13 entries by ${formatDate(addDays(today, 12))}`);
check('forecast on health card ignores appointment', meterFor(appt(3), 'health', today).forecast, week);

console.log(failed ? `${failed} FAILED` : 'ALL PASS');
process.exit(failed ? 1 : 0);
