import { AUTOIMMUNE, F1, F2, F3, F4, F5, F6, F8, FACT_F6_APPROVED, Insight } from '@/copy/facts';
import { fill, S } from '@/copy/strings';
import { formatDate, fromISODate } from '@/lib/dates';
import type { OnboardingState } from '@/state/onboarding';

export type KnownRow = { key: string; text: string; given: boolean };

const lower = (s: string) => s.toLowerCase();
const AUTOIMMUNE_IN_LIST = new Set(
  AUTOIMMUNE.map(lower).filter((name) => S.conditions.options.some((o) => lower(o) === name)),
);

export function healthInsight(state: Pick<OnboardingState, 'conditions' | 'seekingDiagnosis'>, region: string | null): Insight {
  if (state.conditions.includes('Endometriosis')) return F3;
  if (state.conditions.some((c) => AUTOIMMUNE_IN_LIST.has(lower(c)))) return F4;
  if (state.seekingDiagnosis) return F8;
  if (region === 'GB') return F2;
  return F1;
}

export function daysInsight(state: Pick<OnboardingState, 'support'>, approved: boolean = FACT_F6_APPROVED): Insight {
  if (approved && (state.support === 'none' || state.support === 'one_two')) return F6;
  return F5;
}

export function deviceRegion(): string | null {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  return locale.split('-').slice(1).find((part) => /^[A-Z]{2}$/.test(part)) ?? null;
}

export function healthKnown(state: Pick<OnboardingState, 'conditions' | 'symptoms' | 'medicines'>): KnownRow[] {
  const counted = (key: string, n: number, given: string, none: string) =>
    ({ key, given: n > 0, text: n > 0 ? fill(given, { n }) : none });
  return [
    { key: 'today', text: S.known.today, given: true },
    counted('conditions', state.conditions.length, S.known.conditions, S.known.conditionsNone),
    counted('symptoms', state.symptoms.length, S.known.symptoms, S.known.symptomsNone),
    counted('meds', state.medicines.length, S.known.meds, S.known.medsNone),
  ];
}

export function daysKnown(state: Pick<OnboardingState, 'nextAppointment'>): KnownRow[] {
  const appt = state.nextAppointment;
  return [
    { key: 'appt', given: !!appt, text: appt ? fill(S.known.appt, { date: formatDate(fromISODate(appt)) }) : S.known.apptNone },
    { key: 'energy', text: S.known.energy, given: true },
  ];
}
