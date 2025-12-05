// Mock data for study dashboard preview and development
// This data is used when no real participants have enrolled

import { CustomQuestion } from "./study-context";

export interface MockParticipant {
  id: number;
  name: string;
  status: "active" | "completed" | "at-risk";
  day: number;
  compliance: number;
  lastActive: string;
  // Extended participant details
  initials: string;
  age: number;
  location: string;
  device: string;
  enrolledDate: string;
  email?: string;
}

// Daily wearable metric data point
export interface DailyMetricPoint {
  day: number;
  date: string;
  deepSleep: number; // minutes
  remSleep: number; // minutes
  lightSleep: number; // minutes
  totalSleep: number; // minutes
  hrv: number; // ms
  restingHr: number; // bpm
  sleepScore: number; // 0-100
  recoveryScore: number; // 0-100
}

// Check-in response
export interface CheckInResponse {
  day: number;
  date: string;
  completed: boolean;
  villainResponse?: {
    question: string;
    answer: string;
  };
  customResponses?: {
    question: string;
    questionType: "multiple_choice" | "text" | "voice_and_text" | "likert_scale";
    answer: string;
    // Likert scale metadata for display
    likertValue?: number;
    likertMin?: number;
    likertMax?: number;
    likertMinLabel?: string;
    likertMaxLabel?: string;
  }[];
}

// Extended participant detail with metrics and check-ins
export interface ParticipantDetail {
  participantId: number;
  baselineMetrics: {
    avgDeepSleep: number;
    avgRemSleep: number;
    avgTotalSleep: number;
    avgHrv: number;
    avgRestingHr: number;
    avgSleepScore: number;
  };
  dailyMetrics: DailyMetricPoint[];
  checkIns: CheckInResponse[];
  syncHistory: { date: string; synced: boolean }[];
}

export interface MockMetric {
  label: string;
  value: string;
  positive: boolean;
}

export interface MockTestimonial {
  id: number;
  participant: string;
  initials: string;
  age: number;
  location: string;
  completedDay: number;
  overallRating: number;
  story: string;
  metrics: MockMetric[];
  benefits: string[];
  verified: boolean;
  verificationId: string;
  device: string;
  // Video testimonial fields
  hasVideo?: boolean;
  videoUrl?: string;
  videoThumbnail?: string;
  videoDuration?: string; // e.g., "0:34"
}

// Enhanced participant story with profile, baseline, and journey data
export interface ParticipantStory {
  id: string;
  // Basic identity
  name: string;
  initials: string;
  avatarUrl?: string;

  // Profile data (collected progressively from profile questions)
  profile: {
    ageRange: string;
    lifeStage: string;
    primaryWellnessGoal?: string;
    baselineStressLevel?: number; // 1-10
  };

  // Baseline data (collected at study enrollment)
  baseline: {
    motivation: string; // Voice/text: "What motivated you to try [product]?"
    hopedResults: string; // Voice/text: "What results are you hoping to see?"
    villainDuration: string; // How long dealing with issue
    triedOther: string; // Previous products tried
  };

  // Journey data (collected during study)
  journey: {
    startDate: string;
    endDate: string;
    durationDays: number;
    villainVariable: string;
    // Ratings: 1-5 scale (1=much worse, 5=much better)
    villainRatings: { day: number; rating: number; note?: string }[];
    keyQuotes: { day: number; quote: string; context: string }[];
  };

  // Wearable metrics (before/after comparisons)
  wearableMetrics: {
    device: string;
    sleepChange: { before: number; after: number; unit: string; changePercent: number };
    deepSleepChange?: { before: number; after: number; unit: string; changePercent: number };
    hrvChange?: { before: number; after: number; unit: string; changePercent: number };
    restingHrChange?: { before: number; after: number; unit: string; changePercent: number };
  };

  // Generated story (LLM output)
  generatedNarrative?: string;

  // Verification
  verified: boolean;
  verificationId: string;
  completedAt: string;

  // Overall rating
  overallRating: number;
}

export interface MockDemographicItem {
  label: string;
  value: number;
  color: string;
}

export interface MockBaselineItem {
  label: string;
  value: number;
}

// Mock participant data for monitor tab
export const MOCK_PARTICIPANTS: MockParticipant[] = [
  { id: 1, name: "Sarah M.", status: "active", day: 12, compliance: 95, lastActive: "2 hours ago", initials: "SM", age: 34, location: "Austin, TX", device: "Oura Ring", enrolledDate: "2024-11-20" },
  { id: 2, name: "Mike T.", status: "active", day: 8, compliance: 88, lastActive: "5 hours ago", initials: "MT", age: 42, location: "Seattle, WA", device: "Apple Watch", enrolledDate: "2024-11-24" },
  { id: 3, name: "Emily R.", status: "completed", day: 28, compliance: 92, lastActive: "1 day ago", initials: "ER", age: 29, location: "Denver, CO", device: "Whoop", enrolledDate: "2024-11-04" },
  { id: 4, name: "James L.", status: "active", day: 15, compliance: 78, lastActive: "3 hours ago", initials: "JL", age: 38, location: "Portland, OR", device: "Garmin", enrolledDate: "2024-11-17" },
  { id: 5, name: "Lisa K.", status: "at-risk", day: 6, compliance: 45, lastActive: "3 days ago", initials: "LK", age: 31, location: "San Diego, CA", device: "Fitbit", enrolledDate: "2024-11-26" },
];

// Mock testimonial data for harvest tab - enhanced with full story card fields
export const MOCK_TESTIMONIALS: MockTestimonial[] = [
  {
    id: 1,
    participant: "Sarah M.",
    initials: "SM",
    age: 34,
    location: "Austin, TX",
    completedDay: 28,
    overallRating: 4.8,
    story: "I've tried many sleep supplements, but this one actually worked. My Oura ring showed a 23% improvement in deep sleep within the first two weeks. I wake up feeling genuinely refreshed for the first time in years.",
    metrics: [
      { label: "Deep Sleep", value: "+23%", positive: true },
      { label: "Sleep Score", value: "+15%", positive: true },
      { label: "Restfulness", value: "+18%", positive: true },
    ],
    benefits: ["Fall asleep faster", "Wake up refreshed", "More consistent sleep schedule"],
    verified: true,
    verificationId: "2025-087",
    device: "Oura Ring",
    hasVideo: true,
    videoUrl: "https://example.com/testimonials/sarah-m.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop",
    videoDuration: "0:34",
  },
  {
    id: 2,
    participant: "Emily R.",
    initials: "ER",
    age: 29,
    location: "Denver, CO",
    completedDay: 28,
    overallRating: 4.5,
    story: "Skeptical at first, but the data doesn't lie. My HRV improved significantly and I'm waking up feeling actually rested. This is the first supplement that actually delivered measurable results.",
    metrics: [
      { label: "HRV", value: "+19%", positive: true },
      { label: "Sleep Score", value: "+12%", positive: true },
      { label: "Recovery", value: "+14%", positive: true },
    ],
    benefits: ["Better recovery", "Improved HRV", "Less morning grogginess"],
    verified: true,
    verificationId: "2025-092",
    device: "Whoop",
  },
  {
    id: 3,
    participant: "Mike T.",
    initials: "MT",
    age: 42,
    location: "Seattle, WA",
    completedDay: 28,
    overallRating: 4.9,
    story: "As someone who's tracked my sleep for 3 years, I can confidently say this product made a real difference. The improvement in my deep sleep was consistent week over week.",
    metrics: [
      { label: "Deep Sleep", value: "+28%", positive: true },
      { label: "Light Sleep", value: "+10%", positive: true },
      { label: "Sleep Efficiency", value: "+8%", positive: true },
    ],
    benefits: ["Deeper sleep cycles", "More energy throughout the day", "Better mental clarity"],
    verified: true,
    verificationId: "2025-098",
    device: "Apple Watch",
    hasVideo: true,
    videoUrl: "https://example.com/testimonials/mike-t.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    videoDuration: "0:47",
  },
  {
    id: 4,
    participant: "Lisa K.",
    initials: "LK",
    age: 38,
    location: "Portland, OR",
    completedDay: 28,
    overallRating: 4.6,
    story: "I was dealing with stress-related sleep issues and this really helped. My Garmin showed steady improvements in both sleep quality and recovery scores.",
    metrics: [
      { label: "Stress Score", value: "-15%", positive: true },
      { label: "Sleep Quality", value: "+17%", positive: true },
      { label: "Body Battery", value: "+22%", positive: true },
    ],
    benefits: ["Reduced nighttime anxiety", "More restorative sleep", "Better stress management"],
    verified: true,
    verificationId: "2025-103",
    device: "Garmin",
  },
];

