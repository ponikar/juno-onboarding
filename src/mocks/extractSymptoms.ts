// MOCK: stands in for the model call that would read the first entry.

const TABLE: { symptom: string; words: string[] }[] = [
  { symptom: 'Fatigue', words: ['tired', 'exhausted', 'fatigue', 'drained', 'wiped'] },
  { symptom: 'Headaches', words: ['headache', 'migraine', 'head'] },
  { symptom: 'Dizziness', words: ['dizzy', 'lightheaded'] },
  { symptom: 'Nausea', words: ['nauseous', 'nausea', 'sick'] },
  { symptom: 'Brain fog', words: ["can't think", 'can’t think', 'foggy', 'fog'] },
  { symptom: 'Palpitations', words: ['heart racing', 'palpitations'] },
  { symptom: 'Breathlessness', words: ['breathless', 'breath'] },
  { symptom: 'Fainting', words: ['fainted', 'faint'] },
];

export type SymptomMatch = { start: number; end: number; symptom: string };

export function extractSymptoms(entry: string): { symptoms: string[]; matches: SymptomMatch[] } {
  const lower = entry.toLowerCase();
  const matches: SymptomMatch[] = [];
  const taken: boolean[] = new Array(lower.length).fill(false);

  for (const { symptom, words } of TABLE) {
    for (const word of words) {
      let from = 0;
      while (from <= lower.length) {
        const at = lower.indexOf(word, from);
        if (at === -1) break;
        const end = at + word.length;
        const startsWord = at === 0 || !/[a-z]/.test(lower[at - 1]);
        const free = !taken.slice(at, end).some(Boolean);
        if (startsWord && free) {
          let wordEnd = end;
          while (wordEnd < lower.length && /[a-z]/.test(lower[wordEnd])) wordEnd++;
          matches.push({ start: at, end: wordEnd, symptom });
          for (let i = at; i < wordEnd; i++) taken[i] = true;
        }
        from = end;
      }
    }
  }

  const symptoms = TABLE.map((t) => t.symptom).filter((s) => matches.some((m) => m.symptom === s));
  matches.sort((a, b) => a.start - b.start);
  return { symptoms, matches };
}
