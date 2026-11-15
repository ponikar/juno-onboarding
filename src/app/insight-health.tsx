import { deviceRegion, healthInsight, healthKnown } from '@/lib/insights';
import { useOnboarding } from '@/state/onboarding';
import { InsightCard } from '@/ui/InsightCard';

export default function InsightHealth() {
  const { state } = useOnboarding();
  return <InsightCard route="/insight-health" insight={healthInsight(state, deviceRegion())} known={healthKnown(state)} reached="health" />;
}
