/**
 * Mock data and helper functions for admin study detail components
 */

import {
  getSortedSensateStories,
  getSensateStudyStats,
  getSensateAverageMetrics,
} from "@/lib/sensate-real-data";
import {
  getSortedLyfefuelStories,
  getLyfefuelStudyStats,
  getLyfefuelAverageMetrics,
} from "@/lib/lyfefuel-real-data";
import type {
  MockParticipant,
  StudyData,
  Demographics,
  DemographicInsights,
} from "./types";

// ============================================
// PRE-COMPUTED REAL DATA
// ============================================

// Sensate real data
export const SORTED_SENSATE_STORIES = getSortedSensateStories();
const sensateStats = getSensateStudyStats();
const sensateMetrics = getSensateAverageMetrics();

export const SENSATE_STATS = {
  positive: sensateStats.improved,
  neutral: sensateStats.neutral,
  negative: sensateStats.noImprovement,
};

export const SENSATE_METRICS = {
  avgHrvChange: sensateMetrics.avgHrvChange,
  avgDeepSleepChange: sensateMetrics.avgDeepSleepChange,
  enrolled: sensateMetrics.enrolled,
  completed: sensateMetrics.completed,
  completionRate: sensateMetrics.completionRate,
  avgNps: sensateMetrics.avgNps,
  wouldRecommendPercent: sensateMetrics.wouldRecommendPercent,
};

// LYFEfuel real data
export const SORTED_LYFEFUEL_STORIES = getSortedLyfefuelStories();
const lyfefuelRealStats = getLyfefuelStudyStats();
const lyfefuelRealMetrics = getLyfefuelAverageMetrics();

export const LYFEFUEL_STATS = {
  positive: lyfefuelRealStats.improved,
  neutral: lyfefuelRealStats.neutral,
  negative: lyfefuelRealStats.noImprovement,
};

export const LYFEFUEL_METRICS = {
  avgActivityChange: lyfefuelRealMetrics.avgActivityChange,
  avgStepsChange: lyfefuelRealMetrics.avgStepsChange,
  enrolled: lyfefuelRealMetrics.enrolled,
  completed: lyfefuelRealMetrics.completed,
  completionRate: lyfefuelRealMetrics.completionRate,
  avgNps: lyfefuelRealMetrics.avgNps,
  wouldRecommendPercent: lyfefuelRealMetrics.wouldRecommendPercent,
};

// ============================================
// MOCK PARTICIPANT GENERATION
// ============================================

