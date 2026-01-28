/**
 * Brand View Types
 * 
 * Types specific to the Brand View experience.
 * Core domain types come from @/lib/types.
 */

export type BrandViewTab = "brand-overview" | "brand-insights" | "brand-results" | "brand-widget";

export interface BrandViewProps {
  studyId: string;
}

export interface BrandTabProps {
  studyId: string;
  studyCategory: string;
}

/** Category display configuration derived from tier */
export interface CategoryDisplayConfig {
  tier: 1 | 2 | 3 | 4;
  hasWearables: boolean;
  isWearablePrimary: boolean;
  wearableLabel: string;
  assessmentLabel: string;
  higherIsBetter: boolean;
  primaryMetricType: "wearable" | "assessment";
}

/** Demo phase configuration for sales demos */
export interface DemoPhase {
  id: string;
  label: string;
  description: string;
  enrollmentCount: number;
  completedCount: number;
  currentDay: number;
  status: "recruiting" | "active" | "completed";
}

export const DEMO_PHASES: DemoPhase[] = [
  {
    id: "day-0",
    label: "Day 0",
    description: "Study just launched — enrollment link is live",
    enrollmentCount: 0,
    completedCount: 0,
    currentDay: 0,
    status: "recruiting",
  },
  {
    id: "day-1",
    label: "Day 1",
    description: "First participants joining",
    enrollmentCount: 3,
    completedCount: 0,
    currentDay: 1,
    status: "active",
  },
  {
    id: "day-3",
    label: "Day 3",
    description: "Patterns emerging across participants",
    enrollmentCount: 12,
    completedCount: 0,
    currentDay: 3,
    status: "active",
  },
  {
    id: "day-28",
    label: "Day 28",
    description: "Study complete — full results",
    enrollmentCount: 47,
    completedCount: 31,
    currentDay: 28,
    status: "completed",
  },
];