// Enhanced participant stories with profile, baseline, and journey data
export const MOCK_PARTICIPANT_STORIES: ParticipantStory[] = [
  {
    id: "story-1",
    name: "Sarah M.",
    initials: "SM",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    profile: {
      ageRange: "35-44",
      lifeStage: "Parent with young children",
      primaryWellnessGoal: "Get better quality sleep despite busy schedule",
      baselineStressLevel: 7,
    },
    baseline: {
      motivation: "I was desperate to find something that actually worked for my afternoon crashes. I'd tried supplements and caffeine but nothing stuck. After my second kid, my sleep just never recovered.",
      hopedResults: "I'm hoping to finally wake up feeling rested and not drag through the afternoons anymore.",
      villainDuration: "1+ years",
      triedOther: "Yes, several others",
    },
    journey: {
      startDate: "2024-11-01",
      endDate: "2024-11-29",
      durationDays: 28,
      villainVariable: "afternoon brain fog",
      villainRatings: [
        { day: 1, rating: 2, note: "Typical bad day, couldn't focus after lunch" },
        { day: 7, rating: 2, note: "Maybe slightly better? Hard to tell" },
        { day: 14, rating: 3, note: "Definitely noticing a difference in the afternoons" },
        { day: 21, rating: 4, note: "Much clearer afternoons, husband noticed too" },
        { day: 28, rating: 5, note: "Night and day difference from when I started" },
      ],
      keyQuotes: [
        { day: 14, quote: "I actually made it through a 3pm meeting without zoning out", context: "Weekly check-in" },
        { day: 28, quote: "My husband noticed I wasn't crashing after lunch anymore. The data backs it up too.", context: "Final reflection" },
      ],
    },
    wearableMetrics: {
      device: "Oura Ring",
      sleepChange: { before: 382, after: 429, unit: "min", changePercent: 12 },
      deepSleepChange: { before: 45, after: 55, unit: "min", changePercent: 23 },
      hrvChange: { before: 42, after: 51, unit: "ms", changePercent: 21 },
      restingHrChange: { before: 62, after: 58, unit: "bpm", changePercent: -6 },
    },
    generatedNarrative: "Sarah, a 34-year-old parent of two, had been struggling with afternoon brain fog for over a year after her second child. Despite trying several supplements and caffeine, nothing seemed to help her energy crashes. Within two weeks of starting the study, Sarah began noticing improvements in her afternoon focus. By day 21, her husband had noticed the change. Her Oura Ring data showed a 23% increase in deep sleep and 21% improvement in HRV, backing up her subjective experience with objective data.",
    verified: true,
    verificationId: "2025-087",
    completedAt: "2024-11-29",
    overallRating: 4.8,
  },
  {
    id: "story-2",
    name: "Emily R.",
    initials: "ER",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    profile: {
      ageRange: "25-34",
      lifeStage: "Early career professional",
      primaryWellnessGoal: "Improve recovery between workouts",
      baselineStressLevel: 6,
    },
    baseline: {
      motivation: "I'm training for a half marathon and my recovery has been terrible. I read that sleep quality matters more than hours, so I wanted to try something that might help.",
      hopedResults: "Better HRV scores and feeling less sore after long runs.",
      villainDuration: "6-12 months",
      triedOther: "Yes, 1-2 others",
    },
    journey: {
      startDate: "2024-11-04",
      endDate: "2024-12-02",
      durationDays: 28,
      villainVariable: "poor recovery",
      villainRatings: [
        { day: 1, rating: 2, note: "Still sore from Sunday's run" },
        { day: 7, rating: 3, note: "Somewhat better, not as dragged out" },
        { day: 14, rating: 3, note: "Recovery improving, hitting better paces" },
        { day: 21, rating: 4, note: "PR'd on my tempo run, felt fresh" },
        { day: 28, rating: 5, note: "Best I've felt in months" },
      ],
      keyQuotes: [
        { day: 21, quote: "I PR'd on my tempo run yesterday and actually felt fresh going into it", context: "Check-in note" },
        { day: 28, quote: "Skeptical at first, but the data doesn't lie. My HRV improved significantly.", context: "Final reflection" },
      ],
    },
    wearableMetrics: {
      device: "Whoop",
      sleepChange: { before: 395, after: 418, unit: "min", changePercent: 6 },
      deepSleepChange: { before: 52, after: 61, unit: "min", changePercent: 17 },
      hrvChange: { before: 45, after: 54, unit: "ms", changePercent: 19 },
      restingHrChange: { before: 58, after: 55, unit: "bpm", changePercent: -5 },
    },
    generatedNarrative: "Emily, a 29-year-old early career professional training for a half marathon, was struggling with poor recovery between workouts. Within three weeks, she noticed significant improvements, even setting a personal record on a tempo run. Her Whoop data confirmed her experience: HRV improved by 19% and deep sleep increased by 17%.",
    verified: true,
    verificationId: "2025-092",
    completedAt: "2024-12-02",
    overallRating: 4.5,
  },
  {
    id: "story-3",
    name: "Mike T.",
    initials: "MT",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    profile: {
      ageRange: "35-44",
      lifeStage: "Established professional",
      primaryWellnessGoal: "Reduce stress-related sleep issues",
      baselineStressLevel: 8,
    },
    baseline: {
      motivation: "High-pressure job keeps me up at night. I've been tracking my sleep for 3 years and it keeps getting worse. Willing to try anything at this point.",
      hopedResults: "Fall asleep faster and stop waking up at 3am.",
      villainDuration: "1+ years",
      triedOther: "Yes, several others",
    },
    journey: {
      startDate: "2024-11-08",
      endDate: "2024-12-06",
      durationDays: 28,
      villainVariable: "nighttime waking",
      villainRatings: [
        { day: 1, rating: 2, note: "Woke up twice last night" },
        { day: 7, rating: 3, note: "Only woke once, fell back asleep faster" },
        { day: 14, rating: 4, note: "Slept through most nights this week" },
        { day: 21, rating: 4, note: "Consistently better, less 3am wake-ups" },
        { day: 28, rating: 5, note: "Best sleep I've had in years" },
      ],
      keyQuotes: [
        { day: 14, quote: "As someone who's tracked my sleep for 3 years, I can confidently say this made a real difference", context: "Check-in reflection" },
        { day: 28, quote: "The improvement in my deep sleep was consistent week over week. This is sustainable.", context: "Final note" },
      ],
    },
    wearableMetrics: {
      device: "Apple Watch",
      sleepChange: { before: 340, after: 402, unit: "min", changePercent: 18 },
      deepSleepChange: { before: 38, after: 49, unit: "min", changePercent: 28 },
      hrvChange: { before: 38, after: 44, unit: "ms", changePercent: 16 },
      restingHrChange: { before: 65, after: 61, unit: "bpm", changePercent: -6 },
    },
    generatedNarrative: "Mike, a 42-year-old professional with a high-pressure job, had been struggling with nighttime waking for over a year. As a dedicated sleep tracker of 3 years, he was skeptical but willing to try. By week two, he was sleeping through most nights. His Apple Watch showed a remarkable 28% increase in deep sleep and 18% more total sleep time.",
    verified: true,
    verificationId: "2025-098",
    completedAt: "2024-12-06",
    overallRating: 4.9,
  },
  {
    id: "story-4",
    name: "Lisa K.",
    initials: "LK",
    avatarUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop",
    profile: {
      ageRange: "35-44",
      lifeStage: "Established professional",
      primaryWellnessGoal: "Manage work stress better",
      baselineStressLevel: 9,
    },
    baseline: {
      motivation: "Work stress has been off the charts lately. I lie awake thinking about tomorrow's meetings. My Garmin's stress scores are always in the red.",
      hopedResults: "Lower stress scores and actually being able to relax at night.",
      villainDuration: "6-12 months",
      triedOther: "Yes, 1-2 others",
    },
    journey: {
      startDate: "2024-11-10",
      endDate: "2024-12-08",
      durationDays: 28,
      villainVariable: "work-related anxiety",
      villainRatings: [
        { day: 1, rating: 2, note: "Couldn't stop thinking about work" },
        { day: 7, rating: 2, note: "Still anxious but slightly better" },
        { day: 14, rating: 3, note: "More able to disconnect in evenings" },
        { day: 21, rating: 4, note: "Stress feels more manageable" },
        { day: 28, rating: 4, note: "Much better at leaving work at work" },
      ],
      keyQuotes: [
        { day: 21, quote: "My Garmin showed steady improvements in both sleep quality and recovery scores", context: "Check-in note" },
        { day: 28, quote: "I'm finally able to disconnect from work in the evenings. That alone is worth it.", context: "Final reflection" },
      ],
    },
    wearableMetrics: {
      device: "Garmin",
      sleepChange: { before: 365, after: 398, unit: "min", changePercent: 9 },
      deepSleepChange: { before: 42, after: 51, unit: "min", changePercent: 21 },
      hrvChange: { before: 40, after: 47, unit: "ms", changePercent: 17 },
      restingHrChange: { before: 64, after: 60, unit: "bpm", changePercent: -6 },
    },
    generatedNarrative: "Lisa, a 38-year-old professional dealing with intense work stress, struggled to disconnect at night. Her Garmin consistently showed stress scores in the red zone. By week three, she noticed a real shift in her ability to leave work at work. Her device showed steady improvements: 21% more deep sleep and 17% better HRV scores.",
    verified: true,
    verificationId: "2025-103",
    completedAt: "2024-12-08",
    overallRating: 4.6,
  },
];

