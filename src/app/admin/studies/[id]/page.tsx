"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FlaskConical,
  ExternalLink,
  Users,
  Calendar,
  TrendingUp,
  Building2,
  Clock,
  CheckCircle2,
  Star,
  Pencil,
  Eye,
  X,
  BarChart3,
  Settings,
  FileText,
  Sparkles,
  Minus,
  TrendingDown,
} from "lucide-react";
import { useBrandsStore } from "@/lib/brands-store";
import { useStudiesStore } from "@/lib/studies-store";
import { CATEGORY_CONFIGS } from "@/lib/assessments";
import { StudyDetailsFullPreview } from "@/components/study-details-full-preview";
import { StudyPreview } from "@/components/study-preview";
import {
  getLYFEfuelStoriesForStudy,
  getLYFEfuelStudyStats,
} from "@/lib/lyfefuel-demo-stories";
import {
  getSortedSensateStories,
  getSensateStudyStats,
  getSensateDemographics,
  getSensateAverageMetrics,
  categorizeParticipant,
} from "@/lib/sensate-real-data";

// Pre-compute sorted stories and stats for performance
const SORTED_SENSATE_STORIES = getSortedSensateStories();
const sensateStats = getSensateStudyStats();
const sensateMetrics = getSensateAverageMetrics();
const SENSATE_STATS = {
  positive: sensateStats.improved,
  neutral: sensateStats.neutral,
  negative: sensateStats.noImprovement,
};
const SENSATE_METRICS = {
  avgHrvChange: sensateMetrics.avgHrvChange,
  avgDeepSleepChange: sensateMetrics.avgDeepSleepChange,
  enrolled: sensateMetrics.enrolled,
  completed: sensateMetrics.completed,
  completionRate: sensateMetrics.completionRate,
  avgNps: sensateMetrics.avgNps,
  wouldRecommendPercent: sensateMetrics.wouldRecommendPercent,
};

// ============================================
// TYPES & MOCK DATA
// ============================================

