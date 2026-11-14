import { S } from '@/copy/strings';
import { addDays, formatDate, toISODate } from '@/lib/dates';
import { projectionTimeline } from '@/lib/projectionTimeline';

let failed = 0;
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : ` got=${JSON.stringify(got)} want=${JSON.stringify(want)}`}`);
}

const today = new Date(2026, 10, 14);
const inDays = (n: number) => toISODate(addDays(today, n));
const titles = (appt: string | null) => projectionTimeline(appt, today).map((x) => x.title);
const dots = (appt: string | null) => projectionTimeline(appt, today).map((x) => x.weekDots);

check('none: titles', titles(null), ['Today', 'Day 7', 'Day 30']);
check('none: week dots on node 2', dots(null), [false, true, false]);
check('none: subs', projectionTimeline(null, today).map((x) => x.sub), ['1 entry', '7 entries, side by side', 'A month on one page']);
check('today: titles', titles(inDays(0)), ['Today, your appointment', 'Day 7', 'Day 30']);
check('today: first sub', projectionTimeline(inDays(0), today)[0].sub, 'Your first entry is on the page');
check('3 days: titles', titles(inDays(3)), ['Today', `${formatDate(addDays(today, 3))}, your appointment`]);
check('3 days: no week dots', dots(inDays(3)), [false, false]);
check('3 days: entries', projectionTimeline(inDays(3), today)[1].sub, 'Up to 4 entries on one page');
check('12 days: titles', titles(inDays(12)), ['Today', 'Day 7', `${formatDate(addDays(today, 12))}, your appointment`]);
check('12 days: week dots on node 2', dots(inDays(12)), [false, true, false]);
check('12 days: entries', projectionTimeline(inDays(12), today)[2].sub, 'Up to 13 entries on one page');
check('past date = none', titles(inDays(-2)), titles(null));

const banned = /pattern|better|improve|—/i;
for (const [group, strings] of [['project', S.project], ['commit', S.commit]] as const) {
  for (const [k, v] of Object.entries(strings)) check(`S.${group}.${k} has no banned word or em dash`, banned.test(v), false);
}

console.log(failed ? `${failed} FAILED` : 'ALL PASS');
process.exit(failed ? 1 : 0);
