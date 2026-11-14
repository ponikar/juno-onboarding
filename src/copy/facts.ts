// Insights for the v2 narration (docs/specs/narration-v2.md, section 6). Word for word; checked 14 Nov 2026.
// Never round, reword or add a number. Every insight shows its source line.

export type Insight = { id: string; stat: string; label: string; source: string; kind: string };

// Stays false until Juno approves publishing its own onboarding data (spec section 12).
export const FACT_F6_APPROVED = false;

// F7: used inside story.body1 on screen 2 ("Isaac waited 14 years for a diagnosis.").
// https://www.ycombinator.com/launches/QT7-juno-ai-health-assistant-for-chronic-illness

export const F3: Insight = {
  // https://endometriosis-uk.org/node/1118
  id: 'F3',
  stat: '8 years 10 months',
  label: 'average wait for an endometriosis diagnosis in the UK.',
  source: 'Source: Endometriosis UK, 2024',
  kind: 'A long wait is common. It is not your fault.',
};

export const F4: Insight = {
  // https://autoimmune.org/blog/meet-dawn-green-turning-my-pain-into-purpose/
  id: 'F4',
  stat: '4 doctors',
  label: 'seen on average before an autoimmune diagnosis.',
  source: 'Source: Autoimmune Association',
  kind: 'A long road is common. It is not your fault.',
};

export const F8: Insight = {
  // https://www.ycombinator.com/launches/QT7-juno-ai-health-assistant-for-chronic-illness
  id: 'F8',
  stat: '14 years',
  label: 'Isaac, who co-built Juno, waited for a diagnosis.',
  source: "Source: Juno's founders",
  kind: 'Still looking is common. It is not your fault.',
};

export const F2: Insight = {
  // https://richmondgroupofcharities.org.uk/mltcs
  id: 'F2',
  stat: '1 in 4',
  label: 'adults in England have two or more long-term conditions.',
  source: 'Source: Richmond Group of Charities',
  kind: 'You are far from the only one.',
};

export const F1: Insight = {
  // https://www.cdc.gov/chronicdisease/resources/infographic/chronic-diseases.htm
  id: 'F1',
  stat: '6 in 10',
  label: 'US adults have a chronic condition.',
  source: 'Source: CDC',
  kind: 'You are far from the only one.',
};

export const F6: Insight = {
  // Juno funnel board (Figma), support-circle answers, about 75%
  id: 'F6',
  stat: '3 in 4',
  label: 'people starting Juno said the same.',
  source: 'Source: Juno onboarding data',
  kind: 'You have one more now.',
};

export const F5: Insight = {
  // https://pmc.ncbi.nlm.nih.gov/articles/PMC6816596 (Singh Ospina et al., authors' letter, 112 recorded visits)
  id: 'F5',
  stat: '11 seconds',
  label: 'before the doctor cut in, in one US study.',
  source: 'Source: Journal of General Internal Medicine',
  kind: "Your page speaks first, so you don't have to rush.",
};

// Autoimmune names from the spec, matched against Juno's condition list ignoring case.
// Only names that exist in Juno's list count (today: Lupus, Rheumatoid arthritis, Multiple sclerosis).
export const AUTOIMMUNE = [
  'Lupus',
  'Rheumatoid arthritis',
  'Multiple sclerosis',
  "Crohn's disease",
  'Ulcerative colitis',
  "Hashimoto's",
  'Psoriatic arthritis',
  "Sjögren's",
  'Coeliac disease',
  'Type 1 diabetes',
];
