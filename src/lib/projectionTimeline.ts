import { fill, S } from '@/copy/strings';
import { addDays, daysUntil, formatDate } from './dates';

export type TimelineNode = { title: string; sub: string; weekDots: boolean };

function node(text: string, weekDots = false): TimelineNode {
  const [title, sub = ''] = text.split(' · ');
  return { title, sub, weekDots };
}

// Spec 7.3: N = whole days from today to the appointment; a past date counts as none.
export function projectionTimeline(nextAppointment: string | null, today: Date): TimelineNode[] {
  const n = nextAppointment ? daysUntil(nextAppointment, today) : null;
  const week = node(S.project.week, true);
  if (n === null || n < 0) return [node(S.project.today), week, node(S.project.month)];
  if (n === 0) return [node(S.project.todayAppt), week, node(S.project.month)];
  const appt = node(fill(S.project.appt, { date: formatDate(addDays(today, n)), entries: n + 1 }));
  return n < 7 ? [node(S.project.today), appt] : [node(S.project.today), week, appt];
}
