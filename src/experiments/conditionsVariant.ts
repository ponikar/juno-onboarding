import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

// Which conditions screen (6) to show. Flipped from the debug menu or ?variant= on a deep link.
// 'current' is the shipped screen; A, B and C are the experiment variants.
export const CONDITIONS_VARIANTS = ['current', 'A', 'B', 'C'] as const;
export type ConditionsVariant = (typeof CONDITIONS_VARIANTS)[number];

const KEY = 'juno.experiment.conditions';
let value: ConditionsVariant = 'current';
const listeners = new Set<() => void>();
let touched = false; // a setter ran before storage loaded: keep its value

AsyncStorage.getItem(KEY)
  .then((v) => {
    if (!touched && v && (CONDITIONS_VARIANTS as readonly string[]).includes(v)) setConditionsVariant(v as ConditionsVariant, false);
  })
  .catch(() => {});

export function setConditionsVariant(v: ConditionsVariant, persist = true) {
  if (persist) touched = true;
  value = v;
  if (persist) AsyncStorage.setItem(KEY, v).catch(() => {});
  listeners.forEach((l) => l());
}

export function useConditionsVariant() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => value,
  );
}
