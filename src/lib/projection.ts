import { fill, S } from '@/copy/strings';
import { daysUntil } from './dates';

export const MAX_MARKERS = 14;

export type Projection = {
  days: number; // how many days the markers stand for
  markers: number; // markers drawn (capped at MAX_MARKERS)
  more: number; // days beyond the drawn markers
  line: string; // snapshot line
  label: string; // report label under the markers
};

// Computed only from the user's answers: their appointment date and the symptoms they logged.
export function projection(input: { nextAppointment: string | null; todaySymptoms: readonly string[]; symptoms: readonly string[] }, today: Date): Projection {
  const n = input.nextAppointment ? daysUntil(input.nextAppointment, today) : null;
  let days: number;
  let line: string;
  if (n === null || n < 0) {
    days = 7;
    const symptom = input.todaySymptoms[0] ?? input.symptoms[0];
    line = symptom ? fill(S.projection.week, { symptom: symptom.toLowerCase() }) : S.projection.weekNoSymptom;
  } else if (n <= 1) {
    days = 1;
    line = S.projection.soon;
  } else {
    days = n;
    line = fill(S.projection.appointment, { n });
  }
  const markers = Math.min(days, MAX_MARKERS);
  return {
    days,
    markers,
    more: days - markers,
    line,
    label: days === 1 ? S.projection.logged1 : fill(S.projection.loggedN, { n: days }),
  };
}
