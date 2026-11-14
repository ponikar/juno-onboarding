// D-01 D-02 D-03 D-05 D-06 D-08 D-10 D-11 over src/copy/strings.ts
import { check, done, EXEMPT, flatten, sentences, words } from './lib';

const all = flatten().filter((e) => !e.key.startsWith('debug.') && !/\.mock/.test(e.key));
const last = (k: string) => k.split('.').pop()!.replace(/\[\d+\]$/, '');

// D-01 headlines and questions
const HEAD = /^(q|title|titleAnon|trialTitle|freeTitle|exitQ|headline)$/;
const heads = all.filter(
  (e) => !EXEMPT.has(e.key) && (HEAD.test(last(e.key)) || e.key.startsWith('plans.headline.') || e.key === 'notify.trial' || e.key === 'notify.free') && !e.key.startsWith('how.rows'),
);
for (const e of heads) {
  const w = words(e.value).length, c = e.value.length;
  check('D-01', w <= 12 && c <= 60, `${e.key} = "${e.value}" (${w} words, ${c} chars)`);
}

// D-02 reason lines: why and sub under a title
const reasons = all.filter((e) => !EXEMPT.has(e.key) && /^(why|sub|trialSub|freeSub)$/.test(last(e.key)) && !e.key.startsWith('how.rows'));
for (const e of reasons) {
  const w = words(e.value).length, s = sentences(e.value).length;
  check('D-02', w <= 12 && s <= 1, `${e.key} = "${e.value}" (${w} words, ${s} sentences)`);
}

// D-03 Juno replies
const replies = all.filter((e) => /^reply/.test(last(e.key)) || e.key.startsWith('chat.replies.') || e.key === 'chat.open');
for (const e of replies) {
  const w = words(e.value).length, s = sentences(e.value).length;
  check('D-03', w <= 15 && s <= 2, `${e.key} = "${e.value}" (${w} words, ${s} sentences)`);
}

// D-05 sentence length, every string
let d05 = 0;
for (const e of all) for (const s of sentences(e.value)) {
  const w = words(s).length;
  if (w > 20) { d05++; check('D-05', false, `${e.key}: "${s}" (${w} words)`); }
}
if (!d05) check('D-05', true, `no sentence over 20 words in ${all.length} strings`);

// D-06 sensitive questions carry a reason line
const S06: Record<string, string> = { conditions: 'conditions', medicines: 'meds', 'age and sex': 'about', 'health data': 'health' };
const byKey = new Map(all.map((e) => [e.key, e.value]));
for (const [label, g] of Object.entries(S06)) {
  const why = byKey.get(`${g}.why`);
  check('D-06', !!why && words(why).length > 0, `${label}: ${g}.why = ${why ? `"${why}"` : 'MISSING'}`);
}

// D-08 banned words
const BANNED = [/\bdiagnose\b/i, /\btreat(s|ing)?\b/i, /\bcure[sd]?\b/i, /\bguarantee\w*/i, /we found a pattern/i];
let d08 = 0;
for (const e of all) for (const re of BANNED) if (re.test(e.value)) { d08++; check('D-08', false, `${e.key} = "${e.value}" matches ${re}`); }
if (!d08) check('D-08', true, `no banned word (${BANNED.map(String).join(' ')})`);
const numbers = all.filter((e) => /^welcome\.proof/.test(e.key));
console.log(`NOTE D-08 unverifiable claims (need a source): ${numbers.map((e) => `${e.key}="${e.value.replace(/\n/g, ' ')}"`).join(', ')}`);

// D-10 pressure and shame
const PRESSURE = [/don.t miss/i, /last chance/i, /you should/i, /hurry/i, /only \w+ left/i, /expires?\b/i, /ends (today|soon|in)/i, /act now/i, /limited time/i];
let d10 = 0;
for (const e of all) for (const re of PRESSURE) if (re.test(e.value)) { d10++; check('D-10', false, `${e.key} = "${e.value}" matches ${re}`); }
if (!d10) check('D-10', true, 'no pressure phrase');

// D-11 one voice: replies speak as "I", never "we/us/let's"
for (const e of replies) {
  const bad = /\b(we|we’ll|we'll|we’re|us|let’s|let's)\b/i.test(e.value);
  check('D-11', !bad, `${e.key} = "${e.value}"${bad ? ' (uses we/us/let’s)' : ''}`);
}
for (const e of all.filter((e) => /^(heard|symptoms|meds|conditions|appt|energy|about|health|snapshot)\.(title|sub)$/.test(e.key))) {
  const third = /\bJuno\b/.test(e.value);
  if (third) check('D-11', false, `${e.key} = "${e.value}" (third person "Juno" on a screen where Juno replies as "I")`);
}
done();