export function generateMockParticipants(
  studyCategory: string
): MockParticipant[] {
  const categoryMetrics: Record<
    string,
    {
      label: string;
      format: (v: number) => string;
      secondary: { label: string; value: string }[];
    }
  > = {
    sleep: {
      label: "deep sleep",
      format: (v) => `+${v}% deep sleep`,
      secondary: [
        { label: "Sleep Duration", value: "+47 min" },
        { label: "Sleep Score", value: "82 → 91" },
      ],
    },
    recovery: {
      label: "HRV",
      format: (v) => `+${v}% HRV`,
      secondary: [
        { label: "Recovery Score", value: "68 → 84" },
        { label: "Resting HR", value: "-4 bpm" },
      ],
    },
    stress: {
      label: "stress reduction",
      format: (v) => `${v}% less stress`,
      secondary: [
        { label: "Calm Score", value: "+28%" },
        { label: "HRV", value: "+12%" },
      ],
    },
    energy: {
      label: "energy levels",
      format: (v) => `+${v}% energy`,
      secondary: [
        { label: "Afternoon Crashes", value: "-65%" },
        { label: "Focus Score", value: "+22%" },
      ],
    },
    gut: {
      label: "digestive comfort",
      format: (v) => `${v}% improvement`,
      secondary: [
        { label: "Bloating", value: "-72%" },
        { label: "Regularity", value: "+45%" },
      ],
    },
    weight: {
      label: "appetite control",
      format: (v) => `${v}% improvement`,
      secondary: [
        { label: "Cravings", value: "-65%" },
        { label: "Satiety", value: "+48%" },
      ],
    },
    satiety: {
      label: "satiety",
      format: (v) => `${v}% improvement`,
      secondary: [
        { label: "Fullness Duration", value: "+52%" },
        { label: "Snacking", value: "-58%" },
      ],
    },
    skin: {
      label: "skin clarity",
      format: (v) => `${v}% improvement`,
      secondary: [
        { label: "Breakouts", value: "-68%" },
        { label: "Radiance", value: "+42%" },
      ],
    },
    immunity: {
      label: "immune resilience",
      format: (v) => `${v}% improvement`,
      secondary: [
        { label: "Sick Days", value: "-55%" },
        { label: "Energy", value: "+38%" },
      ],
    },
    hair: {
      label: "hair health",
      format: (v) => `${v}% improvement`,
      secondary: [
        { label: "Shedding", value: "-62%" },
        { label: "Thickness", value: "+35%" },
      ],
    },
    anxiety: {
      label: "anxiety reduction",
      format: (v) => `${v}% less anxiety`,
      secondary: [
        { label: "HRV", value: "+38%" },
        { label: "Calm Focus", value: "+45%" },
      ],
    },
    focus: {
      label: "focus",
      format: (v) => `+${v}% focus`,
      secondary: [
        { label: "Concentration", value: "+35%" },
        { label: "Mental Clarity", value: "+28%" },
      ],
    },
    mood: {
      label: "mood",
      format: (v) => `+${v}% mood`,
      secondary: [
        { label: "Positivity", value: "+42%" },
        { label: "Well-being", value: "+38%" },
      ],
    },
    pain: {
      label: "pain reduction",
      format: (v) => `${v}% less pain`,
      secondary: [
        { label: "Mobility", value: "+35%" },
        { label: "Comfort", value: "+48%" },
      ],
    },
  };

  const metric = categoryMetrics[studyCategory] || categoryMetrics.sleep;

  return [
    {
      id: "p1",
      name: "Sarah M.",
      avatar: "SM",
      rating: 5,
      daysInStudy: 28,
      compliance: 96,
      primaryMetric: {
        label: metric.label,
        value: metric.format(23),
        positive: true,
      },
      secondaryMetrics: metric.secondary,
      testimonial:
        "I was skeptical at first, but the data doesn't lie. My sleep quality improved significantly and I wake up feeling refreshed.",
      verifyUrl: `/verify/sample-${studyCategory}-001`,
    },
    {
      id: "p2",
      name: "Michael R.",
      avatar: "MR",
      rating: 4,
      daysInStudy: 28,
      compliance: 89,
      primaryMetric: {
        label: metric.label,
        value: metric.format(18),
        positive: true,
      },
      secondaryMetrics: metric.secondary,
      testimonial:
        "Really impressed with the results. Would definitely recommend to anyone looking to improve their wellness routine.",
      verifyUrl: `/verify/sample-${studyCategory}-002`,
    },
    {
      id: "p3",
      name: "Jennifer L.",
      avatar: "JL",
      rating: 5,
      daysInStudy: 28,
      compliance: 94,
      primaryMetric: {
        label: metric.label,
        value: metric.format(31),
        positive: true,
      },
      secondaryMetrics: metric.secondary,
      testimonial:
        "This product exceeded my expectations. The wearable tracking really helped me see the objective improvements.",
      verifyUrl: `/verify/sample-${studyCategory}-003`,
    },
    {
      id: "p4",
      name: "David K.",
      avatar: "DK",
      rating: 5,
      daysInStudy: 28,
      compliance: 92,
      primaryMetric: {
        label: metric.label,
        value: metric.format(27),
        positive: true,
      },
      secondaryMetrics: metric.secondary,
      testimonial:
        "The difference was noticeable within the first week. By the end of the study, the improvements were substantial.",
      verifyUrl: `/verify/sample-${studyCategory}-004`,
    },
  ];
}

// ============================================
// PARTICIPANT INSIGHTS
// ============================================

