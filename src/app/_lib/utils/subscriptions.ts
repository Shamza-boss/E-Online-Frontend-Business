import { SubscriptionFeatureFlag, SubscriptionPlan } from '../interfaces/types';

export function planToFeatureFlag(
  plan?: SubscriptionPlan | null
): SubscriptionFeatureFlag {
  return plan === 'Enterprise'
    ? SubscriptionFeatureFlag.Enterprise
    : SubscriptionFeatureFlag.Standard;
}

export function featureFlagToPlan(
  flag?: SubscriptionFeatureFlag | null
): SubscriptionPlan {
  return flag === SubscriptionFeatureFlag.Enterprise
    ? 'Enterprise'
    : 'Standard';
}
