import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

// Experiment switches for the debug menu. All default on; switching one off shows the screen as before.
export const FLAGS = {
  projection: 'Personal projection (15, 16)',
  actionEnding: 'Sleep reply in first chat (21)',
  activationTracking: 'Activation tracking (4)',
} as const;
export type Flag = keyof typeof FLAGS;

const KEY = 'juno.experiment.flags';
let values: Record<Flag, boolean> = { projection: true, actionEnding: true, activationTracking: true };
const listeners = new Set<() => void>();
let touched = false; // a setter ran before storage loaded: keep its value
const emit = () => listeners.forEach((l) => l());

AsyncStorage.getItem(KEY)
  .then((raw) => {
    if (!raw || touched) return;
    values = { ...values, ...JSON.parse(raw) };
    emit();
  })
  .catch(() => {});

export function setFlag(flag: Flag, on: boolean) {
  touched = true;
  values = { ...values, [flag]: on };
  AsyncStorage.setItem(KEY, JSON.stringify(values)).catch(() => {});
  emit();
}

export function getFlag(flag: Flag) {
  return values[flag];
}

export function useFlag(flag: Flag) {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => values[flag],
  );
}
