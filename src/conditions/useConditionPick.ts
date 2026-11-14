import { router } from 'expo-router';
import { useState } from 'react';

import { fill, S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { customEntry } from '@/lib/search';
import { track } from '@/lib/track';
import { useOnboarding } from '@/state/onboarding';

export const ALL_CONDITIONS: readonly string[] = S.conditions.options;
// Placeholder order until Juno shares which conditions are most common.
export const TOP_CONDITIONS = ALL_CONDITIONS.slice(0, 6);
export const shortName = (c: string) => c.replace(/\s*\(.*\)$/, '');

// Shared selection logic for the experiment variants of screen 6. State lives in the same store
// fields as the shipped screen (conditions[], seekingDiagnosis), so Back and variant switches keep it.
// "Still looking for answers" is exclusive with conditions.
export function useConditionPick() {
  const { state, set } = useOnboarding();
  const [query, setQuery] = useState('');
  const picked = state.conditions;
  const seeking = state.seekingDiagnosis;
  const q = query.trim().toLowerCase();
  const matches = q ? ALL_CONDITIONS.filter((c) => c.toLowerCase().includes(q)) : ALL_CONDITIONS;
  const custom = customEntry(query, ALL_CONDITIONS, picked);

  const toggle = (c: string) => {
    const conditions = picked.includes(c) ? picked.filter((x) => x !== c) : [...picked, c];
    set({ conditions, seekingDiagnosis: false });
    track('answer', { screen: 'conditions', conditions });
  };
  const remove = (c: string) => toggle(c);
  const toggleSeeking = () => {
    const next = !seeking;
    set({ seekingDiagnosis: next, conditions: next ? [] : picked });
    track('answer', { screen: 'conditions', seekingDiagnosis: next });
  };
  const addCustom = () => {
    if (!custom) return;
    toggle(custom);
    setQuery('');
  };

  const reply = picked.length
    ? fill(S.conditions.reply, { condition: shortName(picked[0]) })
    : seeking
      ? S.conditions.replyNone
      : null;
  const ctaLabel =
    picked.length === 0 ? S.common.continue : picked.length === 1 ? S.conditions.add1 : fill(S.conditions.addN, { n: picked.length });
  const canContinue = picked.length > 0 || seeking;
  const onContinue = () => router.push(nextRoute('/conditions'));

  return { picked, seeking, query, setQuery, matches, custom, addCustom, toggle, remove, toggleSeeking, reply, ctaLabel, canContinue, onContinue };
}
