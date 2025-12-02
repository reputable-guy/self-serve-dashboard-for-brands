// Mock data for study dashboard preview and development
// This data is used when no real participants have enrolled

export interface MockParticipant {
  id: number;
  name: string;
  status: "active" | "completed" | "at-risk";
  day: number;
  compliance: number;
  lastActive: string;
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
  { id: 1, name: "Sarah M.", status: "active", day: 12, compliance: 95, lastActive: "2 hours ago" },
  { id: 2, name: "Mike T.", status: "active", day: 8, compliance: 88, lastActive: "5 hours ago" },
  { id: 3, name: "Emily R.", status: "completed", day: 28, compliance: 92, lastActive: "1 day ago" },
  { id: 4, name: "James L.", status: "active", day: 15, compliance: 78, lastActive: "3 hours ago" },
  { id: 5, name: "Lisa K.", status: "at-risk", day: 6, compliance: 45, lastActive: "3 days ago" },
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