// Mock demographic data for participant insights
export const MOCK_DEMOGRAPHICS = {
  age: [
    { label: "18-25", value: 15, color: "#84CC16" },
    { label: "26-35", value: 42, color: "#F97316" },
    { label: "36-45", value: 28, color: "#8B5CF6" },
    { label: "46-55", value: 15, color: "#06B6D4" },
  ] as MockDemographicItem[],
  gender: [
    { label: "Female", value: 58, color: "#F97316" },
    { label: "Male", value: 38, color: "#3B82F6" },
    { label: "Other", value: 4, color: "#84CC16" },
  ] as MockDemographicItem[],
  location: [
    { label: "US", value: 72, color: "#84CC16" },
    { label: "Canada", value: 18, color: "#F97316" },
    { label: "Other", value: 10, color: "#3B82F6" },
  ] as MockDemographicItem[],
  income: [
    { label: "$0-$50K", value: 22, color: "#8B5CF6" },
    { label: "$50K-$100K", value: 45, color: "#06B6D4" },
    { label: "$100K+", value: 33, color: "#84CC16" },
  ] as MockDemographicItem[],
};

// Mock baseline intake data
export const MOCK_BASELINE_DATA = {
  diet: [
    { label: "No specific diet", value: 35 },
    { label: "Keto/Low-carb", value: 18 },
    { label: "Vegetarian/Vegan", value: 15 },
    { label: "Paleo", value: 12 },
    { label: "Mediterranean", value: 20 },
  ] as MockBaselineItem[],
  exerciseFrequency: [
    { label: "0-1 days", value: 12 },
    { label: "2-3 days", value: 35 },
    { label: "4-5 days", value: 38 },
    { label: "6-7 days", value: 15 },
  ] as MockBaselineItem[],
  stressLevel: [
    { label: "Low", value: 15 },
    { label: "Moderate", value: 45 },
    { label: "High", value: 32 },
    { label: "Very High", value: 8 },
  ] as MockBaselineItem[],
  wearableDevices: [
    { label: "Oura Ring", value: 42 },
    { label: "Apple Watch", value: 35 },
    { label: "Whoop", value: 15 },
    { label: "Fitbit", value: 8 },
  ] as MockBaselineItem[],
  takesSupplements: { yes: 68, no: 32 },
  purchaseMotivation: [
    { label: "Better sleep", value: 45 },
    { label: "More energy", value: 25 },
    { label: "Stress relief", value: 18 },
    { label: "General wellness", value: 12 },
  ] as MockBaselineItem[],
  expectedResults: [
    { label: "Improved sleep quality", value: 52 },
    { label: "Fall asleep faster", value: 28 },
    { label: "Wake up refreshed", value: 15 },
    { label: "Reduced anxiety", value: 5 },
  ] as MockBaselineItem[],
};

// Mock activity data for dashboard
export interface MockActivity {
  id: number;
  type: "completion" | "enrollment" | "milestone";
  message: string;
  detail: string | null;
  timestamp: string;
}

