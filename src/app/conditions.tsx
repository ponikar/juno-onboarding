import { ConditionsA } from '@/conditions/A';
import { ConditionsB } from '@/conditions/B';
import { ConditionsC } from '@/conditions/C';
import { ConditionsCurrent } from '@/conditions/Current';
import { useConditionsVariant } from '@/experiments/conditionsVariant';

// Screen 6. The shipped screen is the default; A, B and C are the experiment variants (debug menu).
export default function Conditions() {
  const variant = useConditionsVariant();
  if (variant === 'A') return <ConditionsA />;
  if (variant === 'B') return <ConditionsB />;
  if (variant === 'C') return <ConditionsC />;
  return <ConditionsCurrent />;
}
