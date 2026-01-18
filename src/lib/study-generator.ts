/**
 * Study Content Generator
 *
 * Generates AI content for study creation based on category and tier.
 * This includes "What You'll Discover", "Daily Routine", testimonial prompts, etc.
 */

import { TierLevel, getCategoryConfig } from "./assessments";
import { getHeartbeatDisplayBreakdown } from "./heartbeat-calculator";

// ============================================
// TYPES
// ============================================

export interface GeneratedStudyContent {
  whatYoullDiscover: string[];
  dailyRoutine: string;
  rewardBreakdown: RewardBreakdownItem[];
  heroQuestion: string;
  villainVariable: string;
  testimonialPrompts: TestimonialPrompt[];
}

export interface RewardBreakdownItem {
  label: string;
  amount: string;
  description: string;
}

export interface TestimonialPrompt {
  day: number;
  question: string;
  type: "text" | "voice_and_text";
}

export interface StudyAutoConfig {
  tier: TierLevel;
  assessmentId: string;
  duration: number;
  checkInDays: number[];
  wearableRequired: boolean;
  wearableMetrics: string[];
  primaryMetric: string;
  heroQuestion: string;
  villainVariable: string;
  requiresPhotos: boolean;
}

// ============================================
// CATEGORY-SPECIFIC TEMPLATES
// ============================================

const DISCOVER_TEMPLATES: Record<string, (productName: string) => string[]> = {
  sleep: (p) => [
    `How ${p} affects your sleep quality over 28 days`,
    `Changes in deep sleep, REM, and sleep efficiency`,
    `Whether you fall asleep faster and stay asleep longer`,
    `Your overall sleep consistency and patterns`,
  ],
  recovery: (p) => [
    `How ${p} impacts your body's recovery`,
    `Changes in HRV and readiness scores`,
    `Whether you feel more refreshed each morning`,
    `Your recovery trends over the study period`,
  ],
  fitness: (p) => [
    `How ${p} affects your fitness and activity levels`,
    `Changes in daily energy and workout performance`,
    `Whether you feel more capable during exercise`,
    `Your activity patterns over 28 days`,
  ],
  stress: (p) => [
    `How ${p} affects your stress levels`,
    `Changes in HRV and physiological stress markers`,
    `Whether you feel calmer and more in control`,
    `Your stress management progress over time`,
  ],
  energy: (p) => [
    `How ${p} affects your daily energy levels`,
    `Whether afternoon crashes become less frequent`,
    `Changes in your overall vitality and motivation`,
    `Your energy consistency throughout the day`,
  ],
  focus: (p) => [
    `How ${p} affects your mental clarity`,
    `Whether you can concentrate for longer periods`,
    `Changes in your cognitive performance`,
    `Your focus consistency over 28 days`,
  ],
  mood: (p) => [
    `How ${p} affects your emotional wellbeing`,
    `Whether you experience more positive emotions`,
    `Changes in your overall mood stability`,
    `Your mood patterns over the study period`,
  ],
  anxiety: (p) => [
    `How ${p} affects your anxiety levels`,
    `Whether you feel calmer in stressful situations`,
    `Changes in your overall sense of peace`,
    `Your anxiety trends over 28 days`,
  ],
  pain: (p) => [
    `How ${p} affects your comfort levels`,
    `Whether pain interferes less with daily activities`,
    `Changes in your overall physical comfort`,
    `Your pain patterns over the study period`,
  ],
  skin: (p) => [
    `How ${p} affects your skin appearance`,
    `Whether you notice visible improvements`,
    `Changes in skin texture and radiance`,
    `Your skin transformation over 28 days`,
  ],
  gut: (p) => [
    `How ${p} affects your digestive comfort`,
    `Whether bloating and discomfort decrease`,
    `Changes in your overall gut health`,
    `Your digestive patterns over the study`,
  ],
  immunity: (p) => [
    `How ${p} supports your immune system`,
    `Whether you feel more resilient overall`,
    `Changes in your energy when under stress`,
    `Your immune health over 28 days`,
  ],
  hair: (p) => [
    `How ${p} affects your hair health`,
    `Whether you notice visible changes`,
    `Changes in hair strength and appearance`,
    `Your hair transformation over the study`,
  ],
  weight: (p) => [
    `How ${p} affects your metabolism`,
    `Whether appetite and cravings change`,
    `Changes in your overall body composition`,
    `Your metabolic trends over 28 days`,
  ],
};

