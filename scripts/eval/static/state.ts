// J-05 every OnboardingState field is read by a screen other than where it is only written
import { readdirSync } from 'node:fs';
import { check, done, read } from './lib';
const model = read('src/state/onboarding.tsx');
const fields = [...model.match(/interface OnboardingState \{([\s\S]*?)\n\}/)![1].matchAll(/^\s+(\w+):/gm)].map((m) => m[1]);
const files = ['src/app', 'src/ui', 'src/lib'].flatMap((d) => readdirSync(`${import.meta.dir}/../../../${d}`).filter((f) => /\.tsx?$/.test(f)).map((f) => `${d}/${f}`)).filter((f) => !f.endsWith('debug.tsx'));
for (const field of fields) {
  const readers: string[] = [];
  for (const f of files) {
    const src = read(f);
    // a read: state.x / s.x / { x } destructure, not only `x:` inside set({...})
    const reads = [...src.matchAll(new RegExp(`(?:state|s|st)\\.${field}\\b`, 'g'))].length;
    if (reads) readers.push(`${f}(${reads})`);
  }
  const internal = field === 'lastRoute';
  const OWN: Record<string, string> = { goals: 'goals', support: 'support', sexAtBirth: 'about', ageRange: 'about', name: 'about', healthDataConnected: 'health', energy: 'energy', symptoms: 'symptoms', conditions: 'conditions', medicines: 'meds', nextAppointment: 'appointment' };
  const later = OWN[field] ? readers.filter((r) => !r.startsWith(`src/app/${OWN[field]}.tsx`)) : readers;
  if (OWN[field] && later.length === 0) { check('J-05', false, `${field}: answer read only on its own screen src/app/${OWN[field]}.tsx, no later screen uses it`); continue; }
  check('J-05', readers.length > 0 || internal, `${field}: read in ${readers.join(', ') || (internal ? 'resume logic only (not an answer)' : 'NO screen')}`);
}
done();
