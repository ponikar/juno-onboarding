// Spec docs/specs/projection-action-activation.md R-01..R-04: numbers come from the user's answers;
// copy stays at 25 words or fewer with no banned words. Run: bun scripts/eval/projection.ts
import { S } from '@/copy/strings';
import { addDays, toISODate } from '@/lib/dates';
import { projection } from '@/lib/projection';

let failed = 0;
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : ` got=${JSON.stringify(got)} want=${JSON.stringify(want)}`}`);
}

const today = new Date(2026, 10, 14, 15, 30);
const at = (n: number) => toISODate(addDays(today, n));
const base = { todaySymptoms: ['Fatigue', 'Headaches'], symptoms: [] as string[] };

const p0 = projection({ ...base, nextAppointment: at(0) }, today);
check('today: very soon line', p0.line, 'Your appointment is very soon. Today’s entry is already in your summary.');
check('today: 1 marker, singular label', [p0.markers, p0.more, p0.label], [1, 0, '1 of 1 day logged']);

const p1 = projection({ ...base, nextAppointment: at(1) }, today);
check('tomorrow: very soon line', p1.line, p0.line);
check('tomorrow: 1 marker', [p1.markers, p1.label], [1, '1 of 1 day logged']);

const p12 = projection({ ...base, nextAppointment: at(12) }, today);
check('12 days: line', p12.line, 'Your appointment is in 12 days. Log once a day and your doctor sees 12 days of how you’ve felt, not just what you remember.');
check('12 days: 12 markers', [p12.markers, p12.more, p12.label], [12, 0, '1 of 12 days logged']);

const pn = projection({ ...base, nextAppointment: null }, today);
check('none: 7-day line with first symptom', pn.line, 'Log once a day this week and I’ll have 7 days to look for what affects your fatigue.');
check('none: 7 markers', [pn.markers, pn.label], [7, '1 of 7 days logged']);

check('none, no symptoms: fallback', projection({ todaySymptoms: [], symptoms: [], nextAppointment: null }, today).line, S.projection.weekNoSymptom);
check('none, symptom from screen 7', projection({ todaySymptoms: [], symptoms: ['Dizziness'], nextAppointment: null }, today).line.endsWith('your dizziness.'), true);
check('past date: treated as none', projection({ ...base, nextAppointment: at(-3) }, today).line, pn.line);
const p60 = projection({ ...base, nextAppointment: at(60) }, today);
check('60 days: 14 markers + 46 more', [p60.markers, p60.more, p60.label], [14, 46, '1 of 60 days logged']);

const BANNED = /\b(diagnos\w*|treat\w*|cure\w*|guarantee\w*|pattern)\b/i;
const lines = [p12.line, pn.line, p0.line, S.projection.weekNoSymptom, S.sleep.reply];
for (const l of lines) {
  const words = l.split(/\s+/).filter(Boolean).length;
  check(`<= 25 words (${words}): ${l.slice(0, 40)}…`, words <= 25, true);
  check(`no banned words: ${l.slice(0, 40)}…`, BANNED.test(l), false);
}

console.log(failed ? `${failed} FAILED` : 'ALL PASS');
process.exit(failed ? 1 : 0);
