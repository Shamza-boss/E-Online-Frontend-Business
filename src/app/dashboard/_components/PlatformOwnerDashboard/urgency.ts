import {
  urgencyFromGrade,
  urgencyPaletteKey,
  type UrgencyPaletteKey,
  type UrgencyTone,
} from '../TraineeDashboardHome/urgency';
import {
  toneHex,
  urgencyFromActiveShare,
  urgencyFromAttentionCount,
  urgencyFromRate,
} from '../AdminDashboardHome/urgency';

export type { UrgencyPaletteKey, UrgencyTone };
export {
  urgencyFromGrade,
  urgencyFromRate,
  urgencyFromAttentionCount,
  urgencyFromActiveShare,
  urgencyPaletteKey,
  toneHex,
};

/** Margin % average → same ladder as grades. */
export function urgencyFromMargin(avgPercent: number): UrgencyTone {
  return urgencyFromGrade(avgPercent);
}
