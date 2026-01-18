import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TrustPillar {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

// Backloaded Earning Model:
// - Progressive earning throughout study: 20-25% of total value
// - Completion bonus at the end: 75-80% of total value
// This model ensures participants are incentivized to complete while feeling progress
export interface DistributionFormula {
  // Progressive earning components (earned throughout study)
  onboarding: number;        // Earned when baseline assessment completed
  dailyCheckIn: number;      // Earned per day for check-ins
  weeklyAssessment: number;  // Earned per week for assessments
  endpointAssessment: number; // Earned for completing final assessment

  // Completion bonus (earned only upon full study completion)
  completionBonus: number;   // 75-80% of total - the "big prize"
}

// Completion requirements for unlocking the completion bonus
export interface CompletionRequirements {
  minDailyCheckInPercent: number;  // e.g., 70% = must complete 70% of daily check-ins
  requireBaselineAssessment: boolean;
  requireEndpointAssessment: boolean;
}

export interface PlatformSettings {
  heartbeatsPerDollar: number;  // 2000 heartbeats = $1, so 1 heartbeat = $0.0005 (0.05 cents)
  defaultStudyDuration: number;
  distributionFormula: DistributionFormula;
  completionRequirements: CompletionRequirements;
  trustStackPillars: TrustPillar[];
}

interface PlatformSettingsStore extends PlatformSettings {
  // Actions
  setHeartbeatsPerDollar: (value: number) => void;
  setDefaultStudyDuration: (value: number) => void;
  setDistributionFormula: (formula: DistributionFormula) => void;
  setCompletionRequirements: (requirements: CompletionRequirements) => void;
  updateTrustPillar: (id: string, updates: Partial<TrustPillar>) => void;
  resetToDefaults: () => void;
}

const DEFAULT_TRUST_PILLARS: TrustPillar[] = [
  {
    id: 'real-person',
    title: 'Real Person',
    description: 'Identity verification confirmed',
    enabled: true,
  },
  {
    id: 'real-device',
    title: 'Real Device',
    description: 'Wearable connected and syncing',
    enabled: true,
  },
  {
    id: 'real-participation',
    title: 'Real Participation',
    description: '28 days of active engagement',
    enabled: true,
  },
  {
    id: 'no-incentive',
    title: 'No Incentive to Lie',
    description: 'Same rebate regardless of outcome',
    enabled: true,
  },
];

// Backloaded Distribution (must total 100%)
// Example for $100 rebate = 200,000 heartbeats (at 2000 per $1):
// - Onboarding: 5% = 10,000 heartbeats ($5)
// - Daily check-ins: 14% = 28,000 heartbeats (~$14) over 28 days = 1,000/day
// - Weekly assessments: 4% = 8,000 heartbeats ($4) over 4 weeks = 2,000/week
// - Endpoint assessment: 2% = 4,000 heartbeats ($2)
// - Completion bonus: 75% = 150,000 heartbeats ($75)
const DEFAULT_DISTRIBUTION: DistributionFormula = {
  onboarding: 5,           // 5% for completing baseline assessment
  dailyCheckIn: 14,        // 14% spread across daily check-ins
  weeklyAssessment: 4,     // 4% spread across weekly assessments
  endpointAssessment: 2,   // 2% for completing final assessment
  completionBonus: 75,     // 75% completion bonus - the big prize!
};

const DEFAULT_COMPLETION_REQUIREMENTS: CompletionRequirements = {
  minDailyCheckInPercent: 70,  // Must complete 70% of daily check-ins
  requireBaselineAssessment: true,
  requireEndpointAssessment: true,
};

const DEFAULT_SETTINGS: PlatformSettings = {
  heartbeatsPerDollar: 2000,  // 2000 heartbeats = $1, so 1 heartbeat = $0.0005 (0.05 cents)
  defaultStudyDuration: 28,
  distributionFormula: DEFAULT_DISTRIBUTION,
  completionRequirements: DEFAULT_COMPLETION_REQUIREMENTS,
  trustStackPillars: DEFAULT_TRUST_PILLARS,
};

export const usePlatformSettingsStore = create<PlatformSettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setHeartbeatsPerDollar: (value) =>
        set({ heartbeatsPerDollar: value }),

      setDefaultStudyDuration: (value) =>
        set({ defaultStudyDuration: value }),

      setDistributionFormula: (formula) =>
        set({ distributionFormula: formula }),

      setCompletionRequirements: (requirements) =>
        set({ completionRequirements: requirements }),

      updateTrustPillar: (id, updates) =>
        set((state) => ({
          trustStackPillars: state.trustStackPillars.map((pillar) =>
            pillar.id === id ? { ...pillar, ...updates } : pillar
          ),
        })),

      resetToDefaults: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'reputable-platform-settings',
    }
  )
);

// Helper to calculate total heartbeats from rebate
export function calculateHeartbeats(
  rebateAmount: number,
  heartbeatsPerDollar: number
): number {
  return rebateAmount * heartbeatsPerDollar;
}

// Helper to validate distribution formula totals 100%
export function validateDistribution(formula: DistributionFormula): boolean {
  const total =
    formula.onboarding +
    formula.dailyCheckIn +
    formula.weeklyAssessment +
    formula.endpointAssessment +
    formula.completionBonus;
  return total === 100;
}

// Calculate progressive vs completion breakdown for display
export function calculateEarningBreakdown(
  rebateAmount: number,
  heartbeatsPerDollar: number,
  formula: DistributionFormula
) {
  const totalHeartbeats = rebateAmount * heartbeatsPerDollar;

  // Progressive earning (what you can earn without completing)
  const progressivePercent = formula.onboarding + formula.dailyCheckIn +
    formula.weeklyAssessment + formula.endpointAssessment;
  const progressiveHeartbeats = Math.round(totalHeartbeats * (progressivePercent / 100));
  const progressiveDollars = progressiveHeartbeats / heartbeatsPerDollar;

  // Completion bonus (only if you complete)
  const completionHeartbeats = Math.round(totalHeartbeats * (formula.completionBonus / 100));
  const completionDollars = completionHeartbeats / heartbeatsPerDollar;

  return {
    total: {
      heartbeats: totalHeartbeats,
      dollars: rebateAmount,
    },
    progressive: {
      heartbeats: progressiveHeartbeats,
      dollars: progressiveDollars,
      percent: progressivePercent,
    },
    completion: {
      heartbeats: completionHeartbeats,
      dollars: completionDollars,
      percent: formula.completionBonus,
    },
    breakdown: {
      onboarding: Math.round(totalHeartbeats * (formula.onboarding / 100)),
      dailyCheckIn: Math.round(totalHeartbeats * (formula.dailyCheckIn / 100)),
      weeklyAssessment: Math.round(totalHeartbeats * (formula.weeklyAssessment / 100)),
      endpointAssessment: Math.round(totalHeartbeats * (formula.endpointAssessment / 100)),
      completionBonus: completionHeartbeats,
    },
  };
}

// Get default values for reset
export { DEFAULT_DISTRIBUTION, DEFAULT_COMPLETION_REQUIREMENTS };
