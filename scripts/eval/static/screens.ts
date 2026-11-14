// D-04 words per screen (approximate: every S.group.key a route file references) and T-02 main button labels
import { FLOW } from '../../../src/flow';
import { S } from '../../../src/copy/strings';
import { check, done, EXEMPT, read, words } from './lib';

const SKIP_KEY = /^(options|suggestions|exitOptions|sex|ages|weekdays|months|mock\w*|a11y|prevMonth|nextMonth|clear|debugHint|placeholder|search|namePlaceholder|typing|send|attach|close|back|addCustom|micUnavailable)$/;
const get = (g: string, k: string) => (S as any)[g]?.[k];

for (const step of FLOW) {
  if (step.route === '/chat') continue;
  const file = `src/app${step.route}.tsx`;
  const src = read(file);
  const refs = [...new Set([...src.matchAll(/S\.(\w+)\.(\w+)/g)].map((m) => `${m[1]}.${m[2]}`))];
  // alternatives (reply / replyNone / replyToday, add1 / addN, trialTitle / freeTitle...) show one at a time: keep the longest per family
  const fam = new Map<string, { key: string; n: number }>();
  for (const r of refs) {
    const [g, k] = r.split('.');
    if (EXEMPT.has(r) || SKIP_KEY.test(k)) continue;
    const v = get(g, k);
    const n = typeof v === 'string' ? words(v).length : v && typeof v === 'object' && !Array.isArray(v) ? Object.values(v).reduce((a: number, x: any) => a + (typeof x === 'string' ? words(x).length : 0), 0) : Array.isArray(v) ? v.reduce((a: number, x: any) => a + (typeof x === 'string' ? words(x).length : words(x.title ?? '').length + words(x.sub ?? '').length), 0) : 0;
    const family = `${g}.${k.replace(/(None|Tomorrow|Today|Anon|Monthly|Default|1|N|0)$/, '').replace(/^(trial|free)/, '')}`;
    const cur = fam.get(family);
    if (!cur || n > cur.n) fam.set(family, { key: r, n });
  }
  // plans.headline is a map of variants: count only the longest one
  if (fam.has('plans.headline')) fam.set('plans.headline', { key: 'plans.headline(max)', n: Math.max(...Object.values(S.plans.headline).map((x) => words(x).length)) });
  const total = [...fam.values()].reduce((a, b) => a + b.n, 0);
  const limit = [15, 16, 18].includes(step.n) ? 60 : step.n >= 3 && step.n <= 13 ? 40 : null;
  const detail = [...fam.values()].map((f) => `${f.key}:${f.n}`).join(' ');
  if (limit) check('D-04', total <= limit, `screen ${step.n} ${file} ${total}/${limit} words [${detail}]`);
  else console.log(`INFO D-04 screen ${step.n} ${file} ${total} words (no limit in spec) [${detail}]`);
}

// T-02
const VERBS = new Set(['try', 'continue', 'add', 'connect', 'start', 'see', 'claim', 'subscribe', 'let’s', 'save', 'get', 'turn', 'allow', 'remind', 'sign', 'go', 'show', 'open', 'keep', 'build']);
const mains: { n: number; file: string; keys: string[] }[] = [];
for (const step of FLOW) {
  const file = `src/app${step.route}.tsx`;
  const src = read(file);
  const m = src.match(/<PrimaryButton[\s\S]*?label=\{([^}]*)\}/);
  if (!m) continue;
  let expr = m[1];
  if (expr.trim() === 'label') expr = (src.match(/const label =([\s\S]*?);/) ?? ['', ''])[1];
  const keys = [...expr.matchAll(/S\.(\w+)\.(\w+)/g)].map((x) => `${x[1]}.${x[2]}`);
  mains.push({ n: step.n, file, keys });
}
for (const { n, file, keys } of mains) for (const k of keys) {
  const v = get(...(k.split('.') as [string, string])) as string;
  const w = words(v);
  const verb = VERBS.has(w[0].toLowerCase());
  const justContinue = v.trim() === 'Continue' && [1, 17, 19, 20].includes(n);
  check('T-02', verb && w.length <= 4 && !justContinue, `screen ${n} ${file} ${k} = "${v}" (${w.length} words${verb ? '' : ', first word not a verb'}${w.length > 4 ? ', over 4 words' : ''}${justContinue ? ', just "Continue" on a named screen' : ''})`);
}
console.log('NOTE T-02 screen 17 /save has no PrimaryButton; its buttons are save.google/save.apple/save.email:', S.save.google, '|', S.save.apple, '|', S.save.email);
done();
