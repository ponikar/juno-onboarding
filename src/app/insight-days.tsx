import { daysInsight, daysKnown } from '@/lib/insights';
import { useOnboarding } from '@/state/onboarding';
import { InsightCard } from '@/ui/InsightCard';

export default function InsightDays() {
  const { state } = useOnboarding();
  return <InsightCard route="/insight-days" insight={daysInsight(state)} known={daysKnown(state)} reached="days" />;
}
