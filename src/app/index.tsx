import { Redirect } from 'expo-router';

import { FLOW } from '@/flow';
import { useOnboarding } from '@/state/onboarding';

// Resume where the user left off (AsyncStorage), else start at Welcome.
export default function Index() {
  const { ready, state } = useOnboarding();
  if (!ready) return null;
  const known = FLOW.some((s) => s.route === state.lastRoute);
  return <Redirect href={(known ? state.lastRoute : '/welcome') as never} />;
}