export const MOCK_ACTIVITIES: MockActivity[] = [
  {
    id: 1,
    type: "completion",
    message: "Sarah M. completed Better Sleep Study",
    detail: "testimonial ready",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "enrollment",
    message: "12 new enrollments in Energy Boost Study",
    detail: null,
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    type: "milestone",
    message: "Recovery Pro Study is 80% full",
    detail: "only 10 spots left",
    timestamp: "1 day ago",
  },
  {
    id: 4,
    type: "completion",
    message: "Mike T. completed Better Sleep Study",
    detail: "testimonial ready",
    timestamp: "1 day ago",
  },
  {
    id: 5,
    type: "enrollment",
    message: "5 new enrollments in Better Sleep Study",
    detail: null,
    timestamp: "2 days ago",
  },
];

// Helper to generate daily metrics for a participant
function generateDailyMetrics(participantId: number, numDays: number, improving: boolean): DailyMetricPoint[] {
  const baseDate = new Date("2024-11-20");
  const metrics: DailyMetricPoint[] = [];

  // Base values vary by participant
  const bases: Record<number, { deepSleep: number; remSleep: number; hrv: number; restingHr: number; sleepScore: number }> = {
    1: { deepSleep: 45, remSleep: 80, hrv: 42, restingHr: 62, sleepScore: 72 },
    2: { deepSleep: 38, remSleep: 75, hrv: 38, restingHr: 65, sleepScore: 68 },
    3: { deepSleep: 50, remSleep: 85, hrv: 45, restingHr: 58, sleepScore: 75 },
    4: { deepSleep: 42, remSleep: 78, hrv: 40, restingHr: 64, sleepScore: 70 },
    5: { deepSleep: 35, remSleep: 70, hrv: 35, restingHr: 68, sleepScore: 62 },
  };

  const base = bases[participantId] || bases[1];

  for (let day = 1; day <= numDays; day++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + day - 1);

    // Add some variance and improvement trend
    const improvementFactor = improving ? (day / numDays) * 0.25 : 0;
    const variance = () => (Math.random() - 0.5) * 10;

    const deepSleep = Math.round(base.deepSleep * (1 + improvementFactor) + variance());
    const remSleep = Math.round(base.remSleep * (1 + improvementFactor * 0.5) + variance());
    const lightSleep = Math.round(180 + variance() * 2);

    metrics.push({
      day,
      date: date.toISOString().split("T")[0],
      deepSleep: Math.max(20, deepSleep),
      remSleep: Math.max(40, remSleep),
      lightSleep,
      totalSleep: deepSleep + remSleep + lightSleep,
      hrv: Math.round(base.hrv * (1 + improvementFactor) + variance() * 0.5),
      restingHr: Math.round(base.restingHr * (1 - improvementFactor * 0.1) + variance() * 0.3),
      sleepScore: Math.min(100, Math.max(40, Math.round(base.sleepScore * (1 + improvementFactor) + variance() * 0.5))),
      recoveryScore: Math.min(100, Math.max(30, Math.round(65 + improvementFactor * 20 + variance()))),
    });
  }

  return metrics;
}

// Generate check-in responses
function generateCheckIns(numDays: number, compliance: number, villainVariable?: string): CheckInResponse[] {
  const baseDate = new Date("2024-11-20");
  const checkIns: CheckInResponse[] = [];
  const villainDays = [7, 14, 21, 28];

  const villainAnswers = [
    "Yes, noticeably better this week",
    "Somewhat improved",
    "About the same",
    "Much better than before",
  ];

  const customQuestions = [
    { question: "How would you rate your energy levels today?", type: "multiple_choice" as const, options: ["Low", "Moderate", "High", "Very High"] },
    { question: "Did you take the supplement as directed?", type: "multiple_choice" as const, options: ["Yes", "No", "Forgot once"] },
    { question: "Any side effects to report?", type: "text" as const, options: [] },
  ];

  for (let day = 1; day <= numDays; day++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + day - 1);

    // Determine if this check-in was completed based on compliance
    const completed = Math.random() * 100 < compliance;

    const checkIn: CheckInResponse = {
      day,
      date: date.toISOString().split("T")[0],
      completed,
    };

    if (completed) {
      // Add villain response on villain days
      if (villainDays.includes(day) && villainVariable) {
        checkIn.villainResponse = {
          question: `Did you notice any changes regarding your ${villainVariable}?`,
          answer: villainAnswers[Math.floor(Math.random() * villainAnswers.length)],
        };
      }

      // Add custom responses
      checkIn.customResponses = customQuestions.map((q) => ({
        question: q.question,
        questionType: q.type,
        answer: q.type === "text"
          ? (Math.random() > 0.7 ? "No side effects" : "None to report")
          : q.options[Math.floor(Math.random() * q.options.length)],
      }));
    }

    checkIns.push(checkIn);
  }

  return checkIns;
}

// Generate sync history
function generateSyncHistory(numDays: number, compliance: number): { date: string; synced: boolean }[] {
  const baseDate = new Date("2024-11-20");
  const history: { date: string; synced: boolean }[] = [];

  for (let day = 1; day <= numDays; day++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + day - 1);

    history.push({
      date: date.toISOString().split("T")[0],
      synced: Math.random() * 100 < compliance + 5, // Syncing is slightly more reliable than check-ins
    });
  }

  return history;
}

// Detailed participant data
export const MOCK_PARTICIPANT_DETAILS: Record<number, ParticipantDetail> = {
  1: {
    participantId: 1,
    baselineMetrics: {
      avgDeepSleep: 45,
      avgRemSleep: 80,
      avgTotalSleep: 305,
      avgHrv: 42,
      avgRestingHr: 62,
      avgSleepScore: 72,
    },
    dailyMetrics: generateDailyMetrics(1, 12, true),
    checkIns: generateCheckIns(12, 95, "afternoon brain fog"),
    syncHistory: generateSyncHistory(12, 95),
  },
  2: {
    participantId: 2,
    baselineMetrics: {
      avgDeepSleep: 38,
      avgRemSleep: 75,
      avgTotalSleep: 290,
      avgHrv: 38,
      avgRestingHr: 65,
      avgSleepScore: 68,
    },
    dailyMetrics: generateDailyMetrics(2, 8, true),
    checkIns: generateCheckIns(8, 88, "afternoon brain fog"),
    syncHistory: generateSyncHistory(8, 88),
  },
  3: {
    participantId: 3,
    baselineMetrics: {
      avgDeepSleep: 50,
      avgRemSleep: 85,
      avgTotalSleep: 320,
      avgHrv: 45,
      avgRestingHr: 58,
      avgSleepScore: 75,
    },
    dailyMetrics: generateDailyMetrics(3, 28, true),
    checkIns: generateCheckIns(28, 92, "afternoon brain fog"),
    syncHistory: generateSyncHistory(28, 92),
  },
  4: {
    participantId: 4,
    baselineMetrics: {
      avgDeepSleep: 42,
      avgRemSleep: 78,
      avgTotalSleep: 300,
      avgHrv: 40,
      avgRestingHr: 64,
      avgSleepScore: 70,
    },
    dailyMetrics: generateDailyMetrics(4, 15, true),
    checkIns: generateCheckIns(15, 78, "afternoon brain fog"),
    syncHistory: generateSyncHistory(15, 78),
  },
  5: {
    participantId: 5,
    baselineMetrics: {
      avgDeepSleep: 35,
      avgRemSleep: 70,
      avgTotalSleep: 275,
      avgHrv: 35,
      avgRestingHr: 68,
      avgSleepScore: 62,
    },
    dailyMetrics: generateDailyMetrics(5, 6, false),
    checkIns: generateCheckIns(6, 45, "afternoon brain fog"),
    syncHistory: generateSyncHistory(6, 45),
  },
};