export function getParticipantInsights(category: string): DemographicInsights {
  const categoryInsights: Record<string, DemographicInsights> = {
    sleep: {
      topMotivation: { label: "Better sleep", value: 45 },
      exerciseActive: 78,
      takesSupplements: 68,
      purchaseMotivation: [
        { label: "Better sleep", value: 45, color: "#00D1C1" },
        { label: "More energy", value: 25, color: "#00D1C1" },
        { label: "Stress relief", value: 18, color: "#00D1C1" },
        { label: "General wellness", value: 12, color: "#00D1C1" },
      ],
      expectedResults: [
        { label: "Improved sleep quality", value: 52 },
        { label: "Fall asleep faster", value: 28 },
        { label: "Wake up refreshed", value: 15 },
        { label: "Reduced anxiety", value: 5 },
      ],
      exerciseFrequency: [
        { label: "0-1 days", value: 12, color: "#22C55E" },
        { label: "2-3 days", value: 35, color: "#22C55E" },
        { label: "4-5 days", value: 38, color: "#22C55E" },
        { label: "6-7 days", value: 15, color: "#22C55E" },
      ],
      stressLevel: [
        { label: "Low", value: 15, color: "#EF4444" },
        { label: "Moderate", value: 45, color: "#EF4444" },
        { label: "High", value: 32, color: "#EF4444" },
        { label: "Very High", value: 8, color: "#EF4444" },
      ],
    },
    stress: {
      topMotivation: { label: "Stress relief", value: 52 },
      exerciseActive: 65,
      takesSupplements: 58,
      purchaseMotivation: [
        { label: "Stress relief", value: 52, color: "#00D1C1" },
        { label: "Better focus", value: 28, color: "#00D1C1" },
        { label: "Better sleep", value: 12, color: "#00D1C1" },
        { label: "General wellness", value: 8, color: "#00D1C1" },
      ],
      expectedResults: [
        { label: "Reduced stress", value: 48 },
        { label: "Better focus", value: 32 },
        { label: "Calmer mood", value: 15 },
        { label: "Better sleep", value: 5 },
      ],
      exerciseFrequency: [
        { label: "0-1 days", value: 18, color: "#22C55E" },
        { label: "2-3 days", value: 32, color: "#22C55E" },
        { label: "4-5 days", value: 35, color: "#22C55E" },
        { label: "6-7 days", value: 15, color: "#22C55E" },
      ],
      stressLevel: [
        { label: "Low", value: 8, color: "#EF4444" },
        { label: "Moderate", value: 35, color: "#EF4444" },
        { label: "High", value: 42, color: "#EF4444" },
        { label: "Very High", value: 15, color: "#EF4444" },
      ],
    },
  };

  return categoryInsights[category] || categoryInsights.sleep;
}

// ============================================
// MOCK DEMOGRAPHICS
// ============================================

export const MOCK_DEMOGRAPHICS: Demographics = {
  age: [
    { label: "18-24", value: 15, color: "#FF6384" },
    { label: "25-34", value: 35, color: "#36A2EB" },
    { label: "35-44", value: 28, color: "#FFCE56" },
    { label: "45-54", value: 15, color: "#4BC0C0" },
    { label: "55+", value: 7, color: "#9966FF" },
  ],
  gender: [
    { label: "Female", value: 58, color: "#FF6384" },
    { label: "Male", value: 40, color: "#36A2EB" },
    { label: "Other", value: 2, color: "#FFCE56" },
  ],
  wearableDevices: [
    { label: "Oura Ring", value: 42, color: "#8B5CF6" },
    { label: "Apple Watch", value: 35, color: "#8B5CF6" },
    { label: "Whoop", value: 15, color: "#8B5CF6" },
    { label: "Fitbit", value: 8, color: "#8B5CF6" },
  ],
};

// ============================================
// MOCK STUDIES
// ============================================

