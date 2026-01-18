/**
 * Heartbeat (Points) Calculator
 *
 * Converts rebate amounts to heartbeats and calculates distribution
 * across the study duration.
 */

export interface HeartbeatDistribution {
  total: number;
  daily: number;
  baseline: number;
  finalSurvey: number;
  weeklyBonus: number;
  breakdown: {
    dailyTotal: number;
    dailyPercent: number;
    baselinePercent: number;
    finalPercent: number;
    weeklyPercent: number;
  };
}

export interface HeartbeatDisplayBreakdown {
  label: string;
  amount: number;
  description: string;
}

// Configuration
const HEARTBEATS_PER_DOLLAR = 10;
const DEFAULT_DURATION_DAYS = 28;

// Distribution percentages
const DAILY_PERCENT = 0.70;      // 70% for daily engagement
const BASELINE_PERCENT = 0.10;   // 10% for baseline completion
const FINAL_PERCENT = 0.10;      // 10% for final survey
const WEEKLY_PERCENT = 0.10;     // 10% for weekly bonuses (split across 4 weeks)

/**
 * Calculate heartbeat distribution from rebate amount
 */
export function calculateHeartbeats(
  rebateAmount: number,
  durationDays: number = DEFAULT_DURATION_DAYS
): HeartbeatDistribution {
  const total = rebateAmount * HEARTBEATS_PER_DOLLAR;
  const numWeeks = Math.ceil(durationDays / 7);

  const dailyTotal = Math.round(total * DAILY_PERCENT);
  const daily = Math.round(dailyTotal / durationDays);

  const baseline = Math.round(total * BASELINE_PERCENT);
  const finalSurvey = Math.round(total * FINAL_PERCENT);
  const weeklyTotal = Math.round(total * WEEKLY_PERCENT);
  const weeklyBonus = Math.round(weeklyTotal / numWeeks);

  return {
    total,
    daily,
    baseline,
    finalSurvey,
    weeklyBonus,
    breakdown: {
      dailyTotal,
      dailyPercent: DAILY_PERCENT * 100,
      baselinePercent: BASELINE_PERCENT * 100,
      finalPercent: FINAL_PERCENT * 100,
      weeklyPercent: WEEKLY_PERCENT * 100,
    },
  };
}

/**
 * Get display-friendly breakdown for UI
 */
export function getHeartbeatDisplayBreakdown(
  rebateAmount: number,
  durationDays: number = DEFAULT_DURATION_DAYS
): HeartbeatDisplayBreakdown[] {
  const dist = calculateHeartbeats(rebateAmount, durationDays);

  return [
    {
      label: "Daily device sync",
      amount: dist.daily,
      description: `~$${(dist.daily / HEARTBEATS_PER_DOLLAR).toFixed(2)}/day (${dist.breakdown.dailyPercent}%)`,
    },
    {
      label: "Baseline completion",
      amount: dist.baseline,
      description: `$${(dist.baseline / HEARTBEATS_PER_DOLLAR).toFixed(2)} (${dist.breakdown.baselinePercent}%)`,
    },
    {
      label: "Final survey",
      amount: dist.finalSurvey,
      description: `$${(dist.finalSurvey / HEARTBEATS_PER_DOLLAR).toFixed(2)} (${dist.breakdown.finalPercent}%)`,
    },
    {
      label: "Weekly bonus",
      amount: dist.weeklyBonus,
      description: `$${(dist.weeklyBonus / HEARTBEATS_PER_DOLLAR).toFixed(2)}/week (${dist.breakdown.weeklyPercent}%)`,
    },
  ];
}

/**
 * Format rebate amount as display string with heartbeats
 */
export function formatRebateWithHeartbeats(rebateAmount: number): string {
  const total = rebateAmount * HEARTBEATS_PER_DOLLAR;
  return `$${rebateAmount} (${total.toLocaleString()} heartbeats)`;
}

/**
 * Get tier-specific earning description
 */
export function getTierEarningDescription(tier: 1 | 2 | 3 | 4): string {
  switch (tier) {
    case 1:
      return "Earn heartbeats by wearing your device daily and completing brief check-ins at the start and end of the study.";
    case 2:
      return "Earn heartbeats by wearing your device daily and completing weekly assessments (about 3 minutes each).";
    case 3:
      return "Earn heartbeats by completing weekly assessments (about 5 minutes each). Your wearable provides supporting data.";
    case 4:
      return "Earn heartbeats by completing weekly assessments and uploading progress photos. Your wearable confirms your participation.";
  }
}

/**
 * Get estimated time commitment by tier
 */
export function getTimeCommitment(tier: 1 | 2 | 3 | 4): {
  daily: string;
  weekly: string;
  total: string;
} {
  switch (tier) {
    case 1:
      return {
        daily: "< 1 min",
        weekly: "1-2 min",
        total: "~30 min over 28 days",
      };
    case 2:
      return {
        daily: "< 1 min",
        weekly: "3-5 min",
        total: "~45 min over 28 days",
      };
    case 3:
      return {
        daily: "30 sec",
        weekly: "5-7 min",
        total: "~60 min over 28 days",
      };
    case 4:
      return {
        daily: "30 sec",
        weekly: "7-10 min",
        total: "~75 min over 28 days",
      };
  }
}