// Helper to get participant detail by ID
export function getParticipantDetail(participantId: number): ParticipantDetail | undefined {
  return MOCK_PARTICIPANT_DETAILS[participantId];
}

// Generate check-in responses using study's actual questions
function generateCheckInsWithStudyQuestions(
  numDays: number,
  compliance: number,
  villainVariable: string,
  villainQuestionDays: number[],
  customQuestions: CustomQuestion[]
): CheckInResponse[] {
  const baseDate = new Date("2024-11-20");
  const checkIns: CheckInResponse[] = [];

  const villainAnswers = [
    "Yes, noticeably better this week",
    "Somewhat improved",
    "About the same",
    "Much better than before",
    "Significant improvement",
    "Slight improvement",
  ];

  for (let day = 1; day <= numDays; day++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + day - 1);

    // Determine if this check-in was completed based on compliance
    const completed = Math.random() * 100 < compliance;

    const checkIn: CheckInResponse = {
      day,
      date: date.toISOString().split("T")[0],
      completed,
    };

    if (completed) {
      // Add villain response on configured villain days
      if (villainVariable && villainQuestionDays.includes(day)) {
        checkIn.villainResponse = {
          question: `Did you notice any changes regarding your ${villainVariable}?`,
          answer: villainAnswers[Math.floor(Math.random() * villainAnswers.length)],
        };
      }

      // Add custom question responses for questions that should appear on this day
      const questionsForThisDay = customQuestions.filter(q => q.showOnDays.includes(day));

      if (questionsForThisDay.length > 0) {
        checkIn.customResponses = questionsForThisDay.map((q) => {
          let answer: string;
          let likertValue: number | undefined;

          if (q.questionType === "text" || q.questionType === "voice_and_text") {
            // Generate realistic text responses based on question content
            const textResponses = [
              "Everything is going well",
              "No issues to report",
              "Feeling good today",
              "Much better than last week",
              "Some minor improvements noticed",
            ];
            answer = textResponses[Math.floor(Math.random() * textResponses.length)];
          } else if (q.questionType === "likert_scale") {
            // Generate a Likert scale response (tends toward positive for improving participants)
            const min = q.likertMin || 1;
            const max = q.likertMax || 10;
            // Bias toward higher values (6-10 range more likely)
            likertValue = Math.floor(Math.random() * (max - min + 1)) + min;
            // Add slight positive bias
            if (likertValue < max - 2 && Math.random() > 0.4) {
              likertValue = Math.min(max, likertValue + Math.floor(Math.random() * 3));
            }
            answer = likertValue.toString();
          } else {
            // Multiple choice - pick from the configured options
            const validOptions = q.options.filter(o => o && o.trim() !== "");
            answer = validOptions.length > 0
              ? validOptions[Math.floor(Math.random() * validOptions.length)]
              : "N/A";
          }

          const response: NonNullable<CheckInResponse["customResponses"]>[0] = {
            question: q.questionText || "Custom question",
            questionType: q.questionType,
            answer,
          };

          // Add Likert metadata if applicable
          if (q.questionType === "likert_scale") {
            response.likertValue = likertValue;
            response.likertMin = q.likertMin || 1;
            response.likertMax = q.likertMax || 10;
            response.likertMinLabel = q.likertMinLabel || "Strongly Disagree";
            response.likertMaxLabel = q.likertMaxLabel || "Strongly Agree";
          }

          return response;
        });
      }
    }

    checkIns.push(checkIn);
  }

  return checkIns;
}

// Generate participant detail dynamically using study's questions
export function generateParticipantDetailForStudy(
  participant: MockParticipant,
  villainVariable: string,
  villainQuestionDays: number[],
  customQuestions: CustomQuestion[]
): ParticipantDetail {
  const numDays = participant.day;
  const improving = participant.status !== "at-risk";

  // Base baseline metrics vary by participant
  const baselinesByParticipant: Record<number, ParticipantDetail["baselineMetrics"]> = {
    1: { avgDeepSleep: 45, avgRemSleep: 80, avgTotalSleep: 305, avgHrv: 42, avgRestingHr: 62, avgSleepScore: 72 },
    2: { avgDeepSleep: 38, avgRemSleep: 75, avgTotalSleep: 290, avgHrv: 38, avgRestingHr: 65, avgSleepScore: 68 },
    3: { avgDeepSleep: 50, avgRemSleep: 85, avgTotalSleep: 320, avgHrv: 45, avgRestingHr: 58, avgSleepScore: 75 },
    4: { avgDeepSleep: 42, avgRemSleep: 78, avgTotalSleep: 300, avgHrv: 40, avgRestingHr: 64, avgSleepScore: 70 },
    5: { avgDeepSleep: 35, avgRemSleep: 70, avgTotalSleep: 275, avgHrv: 35, avgRestingHr: 68, avgSleepScore: 62 },
  };

  const baselineMetrics = baselinesByParticipant[participant.id] || baselinesByParticipant[1];

  return {
    participantId: participant.id,
    baselineMetrics,
    dailyMetrics: generateDailyMetrics(participant.id, numDays, improving),
    checkIns: generateCheckInsWithStudyQuestions(
      numDays,
      participant.compliance,
      villainVariable,
      villainQuestionDays,
      customQuestions
    ),
    syncHistory: generateSyncHistory(numDays, participant.compliance),
  };
}

// =============================================================================
// DYNAMIC STORY GENERATOR
// Generates contextually appropriate participant stories based on study type
// =============================================================================

// Health category definitions with relevant metrics and narratives
interface HealthCategory {
  keywords: string[];
  villainVariables: string[];
  metrics: {
    primary: { label: string; unit: string; beforeRange: [number, number]; changeRange: [number, number] };
    secondary: { label: string; unit: string; beforeRange: [number, number]; changeRange: [number, number] }[];
  };
  motivations: string[];
  hopedResults: string[];
  journeyNotes: { day: number; improving: string; struggling: string }[];
  keyQuotes: { context: string; quotes: string[] }[];
  lifeStages: string[];
  wellnessGoals: string[];
}

