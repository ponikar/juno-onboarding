import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { addDays, toISODate } from '@/lib/dates';

export type Plan = 'trial_yearly' | 'monthly' | 'free' | 'sponsored';
export type Support = 'none' | 'one_two' | 'three_five' | 'lots';
export type Sex = 'female' | 'male' | 'intersex' | 'undisclosed';

export interface OnboardingState {
  consentGiven: boolean;
  todayEntry: string;
  todaySymptoms: string[];
  goals: string[];
  conditions: string[];
  seekingDiagnosis: boolean;
  symptoms: string[];
  symptomsSeeded: boolean;
  noSymptoms: boolean;
  medicines: string[];
  medicinesSkipped: boolean;
  noMedicines: boolean;
  nextAppointment: string | null;
  appointmentAnswered: boolean;
  energy: number | null; // 1..7, the seven bars on Figma 37
  support: Support | null;
  name: string;
  ageRange: string | null; // Figma 33 offers ranges, not an exact age
  sexAtBirth: Sex | null;
  healthDataConnected: boolean;
  healthAnswered: boolean;
  signedIn: boolean;
  plan: Plan | null;
  paywallExitReason: 'price' | 'unsure' | 'try_first' | null;
  notificationsAllowed: boolean | null;
  lastRoute: string | null;
}

export const initialState: OnboardingState = {
  consentGiven: false,
  todayEntry: '',
  todaySymptoms: [],
  goals: [],
  conditions: [],
  seekingDiagnosis: false,
  symptoms: [],
  symptomsSeeded: false,
  noSymptoms: false,
  medicines: [],
  medicinesSkipped: false,
  noMedicines: false,
  nextAppointment: null,
  appointmentAnswered: false,
  energy: null,
  support: null,
  name: '',
  ageRange: null,
  sexAtBirth: null,
  healthDataConnected: false,
  healthAnswered: false,
  signedIn: false,
  plan: null,
  paywallExitReason: null,
  notificationsAllowed: null,
  lastRoute: null,
};

// Presets let the debug menu and the screenshot evals open any screen in a known state.
export function presetState(name: string): OnboardingState {
  if (name === 'demo') {
    return {
      ...initialState,
      consentGiven: true,
      todayEntry: 'Tired, and my head hurts',
      todaySymptoms: ['Fatigue', 'Headaches'],
      goals: ['Manage flare days', 'Understand my symptoms', 'Prepare for appointments'],
      conditions: ['Long COVID', 'POTS', 'hEDS'],
      symptoms: ['Fatigue', 'Headaches', 'Dizziness'],
      symptomsSeeded: true,
      medicines: ['Salt tablets', 'Propranolol', 'Midodrine'],
      nextAppointment: toISODate(addDays(new Date(), 10)),
      appointmentAnswered: true,
      energy: 4,
      support: 'one_two',
      name: 'Sam',
      ageRange: '25–34',
      sexAtBirth: 'female',
      healthAnswered: true,
      signedIn: true,
      plan: 'trial_yearly',
    };
  }
  if (name === 'skipped') {
    return {
      ...initialState,
      consentGiven: true,
      todayEntry: 'feeling meh',
      seekingDiagnosis: true,
      symptomsSeeded: true,
      noSymptoms: true,
      medicinesSkipped: true,
      appointmentAnswered: true,
      healthAnswered: true,
      plan: 'free',
    };
  }
  return initialState;
}

const KEY = 'juno.onboarding.v0';

type Ctx = {
  state: OnboardingState;
  ready: boolean;
  set: (patch: Partial<OnboardingState> | ((s: OnboardingState) => Partial<OnboardingState>)) => void;
  reset: (to?: OnboardingState) => void;
};

const OnboardingContext = createContext<Ctx | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(initialState);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setState({ ...initialState, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  const set = useCallback<Ctx['set']>((patch) => {
    setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  const reset = useCallback((to: OnboardingState = initialState) => setState(to), []);

  const value = useMemo(() => ({ state, ready, set, reset }), [state, ready, set, reset]);
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}
