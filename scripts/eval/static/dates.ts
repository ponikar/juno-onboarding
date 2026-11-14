// D-12 trial dates computed from today and shown in the device's format
import { formatDate, trialDates } from '../../../src/lib/dates';
import { check, done, read } from './lib';
const t = new Date(2026, 10, 28); // crosses a month end
const d = trialDates(t);
check('D-12', d.remind.getDate() === 3 && d.remind.getMonth() === 11 && d.charge.getDate() === 5, `trialDates(2026-11-28): remind ${d.remind.toDateString()}, charge ${d.charge.toDateString()}`);
for (const f of ['src/app/plans.tsx', 'src/app/how.tsx']) check('D-12', /trialDates\(new Date\(\)\)/.test(read(f)), `${f} computes dates from new Date()`);
const lib = read('src/lib/dates.ts');
const localeAware = /toLocaleDateString|Intl\.DateTimeFormat/.test(lib.match(/export function formatDate[\s\S]*?\n\}/)![0]);
check('D-12', localeAware, `src/lib/dates.ts formatDate uses ${localeAware ? 'the device locale' : `a hard-coded English month array ("${formatDate(t)}" on every device)`}; used by plans.tsx:80, how.tsx:29-30, building.tsx:25`);
done();
