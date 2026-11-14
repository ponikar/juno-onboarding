// A-01 every pressable: visual size + 2 x hitSlop >= 44 (iOS) and >= 48 (Android)
import { readdirSync } from 'node:fs';
import { size } from '../../../src/theme/tokens';
import { check, done, read } from './lib';
const files = ['src/app', 'src/ui'].flatMap((d) => readdirSync(`${import.meta.dir}/../../../${d}`).filter((f) => f.endsWith('.tsx')).map((f) => `${d}/${f}`));
const num = (v: string | undefined, src: string) => {
  if (!v) return undefined;
  v = v.trim();
  if (/^size\.\w+$/.test(v)) return (size as any)[v.slice(5)];
  const c = src.match(new RegExp(`const ${v} = (\\d+)`)); if (c) return Number(c[1]);
  return /^\d+(\.\d+)?$/.test(v) ? Number(v) : undefined;
};
// visuals without a fixed style, measured by hand (file:line given)
const MANUAL: Record<string, [number, number, string]> = {
  'src/app/chat.tsx:attach': [20, 20, 'icon only, Icon size 20, no style'],
  'src/app/welcome.tsx:Pressable': [999, 40, 'logo long-press, debug only'],
  'src/ui/Sheet.tsx:Pressable': [999, 999, 'full-screen dim'],
  'src/app/plans.tsx:card': [300, 60, 'plan card, padding 14 + text, estimated'],
  'src/app/plans.tsx:exitOption': [0, 0, 'see style'],
  'src/ui/Calendar.tsx:cell': [48, 42, 'width 1/7 of ~340pt card = ~48, height CELL 42'],
};
for (const f of files) {
  const src = read(f);
  src.split('\n').forEach((line, i) => {
    const m = line.match(/<(PressableScale|Pressable)\b/);
    if (!m || f.endsWith('PressableScale.tsx')) return;
    const block = src.split('\n').slice(i, i + 14).join('\n').split(/>\s*\n/)[0];
    const slop = Number(block.match(/hitSlop=\{(\d+)\}/)?.[1] ?? (m[1] === 'PressableScale' ? 6 : 0));
    const key = block.match(/styles\.(\w+)/)?.[1];
    const sty = key ? src.match(new RegExp(`\\b${key}:\\s*\\{([\\s\\S]*?)\\}`))?.[1] ?? '' : '';
    let h = num(sty.match(/(?:min)?[hH]eight:\s*([\w.]+)/)?.[1], src);
    let w = num(sty.match(/(?<![a-zA-Z])width:\s*([\w.]+)/)?.[1], src);
    const pv = Number(sty.match(/paddingVertical:\s*(\d+)/)?.[1] ?? 0);
    let note = key ?? 'no style';
    const man = MANUAL[`${f}:${key ?? (block.includes('S.chat.attach') ? 'attach' : m[1])}`];
    if (man && man[0]) { w = man[0]; h = man[1]; note += ` (${man[2]})`; }
    if (h === undefined && pv) { h = pv * 2 + 21; note += ' (height = padding + 21pt line, estimated)'; }
    if (w === undefined) w = 999; // stretches or wraps text wider than 44
    if (h === undefined) { console.log(`NOT TESTED A-01 ${f}:${i + 1} ${note}: no height found`); return; }
    const eh = h + 2 * slop, ew = w + 2 * slop;
    const ok = Math.min(eh, ew) >= 48;
    const ios = Math.min(eh, ew) >= 44;
    check('A-01', ok, `${f}:${i + 1} ${note}: ${w === 999 ? 'wide' : w}x${h} + hitSlop ${slop} = ${w === 999 ? 'wide' : ew}x${eh}${ok ? '' : ios ? ' (meets iOS 44, misses Android 48)' : ' (misses iOS 44)'}`);
  });
}
done();
