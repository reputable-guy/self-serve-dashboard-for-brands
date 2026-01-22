/**
 * Shared types for admin study detail components
 */

export interface MockParticipant {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  daysInStudy: number;
  compliance: number;
  primaryMetric: { label: string; value: string; positive: boolean };
  secondaryMetrics: { label: string; value: string }[];
  testimonial: string;
  verifyUrl: string;
}

export interface StudyData {
  id: string;
  // Demo studies show sample/mock data; real studies show actual data (or empty state if new)
  isDemo?: boolean;
  name: string;
  brandId: string;
  category: string;
  categoryLabel: string;
  status: "draft" | "coming_soon" | "recruiting" | "filling-fast" | "full" | "active" | "completed" | "archived";
  participants: number;
  targetParticipants: number;
  startDate: string;
  endDate: string;
  avgImprovement: number;
  completionRate: number;
  tier: number;
  rebateAmount: number;
  hasWearables: boolean;
  productDescription: string;
  productImage: string;
  whatYoullDiscover: string[];
  dailyRoutine: string;
  howItWorks: string;
  // Primary metric configuration (Tier 1 wearables studies only)
  primaryMetricConfig?: {
    mode: "auto" | "manual";
    selectedMetric?: string;
  };
  // Current day of the study (for active studies)
  currentDay?: number;
  // Launch checklist state (for draft/coming_soon studies)
  launchChecklist?: {
    settingsComplete: boolean;
    previewReviewed: boolean;
    inventoryConfirmed: boolean;
    goLiveAt?: string;
  };
}

export interface DemographicItem {
  label: string;
  value: number;
  color: string;
}

export interface DemographicInsights {
  topMotivation: { label: string; value: number };
  exerciseActive: number;
  takesSupplements: number;
  purchaseMotivation: DemographicItem[];
  expectedResults: { label: string; value: number }[];
  exerciseFrequency: DemographicItem[];
  stressLevel: DemographicItem[];
}

export interface Demographics {
  age: DemographicItem[];
  gender: DemographicItem[];
  wearableDevices: DemographicItem[];
}

export type TabId = "overview" | "fulfillment" | "compliance" | "results" | "config";
