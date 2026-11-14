// A-02 WCAG contrast for each text/background pair found in src (file:line in each row)
import { colors, skyStops } from '../../../src/theme/tokens';
import { check, done } from './lib';

type RGB = [number, number, number];
function parse(c: string): { rgb: RGB; a: number } {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (m) { const p = m[1].split(',').map(Number); return { rgb: [p[0], p[1], p[2]], a: p[3] ?? 1 }; }
  const h = c.replace('#', '');
  return { rgb: [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB, a: 1 };
}
function over(fg: string, bg: RGB): RGB { const { rgb, a } = parse(fg); return rgb.map((v, i) => v * a + bg[i] * (1 - a)) as RGB; }
function solid(...layers: string[]): RGB { let base = parse(layers[0]).rgb; for (const l of layers.slice(1)) base = over(l, base); return base; }
const lum = ([r, g, b]: RGB) => { const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a: RGB, b: RGB) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const lightestSky = skyStops[skyStops.length - 2].color; // #F9F7F8, the palest stop
const skyTop = skyStops[0].color;
// [label, fg, bg layers (bottom first), size pt, weight, where]
const pairs: [string, string, string[], number, number, string][] = [
  ['white sky title on sky top stop', colors.skyText, [skyTop], 28, 700, 'src/theme/tokens.ts:57 titleSky'],
  ['white sky title on lightest sky stop', colors.skyText, [lightestSky], 28, 700, 'src/theme/tokens.ts:44 skyStops (worst case)'],
  ['sky why/sub 90% white on sky top', 'rgba(255,255,255,0.9)', [skyTop], 15, 400, 'src/ui/ScreenShell.tsx:107'],
  ['sky why/sub 90% white on mid sky #74AAE8', 'rgba(255,255,255,0.9)', ['#74AAE8'], 15, 400, 'src/ui/ScreenShell.tsx:107 (if title wraps lower)'],
  ['placeholder muted on surface', colors.muted, [colors.surface], 17, 400, 'src/ui/Fields.tsx:16'],
  ['muted text on bg', colors.muted, [colors.bg], 16, 600, 'src/app/symptoms.tsx:112 groupText'],
  ['muted 12pt label on surface', colors.muted, [colors.surface], 12, 600, 'src/app/report.tsx:101'],
  ['muted 13pt note on surface', colors.muted, [colors.surface], 13, 400, 'src/app/report.tsx:110'],
  ['muted 14pt row sub on bg', colors.muted, [colors.bg], 14, 400, 'src/app/how.tsx:119'],
  ['inkSoft on bg', colors.inkSoft, [colors.bg], 15, 400, 'src/ui/ScreenShell.tsx:107'],
  ['inkSoft on surface', colors.inkSoft, [colors.surface], 14, 400, 'src/app/plans.tsx:204 terms'],
  ['ink on bg', colors.ink, [colors.bg], 17, 400, 'src/theme/tokens.ts type.body'],
  ['disabled button label on disabled fill', colors.buttonDisabledText, [colors.buttonDisabled], 18, 600, 'src/ui/PrimaryButton.tsx:31'],
  ['button label on black', colors.buttonText, [colors.button], 18, 600, 'src/ui/PrimaryButton.tsx:31'],
  ['button label on navy', colors.buttonText, [colors.navy], 18, 600, 'src/app/welcome.tsx:85'],
  ['welcome proof/terms grey on bg (art assumed bg colour)', '#868485', [colors.bg], 14, 400, 'src/app/welcome.tsx:124'],
  ['consent body on sky art (assumed bg)', '#6E5A50', [colors.bg], 17, 400, 'src/app/consent.tsx:55'],
  ['consent agree text on panel', '#6E5A50', ['#EFEFEF'], 16, 400, 'src/app/consent.tsx:58'],
  ['plans badge tab white on orange', '#FFFFFF', ['#E8783E'], 13, 700, 'src/app/plans.tsx:191'],
  ['report badge white on orange', '#FFFFFF', [colors.orange], 13, 700, 'src/app/report.tsx:100'],
  ['calendar today orange on surface', colors.orange, [colors.surface], 20, 600, 'src/ui/Calendar.tsx:95'],
  ['calendar selected white on orange disc', '#FFFFFF', [colors.orange], 20, 600, 'src/ui/Calendar.tsx:96'],
  ['calendar weekday muted on surface', colors.muted, [colors.surface], 13, 500, 'src/ui/Calendar.tsx:89'],
  ['user bubble white on blue', '#FFFFFF', [colors.userBubble], 18, 400, 'src/app/heard.tsx:151'],
  ['snapshot label 80% white on glass over lightest sky', 'rgba(255,255,255,0.8)', [lightestSky, 'rgba(38,108,196,0.32)'], 13, 600, 'src/app/snapshot.tsx:95'],
  ['snapshot value white on glass over lightest sky', '#FFFFFF', [lightestSky, 'rgba(38,108,196,0.32)'], 16, 600, 'src/app/snapshot.tsx:96'],
  ['snapshot value white on glass over sky #A9C6F0', '#FFFFFF', ['#A9C6F0', 'rgba(38,108,196,0.32)'], 16, 600, 'src/app/snapshot.tsx:96'],
  ['building item white on glass over sky #74AAE8', colors.skyText, ['#74AAE8', 'rgba(255,255,255,0.16)'], 17, 600, 'src/app/building.tsx:88'],
  ['building item white on glass over sky #A9C6F0', colors.skyText, ['#A9C6F0', 'rgba(255,255,255,0.16)'], 17, 600, 'src/app/building.tsx:88'],
  ['energy end label on bg', '#7A6253', [colors.bg], 15, 500, 'src/ui/EnergySlider.tsx:126'],
  ['heard card date muted on surface', colors.muted, [colors.surface], 13, 400, 'src/app/heard.tsx:157'],
];
for (const [label, fg, bg, pt, w, where] of pairs) {
  const b = solid(...bg);
  const r = ratio(over(fg, b), b);
  const large = pt >= 24 || (pt >= 18.66 && w >= 700);
  const need = large ? 3 : 4.5;
  check('A-02', r >= need, `${label}: ${r.toFixed(2)}:1 (need ${need}, ${pt}pt w${w}) ${where}`);
}
// non-text (1.4.11): control outlines 3:1
const outlines: [string, string, string, string][] = [
  ['chip border hairline on surface', colors.hairline, colors.surface, 'src/ui/Chip.tsx:33'],
  ['field border orangeBorder on surface', colors.orangeBorder, colors.surface, 'src/ui/Fields.tsx:57'],
  ['tick ring radio on surface', colors.radio, colors.surface, 'src/ui/Chip.tsx:83'],
  ['disabled button fill on bg', colors.buttonDisabled, colors.bg, 'src/ui/PrimaryButton.tsx:27'],
];
for (const [label, fg, bg, where] of outlines) {
  const r = ratio(parse(fg).rgb, parse(bg).rgb);
  check('A-02', r >= 3, `outline ${label}: ${r.toFixed(2)}:1 (need 3) ${where}`);
}
done();
