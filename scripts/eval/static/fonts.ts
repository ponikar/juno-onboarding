// G-01 every fontSize in tokens and StyleSheets: nothing below 13, body/input 16+
import { readdirSync } from 'node:fs';
import { check, done, read } from './lib';
const files = ['src/theme/tokens.ts', ...['src/app', 'src/ui'].flatMap((d) => readdirSync(`${import.meta.dir}/../../../${d}`).filter((f) => f.endsWith('.tsx')).map((f) => `${d}/${f}`))];
for (const f of files) read(f).split('\n').forEach((line, i) => {
  for (const m of line.matchAll(/(\w+):\s*\{[^{}]*?fontSize:\s*([\d.]+)/g)) {
    const n = Number(m[2]), name = m[1];
    const bodyish = /^(body|input|field|entry|bubbleText|text|meText|userText|chip)$/.test(name);
    check('G-01', n >= 13 && (!bodyish || n >= 16), `${f}:${i + 1} ${name} ${n}pt${bodyish ? ' (body/input, needs 16)' : ''}`);
  }
});
done();