interface MockParticipant {
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

function generateMockParticipants(
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

  // Create unique verification URLs for each participant
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

// Comprehensive participant insights data
function getParticipantInsights(category: string) {
  const categoryInsights: Record<string, {
    topMotivation: { label: string; value: number };
    exerciseActive: number;
    takesSupplements: number;
    purchaseMotivation: { label: string; value: number; color: string }[];
    expectedResults: { label: string; value: number }[];
    exerciseFrequency: { label: string; value: number; color: string }[];
    stressLevel: { label: string; value: number; color: string }[];
  }> = {
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

  // Default fallback
  return categoryInsights[category] || categoryInsights.sleep;
}

const MOCK_DEMOGRAPHICS = {
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

const MOCK_STUDIES: Record<
  string,
  {
    id: string;
    name: string;
    brandId: string;
    category: string;
    categoryLabel: string;
    status: "draft" | "recruiting" | "filling-fast" | "full" | "active" | "completed" | "archived";
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
  }
> = {
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
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getStatusColor(status: string) {
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

function getTierColor(tier: number) {
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

function getTierLabel(tier: number) {
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

// ============================================
// PREVIEW MODAL COMPONENT
// ============================================

function PreviewModal({
  study,
  onClose,
}: {
  study: (typeof MOCK_STUDIES)["study-1"];
  onClose: () => void;
}) {
  const [activePreview, setActivePreview] = useState<"card" | "details">(
    "card"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-xl shadow-2xl w-full max-w-[440px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div>
            <h3 className="font-semibold">App Preview</h3>
            <p className="text-sm text-muted-foreground">
              How participants see this study
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Toggle */}
        <div className="p-4 flex-shrink-0">
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <button
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activePreview === "card"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActivePreview("card")}
            >
              Catalog Card
            </button>
            <button
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activePreview === "details"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActivePreview("details")}
            >
              Full Details
            </button>
          </div>
        </div>

        {/* Preview Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex justify-center">
            {activePreview === "card" ? (
              <StudyPreview
                productName={study.name}
                productImage={study.productImage}
                category={study.categoryLabel}
                rebateAmount={String(study.rebateAmount)}
                durationDays="28"
                totalSpots={String(study.targetParticipants)}
                requiredDevice={study.hasWearables ? "oura" : "any"}
                studyTitle={`${study.name} Study`}
                hookQuestion={`Can ${study.name} improve your ${study.categoryLabel.toLowerCase()}?`}
              />
            ) : (
              <StudyDetailsFullPreview
                productName={study.name}
                productImage={study.productImage}
                productDescription={study.productDescription}
                category={study.categoryLabel}
                rebateAmount={study.rebateAmount}
                durationDays={28}
                totalSpots={study.targetParticipants}
                requiredDevice={study.hasWearables ? "required" : "optional"}
                whatYoullDiscover={study.whatYoullDiscover}
                dailyRoutine={study.dailyRoutine}
                howItWorks={study.howItWorks}
                tier={study.tier}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TAB COMPONENTS
// ============================================

type TabId = "overview" | "results" | "config";

function OverviewTab({
  study,
  brand,
  onOpenPreview,
}: {
  study: (typeof MOCK_STUDIES)["study-1"];
  brand: { id: string; name: string } | undefined;
  onOpenPreview: () => void;
}) {
  // Check if this is the real Sensate study
  const isSensateRealStudy = study.id === "study-sensate-real";

  // Use real data for Sensate study, mock data for others
  const studyParticipants = isSensateRealStudy ? SENSATE_METRICS.completed : study.participants;
  const studyTargetParticipants = isSensateRealStudy ? SENSATE_METRICS.enrolled : study.targetParticipants;
  const studyCompletionRate = isSensateRealStudy ? SENSATE_METRICS.completionRate : study.completionRate;
  const studyAvgImprovement = isSensateRealStudy ? SENSATE_METRICS.avgHrvChange : study.avgImprovement;
  const studyMetricName = isSensateRealStudy ? "HRV" : "primary metric";

  const participants = generateMockParticipants(study.category);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href={`/admin/studies/${study.id}/edit`}>
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Study
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={onOpenPreview}>
          <Eye className="h-4 w-4 mr-2" />
          Preview in App
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Enrolled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {studyTargetParticipants}
            </p>
            <p className="text-sm text-muted-foreground">participants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{studyParticipants}/{studyTargetParticipants}</p>
            <p className="text-sm text-muted-foreground">{studyCompletionRate}% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg. Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              +{studyAvgImprovement}%
            </p>
            <p className="text-sm text-muted-foreground">{studyMetricName}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">28 days</p>
            {isSensateRealStudy ? (
              <p className="text-sm text-muted-foreground">Rolling enrollment</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {new Date(study.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(study.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Brand + Timeline Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Brand Info */}
        {brand && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Brand
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isSensateRealStudy ? (
                    <img
                      src="/logos/sensate-logo.png"
                      alt="Sensate"
                      className="h-10 w-auto object-contain"
                    />
                  ) : (
                    <>
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-sm font-semibold">
                        {brand.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <p className="font-medium">{brand.name}</p>
                    </>
                  )}
                </div>
                <Link href={`/admin/brands/${brand.id}`}>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">
                  Started{" "}
                  {new Date(study.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex-1 h-0.5 bg-muted" />
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    study.status === "completed"
                      ? "bg-blue-500"
                      : "bg-muted-foreground"
                  }`}
                />
                <span className="text-sm">
                  {study.status === "completed" ? "Completed" : "Ends"}{" "}
                  {new Date(study.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sample Results Preview - Clickable */}
      <Card className={isSensateRealStudy ? "border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-white" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className={`h-4 w-4 ${isSensateRealStudy ? "text-emerald-500" : "text-purple-500"}`} />
                {isSensateRealStudy ? "Real Participant Stories" : "Sample Results Preview"}
              </CardTitle>
              <Badge variant="outline" className={`text-xs ${isSensateRealStudy ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}`}>
                {isSensateRealStudy ? "Real Data" : "Demo Data"}
              </Badge>
            </div>
          </div>
          <CardDescription>
            {isSensateRealStudy
              ? `Verified participant stories from the Sensate study (${SENSATE_STATS.positive} positive, ${SENSATE_STATS.neutral} neutral, ${SENSATE_STATS.negative} negative)`
              : "Click to see how verified participant stories will appear"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSensateRealStudy ? (
            // Real Sensate participants - sorted by improvement score
            <div className="grid gap-3 sm:grid-cols-2">
              {SORTED_SENSATE_STORIES.slice(0, 4).map((story) => (
                <Link key={story.id} href={`/verify/${story.verificationId}`}>
                  <div className="p-3 rounded-lg border border-emerald-200 bg-white flex items-center gap-3 hover:bg-emerald-50 hover:border-emerald-300 transition-colors cursor-pointer group">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-sm font-semibold text-white">
                      {story.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm group-hover:text-[#00D1C1] transition-colors">
                        {story.name}
                      </p>
                      {story.wearableMetrics?.hrvChange && (
                        <Badge className={`text-xs ${
                          story.wearableMetrics.hrvChange.changePercent > 0
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }`}>
                          {story.wearableMetrics.hrvChange.changePercent > 0 ? "+" : ""}
                          {story.wearableMetrics.hrvChange.changePercent}% HRV
                        </Badge>
                      )}
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-[#00D1C1] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // Demo participants (default)
            <div className="grid gap-3 sm:grid-cols-2">
              {participants.slice(0, 2).map((p) => (
                <Link key={p.id} href={p.verifyUrl}>
                  <div className="p-3 rounded-lg border bg-muted/30 flex items-center gap-3 hover:bg-muted/50 hover:border-[#00D1C1]/50 transition-colors cursor-pointer group">
                    <div className="h-10 w-10 rounded-full bg-[#00D1C1]/10 flex items-center justify-center text-sm font-semibold text-[#00D1C1]">
                      {p.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm group-hover:text-[#00D1C1] transition-colors">
                        {p.name}
                      </p>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                        {p.primaryMetric.value}
                      </Badge>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-[#00D1C1] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
          {isSensateRealStudy ? (
            <Link href="/verify/sensate-results" className="block mt-3">
              <Button variant="outline" size="sm" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                View all {SORTED_SENSATE_STORIES.length} verified results
              </Button>
            </Link>
          ) : (
            <p className="text-xs text-muted-foreground mt-3">
              View the Results tab for all sample stories and participant insights
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ResultsTab({ study }: { study: (typeof MOCK_STUDIES)["study-1"] }) {
  // Check if this is the real Sensate study
  const isSensateRealStudy = study.id === "study-sensate-real";

  // Check if this is a LYFEfuel study with specific demo stories
  const lyfefuelStats = getLYFEfuelStudyStats(study.id);
  const lyfefuelStories = getLYFEfuelStoriesForStudy(study.id);
  const isLYFEfuelStudy = lyfefuelStories.length > 0;

  const participants = generateMockParticipants(study.category);
  const insights = getParticipantInsights(study.category);

  // Get real demographics for Sensate study
  const sensateDemographics = isSensateRealStudy ? getSensateDemographics() : null;

  // Use real demographics for Sensate study, fallback to mock for others
  const demographics = sensateDemographics || MOCK_DEMOGRAPHICS;

  return (
    <div className="space-y-6">
      {/* Aggregate Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Aggregate Results
          </CardTitle>
          <CardDescription>
            Summary of outcomes across all {lyfefuelStats?.participants || study.participants} participants
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* LYFEfuel-specific headline if available */}
          {lyfefuelStats && (
            <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-[#00D1C1]/10 to-[#00D1C1]/5 border border-[#00D1C1]/20">
              <p className="text-sm text-muted-foreground mb-1">Key Finding</p>
              <p className="text-lg font-semibold text-[#00D1C1]">{lyfefuelStats.topHeadline}</p>
            </div>
          )}
          {/* Sensate-specific key finding */}
          {isSensateRealStudy && (
            <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
              <p className="text-sm text-muted-foreground mb-1">Key Finding</p>
              <p className="text-lg font-semibold text-emerald-600">
                {SENSATE_METRICS.wouldRecommendPercent}% of participants would recommend the product (NPS ≥ 7)
              </p>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
              <p className="text-sm text-muted-foreground">Primary Outcome</p>
              <p className="text-2xl font-bold text-green-600">
                {isSensateRealStudy ? (
                  <>{SENSATE_METRICS.avgHrvChange > 0 ? "+" : ""}{SENSATE_METRICS.avgHrvChange}%</>
                ) : (
                  <>+{lyfefuelStats?.averageImprovement || study.avgImprovement}%</>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isSensateRealStudy ? "average HRV improvement" : `average ${study.categoryLabel.toLowerCase()} improvement`}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">
                {isSensateRealStudy ? SENSATE_METRICS.completionRate : (lyfefuelStats?.completionRate || study.completionRate)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isSensateRealStudy ? `${SENSATE_METRICS.completed} of ${SENSATE_METRICS.enrolled} enrolled` : "finished the full study"}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm text-muted-foreground">
                {isSensateRealStudy ? "Avg. NPS Score" : "Avg. Compliance"}
              </p>
              <p className="text-2xl font-bold">
                {isSensateRealStudy ? `${SENSATE_METRICS.avgNps}/10` : "91%"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isSensateRealStudy ? "likelihood to recommend" : "daily check-in rate"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participant Insights Highlights - Hide for Sensate (no real data for these) */}
      {!isSensateRealStudy && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#00D1C1]/10 to-[#00D1C1]/5 border border-[#00D1C1]/20">
            <p className="text-xs text-muted-foreground mb-1">Top Motivation</p>
            <p className="text-lg font-semibold text-[#00D1C1]">
              {insights.topMotivation.label} ({insights.topMotivation.value}%)
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
            <p className="text-xs text-muted-foreground mb-1">Exercise 3+ days/week</p>
            <p className="text-lg font-semibold text-green-600">
              {insights.exerciseActive}%
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
            <p className="text-xs text-muted-foreground mb-1">Already takes supplements</p>
            <p className="text-lg font-semibold text-purple-600">
              {insights.takesSupplements}%
            </p>
          </div>
        </div>
      )}

      {/* Sample Participant Stories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Star className={`h-5 w-5 ${isSensateRealStudy ? "text-emerald-500" : "text-yellow-500"}`} />
              {isSensateRealStudy ? "Real Verified Participant Stories" : isLYFEfuelStudy ? "Verified Participant Stories" : "Sample Participant Stories"}
            </h3>
            <Badge variant="outline" className={`text-xs ${isSensateRealStudy ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}`}>
              {isSensateRealStudy ? "Real Data" : isLYFEfuelStudy ? "LYFEfuel Demo" : "Demo Data"}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {isSensateRealStudy
            ? `These are REAL participant stories from the Sensate study. Includes ${SENSATE_STATS.positive} positive, ${SENSATE_STATS.neutral} neutral, and ${SENSATE_STATS.negative} negative results for credibility.`
            : isLYFEfuelStudy
            ? "These stories show the type of verified evidence LYFEfuel can expect from their Daily Essentials studies."
            : "Preview how verified participant stories will appear. Click any card to see the full verification page."}
        </p>

        {/* LYFEfuel Stories */}
        {isLYFEfuelStudy && (
          <div className="grid gap-4 sm:grid-cols-2">
            {lyfefuelStories.map((story) => (
              <Card
                key={story.id}
                className="overflow-hidden hover:shadow-md transition-shadow border-[#00D1C1]/20"
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-[#00D1C1]/10 flex items-center justify-center text-sm font-semibold text-[#00D1C1]">
                        {story.initials}
                      </div>
                      <div>
                        <p className="font-medium">{story.name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(story.overallRating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{story.journey.durationDays} days</p>
                      <p className="text-[#00D1C1]">{story.verificationId}</p>
                    </div>
                  </div>

                  {/* Villain Variable & Improvement */}
                  <div className="mb-3 space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Tracking: <span className="font-medium">{story.journey.villainVariable}</span>
                    </div>
                    {story.assessmentResult && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-sm px-3 py-1">
                        +{story.assessmentResult.change.compositePercent}% {story.assessmentResult.categoryLabel}
                      </Badge>
                    )}
                  </div>

                  {/* Journey Progress */}
                  <div className="mb-3 text-xs">
                    <p className="text-muted-foreground mb-1">Progress: {story.journey.villainRatings[0]?.rating}/5 → {story.journey.villainRatings[story.journey.villainRatings.length - 1]?.rating}/5</p>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-green-500 rounded-full"
                        style={{ width: `${(story.journey.villainRatings[story.journey.villainRatings.length - 1]?.rating / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Key Quote */}
                  {story.journey.keyQuotes[story.journey.keyQuotes.length - 1] && (
                    <p className="text-sm text-muted-foreground italic mb-4">
                      &quot;{story.journey.keyQuotes[story.journey.keyQuotes.length - 1].quote}&quot;
                    </p>
                  )}

                  {/* Profile Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{story.profile.ageRange}</span>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{story.profile.lifeStage}</span>
                  </div>

                  {/* View Story Button */}
                  <Link href={`/verify/${story.verificationId}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Verified Story
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Real Sensate Stories - grouped by category */}
        {isSensateRealStudy && (() => {
          // Group stories by category
          const positiveStories = SORTED_SENSATE_STORIES.filter(s => categorizeParticipant(s) === "positive");
          const neutralStories = SORTED_SENSATE_STORIES.filter(s => categorizeParticipant(s) === "neutral");
          const negativeStories = SORTED_SENSATE_STORIES.filter(s => categorizeParticipant(s) === "negative");

          // Reusable card component
          const renderStoryCard = (story: typeof SORTED_SENSATE_STORIES[0], category: "positive" | "neutral" | "negative") => {
            const cardStyles = {
              positive: "border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white",
              neutral: "border-yellow-200 bg-gradient-to-br from-yellow-50/30 to-white",
              negative: "border-red-200 bg-gradient-to-br from-red-50/30 to-white",
            };
            const avatarStyles = {
              positive: "bg-gradient-to-br from-[#00D1C1] to-[#00A89D]",
              neutral: "bg-gradient-to-br from-yellow-400 to-yellow-500",
              negative: "bg-gradient-to-br from-red-400 to-red-500",
            };
            const buttonStyles = {
              positive: "border-emerald-200 hover:bg-emerald-50",
              neutral: "border-yellow-200 hover:bg-yellow-50",
              negative: "border-red-200 hover:bg-red-50",
            };
            const idStyles = {
              positive: "text-emerald-600",
              neutral: "text-yellow-600",
              negative: "text-red-600",
            };

            return (
              <Card
                key={story.id}
                className={`overflow-hidden hover:shadow-md transition-shadow ${cardStyles[category]}`}
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-semibold text-white ${avatarStyles[category]}`}>
                        {story.initials}
                      </div>
                      <div>
                        <p className="font-medium">{story.name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(story.finalTestimonial?.overallRating || 0)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            {story.finalTestimonial?.npsScore !== undefined
                              ? `${story.finalTestimonial.npsScore}/10 NPS`
                              : `${story.finalTestimonial?.overallRating}/5`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{story.journey.durationDays} days</p>
                      <p className={idStyles[category]}>{story.verificationId}</p>
                    </div>
                  </div>

                  {/* Demographics */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{story.profile.ageRange}</span>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{story.profile.gender}</span>
                    {story.profile.educationLevel && (
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{story.profile.educationLevel}</span>
                    )}
                  </div>

                  {/* Wearable Metrics */}
                  <div className="mb-3 space-y-2">
                    {story.wearableMetrics?.hrvChange && (
                      <Badge className={`text-sm px-3 py-1 ${
                        story.wearableMetrics.hrvChange.changePercent > 0
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }`}>
                        HRV: {story.wearableMetrics.hrvChange.changePercent > 0 ? "+" : ""}
                        {story.wearableMetrics.hrvChange.changePercent}%
                      </Badge>
                    )}
                    {story.wearableMetrics?.deepSleepChange && (
                      <Badge className={`text-sm px-3 py-1 ml-1 ${
                        story.wearableMetrics.deepSleepChange.changePercent > 0
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }`}>
                        Deep Sleep: {story.wearableMetrics.deepSleepChange.changePercent > 0 ? "+" : ""}
                        {story.wearableMetrics.deepSleepChange.changePercent}%
                      </Badge>
                    )}
                  </div>

                  {/* Key Quote */}
                  {story.finalTestimonial?.quote && (
                    <p className="text-sm text-muted-foreground italic mb-4 line-clamp-2">
                      &quot;{story.finalTestimonial.quote}&quot;
                    </p>
                  )}

                  {/* View Story Button */}
                  <Link href={`/verify/${story.verificationId}`}>
                    <Button variant="outline" size="sm" className={`w-full ${buttonStyles[category]}`}>
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Verified Story
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          };

          return (
            <div className="space-y-8">
              {/* Improved Section */}
              {positiveStories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <h4 className="font-semibold text-emerald-700">Improved ({positiveStories.length})</h4>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      {Math.round((positiveStories.length / SORTED_SENSATE_STORIES.length) * 100)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Participants with objective improvement (HRV or Deep Sleep up 5%+) AND high satisfaction (NPS 7+)
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {positiveStories.map(story => renderStoryCard(story, "positive"))}
                  </div>
                </div>
              )}

              {/* Neutral Section */}
              {neutralStories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Minus className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-700">Mixed Results ({neutralStories.length})</h4>
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      {Math.round((neutralStories.length / SORTED_SENSATE_STORIES.length) * 100)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Participants with either objective improvement but lower satisfaction, or high satisfaction but no measurable improvement
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {neutralStories.map(story => renderStoryCard(story, "neutral"))}
                  </div>
                </div>
              )}

              {/* No Improvement Section */}
              {negativeStories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    <h4 className="font-semibold text-red-600">No Improvement ({negativeStories.length})</h4>
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                      {Math.round((negativeStories.length / SORTED_SENSATE_STORIES.length) * 100)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Participants with low satisfaction (NPS 4 or below) AND no objective improvement in metrics
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {negativeStories.map(story => renderStoryCard(story, "negative"))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Generic Mock Participants (non-LYFEfuel, non-Sensate studies) */}
        {!isLYFEfuelStudy && !isSensateRealStudy && (
          <div className="grid gap-4 sm:grid-cols-2">
            {participants.map((participant) => (
              <Card
                key={participant.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-[#00D1C1]/10 flex items-center justify-center text-sm font-semibold text-[#00D1C1]">
                        {participant.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < participant.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{participant.daysInStudy} days</p>
                      <p>{participant.compliance}% compliance</p>
                    </div>
                  </div>

                  {/* Primary Metric */}
                  <div className="mb-3">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-sm px-3 py-1">
                      {participant.primaryMetric.value}
                    </Badge>
                  </div>

                  {/* Secondary Metrics */}
                  <div className="flex gap-4 mb-3 text-xs">
                    {participant.secondaryMetrics.map((m, i) => (
                      <div key={i}>
                        <span className="text-muted-foreground">{m.label}:</span>{" "}
                        <span className="font-medium">{m.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Testimonial */}
                  <p className="text-sm text-muted-foreground italic mb-4">
                    &quot;{participant.testimonial}&quot;
                  </p>

                  {/* View Story Button */}
                  <Link href={participant.verifyUrl}>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Verified Story
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Comprehensive Participant Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participant Insights
          </CardTitle>
          <CardDescription>
            Demographics, motivations, and characteristics of study participants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Purchase Motivation */}
            <div>
              <h4 className="text-sm font-medium mb-4">Purchase Motivation</h4>
              <div className="space-y-3">
                {insights.purchaseMotivation.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00D1C1] rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise Frequency */}
            <div>
              <h4 className="text-sm font-medium mb-4">Exercise Frequency</h4>
              <div className="space-y-3">
                {insights.exerciseFrequency.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Results */}
            <div>
              <h4 className="text-sm font-medium mb-4">Expected Results</h4>
              <div className="space-y-3">
                {insights.expectedResults.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stress Level */}
            <div>
              <h4 className="text-sm font-medium mb-4">Stress Level</h4>
              <div className="space-y-3">
                {insights.stressLevel.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wearable Devices */}
            <div>
              <h4 className="text-sm font-medium mb-4">Wearable Devices</h4>
              <div className="space-y-3">
                {demographics.wearableDevices.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demographics */}
            <div>
              <h4 className="text-sm font-medium mb-4">Age & Gender</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  {demographics.age.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm flex-1">{item.label}</span>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {demographics.gender.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm flex-1">{item.label}</span>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Sensate Demographics - Education */}
            {sensateDemographics && sensateDemographics.education.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-4">Education Level</h4>
                <div className="space-y-3">
                  {sensateDemographics.education.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Sensate Demographics - Employment */}
            {sensateDemographics && sensateDemographics.employment.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-4">Employment Status</h4>
                <div className="space-y-3">
                  {sensateDemographics.employment.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Sensate Demographics - Income */}
            {sensateDemographics && sensateDemographics.income.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-4">Household Income</h4>
                <div className="space-y-3">
                  {sensateDemographics.income.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Sensate Demographics - Satisfaction */}
            {sensateDemographics && sensateDemographics.satisfaction.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-4">Overall Satisfaction</h4>
                <div className="space-y-3">
                  {sensateDemographics.satisfaction.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink-500 rounded-full"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ConfigTab({
  study,
  categoryConfig,
}: {
  study: (typeof MOCK_STUDIES)["study-1"];
  categoryConfig: (typeof CATEGORY_CONFIGS)[0] | undefined;
}) {
  return (
    <div className="space-y-6">
      {/* Study Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Study Configuration
              </CardTitle>
              <CardDescription>
                Measurement methodology and data collection settings
              </CardDescription>
            </div>
            <Link href={`/admin/studies/${study.id}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Measurement Tier</p>
              <p className="font-medium">{getTierLabel(study.tier)}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Wearable Data</p>
              <p className="font-medium">
                {study.hasWearables ? "Required" : "Optional"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Rebate Amount</p>
              <p className="font-medium">${study.rebateAmount}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="font-medium">
                {categoryConfig?.label || study.category}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            {study.productImage && (
              <img
                src={study.productImage}
                alt={study.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h4 className="font-medium">{study.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {study.productDescription}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">How It Works</h4>
            <p className="text-sm text-muted-foreground">{study.howItWorks}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">
              What Participants Discover
            </h4>
            <ul className="space-y-1">
              {study.whatYoullDiscover.map((item, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#00D1C1] mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function AdminStudyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showPreview, setShowPreview] = useState(false);

  // First try the store, then fall back to legacy MOCK_STUDIES
  const storeStudy = useStudiesStore((state) => state.getStudyById(id));
  const legacyStudy = MOCK_STUDIES[id];

  // Convert store study to the format expected by this page
  const study = storeStudy
    ? {
        ...storeStudy,
        startDate: storeStudy.startDate ? new Date(storeStudy.startDate).toISOString().split('T')[0] : "",
        endDate: storeStudy.endDate ? new Date(storeStudy.endDate).toISOString().split('T')[0] : "",
        avgImprovement: Math.floor(Math.random() * 20) + 15, // Generate random for new studies
        completionRate: storeStudy.status === 'completed' ? 100 : Math.floor(Math.random() * 20) + 75,
      }
    : legacyStudy;

  const brand = useBrandsStore((state) =>
    study ? state.getBrandById(study.brandId) : undefined
  );

  const categoryConfig = study
    ? CATEGORY_CONFIGS.find((c) => c.value === study.category)
    : undefined;

  if (!study) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">Study not found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            The study you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/admin/studies")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Studies
          </Button>
        </div>
      </div>
    );
  }

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    { id: "results", label: "Results", icon: <Star className="h-4 w-4" /> },
    {
      id: "config",
      label: "Configuration",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/admin/studies"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Studies
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-lg bg-[#00D1C1]/10 flex items-center justify-center">
            <FlaskConical className="h-7 w-7 text-[#00D1C1]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{study.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(study.status)}>
                {study.status}
              </Badge>
              <Badge className={getTierColor(study.tier)}>Tier {study.tier}</Badge>
              {categoryConfig && (
                <Badge variant="outline">{categoryConfig.label}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#00D1C1] text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab
          study={study}
          brand={brand}
          onOpenPreview={() => setShowPreview(true)}
        />
      )}
      {activeTab === "results" && <ResultsTab study={study} />}
      {activeTab === "config" && (
        <ConfigTab study={study} categoryConfig={categoryConfig} />
      )}

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal study={study} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