export const MOCK_STUDIES: Record<string, StudyData> = {
  "study-1": {
    id: "study-1",
    name: "SleepWell Premium",
    brandId: "brand-acme",
    category: "sleep",
    categoryLabel: "Sleep",
    status: "active",
    participants: 45,
    targetParticipants: 50,
    startDate: "2024-11-01",
    endDate: "2024-11-29",
    avgImprovement: 23,
    completionRate: 90,
    tier: 1,
    rebateAmount: 50,
    hasWearables: true,
    productDescription:
      "Natural sleep supplement formulated to improve sleep quality and duration",
    productImage:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=600&fit=crop",
    whatYoullDiscover: [
      "How SleepWell Premium affects your sleep quality and duration",
      "Whether you wake up feeling more refreshed",
      "Changes in your deep sleep and REM patterns",
      "Your overall sleep consistency over 28 days",
    ],
    dailyRoutine:
      "Take SleepWell Premium before bed. Your wearable tracks sleep automatically. Quick daily check-in takes ~30 seconds.",
    howItWorks:
      "SleepWell Premium contains a blend of natural ingredients including magnesium, L-theanine, and melatonin that work together to support healthy sleep patterns.",
  },
  "study-2": {
    id: "study-2",
    name: "Recovery Plus",
    brandId: "brand-acme",
    category: "recovery",
    categoryLabel: "Recovery",
    status: "active",
    participants: 32,
    targetParticipants: 40,
    startDate: "2024-11-15",
    endDate: "2024-12-13",
    avgImprovement: 18,
    completionRate: 80,
    tier: 1,
    rebateAmount: 50,
    hasWearables: true,
    productDescription:
      "Advanced recovery formula for post-workout muscle recovery",
    productImage:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
    whatYoullDiscover: [
      "How Recovery Plus affects your post-workout recovery",
      "Changes in your HRV and recovery scores",
      "Whether muscle soreness decreases faster",
      "Your overall recovery consistency",
    ],
    dailyRoutine:
      "Take Recovery Plus after workouts. Your wearable tracks recovery metrics automatically. Quick daily check-in takes ~30 seconds.",
    howItWorks:
      "Recovery Plus contains BCAAs, electrolytes, and anti-inflammatory compounds designed to accelerate post-workout recovery and reduce muscle soreness.",
  },
  "study-3": {
    id: "study-3",
    name: "Calm Focus Formula",
    brandId: "brand-acme",
    category: "stress",
    categoryLabel: "Stress Management",
    status: "active",
    participants: 28,
    targetParticipants: 35,
    startDate: "2024-11-20",
    endDate: "2024-12-18",
    avgImprovement: 33,
    completionRate: 80,
    tier: 2,
    rebateAmount: 50,
    hasWearables: true,
    productDescription:
      "Natural stress relief supplement for better focus and calm",
    productImage:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    whatYoullDiscover: [
      "How Calm Focus Formula affects your daily stress levels",
      "Whether your focus and concentration improve",
      "Changes in your HRV indicating stress resilience",
      "Your stress patterns over 28 days",
    ],
    dailyRoutine:
      "Take Calm Focus Formula each morning. Complete weekly stress assessment (~5 min). Your wearable provides supporting HRV data.",
    howItWorks:
      "Calm Focus Formula combines adaptogenic herbs like ashwagandha and rhodiola with L-theanine to support stress resilience and mental clarity.",
  },
  "study-4": {
    id: "study-4",
    name: "Energy Boost Complex",
    brandId: "brand-acme",
    category: "energy",
    categoryLabel: "Energy & Vitality",
    status: "active",
    participants: 22,
    targetParticipants: 30,
    startDate: "2024-11-25",
    endDate: "2024-12-23",
    avgImprovement: 42,
    completionRate: 73,
    tier: 3,
    rebateAmount: 50,
    hasWearables: false,
    productDescription:
      "All-day energy supplement without jitters or crashes",
    productImage:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=600&fit=crop",
    whatYoullDiscover: [
      "How Energy Boost Complex affects your daily energy levels",
      "Whether afternoon crashes become less frequent",
      "Changes in your overall vitality and motivation",
      "Your energy consistency throughout the day",
    ],
    dailyRoutine:
      "Complete a weekly energy assessment (~5 min). Track your energy levels through quick check-ins. Wearable optional but adds supporting data.",
    howItWorks:
      "Energy Boost Complex uses sustained-release B vitamins, CoQ10, and natural caffeine from green tea to provide steady energy without the crash.",
  },
  "study-5": {
    id: "study-5",
    name: "Gut Health Pro",
    brandId: "brand-acme",
    category: "gut",
    categoryLabel: "Gut Health",
    status: "completed",
    participants: 50,
    targetParticipants: 50,
    startDate: "2024-09-01",
    endDate: "2024-09-29",
    avgImprovement: 52,
    completionRate: 100,
    tier: 4,
    rebateAmount: 50,
    hasWearables: false,
    productDescription:
      "Probiotic blend for digestive wellness and gut balance",
    productImage:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop",
    whatYoullDiscover: [
      "How Gut Health Pro affects your digestive comfort",
      "Whether bloating and discomfort decrease",
      "Changes in your gut health symptoms",
      "Your digestive patterns over 28 days",
    ],
    dailyRoutine:
      "Take Gut Health Pro daily. Complete weekly gut health assessment (~5 min). Track symptoms through quick check-ins.",
    howItWorks:
      "Gut Health Pro contains 50 billion CFU of clinically-studied probiotic strains plus prebiotic fiber to support digestive health and microbiome balance.",
  },
  "study-sensate-real": {
    id: "study-sensate-real",
    name: "Sensate Sleep & Stress Study (Real Data)",
    brandId: "brand-sensate",
    category: "stress",
    categoryLabel: "Stress & Sleep",
    status: "completed",
    participants: 18,
    targetParticipants: 25,
    startDate: "2024-09-25",
    endDate: "2024-11-17",
    avgImprovement: SENSATE_METRICS.avgHrvChange,
    completionRate: SENSATE_METRICS.completionRate,
    tier: 2,
    rebateAmount: 75,
    hasWearables: true,
    productDescription:
      "The 10-Minute Vagus Nerve Device Shown to Cut Stress by 48% and Boost Sleep. Sensate uses gentle sound vibrations to quickly calm your nervous system.",
    productImage: "/images/sensate-device.png",
    whatYoullDiscover: [
      "How Sensate affects your daily stress levels and HRV",
      "Whether 10 minutes of vagus nerve stimulation improves sleep quality",
      "Changes in deep sleep and sleep efficiency over 28 days",
      "Your body's stress response and recovery improvements",
    ],
    dailyRoutine:
      "Use Sensate for 10 minutes during your bedtime routine. Your Oura Ring tracks sleep and HRV automatically. Complete weekly stress and sleep assessments (2-3 min).",
    howItWorks:
      "Sensate uses precise low-frequency vibrations delivered through bone conduction to stimulate the vagus nerve, activating your parasympathetic nervous system and triggering a deep relaxation response that promotes better sleep.",
  },
  "study-lyfefuel-real": {
    id: "study-lyfefuel-real",
    name: "LYFEfuel Daily Essentials Energy Study (Real Data)",
    brandId: "brand-lyfefuel",
    category: "energy",
    categoryLabel: "Energy & Vitality",
    status: "completed",
    participants: LYFEFUEL_METRICS.completed,
    targetParticipants: LYFEFUEL_METRICS.enrolled,
    startDate: "2025-09-18",
    endDate: "2025-10-30",
    avgImprovement: LYFEFUEL_METRICS.avgActivityChange,
    completionRate: LYFEFUEL_METRICS.completionRate,
    tier: 2,
    rebateAmount: 60,
    hasWearables: true,
    productDescription:
      "Daily Essentials Shake - Clean, whole-food nutrition that replaces your protein, multivitamin, and greens. Delivers steady, crash-free energy throughout the day.",
    productImage: "/logos/lyfefuel-logo.png",
    whatYoullDiscover: [
      "How Daily Essentials affects your daily activity levels and energy",
      "Whether your activity minutes increase with consistent use",
      "Changes in steps, active calories, and overall movement",
      "Your sleep quality and HRV improvements over 24 days",
    ],
    dailyRoutine:
      "Blend one scoop of Daily Essentials with water or your favorite milk each morning. Your Oura Ring tracks activity, sleep, and HRV automatically. Complete weekly energy assessments (2-3 min).",
    howItWorks:
      "Daily Essentials provides clean, whole-food nutrition with complete protein, vitamins, minerals, and superfoods that support sustained energy and improved activity levels without the crash of caffeine or sugar.",
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    case "draft":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export function getTierColor(tier: number): string {
  switch (tier) {
    case 1:
      return "bg-blue-100 text-blue-700";
    case 2:
      return "bg-purple-100 text-purple-700";
    case 3:
      return "bg-green-100 text-green-700";
    case 4:
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function getTierLabel(tier: number): string {
  switch (tier) {
    case 1:
      return "Tier 1: Wearables Primary";
    case 2:
      return "Tier 2: Co-Primary";
    case 3:
      return "Tier 3: Assessment Primary";
    case 4:
      return "Tier 4: Assessment Only";
    default:
      return `Tier ${tier}`;
  }
}