const HEALTH_CATEGORIES: Record<string, HealthCategory> = {
  digestion: {
    keywords: ["digestion", "bloating", "gut", "stomach", "digestive", "morning routine", "regularity"],
    villainVariables: ["bloating", "digestive discomfort", "irregular digestion", "stomach issues", "morning sluggishness"],
    metrics: {
      primary: { label: "Bloating episodes", unit: "per week", beforeRange: [5, 8], changeRange: [-60, -80] },
      secondary: [
        { label: "Digestive comfort", unit: "score", beforeRange: [4, 6], changeRange: [30, 50] },
        { label: "Energy levels", unit: "score", beforeRange: [5, 6], changeRange: [20, 35] },
        { label: "Morning alertness", unit: "score", beforeRange: [4, 5], changeRange: [25, 45] },
      ],
    },
    motivations: [
      "I've been dealing with bloating after almost every meal. It's uncomfortable and embarrassing.",
      "My morning routine has been a mess - I feel sluggish and my digestion is all over the place.",
      "I read that gut health affects everything from mood to energy. I want to finally fix this.",
      "After years of digestive issues, I'm ready to try something that actually addresses the root cause.",
    ],
    hopedResults: [
      "I'm hoping to eat without worrying about bloating afterward.",
      "I want to feel lighter and more energetic in the mornings.",
      "I'd love to have regular, comfortable digestion again.",
      "I'm looking for consistent energy throughout the day without the afternoon slump.",
    ],
    journeyNotes: [
      { day: 1, improving: "First day, feeling hopeful", struggling: "Usual bloating after lunch" },
      { day: 7, improving: "Noticing less bloating after meals", struggling: "Still some discomfort, but maybe slightly better" },
      { day: 14, improving: "Digestion feels smoother, less heavy after eating", struggling: "Good days and bad days still" },
      { day: 21, improving: "My pants fit better - less bloat!", struggling: "Improvement is slow but there" },
      { day: 28, improving: "Feel like a different person - light and energetic", struggling: "Consistent improvement, really pleased" },
    ],
    keyQuotes: [
      { context: "Weekly check-in", quotes: [
        "I actually wore my fitted jeans to dinner without worrying about bloating",
        "My morning routine is completely different now - I feel ready to tackle the day",
        "I used to dread eating out, now I can enjoy meals again",
      ]},
      { context: "Final reflection", quotes: [
        "The difference in my digestion is night and day. I wish I'd found this sooner.",
        "I finally feel comfortable in my own body after meals.",
        "My energy is so much more consistent now that my gut is happy.",
      ]},
    ],
    lifeStages: ["Busy professional", "New parent", "Health-conscious adult", "Active lifestyle seeker"],
    wellnessGoals: ["Improve digestive health", "Reduce bloating", "Better gut health", "More consistent energy"],
  },

  sleep: {
    keywords: ["sleep", "rest", "insomnia", "tired", "fatigue", "energy", "recovery"],
    villainVariables: ["poor sleep", "insomnia", "nighttime waking", "afternoon brain fog", "low energy"],
    metrics: {
      primary: { label: "Deep sleep", unit: "min", beforeRange: [35, 50], changeRange: [15, 30] },
      secondary: [
        { label: "Sleep score", unit: "pts", beforeRange: [60, 72], changeRange: [12, 22] },
        { label: "HRV", unit: "ms", beforeRange: [35, 45], changeRange: [15, 25] },
        { label: "Resting HR", unit: "bpm", beforeRange: [62, 68], changeRange: [-8, -4] },
      ],
    },
    motivations: [
      "I've tried many sleep supplements, but nothing seems to work long-term.",
      "My wearable shows terrible sleep scores. I need to fix this.",
      "I'm exhausted all day but can't fall asleep at night. It's affecting everything.",
      "Work stress keeps me up at night. I need something to help me wind down.",
    ],
    hopedResults: [
      "I want to wake up feeling actually rested for once.",
      "I'm hoping for better deep sleep numbers on my tracker.",
      "I want to fall asleep faster and stay asleep through the night.",
      "I'd love to have consistent energy without caffeine crashes.",
    ],
    journeyNotes: [
      { day: 1, improving: "Taking it before bed as directed", struggling: "Same old sleep issues" },
      { day: 7, improving: "Maybe falling asleep a bit faster?", struggling: "Hard to tell if it's working yet" },
      { day: 14, improving: "Definitely sleeping more soundly", struggling: "Some improvement in sleep quality" },
      { day: 21, improving: "Waking up refreshed more often", struggling: "Getting better, husband noticed" },
      { day: 28, improving: "Best sleep I've had in years", struggling: "Solid improvement overall" },
    ],
    keyQuotes: [
      { context: "Weekly check-in", quotes: [
        "I actually made it through a 3pm meeting without zoning out",
        "My Oura ring is showing the best scores I've seen in months",
        "I finally feel like myself again in the mornings",
      ]},
      { context: "Final reflection", quotes: [
        "The data doesn't lie - my sleep has genuinely improved.",
        "I was skeptical, but the consistent results won me over.",
        "My energy levels are completely different now.",
      ]},
    ],
    lifeStages: ["Parent of young kids", "High-stress professional", "Shift worker", "Established professional"],
    wellnessGoals: ["Better sleep quality", "More energy", "Improve recovery", "Reduce stress"],
  },

  stress: {
    keywords: ["stress", "anxiety", "calm", "relax", "cortisol", "mood", "mental"],
    villainVariables: ["work-related anxiety", "chronic stress", "racing thoughts", "tension", "overwhelm"],
    metrics: {
      primary: { label: "Stress score", unit: "pts", beforeRange: [70, 85], changeRange: [-25, -40] },
      secondary: [
        { label: "HRV", unit: "ms", beforeRange: [32, 42], changeRange: [18, 30] },
        { label: "Resting HR", unit: "bpm", beforeRange: [68, 75], changeRange: [-10, -6] },
        { label: "Recovery score", unit: "pts", beforeRange: [45, 55], changeRange: [20, 35] },
      ],
    },
    motivations: [
      "My stress levels have been through the roof. My watch says I'm always in the red zone.",
      "I can't seem to turn my brain off at night. The anxiety is constant.",
      "Work pressure is affecting my health. I need to find a way to manage it better.",
      "I've tried meditation apps but need something more to help me stay calm.",
    ],
    hopedResults: [
      "I want to feel calm and in control, even during busy days.",
      "I'm hoping for lower stress scores on my wearable.",
      "I'd love to be able to relax without feeling guilty or anxious.",
      "I want to respond to stress better, not just react.",
    ],
    journeyNotes: [
      { day: 1, improving: "Starting with hope", struggling: "Another stressful day at work" },
      { day: 7, improving: "Feeling slightly calmer during meetings", struggling: "Still pretty stressed overall" },
      { day: 14, improving: "Handling pressure better at work", struggling: "Better days appearing more often" },
      { day: 21, improving: "Colleagues noticed I seem calmer", struggling: "Definite improvement in my reactions" },
      { day: 28, improving: "Feel like I have my stress under control", struggling: "Much better ability to cope" },
    ],
    keyQuotes: [
      { context: "Weekly check-in", quotes: [
        "My team said I seemed more relaxed in our strategy meeting",
        "I didn't snap at my kids after a hard day - that's new",
        "My stress score dropped from red to yellow for the first time",
      ]},
      { context: "Final reflection", quotes: [
        "I finally feel like stress isn't controlling my life anymore.",
        "The improvement in my HRV tells the whole story.",
        "I'm the calm one in meetings now. My team can't believe it.",
      ]},
    ],
    lifeStages: ["Startup founder", "Executive", "Caregiver", "Busy parent"],
    wellnessGoals: ["Manage stress better", "Improve mental clarity", "Better emotional balance", "Lower cortisol"],
  },

  energy: {
    keywords: ["energy", "fatigue", "vitality", "focus", "productivity", "concentration"],
    villainVariables: ["low energy", "afternoon fatigue", "brain fog", "lack of focus", "mental fatigue"],
    metrics: {
      primary: { label: "Energy score", unit: "pts", beforeRange: [45, 55], changeRange: [25, 40] },
      secondary: [
        { label: "Focus time", unit: "hrs", beforeRange: [2, 3], changeRange: [40, 60] },
        { label: "Recovery score", unit: "pts", beforeRange: [50, 60], changeRange: [15, 30] },
        { label: "Activity minutes", unit: "min", beforeRange: [25, 35], changeRange: [30, 50] },
      ],
    },
    motivations: [
      "I hit a wall every afternoon around 2pm. Coffee doesn't help anymore.",
      "I used to have so much energy but now I'm dragging through every day.",
      "I can't focus for more than 30 minutes without feeling exhausted.",
      "My productivity has tanked because I just don't have the energy.",
    ],
    hopedResults: [
      "I want consistent energy throughout the day without caffeine.",
      "I'm hoping to be productive past 3pm for once.",
      "I'd love to have enough energy for both work and workouts.",
      "I want to feel sharp and focused during important meetings.",
    ],
    journeyNotes: [
      { day: 1, improving: "Excited to start", struggling: "Typical afternoon crash" },
      { day: 7, improving: "Maybe a bit more alert in the afternoon?", struggling: "Still fatigued but perhaps less" },
      { day: 14, improving: "Noticeably more energy after lunch", struggling: "Good days are becoming more common" },
      { day: 21, improving: "Powered through a 4pm meeting easily", struggling: "Energy is definitely more stable" },
      { day: 28, improving: "Have energy for evening workouts again!", struggling: "Feel consistently better" },
    ],
    keyQuotes: [
      { context: "Weekly check-in", quotes: [
        "I actually went for a run after work - haven't done that in months",
        "My 3pm slump is basically gone",
        "Finished a whole project without reaching for more coffee",
      ]},
      { context: "Final reflection", quotes: [
        "The difference in my productivity is measurable. I'm getting so much more done.",
        "I forgot what it felt like to have real energy. This brought it back.",
        "My team asked if I changed my diet. Nope, just found something that works.",
      ]},
    ],
    lifeStages: ["Remote worker", "Entrepreneur", "Graduate student", "Creative professional"],
    wellnessGoals: ["More sustainable energy", "Better focus", "Increased productivity", "Athletic performance"],
  },

  fitness: {
    keywords: ["fitness", "workout", "muscle", "strength", "athletic", "performance", "recovery", "exercise"],
    villainVariables: ["poor recovery", "muscle soreness", "performance plateau", "slow gains", "workout fatigue"],
    metrics: {
      primary: { label: "Recovery score", unit: "pts", beforeRange: [50, 60], changeRange: [20, 35] },
      secondary: [
        { label: "HRV", unit: "ms", beforeRange: [40, 50], changeRange: [15, 25] },
        { label: "Strain capacity", unit: "pts", beforeRange: [12, 14], changeRange: [15, 25] },
        { label: "Resting HR", unit: "bpm", beforeRange: [55, 62], changeRange: [-8, -5] },
      ],
    },
    motivations: [
      "I'm training hard but not seeing the gains I should. Recovery is definitely the issue.",
      "My WHOOP tells me I'm always in the red. I can't train as hard as I want.",
      "I'm sore for days after workouts. It's affecting my consistency.",
      "I want to optimize my recovery so I can train more and see better results.",
    ],
    hopedResults: [
      "I want to recover faster between workouts.",
      "I'm hoping for better HRV and recovery scores.",
      "I'd love to train 5 days a week without feeling broken.",
      "I want to see my performance actually improve, not just maintain.",
    ],
    journeyNotes: [
      { day: 1, improving: "Ready to see if this helps", struggling: "Still sore from yesterday's workout" },
      { day: 7, improving: "Recovery feels slightly faster", struggling: "Hard to tell if it's working yet" },
      { day: 14, improving: "Able to hit PR on deadlift - feeling fresh", struggling: "Definitely recovering better" },
      { day: 21, improving: "Training 5x/week now without issue", struggling: "Consistent improvement in recovery" },
      { day: 28, improving: "Best training block I've had in a year", struggling: "Really pleased with the results" },
    ],
    keyQuotes: [
      { context: "Weekly check-in", quotes: [
        "Hit a PR on my tempo run - actually felt fresh going into it",
        "My WHOOP finally showed green recovery for 5 days straight",
        "I'm not dreading leg day anymore because I know I'll recover",
      ]},
      { context: "Final reflection", quotes: [
        "The data backs up how I feel - my recovery metrics are the best they've been.",
        "I was skeptical, but you can't argue with PRs and green recovery days.",
        "This is now a permanent part of my training stack.",
      ]},
    ],
    lifeStages: ["Competitive athlete", "Fitness enthusiast", "Weekend warrior", "CrossFit devotee"],
    wellnessGoals: ["Faster recovery", "Better performance", "More training capacity", "Reduce soreness"],
  },

  weight: {
    keywords: ["weight", "metabolism", "fat", "lean", "body composition", "appetite", "cravings"],
    villainVariables: ["stubborn weight", "slow metabolism", "cravings", "appetite control", "body composition"],
    metrics: {
      primary: { label: "Cravings intensity", unit: "score", beforeRange: [7, 9], changeRange: [-40, -60] },
      secondary: [
        { label: "Satiety", unit: "score", beforeRange: [4, 5], changeRange: [35, 55] },
        { label: "Energy stability", unit: "score", beforeRange: [4, 6], changeRange: [25, 40] },
        { label: "Metabolic markers", unit: "score", beforeRange: [50, 60], changeRange: [15, 25] },
      ],
    },
    motivations: [
      "I've tried every diet. The cravings always win. I need help with appetite control.",
      "My metabolism seems to have stalled. Nothing I do moves the needle.",
      "I eat healthy but still can't shake the last 10 pounds.",
      "I need something to support my metabolism while I work on my diet.",
    ],
    hopedResults: [
      "I want to stop thinking about food constantly.",
      "I'm hoping to feel satisfied with normal portion sizes.",
      "I'd love for my hard work in the gym to finally show.",
      "I want to support my metabolism naturally.",
    ],
    journeyNotes: [
      { day: 1, improving: "Starting fresh", struggling: "Same old cravings hit at 3pm" },
      { day: 7, improving: "Afternoon cravings seem less intense", struggling: "Maybe slightly better appetite control" },
      { day: 14, improving: "Skipped my usual stress snack without trying", struggling: "Noticing I'm less hungry overall" },
      { day: 21, improving: "Feel satisfied with smaller portions", struggling: "Definite change in my relationship with food" },
      { day: 28, improving: "Down a belt notch - and not from restriction", struggling: "Really pleased with the changes" },
    ],
    keyQuotes: [
      { context: "Weekly check-in", quotes: [
        "I walked past the office candy without even thinking about it",
        "My afternoon snack cravings have basically disappeared",
        "I'm finally eating because I'm hungry, not because I'm bored or stressed",
      ]},
      { context: "Final reflection", quotes: [
        "For the first time, I feel in control of my appetite rather than controlled by it.",
        "The changes were subtle at first but now they're unmistakable.",
        "This wasn't a quick fix - it was a genuine shift in how my body signals hunger.",
      ]},
    ],
    lifeStages: ["Post-pregnancy", "Desk job professional", "Pre-wedding", "Health transformation"],
    wellnessGoals: ["Better appetite control", "Support metabolism", "Reduce cravings", "Healthy body composition"],
  },
};

