import { S } from '@/copy/strings';
import { deviceRegion, healthInsight, healthKnown } from '@/lib/insights';
import { useOnboarding } from '@/state/onboarding';
import { InsightCard } from '@/ui/InsightCard';

// Screen 10 (spec 5 and 6).
export default function InsightHealth() {
  const { state } = useOnboarding();
  return <InsightCard route="/insight-health" insight={healthInsight(state, deviceRegion())} known={healthKnown(state)} next={S.card.healthNext} reached="health" />;
}
