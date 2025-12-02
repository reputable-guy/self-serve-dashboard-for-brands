// Mock data for study dashboard preview and development
// This data is used when no real participants have enrolled

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
    questionType: "multiple_choice" | "text" | "voice_and_text";
    answer: string;
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
