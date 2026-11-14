import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { S } from '../../../src/copy/strings';

export const ROOT = join(import.meta.dir, '../../..');
export const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');

export type Entry = { key: string; value: string };

export function flatten(obj: unknown = S, prefix = ''): Entry[] {
  if (typeof obj === 'string') return [{ key: prefix, value: obj }];
  if (Array.isArray(obj)) return obj.flatMap((v, i) => flatten(v, `${prefix}[${i}]`));
  if (obj && typeof obj === 'object')
    return Object.entries(obj).flatMap(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k));
  return [];
}

export const strip = (s: string) => s.replace(/\{\w+\}/g, 'X').replace(/\n/g, ' ');
export const words = (s: string) => strip(s).split(/\s+/).filter((w) => /[\p{L}\p{N}#$]/u.test(w));
export const sentences = (s: string) =>
  strip(s).split(/(?<=[.!?…])\s+/).map((x) => x.trim()).filter(Boolean);

export const EXEMPT = new Set([
  'welcome.termsLead', 'welcome.terms', 'welcome.and', 'welcome.privacy',
  'consent.agreeLead', 'consent.privacy', 'consent.and', 'consent.terms',
  'plans.yearlyPrice', 'plans.yearlySub', 'plans.monthlyPrice', 'plans.monthlyPer', 'plans.monthlySub',
  'plans.terms', 'plans.termsMonthly', 'plans.refund', 'plans.termsLink', 'plans.privacy', 'plans.restore',
  'plans.badge', 'how.noPayment',
]);

let failures = 0;
export function check(id: string, ok: boolean, msg: string) {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${msg}`);
}
export function done() {
  console.log(failures ? `\n${failures} failure(s)` : '\nall green');
  process.exit(failures ? 1 : 0);
}