const ROUTINE_TEMPLATES: Record<TierLevel, (category: string) => string> = {
  1: (c) =>
    `Just wear your device as usual! We'll automatically collect your ${c.toLowerCase()} data each day. You'll receive brief check-ins at the start and end of the study to share your experience in your own words.`,
  2: (c) =>
    `Wear your device daily and complete a brief ${c.toLowerCase()} check-in once a week (about 3 minutes). Your device data combined with your self-reports gives us the complete picture.`,
  3: (c) =>
    `Complete a weekly ${c.toLowerCase()} assessment (about 5 minutes). Your wearable provides supporting data to validate your progress. Daily check-ins take less than 30 seconds.`,
  4: (c) =>
    `Complete weekly ${c.toLowerCase()} assessments and upload progress photos when prompted. Your wearable confirms your participation throughout the study.`,
};

const VILLAIN_VARIABLES: Record<string, string> = {
  sleep: "poor sleep quality",
  recovery: "slow recovery",
  fitness: "low activity levels",
  stress: "high stress",
  energy: "low energy",
  focus: "poor focus",
  mood: "mood instability",
  anxiety: "anxiety",
  pain: "chronic discomfort",
  skin: "skin concerns",
  gut: "digestive issues",
  immunity: "weakened immunity",
  hair: "hair concerns",
  weight: "metabolic struggles",
};

const HERO_QUESTIONS: Record<string, string> = {
  sleep: "How would you rate your overall sleep quality?",
  recovery: "How recovered do you feel when you wake up?",
  fitness: "How would you rate your overall fitness level?",
  stress: "How would you rate your overall stress level?",
  energy: "How would you rate your overall energy level?",
  focus: "How would you rate your ability to focus?",
  mood: "How would you rate your overall mood?",
  anxiety: "How would you rate your overall anxiety level?",
  pain: "How would you rate your average pain level?",
  skin: "How would you rate your overall skin appearance?",
  gut: "How would you rate your digestive comfort?",
  immunity: "How would you rate your immune health?",
  hair: "How would you rate your hair health?",
  weight: "How would you rate your appetite control?",
};

const PRIMARY_METRICS: Record<string, string> = {
  sleep: "Sleep Quality Score",
  recovery: "Recovery/Readiness Score",
  fitness: "Activity Score",
  stress: "Stress Level",
  energy: "Energy Level",
  focus: "Focus Score",
  mood: "Mood Score",
  anxiety: "Anxiety Level",
  pain: "Pain Level",
  skin: "Skin Appearance",
  gut: "Digestive Comfort",
  immunity: "Immune Health",
  hair: "Hair Health",
  weight: "Metabolic Balance",
};

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Get auto-configuration for a category
 */
export function getStudyAutoConfig(category: string): StudyAutoConfig {
  const config = getCategoryConfig(category);

  if (!config) {
    // Default fallback
    return {
      tier: 3,
      assessmentId: "",
      duration: 28,
      checkInDays: [1, 7, 14, 21, 28],
      wearableRequired: true,
      wearableMetrics: [],
      primaryMetric: "Wellness Score",
      heroQuestion: "How would you rate your overall wellness?",
      villainVariable: "wellness concerns",
      requiresPhotos: false,
    };
  }

  return {
    tier: config.tier,
    assessmentId: config.assessmentId,
    duration: 28,
    checkInDays: config.checkInDays,
    wearableRequired: config.tier <= 2, // Tier 1-2 require wearables by default
    wearableMetrics: config.wearableMetrics,
    primaryMetric: PRIMARY_METRICS[category] || "Wellness Score",
    heroQuestion: HERO_QUESTIONS[category] || "How would you rate your overall wellness?",
    villainVariable: VILLAIN_VARIABLES[category] || "wellness concerns",
    requiresPhotos: config.requiresPhotos,
  };
}

/**
 * Generate all study content based on product and category
 */
