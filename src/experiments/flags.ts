import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

// Experiment switches for the debug menu. Switching one off shows the screen as before.
export const FLAGS = {
  projection: 'Personal projection (19, 20)',
  actionEnding: 'Sleep reply in first chat (25)',
  activationTracking: 'Activation tracking (5)',
} as const;
export type Flag = keyof typeof FLAGS;

const KEY = 'juno.experiment.flags.v2'; // new key so the v2 defaults apply on devices that stored the old ones
// projection and actionEnding default off: the v2 narration spec replaces them on screens 20 and 25.
let values: Record<Flag, boolean> = { projection: false, actionEnding: false, activationTracking: true };
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
