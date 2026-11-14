import { S } from '@/copy/strings';
import { daysInsight, daysKnown } from '@/lib/insights';
import { useOnboarding } from '@/state/onboarding';
import { InsightCard } from '@/ui/InsightCard';

// Screen 14 (spec 5 and 6).
export default function InsightDays() {
  const { state } = useOnboarding();
  return <InsightCard route="/insight-days" insight={daysInsight(state)} known={daysKnown(state)} next={S.card.daysNext} />;
}