export function generateStudyContent(
  productName: string,
  category: string,
  rebateAmount: number
): GeneratedStudyContent {
  const config = getCategoryConfig(category);
  const tier = config?.tier || 3;

  // What You'll Discover
  const discoverTemplate = DISCOVER_TEMPLATES[category];
  const whatYoullDiscover = discoverTemplate
    ? discoverTemplate(productName)
    : [
        `How ${productName} affects your wellness`,
        `Changes in your key health metrics`,
        `Whether you experience noticeable improvements`,
        `Your progress over the 28-day study`,
      ];

  // Daily Routine
  const routineTemplate = ROUTINE_TEMPLATES[tier];
  const categoryLabel = config?.label || category;
  const dailyRoutine = routineTemplate(categoryLabel);

  // Reward Breakdown
  const heartbeatBreakdown = getHeartbeatDisplayBreakdown(rebateAmount);
  const rewardBreakdown: RewardBreakdownItem[] = [
    {
      label: "Daily device sync",
      amount: `~$${(rebateAmount * 0.7 / 28).toFixed(2)}/day`,
      description: `${heartbeatBreakdown[0].amount} heartbeats/day (70%)`,
    },
    {
      label: "Baseline completion",
      amount: `$${(rebateAmount * 0.1).toFixed(2)}`,
      description: `${heartbeatBreakdown[1].amount} heartbeats (10%)`,
    },
    {
      label: "Final survey",
      amount: `$${(rebateAmount * 0.1).toFixed(2)}`,
      description: `${heartbeatBreakdown[2].amount} heartbeats (10%)`,
    },
    {
      label: "Weekly bonus",
      amount: `$${(rebateAmount * 0.1 / 4).toFixed(2)}/week`,
      description: `${heartbeatBreakdown[3].amount} heartbeats/week (10%)`,
    },
  ];

  // Hero Question and Villain
  const heroQuestion = HERO_QUESTIONS[category] || "How would you rate your overall wellness?";
  const villainVariable = VILLAIN_VARIABLES[category] || "wellness concerns";

  // Testimonial Prompts
  const testimonialPrompts = getTestimonialPrompts(category, tier);

  return {
    whatYoullDiscover,
    dailyRoutine,
    rewardBreakdown,
    heroQuestion,
    villainVariable,
    testimonialPrompts,
  };
}

/**
 * Get testimonial prompts for a category
 */
function getTestimonialPrompts(category: string, tier: TierLevel): TestimonialPrompt[] {
  const categoryLabel = getCategoryConfig(category)?.label || category;

  if (tier === 1) {
    // Tier 1: Minimal testimonials
    return [
      {
        day: 1,
        question: `What's your biggest challenge with ${categoryLabel.toLowerCase()} right now?`,
        type: "voice_and_text",
      },
      {
        day: 30,
        question: `How has your ${categoryLabel.toLowerCase()} changed over the past month?`,
        type: "voice_and_text",
      },
      {
        day: 30,
        question: "What surprised you most about this experience?",
        type: "voice_and_text",
      },
    ];
  }

  // Tier 2-4: More detailed testimonials
  return [
    {
      day: 1,
      question: `What's your biggest challenge with ${categoryLabel.toLowerCase()} right now?`,
      type: "voice_and_text",
    },
    {
      day: 14,
      question: "Have you noticed any changes so far? Tell us about them.",
      type: "text",
    },
    {
      day: 28,
      question: `How has your ${categoryLabel.toLowerCase()} changed over the past month?`,
      type: "voice_and_text",
    },
    {
      day: 28,
      question: "Would you recommend this product? Why or why not?",
      type: "voice_and_text",
    },
  ];
}

/**
 * Get non-wearable experience description
 */
export function getNonWearableDescription(category: string): string {
  const categoryLabel = getCategoryConfig(category)?.label || category;

  return `Participants without a wearable device will complete weekly ${categoryLabel.toLowerCase()} assessments instead of automatic device tracking. Results are validated through our assessment methodology.`;
}

/**
 * Get tier-specific wearable role description
 */
export function getWearableRoleDescription(tier: TierLevel): string {
  switch (tier) {
    case 1:
      return "Primary measurement - device data directly measures outcomes";
    case 2:
      return "Co-primary - device data validates assessment results";
    case 3:
      return "Supporting evidence - validates participant engagement";
    case 4:
      return "Proof of participation - confirms participant is real and active";
  }
}

/**
 * Get check-in schedule description
 */
