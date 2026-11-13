import { extractSymptoms } from '@/mocks/extractSymptoms';
import { daysUntil, formatDate, trialDates } from '@/lib/dates';

let failed = 0;
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : ` got=${JSON.stringify(got)} want=${JSON.stringify(want)}`}`);
}

const symptomCases: [string, string[]][] = [
  ['Tired, and my head hurts', ['Fatigue', 'Headaches']],
  ['Dizzy when I stand up', ['Dizziness']],
  ['Okay today, just foggy', ['Brain fog']],
  ['feeling meh', []],
  ['exhausted and exhausted', ['Fatigue']],
  ['my heart racing and I nearly fainted', ['Palpitations', 'Fainting']],
  ['breathless', ['Breathlessness']],
];
for (const [entry, want] of symptomCases) {
  const res = extractSymptoms(entry);
  check(`extractSymptoms(${JSON.stringify(entry)}).symptoms`, res.symptoms, want);
  const spansOk = res.matches.every(
    (m) => m.start >= 0 && m.end <= entry.length && m.start < m.end && want.includes(m.symptom),
  );
  check(`extractSymptoms(${JSON.stringify(entry)}).matches in range and known`, spansOk, true);
}

const today = new Date(2026, 10, 14);
const t = trialDates(today);
check('formatDate(trialDates.today)', formatDate(t.today), 'Nov 14');
check('formatDate(trialDates.remind) = today+5', formatDate(t.remind), 'Nov 19');
check('formatDate(trialDates.charge) = today+7', formatDate(t.charge), 'Nov 21');
check("daysUntil('2026-11-24', today)", daysUntil('2026-11-24', today), 10);

console.log(failed ? `${failed} FAILED` : 'ALL PASS');
process.exit(failed ? 1 : 0);
