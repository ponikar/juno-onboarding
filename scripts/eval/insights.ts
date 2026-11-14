import { F1, F2, F3, F4, F5, F6, F8, Insight } from '@/copy/facts';
import { S } from '@/copy/strings';
import { formatDate, fromISODate } from '@/lib/dates';
import { daysInsight, daysKnown, healthInsight, healthKnown } from '@/lib/insights';

let failed = 0;
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : ` got=${JSON.stringify(got)} want=${JSON.stringify(want)}`}`);
}

const h = (conditions: string[], seekingDiagnosis = false) => ({ conditions, seekingDiagnosis });

// Check 3: screen 10 rule order.
check('3 endometriosis -> F3', healthInsight(h(['Endometriosis']), 'US').id, 'F3');
check('3 Lupus -> F4', healthInsight(h(['Lupus']), 'US').id, 'F4');
check('3 lupus (case) -> F4', healthInsight(h(['lupus']), 'US').id, 'F4');
check("3 Crohn's (not in Juno's list) -> F1", healthInsight(h(["Crohn's disease"]), 'US').id, 'F1');
check('3 still looking -> F8', healthInsight(h([], true), 'US').id, 'F8');
check('3 GB none -> F2', healthInsight(h([]), 'GB').id, 'F2');
check('3 US none -> F1', healthInsight(h([]), 'US').id, 'F1');
check('3 unknown region none -> F1', healthInsight(h([]), null).id, 'F1');
check('3 endometriosis + lupus -> F3', healthInsight(h(['Lupus', 'Endometriosis']), 'GB').id, 'F3');
check('3 lupus + still looking -> F4', healthInsight(h(['Lupus'], true), 'GB').id, 'F4');

// Check 4: screen 14.
for (const support of ['none', 'one_two', 'three_five', 'lots', null] as const) {
  check(`4 flag off, support=${support} -> F5`, daysInsight({ support }).id, 'F5');
}
check('4 flag on, none -> F6', daysInsight({ support: 'none' }, true).id, 'F6');
check('4 flag on, one_two -> F6', daysInsight({ support: 'one_two' }, true).id, 'F6');
check('4 flag on, three_five -> F5', daysInsight({ support: 'three_five' }, true).id, 'F5');
check('4 flag on, lots -> F5', daysInsight({ support: 'lots' }, true).id, 'F5');
check('4 flag on, unanswered -> F5', daysInsight({ support: null }, true).id, 'F5');

// Check 5: copied from docs/specs/narration-v2.md section 6.
const spec: [Insight, string, string, string, string][] = [
  [F3, '8 years 10 months', 'average wait for an endometriosis diagnosis in the UK.', 'Source: Endometriosis UK, 2024', 'A long wait is common. It is not your fault.'],
  [F4, '4 doctors', 'seen on average before an autoimmune diagnosis.', 'Source: Autoimmune Association', 'A long road is common. It is not your fault.'],
  [F8, '14 years', 'Isaac, who co-built Juno, waited for a diagnosis.', "Source: Juno's founders", 'Still looking is common. It is not your fault.'],
  [F2, '1 in 4', 'adults in England have two or more long-term conditions.', 'Source: Richmond Group of Charities', 'You are far from the only one.'],
  [F1, '6 in 10', 'US adults have a chronic condition.', 'Source: CDC', 'You are far from the only one.'],
  [F6, '3 in 4', 'people starting Juno said the same.', 'Source: Juno onboarding data', 'You have one more now.'],
  [F5, '11 seconds', 'before the doctor cut in, in one US study.', 'Source: Journal of General Internal Medicine', "Your page speaks first, so you don't have to rush."],
];
for (const [f, stat, label, source, kind] of spec) {
  check(`5 ${f.id} matches spec`, [f.stat, f.label, f.source, f.kind], [stat, label, source, kind]);
}

// Check 6: known-so-far rows, given and not given.
const text = (rows: { text: string; given: boolean }[]) => rows.map((r) => [r.text, r.given]);
check(
  '6 screen 10 given',
  text(healthKnown({ conditions: ['POTS', 'hEDS'], symptoms: ['Fatigue', 'Headaches', 'Dizziness'], medicines: ['Salt tablets'] })),
  [["Today's entry", true], ['Conditions: 2', true], ['Symptoms: 3', true], ['Medicines: 1', true]],
);
check(
  '6 screen 10 not given',
  text(healthKnown({ conditions: [], symptoms: [], medicines: [] })),
  [["Today's entry", true], ['Conditions: still looking', false], ['Symptoms: none right now', false], ['Medicines: add later', false]],
);
check(
  '6 screen 14 given',
  text(daysKnown({ nextAppointment: '2026-12-12' })),
  [[`Next appointment: ${formatDate(fromISODate('2026-12-12'))}`, true], ['Energy on a normal day', true]],
);
check(
  '6 screen 14 not given',
  text(daysKnown({ nextAppointment: null })),
  [['Next appointment: none booked', false], ['Energy on a normal day', true]],
);

// Checks 10 and 14: banned words and em dashes in every insight and card string.
const copy = [
  ...spec.flatMap(([f]) => [f.stat, f.label, f.source, f.kind]),
  ...Object.values(S.known),
  ...Object.values(S.card),
];
const banned = /pattern|better|improve|cure|treat|prognosis|death|—/i;
check('10/14 no banned words or em dash', copy.filter((s) => banned.test(s)), []);

console.log(failed ? `${failed} FAILED` : 'ALL PASS');
process.exit(failed ? 1 : 0);