export function getCheckInDescription(checkInDays: number[]): string {
  if (checkInDays.length === 2 && checkInDays[0] === 1 && checkInDays[1] === 30) {
    return "Brief check-ins at start and end only";
  }
  if (checkInDays.length >= 4) {
    return `Weekly check-ins on days ${checkInDays.join(", ")}`;
  }
  return `Check-ins on days ${checkInDays.join(", ")}`;
}

/**
 * Generate sample verification page preview data
 */
export function generateSamplePreviewData(
  productName: string,
  category: string,
  tier: TierLevel
) {
  const config = getCategoryConfig(category);
  const categoryLabel = config?.label || category;

  // Sample demographics by category
  const sampleDemographics = getSampleDemographics(category);

  // Sample improvement percentages by tier
  const primaryImprovement = tier <= 2 ? Math.floor(Math.random() * 15) + 18 : Math.floor(Math.random() * 20) + 25;
  const compositeImprovement = Math.floor(primaryImprovement * 0.8);

  return {
    participant: sampleDemographics,
    category: categoryLabel,
    productName,
    primaryMetric: {
      name: PRIMARY_METRICS[category] || "Wellness Score",
      baseline: tier <= 2 ? 68 : 42,
      endpoint: tier <= 2 ? 82 : 71,
      improvement: primaryImprovement,
    },
    compositeScore: {
      baseline: 38,
      endpoint: 68 + compositeImprovement,
      improvement: compositeImprovement,
    },
    sampleQuote: getSampleQuote(category, productName),
    trustStack: getTrustStackForTier(tier),
  };
}

function getSampleDemographics(category: string) {
  const demographicsByCategory: Record<string, { name: string; age: number; location: string }[]> = {
    sleep: [
      { name: "Sarah M.", age: 34, location: "Denver, CO" },
      { name: "Michael R.", age: 42, location: "Austin, TX" },
      { name: "Jennifer L.", age: 38, location: "Seattle, WA" },
    ],
    stress: [
      { name: "David K.", age: 36, location: "New York, NY" },
      { name: "Amanda P.", age: 31, location: "Chicago, IL" },
      { name: "Robert T.", age: 45, location: "San Francisco, CA" },
    ],
    energy: [
      { name: "Lisa H.", age: 29, location: "Portland, OR" },
      { name: "Chris M.", age: 35, location: "Miami, FL" },
      { name: "Emily W.", age: 32, location: "Boston, MA" },
    ],
    skin: [
      { name: "Nicole B.", age: 28, location: "Los Angeles, CA" },
      { name: "Ashley K.", age: 33, location: "Phoenix, AZ" },
      { name: "Rachel S.", age: 30, location: "Nashville, TN" },
    ],
  };

  const options = demographicsByCategory[category] || demographicsByCategory.energy;
  return options[Math.floor(Math.random() * options.length)];
}

function getSampleQuote(category: string, productName: string): string {
  const quotes: Record<string, string[]> = {
    sleep: [
      `${productName} helped me finally get the deep sleep I've been missing. I wake up actually feeling refreshed now.`,
      `I used to hit snooze 5 times every morning. Now I wake up before my alarm feeling ready to go.`,
    ],
    stress: [
      `${productName} helped me feel calmer even during my busiest workdays. My Garmin shows my stress scores dropping.`,
      `I finally feel like I can handle work pressure without feeling overwhelmed.`,
    ],
    energy: [
      `I used to need 3 coffees to get through the afternoon. Now I need zero. ${productName} really changed things.`,
      `My afternoon crashes are completely gone. I have steady energy throughout the day.`,
    ],
    skin: [
      `My friends keep asking what I changed. It's ${productName}. My skin looks noticeably healthier.`,
      `I wasn't expecting such visible results, but the before/after difference is remarkable.`,
    ],
  };

  const categoryQuotes = quotes[category] || quotes.energy;
  return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
}

function getTrustStackForTier(tier: TierLevel): string[] {
  const base = [
    "Real person (identity verified)",
    "Real participation (28 days active)",
    "No incentive to lie (same rebate regardless)",
  ];

  switch (tier) {
    case 1:
      return ["Real device (connected and syncing)", ...base, "Objective wearable data"];
    case 2:
      return ["Real device (connected and syncing)", ...base, "Physiological + self-reported data"];
    case 3:
      return [...base, "Validated assessment methodology", "Wearable engagement verified"];
    case 4:
      return [...base, "Validated assessment methodology", "Photo documentation"];
  }
}