// Base participant templates for story generation
const PARTICIPANT_TEMPLATES = [
  { name: "Sarah M.", initials: "SM", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", ageRange: "25-34", baseRating: 4.8 },
  { name: "Emily R.", initials: "ER", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", ageRange: "25-34", baseRating: 4.5 },
  { name: "Mike T.", initials: "MT", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", ageRange: "35-44", baseRating: 4.9 },
  { name: "Lisa K.", initials: "LK", avatarUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop", ageRange: "35-44", baseRating: 4.6 },
  { name: "David H.", initials: "DH", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", ageRange: "45-54", baseRating: 4.7 },
  { name: "Jennifer W.", initials: "JW", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", ageRange: "25-34", baseRating: 4.4 },
];

// Detect health category from villain variable or product name
function detectHealthCategory(villainVariable: string, productName?: string): HealthCategory {
  const searchText = `${villainVariable} ${productName || ""}`.toLowerCase();

  // Check each category for keyword matches
  for (const [, category] of Object.entries(HEALTH_CATEGORIES)) {
    for (const keyword of category.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }

  // Default to sleep if no match (most common wellness category)
  return HEALTH_CATEGORIES.sleep;
}

// Generate a random value within a range
function randomInRange(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

// Generate wearable metrics based on category
function generateWearableMetrics(category: HealthCategory): ParticipantStory["wearableMetrics"] {
  const devices = ["Oura Ring", "Apple Watch", "WHOOP", "Garmin", "Fitbit"];
  const device = devices[Math.floor(Math.random() * devices.length)];

  const primaryBefore = randomInRange(category.metrics.primary.beforeRange[0], category.metrics.primary.beforeRange[1]);
  const primaryChange = randomInRange(category.metrics.primary.changeRange[0], category.metrics.primary.changeRange[1]);
  const primaryAfter = Math.round(primaryBefore * (1 + primaryChange / 100));

  const secondary = category.metrics.secondary[0];
  const secBefore = randomInRange(secondary.beforeRange[0], secondary.beforeRange[1]);
  const secChange = randomInRange(secondary.changeRange[0], secondary.changeRange[1]);
  const secAfter = Math.round(secBefore * (1 + secChange / 100));

  return {
    device,
    sleepChange: { before: primaryBefore, after: primaryAfter, unit: category.metrics.primary.unit, changePercent: primaryChange },
    deepSleepChange: { before: secBefore, after: secAfter, unit: secondary.unit, changePercent: secChange },
  };
}

// Generate participant stories dynamically based on study villain variable
export function generateParticipantStories(
  villainVariable: string,
  productName?: string,
  studyDurationDays: number = 28,
  count: number = 4
): ParticipantStory[] {
  const category = detectHealthCategory(villainVariable, productName);
  const stories: ParticipantStory[] = [];

  for (let i = 0; i < Math.min(count, PARTICIPANT_TEMPLATES.length); i++) {
    const template = PARTICIPANT_TEMPLATES[i];
    const villainVar = category.villainVariables[i % category.villainVariables.length];
    const motivation = category.motivations[i % category.motivations.length];
    const hopedResult = category.hopedResults[i % category.hopedResults.length];
    const lifeStage = category.lifeStages[i % category.lifeStages.length];
    const wellnessGoal = category.wellnessGoals[i % category.wellnessGoals.length];

    // Generate journey ratings with improvement trend
    const villainRatings = category.journeyNotes.map(note => ({
      day: note.day,
      rating: note.day === 1 ? 2 : note.day <= 7 ? (2 + Math.floor(Math.random() * 2)) : note.day <= 14 ? 3 : note.day <= 21 ? 4 : 5,
      note: Math.random() > 0.5 ? note.improving : note.struggling,
    }));

    // Pick random quotes from available options
    const keyQuotes = category.keyQuotes.flatMap(kq =>
      kq.quotes.slice(0, 1).map(quote => ({
        day: kq.context === "Final reflection" ? studyDurationDays : Math.floor(studyDurationDays / 2),
        quote,
        context: kq.context,
      }))
    ).slice(0, 2);

    const wearableMetrics = generateWearableMetrics(category);

    stories.push({
      id: `generated-story-${i + 1}`,
      name: template.name,
      initials: template.initials,
      avatarUrl: template.avatarUrl,
      profile: {
        ageRange: template.ageRange,
        lifeStage,
        primaryWellnessGoal: wellnessGoal,
        baselineStressLevel: randomInRange(5, 8),
      },
      baseline: {
        motivation,
        hopedResults: hopedResult,
        villainDuration: ["3-6 months", "6-12 months", "1+ years"][Math.floor(Math.random() * 3)],
        triedOther: ["Yes, 1-2 others", "Yes, several others", "No, this is my first"][Math.floor(Math.random() * 3)],
      },
      journey: {
        startDate: new Date(Date.now() - studyDurationDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        durationDays: studyDurationDays,
        villainVariable: villainVar,
        villainRatings,
        keyQuotes,
      },
      wearableMetrics,
      verified: true,
      verificationId: `2025-${100 + i}`,
      completedAt: new Date().toISOString().split("T")[0],
      overallRating: template.baseRating + (Math.random() * 0.4 - 0.2),
    });
  }

  return stories;
}

// Get stories for a specific study - generates contextual stories based on villain variable
export function getStoriesForStudy(
  villainVariable: string,
  productName?: string,
  studyDurationDays: number = 28
): ParticipantStory[] {
  const searchText = `${villainVariable} ${productName || ""}`.toLowerCase();

  // Check for non-sleep categories first (more specific)
  const nonSleepCategories = {
    digestion: ["digestion", "bloating", "gut", "stomach", "digestive", "morning routine", "regularity"],
    stress: ["stress", "anxiety", "calm", "relax", "cortisol", "mood", "mental"],
    energy: ["energy", "vitality", "focus", "productivity", "concentration"],
    fitness: ["fitness", "workout", "muscle", "strength", "athletic", "performance", "exercise"],
    weight: ["weight", "metabolism", "fat", "lean", "body composition", "appetite", "cravings"],
  };

  // Check if it matches a non-sleep category
  for (const [, keywords] of Object.entries(nonSleepCategories)) {
    if (keywords.some(kw => searchText.includes(kw))) {
      // Generate category-specific stories
      return generateParticipantStories(villainVariable, productName, studyDurationDays, 4);
    }
  }

  // Default: Check for sleep-related keywords - use hardcoded stories for these
  const sleepKeywords = ["sleep", "rest", "insomnia", "tired", "fatigue", "brain fog", "waking", "recovery"];
  const isSleepRelated = sleepKeywords.some(kw => searchText.includes(kw));

  if (isSleepRelated) {
    return MOCK_PARTICIPANT_STORIES;
  }

  // Fallback: generate stories based on whatever was provided
  return generateParticipantStories(villainVariable, productName, studyDurationDays, 4);
}
