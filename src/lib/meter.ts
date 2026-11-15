import { fill, S } from '@/copy/strings';
import type { OnboardingState } from '@/state/onboarding';
import { addDays, daysUntil, formatDate, fromISODate } from './dates';

export type MeterReached = 'health' | 'days' | 'routine';
export type MeterTick = { key: 'today' | MeterReached; label: string; filled: boolean };

// Forecast: no or past appointment = a week, today = soon, else N + 1 entries.
// The appointment is asked after the health card, so that card always shows the week forecast.
export function meterFor(state: Pick<OnboardingState, 'commitment' | 'nextAppointment'>, reached: MeterReached, today: Date) {
  const ticks: MeterTick[] = [
    { key: 'today', label: S.meter.today, filled: true },
    { key: 'health', label: S.meter.health, filled: true },
    { key: 'days', label: S.meter.days, filled: reached !== 'health' },
    { key: 'routine', label: S.meter.routine, filled: reached === 'routine' && state.commitment !== null },
  ];
  const n = state.nextAppointment && reached !== 'health' ? daysUntil(state.nextAppointment, today) : null;
  let forecast: string;
  if (n === null || n < 0) forecast = fill(S.meter.week, { date: formatDate(addDays(today, 6)) });
  else if (n === 0) forecast = S.meter.soon;
  else forecast = fill(S.meter.forecast, { entries: n + 1, date: formatDate(fromISODate(state.nextAppointment!)) });
  return { ticks, forecast };
}
