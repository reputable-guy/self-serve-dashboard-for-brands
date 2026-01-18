// Sample Stories by Category
// Each category has predefined stories with appropriate villain variables and progress tracking
// These serve as end-to-end examples of what verification pages look like for each category

import { ParticipantStory } from "./mock-data";
import { TierLevel } from "./assessments";
import { createAssessmentResult } from "./generators/story-utils";

// Villain variable definitions per category
export interface VillainVariable {
  name: string;
  description: string;
  examples: string[];
}

export const VILLAIN_VARIABLES_BY_CATEGORY: Record<string, VillainVariable[]> = {
  sleep: [
    { name: "poor sleep quality", description: "Waking up feeling unrested", examples: ["light sleep", "frequent waking", "unrefreshing sleep"] },
    { name: "difficulty falling asleep", description: "Taking too long to fall asleep", examples: ["racing thoughts", "restlessness", "anxiety at bedtime"] },
    { name: "nighttime waking", description: "Waking up during the night", examples: ["3am wake-ups", "bathroom trips", "restless sleep"] },
    { name: "afternoon brain fog", description: "Mental fatigue despite sleep", examples: ["post-lunch crash", "inability to focus", "mental cloudiness"] },
  ],
  recovery: [
    { name: "poor recovery", description: "Not bouncing back from workouts", examples: ["persistent soreness", "low HRV", "fatigue after training"] },
    { name: "slow muscle recovery", description: "Extended soreness after exercise", examples: ["DOMS lasting days", "reduced performance", "overtraining symptoms"] },
    { name: "low energy after workouts", description: "Feeling drained instead of energized", examples: ["post-workout fatigue", "need for long rest periods"] },
  ],
  fitness: [
    { name: "performance plateau", description: "Not seeing improvement despite training", examples: ["stalled PRs", "no strength gains", "endurance stagnation"] },
    { name: "exercise fatigue", description: "Getting tired too quickly during workouts", examples: ["early burnout", "reduced stamina", "need for frequent breaks"] },
    { name: "low workout motivation", description: "Difficulty getting started", examples: ["gym avoidance", "lack of drive", "exercise procrastination"] },
  ],
  stress: [
    { name: "work-related anxiety", description: "Stress from job demands", examples: ["deadline pressure", "meeting anxiety", "email overwhelm"] },
    { name: "chronic stress", description: "Persistent feeling of being overwhelmed", examples: ["constant tension", "inability to relax", "stress eating"] },
    { name: "racing thoughts", description: "Mind won't quiet down", examples: ["overthinking", "worry loops", "mental restlessness"] },
  ],
  energy: [
    { name: "afternoon energy crash", description: "Energy drops significantly after lunch", examples: ["3pm slump", "post-meal fatigue", "need for caffeine"] },
    { name: "morning fatigue", description: "Difficulty getting going in the morning", examples: ["slow starts", "grogginess", "hitting snooze"] },
    { name: "inconsistent energy", description: "Unpredictable energy levels", examples: ["energy spikes and crashes", "unreliable stamina"] },
  ],
  focus: [
    { name: "difficulty concentrating", description: "Can't maintain focus on tasks", examples: ["easily distracted", "task switching", "mind wandering"] },
    { name: "mental fog", description: "Cloudy thinking and poor clarity", examples: ["slow processing", "forgetfulness", "confusion"] },
    { name: "attention issues", description: "Trouble staying on task", examples: ["short attention span", "inability to complete tasks"] },
  ],
  mood: [
    { name: "mood swings", description: "Unpredictable emotional changes", examples: ["irritability", "sudden sadness", "emotional volatility"] },
    { name: "low mood", description: "Persistent feelings of being down", examples: ["lack of joy", "apathy", "emotional flatness"] },
    { name: "emotional reactivity", description: "Overreacting to small things", examples: ["quick to anger", "sensitivity", "tearfulness"] },
  ],
  anxiety: [
    { name: "generalized anxiety", description: "Persistent worry about various things", examples: ["constant worry", "fear of worst case", "nervous tension"] },
    { name: "social anxiety", description: "Discomfort in social situations", examples: ["meeting dread", "fear of judgment", "avoidance"] },
    { name: "physical anxiety symptoms", description: "Body manifestations of anxiety", examples: ["racing heart", "sweaty palms", "stomach knots"] },
  ],
  pain: [
    { name: "chronic pain", description: "Persistent ongoing pain", examples: ["back pain", "joint pain", "neck stiffness"] },
    { name: "muscle tension", description: "Tight, uncomfortable muscles", examples: ["shoulder knots", "tight back", "tension headaches"] },
    { name: "inflammation", description: "Swelling and discomfort", examples: ["joint swelling", "soreness", "stiffness"] },
  ],
  gut: [
    { name: "bloating", description: "Uncomfortable abdominal distension", examples: ["post-meal bloat", "gas", "tight feeling"] },
    { name: "digestive discomfort", description: "General GI unease", examples: ["cramping", "nausea", "irregular bowel movements"] },
    { name: "food sensitivities", description: "Reactions to certain foods", examples: ["dairy issues", "gluten problems", "meal anxiety"] },
  ],
  skin: [
    { name: "acne breakouts", description: "Recurring skin blemishes", examples: ["hormonal acne", "stress breakouts", "cystic acne"] },
    { name: "dull skin", description: "Lack of healthy glow", examples: ["tired-looking skin", "uneven tone", "lack of radiance"] },
    { name: "skin irritation", description: "Redness and sensitivity", examples: ["rashes", "inflammation", "reactive skin"] },
  ],
  immunity: [
    { name: "frequent illness", description: "Getting sick often", examples: ["catching every cold", "slow recovery from illness", "low resistance"] },
    { name: "low energy from illness", description: "Feeling run down", examples: ["fatigue", "taking longer to recover", "susceptibility to bugs"] },
    { name: "seasonal vulnerability", description: "Getting sick during certain times", examples: ["flu season issues", "allergy susceptibility", "weather sensitivity"] },
  ],
  hair: [
    { name: "hair thinning", description: "Losing hair density", examples: ["visible scalp", "thinner ponytail", "receding hairline"] },
    { name: "hair shedding", description: "Excessive hair loss", examples: ["clumps in shower", "hair on pillow", "hair in brush"] },
    { name: "brittle hair", description: "Hair that breaks easily", examples: ["split ends", "breakage", "dryness"] },
  ],
  weight: [
    { name: "stubborn weight", description: "Weight that won't budge", examples: ["plateau", "resistant fat", "slow metabolism"] },
    { name: "cravings", description: "Intense urges for unhealthy foods", examples: ["sugar cravings", "emotional eating", "late-night snacking"] },
    { name: "appetite control", description: "Difficulty managing hunger", examples: ["overeating", "portion control", "constant hunger"] },
  ],
};

// Sample story for each category
export interface CategorySampleStory {
  category: string;
  categoryLabel: string;
  tier: TierLevel;
  villainVariable: string;
  story: ParticipantStory;
}

// ============================================
// SAMPLE STORIES BY CATEGORY
// ============================================

export const SAMPLE_STORIES_BY_CATEGORY: Record<string, CategorySampleStory> = {
  // ===== TIER 1: WEARABLES PRIMARY =====
  sleep: {
    category: "sleep",
    categoryLabel: "Sleep",
    tier: 1,
    villainVariable: "afternoon brain fog",
    story: {
      id: "sample-sleep-1",
      name: "Sarah M.",
      initials: "SM",
      tier: 1,
      profile: {
        ageRange: "35-44",
        lifeStage: "Parent with young children",
        primaryWellnessGoal: "Get better quality sleep despite busy schedule",
        baselineStressLevel: 7,
      },
      baseline: {
        motivation: "I was desperate to find something that actually worked for my afternoon crashes. After my second kid, my sleep just never recovered.",
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
      testimonialResponses: [
        { day: 1, question: "What's your biggest challenge with sleep right now?", response: "I wake up feeling exhausted no matter how long I sleep. The afternoons are the worst - complete brain fog." },
        { day: 30, question: "How has your sleep changed over the past month?", response: "Night and day difference! I'm actually waking up refreshed and the afternoon crashes are basically gone." },
        { day: 30, question: "What surprised you most about this experience?", response: "How quickly my wearable data reflected the changes I was feeling. The objective proof made it real." },
      ],
      verified: true,
      verificationId: "sample-sleep-001",
      completedAt: "2024-11-29",
      overallRating: 4.8,
    },
  },

  recovery: {
    category: "recovery",
    categoryLabel: "Recovery",
    tier: 1,
    villainVariable: "poor recovery",
    story: {
      id: "sample-recovery-1",
      name: "Emily R.",
      initials: "ER",
      tier: 1,
      profile: {
        ageRange: "25-34",
        lifeStage: "Early career professional",
        primaryWellnessGoal: "Improve recovery between workouts",
        baselineStressLevel: 6,
      },
      baseline: {
        motivation: "I'm training for a half marathon and my recovery has been terrible. I read that sleep quality matters more than hours.",
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
      testimonialResponses: [
        { day: 1, question: "What's your biggest challenge with recovery right now?", response: "I'm constantly sore and my WHOOP shows red recovery scores most days. It's limiting my training." },
        { day: 30, question: "How has your recovery changed over the past month?", response: "My recovery scores are consistently green now. I can train harder and more often without feeling broken." },
        { day: 30, question: "What surprised you most about this experience?", response: "How much better sleep quality affected my athletic performance. The HRV improvement was real." },
      ],
      verified: true,
      verificationId: "sample-recovery-001",
      completedAt: "2024-12-02",
      overallRating: 4.5,
    },
  },

  fitness: {
    category: "fitness",
    categoryLabel: "Fitness",
    tier: 1,
    villainVariable: "performance plateau",
    story: {
      id: "sample-fitness-1",
      name: "Mike T.",
      initials: "MT",
      tier: 1,
      profile: {
        ageRange: "35-44",
        lifeStage: "Established professional",
        primaryWellnessGoal: "Break through training plateau",
        baselineStressLevel: 5,
      },
      baseline: {
        motivation: "I've been stuck at the same weights for months. My recovery is fine but I'm just not progressing.",
        hopedResults: "Finally see some strength gains and feel stronger in my workouts.",
        villainDuration: "6-12 months",
        triedOther: "Yes, 1-2 others",
      },
      journey: {
        startDate: "2024-11-08",
        endDate: "2024-12-06",
        durationDays: 28,
        villainVariable: "performance plateau",
        villainRatings: [
          { day: 1, rating: 2, note: "Same old plateau, no progress this week" },
          { day: 7, rating: 2, note: "Maybe slightly more energy in workouts" },
          { day: 14, rating: 3, note: "Added 5lbs to my bench press" },
          { day: 21, rating: 4, note: "PRs on multiple lifts this week" },
          { day: 28, rating: 5, note: "Best training block in over a year" },
        ],
        keyQuotes: [
          { day: 14, quote: "I actually added weight to my bench for the first time in 4 months", context: "Check-in note" },
          { day: 28, quote: "The improvement in my training was consistent week over week. This is sustainable.", context: "Final note" },
        ],
      },
      wearableMetrics: {
        device: "Apple Watch",
        sleepChange: { before: 340, after: 402, unit: "min", changePercent: 18 },
        deepSleepChange: { before: 38, after: 49, unit: "min", changePercent: 28 },
        hrvChange: { before: 38, after: 44, unit: "ms", changePercent: 16 },
        restingHrChange: { before: 65, after: 61, unit: "bpm", changePercent: -6 },
      },
      testimonialResponses: [
        { day: 1, question: "What's your biggest challenge with fitness right now?", response: "I've hit a wall. Same weights, same reps, no progress for months despite consistent training." },
        { day: 30, question: "How has your fitness changed over the past month?", response: "I'm finally seeing progress again. PRs on multiple lifts and feeling stronger every week." },
        { day: 30, question: "What surprised you most about this experience?", response: "How much sleep quality was holding back my training. Better sleep = better gains, the data proves it." },
      ],
      verified: true,
      verificationId: "sample-fitness-001",
      completedAt: "2024-12-06",
      overallRating: 4.9,
    },
  },

  // ===== TIER 2: CO-PRIMARY =====
  stress: {
    category: "stress",
    categoryLabel: "Stress",
    tier: 2,
    villainVariable: "work-related anxiety",
    story: {
      id: "sample-stress-1",
      name: "Lisa K.",
      initials: "LK",
      tier: 2,
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
      assessmentResult: createAssessmentResult(
        "reputable-stress",
        "Reputable Stress Assessment",
        "Stress",
        42, // baseline composite
        71, // endpoint composite
        7,  // baseline raw (stress level 7/10 - high stress)
        3,  // endpoint raw (stress level 3/10 - low stress)
        10
      ),
      verified: true,
      verificationId: "sample-stress-001",
      completedAt: "2024-12-08",
      overallRating: 4.6,
    },
  },

  // ===== TIER 3: ASSESSMENT PRIMARY =====
  energy: {
    category: "energy",
    categoryLabel: "Energy",
    tier: 3,
    villainVariable: "afternoon energy crash",
    story: {
      id: "sample-energy-1",
      name: "David H.",
      initials: "DH",
      tier: 3,
      profile: {
        ageRange: "45-54",
        lifeStage: "Senior professional",
        primaryWellnessGoal: "Consistent energy throughout the day",
        baselineStressLevel: 6,
      },
      baseline: {
        motivation: "I hit a wall every afternoon around 2pm. Coffee doesn't help anymore. I need something sustainable.",
        hopedResults: "Consistent energy throughout the day without caffeine dependency.",
        villainDuration: "1+ years",
        triedOther: "Yes, several others",
      },
      journey: {
        startDate: "2024-11-05",
        endDate: "2024-12-03",
        durationDays: 28,
        villainVariable: "afternoon energy crash",
        villainRatings: [
          { day: 1, rating: 2, note: "Typical afternoon crash at 2pm" },
          { day: 7, rating: 2, note: "Maybe a bit more alert in the afternoon?" },
          { day: 14, rating: 3, note: "Noticeably more energy after lunch" },
          { day: 21, rating: 4, note: "Powered through a 4pm meeting easily" },
          { day: 28, rating: 5, note: "Have energy for evening workouts again!" },
        ],
        keyQuotes: [
          { day: 14, quote: "I actually went for a run after work - haven't done that in months", context: "Check-in note" },
          { day: 28, quote: "My 3pm slump is basically gone. I'm productive until 6pm now.", context: "Final reflection" },
        ],
      },
      // Tier 3: Activity-related wearable metrics as supporting evidence
      wearableMetrics: {
        device: "Apple Watch",
        sleepChange: { before: 0, after: 0, unit: "min", changePercent: 0 }, // Required field but not displayed
        stepsChange: { before: 4800, after: 7200, unit: "steps", changePercent: 50 },
        activeMinutesChange: { before: 25, after: 40, unit: "min", changePercent: 60 },
      },
      assessmentResult: createAssessmentResult(
        "reputable-energy",
        "Reputable Energy Assessment",
        "Energy",
        38, // baseline composite
        74, // endpoint composite
        4,  // baseline raw (energy level 4/10)
        8,  // endpoint raw (energy level 8/10)
        10
      ),
      verified: true,
      verificationId: "sample-energy-001",
      completedAt: "2024-12-03",
      overallRating: 4.7,
    },
  },

  focus: {
    category: "focus",
    categoryLabel: "Focus",
    tier: 3,
    villainVariable: "difficulty concentrating",
    story: {
      id: "sample-focus-1",
      name: "Jennifer W.",
      initials: "JW",
      tier: 3,
      profile: {
        ageRange: "25-34",
        lifeStage: "Graduate student",
        primaryWellnessGoal: "Better focus for studying",
        baselineStressLevel: 7,
      },
      baseline: {
        motivation: "I can't focus for more than 20 minutes without my mind wandering. My thesis is suffering.",
        hopedResults: "Longer periods of deep focus and less mental fatigue.",
        villainDuration: "6-12 months",
        triedOther: "Yes, 1-2 others",
      },
      journey: {
        startDate: "2024-11-12",
        endDate: "2024-12-10",
        durationDays: 28,
        villainVariable: "difficulty concentrating",
        villainRatings: [
          { day: 1, rating: 2, note: "Got distracted every 15 minutes today" },
          { day: 7, rating: 2, note: "Slightly better, maybe 25 min focus blocks" },
          { day: 14, rating: 3, note: "Did a 45-minute deep work session!" },
          { day: 21, rating: 4, note: "Focus feels sharper, less mind wandering" },
          { day: 28, rating: 4, note: "Consistently doing 1-hour focus blocks" },
        ],
        keyQuotes: [
          { day: 14, quote: "I wrote 2000 words in one sitting - that hasn't happened in months", context: "Check-in note" },
          { day: 28, quote: "My thesis advisor noticed the improvement in my work quality.", context: "Final reflection" },
        ],
      },
      wearableMetrics: {
        device: "Oura Ring",
        sleepChange: { before: 380, after: 410, unit: "min", changePercent: 8 },
        hrvChange: { before: 48, after: 55, unit: "ms", changePercent: 15 },
      },
      assessmentResult: createAssessmentResult(
        "reputable-focus",
        "Reputable Focus Assessment",
        "Focus",
        35, // baseline composite
        68, // endpoint composite
        3,  // baseline raw (focus level 3/10)
        7,  // endpoint raw (focus level 7/10)
        10
      ),
      verified: true,
      verificationId: "sample-focus-001",
      completedAt: "2024-12-10",
      overallRating: 4.4,
    },
  },

  mood: {
    category: "mood",
    categoryLabel: "Mood",
    tier: 3,
    villainVariable: "mood swings",
    story: {
      id: "sample-mood-1",
      name: "Amanda C.",
      initials: "AC",
      tier: 3,
      profile: {
        ageRange: "35-44",
        lifeStage: "Working parent",
        primaryWellnessGoal: "More stable mood throughout the day",
        baselineStressLevel: 8,
      },
      baseline: {
        motivation: "I'm irritable with my kids and snap at my partner. I know it's not their fault but I can't seem to control it.",
        hopedResults: "More emotional stability and patience with my family.",
        villainDuration: "6-12 months",
        triedOther: "Yes, 1-2 others",
      },
      journey: {
        startDate: "2024-11-15",
        endDate: "2024-12-13",
        durationDays: 28,
        villainVariable: "mood swings",
        villainRatings: [
          { day: 1, rating: 2, note: "Snapped at the kids again this morning" },
          { day: 7, rating: 2, note: "Still reactive but caught myself once" },
          { day: 14, rating: 3, note: "Had a stressful day but stayed calm" },
          { day: 21, rating: 4, note: "Partner noticed I'm more patient" },
          { day: 28, rating: 4, note: "Feel more in control of my reactions" },
        ],
        keyQuotes: [
          { day: 21, quote: "My husband asked what changed - I didn't yell once this weekend", context: "Check-in note" },
          { day: 28, quote: "I finally feel like the parent I want to be.", context: "Final reflection" },
        ],
      },
      wearableMetrics: {
        device: "Fitbit",
        sleepChange: { before: 350, after: 385, unit: "min", changePercent: 10 },
        hrvChange: { before: 32, after: 40, unit: "ms", changePercent: 25 },
      },
      assessmentResult: createAssessmentResult(
        "reputable-mood",
        "Reputable Mood Assessment",
        "Mood",
        40, // baseline composite
        72, // endpoint composite
        4,  // baseline raw (mood stability 4/10)
        8,  // endpoint raw (mood stability 8/10)
        10
      ),
      verified: true,
      verificationId: "sample-mood-001",
      completedAt: "2024-12-13",
      overallRating: 4.6,
    },
  },

  anxiety: {
    category: "anxiety",
    categoryLabel: "Anxiety",
    tier: 3,
    villainVariable: "generalized anxiety",
    story: {
      id: "sample-anxiety-1",
      name: "Mark S.",
      initials: "MS",
      tier: 3,
      profile: {
        ageRange: "25-34",
        lifeStage: "Young professional",
        primaryWellnessGoal: "Reduce daily anxiety levels",
        baselineStressLevel: 8,
      },
      baseline: {
        motivation: "I worry about everything - work, finances, relationships. It's exhausting and affecting my sleep.",
        hopedResults: "Feel calmer and less consumed by worry throughout the day.",
        villainDuration: "1+ years",
        triedOther: "Yes, 1-2 others",
      },
      journey: {
        startDate: "2024-11-10",
        endDate: "2024-12-08",
        durationDays: 28,
        villainVariable: "generalized anxiety",
        villainRatings: [
          { day: 1, rating: 2, note: "Couldn't stop worrying about presentation next week" },
          { day: 7, rating: 2, note: "Still anxious but maybe less intense" },
          { day: 14, rating: 3, note: "Had an anxious moment but recovered faster" },
          { day: 21, rating: 4, note: "Feeling noticeably calmer day-to-day" },
          { day: 28, rating: 4, note: "Worry doesn't spiral like it used to" },
        ],
        keyQuotes: [
          { day: 14, quote: "I caught myself worrying and was able to let it go - that's new", context: "Check-in note" },
          { day: 28, quote: "The constant background anxiety has quieted down significantly.", context: "Final reflection" },
        ],
      },
      wearableMetrics: {
        device: "Garmin",
        sleepChange: { before: 360, after: 395, unit: "min", changePercent: 10 },
        hrvChange: { before: 38, after: 46, unit: "ms", changePercent: 21 },
      },
      assessmentResult: createAssessmentResult(
        "reputable-anxiety",
        "Reputable Anxiety Assessment",
        "Anxiety",
        35, // baseline composite
        68, // endpoint composite
        8,  // baseline raw (anxiety level 8/10 - high)
        4,  // endpoint raw (anxiety level 4/10 - moderate)
        10
      ),
      verified: true,
      verificationId: "sample-anxiety-001",
      completedAt: "2024-12-08",
      overallRating: 4.5,
    },
  },

  pain: {
    category: "pain",
    categoryLabel: "Pain Management",
    tier: 3,
    villainVariable: "chronic pain",
    story: {
      id: "sample-pain-1",
      name: "Robert L.",
      initials: "RL",
      tier: 3,
      profile: {
        ageRange: "45-54",
        lifeStage: "Mid-career professional",
        primaryWellnessGoal: "Reduce chronic back pain",
        baselineStressLevel: 7,
      },
      baseline: {
        motivation: "My lower back pain has been limiting my activities. I want to be able to play with my kids without wincing.",
        hopedResults: "Less daily pain and more mobility for activities I love.",
        villainDuration: "1+ years",
        triedOther: "Yes, several others",
      },
      journey: {
        startDate: "2024-11-08",
        endDate: "2024-12-06",
        durationDays: 28,
        villainVariable: "chronic pain",
        villainRatings: [
          { day: 1, rating: 2, note: "Usual morning stiffness, pain by afternoon" },
          { day: 7, rating: 2, note: "Maybe slightly less intense today" },
          { day: 14, rating: 3, note: "Didn't need to take a break during work" },
          { day: 21, rating: 4, note: "Played catch with my son - minimal pain!" },
          { day: 28, rating: 4, note: "Pain is manageable and less frequent" },
        ],
        keyQuotes: [
          { day: 21, quote: "I threw a football with my son for 30 minutes without having to stop", context: "Check-in note" },
          { day: 28, quote: "I'm not pain-free, but I'm not limited by it anymore.", context: "Final reflection" },
        ],
      },
      wearableMetrics: {
        device: "Apple Watch",
        sleepChange: { before: 345, after: 385, unit: "min", changePercent: 12 },
        hrvChange: { before: 35, after: 42, unit: "ms", changePercent: 20 },
      },
      assessmentResult: createAssessmentResult(
        "reputable-pain",
        "Reputable Pain Assessment",
        "Pain Management",
        30, // baseline composite
        65, // endpoint composite
        7,  // baseline raw (pain level 7/10 - significant)
        4,  // endpoint raw (pain level 4/10 - moderate)
        10
      ),
      verified: true,
      verificationId: "sample-pain-001",
      completedAt: "2024-12-06",
      overallRating: 4.4,
    },
  },

  // ===== TIER 4: ASSESSMENT ONLY =====
  gut: {
    category: "gut",
    categoryLabel: "Gut Health",
    tier: 4,
    villainVariable: "bloating",
    story: {
      id: "sample-gut-1",
      name: "Rachel P.",
      initials: "RP",
      tier: 4,
      profile: {
        ageRange: "25-34",
        lifeStage: "Young professional",
        primaryWellnessGoal: "Reduce bloating and digestive discomfort",
        baselineStressLevel: 5,
      },
      baseline: {
        motivation: "I'm bloated after almost every meal. It's uncomfortable and embarrassing. I've tried eliminating foods but nothing helps.",
        hopedResults: "Eat without worrying about bloating afterward.",
        villainDuration: "1+ years",
        triedOther: "Yes, several others",
      },
      journey: {
        startDate: "2024-11-18",
        endDate: "2024-12-16",
        durationDays: 28,
        villainVariable: "bloating",
        villainRatings: [
          { day: 1, rating: 2, note: "Usual bloating after lunch" },
          { day: 7, rating: 2, note: "Maybe slightly less bloated?" },
          { day: 14, rating: 3, note: "Digestion feels smoother" },
          { day: 21, rating: 4, note: "My pants fit better - less bloat!" },
          { day: 28, rating: 5, note: "Feel like a different person" },
        ],
        keyQuotes: [
          { day: 14, quote: "I actually wore my fitted jeans to dinner without worrying", context: "Check-in note" },
          { day: 28, quote: "The difference in my digestion is night and day. I wish I'd found this sooner.", context: "Final reflection" },
        ],
      },
      // No wearableMetrics for tier 4 (assessment-only)
      assessmentResult: createAssessmentResult(
        "reputable-gut",
        "Reputable Gut Health Assessment",
        "Gut Health",
        32, // baseline composite
        78, // endpoint composite
        3,  // baseline raw (gut comfort 3/10)
        8,  // endpoint raw (gut comfort 8/10)
        10
      ),
      verified: true,
      verificationId: "sample-gut-001",
      completedAt: "2024-12-16",
      overallRating: 4.8,
    },
  },

  skin: {
    category: "skin",
    categoryLabel: "Skin Health",
    tier: 4,
    villainVariable: "acne breakouts",
    story: {
      id: "sample-skin-1",
      name: "Olivia M.",
      initials: "OM",
      tier: 4,
      profile: {
        ageRange: "25-34",
        lifeStage: "Young professional",
        primaryWellnessGoal: "Clearer skin with fewer breakouts",
        baselineStressLevel: 6,
      },
      baseline: {
        motivation: "I'm in my 30s and still dealing with acne. It affects my confidence at work.",
        hopedResults: "Fewer breakouts and clearer skin overall.",
        villainDuration: "1+ years",
        triedOther: "Yes, several others",
      },
      journey: {
        startDate: "2024-11-20",
        endDate: "2024-12-18",
        durationDays: 28,
        villainVariable: "acne breakouts",
        villainRatings: [
          { day: 1, rating: 2, note: "New breakout this morning" },
          { day: 7, rating: 2, note: "Same as usual, nothing new" },
          { day: 14, rating: 3, note: "No new breakouts this week" },
          { day: 21, rating: 4, note: "Skin is looking clearer" },
          { day: 28, rating: 4, note: "Coworker asked about my skincare routine" },
        ],
        keyQuotes: [
          { day: 21, quote: "For the first time in years I went to work without concealer", context: "Check-in note" },
          { day: 28, quote: "My skin hasn't been this clear since college.", context: "Final reflection" },
        ],
      },
      // No wearableMetrics for tier 4 (assessment-only)
      assessmentResult: createAssessmentResult(
        "reputable-skin",
        "Reputable Skin Health Assessment",
        "Skin Health",
        35, // baseline composite
        75, // endpoint composite
        3,  // baseline raw (skin clarity 3/10)
        8,  // endpoint raw (skin clarity 8/10)
        10
      ),
      photoDocumentation: {
        beforePhoto: "placeholder-before.jpg",
        afterPhoto: "placeholder-after.jpg",
      },
      verified: true,
      verificationId: "sample-skin-001",
      completedAt: "2024-12-18",
      overallRating: 4.5,
    },
  },

  weight: {
    category: "weight",
    categoryLabel: "Weight Management",
    tier: 4,
    villainVariable: "cravings",
    story: {
      id: "sample-weight-1",
      name: "Chris B.",
      initials: "CB",
      tier: 4,
      profile: {
        ageRange: "35-44",
        lifeStage: "Busy professional",
        primaryWellnessGoal: "Better appetite control",
        baselineStressLevel: 7,
      },
      baseline: {
        motivation: "I've tried every diet. The cravings always win. I need help with appetite control, not willpower.",
        hopedResults: "Feel satisfied with normal portions and stop thinking about food constantly.",
        villainDuration: "1+ years",
        triedOther: "Yes, several others",
      },
      journey: {
        startDate: "2024-11-22",
        endDate: "2024-12-20",
        durationDays: 28,
        villainVariable: "cravings",
        villainRatings: [
          { day: 1, rating: 2, note: "Same old 3pm snack cravings" },
          { day: 7, rating: 2, note: "Cravings seem slightly less intense" },
          { day: 14, rating: 3, note: "Skipped my usual stress snack" },
          { day: 21, rating: 4, note: "Feel satisfied with smaller portions" },
          { day: 28, rating: 5, note: "Down a belt notch - not from restriction" },
        ],
        keyQuotes: [
          { day: 14, quote: "I walked past the office candy without even thinking about it", context: "Check-in note" },
          { day: 28, quote: "For the first time, I feel in control of my appetite rather than controlled by it.", context: "Final reflection" },
        ],
      },
      // No wearableMetrics for tier 4 (assessment-only)
      assessmentResult: createAssessmentResult(
        "reputable-weight",
        "Reputable Weight Management Assessment",
        "Weight Management",
        38, // baseline composite
        78, // endpoint composite
        3,  // baseline raw (appetite control 3/10 - poor)
        8,  // endpoint raw (appetite control 8/10 - good)
        10
      ),
      verified: true,
      verificationId: "sample-weight-001",
      completedAt: "2024-12-20",
      overallRating: 4.7,
    },
  },

  immunity: {
    category: "immunity",
    categoryLabel: "Immune Support",
    tier: 4,
    villainVariable: "frequent illness",
    story: {
      id: "sample-immunity-1",
      name: "Karen T.",
      initials: "KT",
      tier: 4,
      profile: {
        ageRange: "45-54",
        lifeStage: "Parent with school-age children",
        primaryWellnessGoal: "Stay healthy and avoid getting sick so often",
        baselineStressLevel: 6,
      },
      baseline: {
        motivation: "I catch every cold my kids bring home. I'm tired of being sick every month during flu season.",
        hopedResults: "Build up my immune system so I don't get knocked out by every bug.",
        villainDuration: "1+ years",
        triedOther: "Yes, 1-2 others",
      },
      journey: {
        startDate: "2024-11-01",
        endDate: "2024-11-29",
        durationDays: 28,
        villainVariable: "frequent illness",
        villainRatings: [
          { day: 1, rating: 2, note: "Kids brought home a cold, I feel it coming" },
          { day: 7, rating: 3, note: "Fought it off! Just a mild sniffle" },
          { day: 14, rating: 3, note: "Feeling more resilient overall" },
          { day: 21, rating: 4, note: "Another virus at school, I stayed healthy" },
          { day: 28, rating: 5, note: "First November without getting sick!" },
        ],
        keyQuotes: [
          { day: 21, quote: "Both kids were sick last week and I didn't catch it - that never happens", context: "Check-in note" },
          { day: 28, quote: "For the first time in years, I made it through November without a single sick day.", context: "Final reflection" },
        ],
      },
      // No wearableMetrics for tier 4 (assessment-only)
      assessmentResult: createAssessmentResult(
        "reputable-immunity",
        "Reputable Immune Health Assessment",
        "Immune Support",
        40, // baseline composite
        75, // endpoint composite
        4,  // baseline raw (immune resilience 4/10)
        8,  // endpoint raw (immune resilience 8/10)
        10
      ),
      verified: true,
      verificationId: "sample-immunity-001",
      completedAt: "2024-11-29",
      overallRating: 4.6,
    },
  },

  hair: {
    category: "hair",
    categoryLabel: "Hair Health",
    tier: 4,
    villainVariable: "hair thinning",
    story: {
      id: "sample-hair-1",
      name: "Jessica N.",
      initials: "JN",
      tier: 4,
      profile: {
        ageRange: "35-44",
        lifeStage: "Postpartum mother",
        primaryWellnessGoal: "Reduce hair shedding and improve hair health",
        baselineStressLevel: 7,
      },
      baseline: {
        motivation: "My hair has been falling out since having my baby. I'm finding clumps in the shower and it's really getting to me.",
        hopedResults: "Less shedding and hopefully some regrowth or at least fuller-looking hair.",
        villainDuration: "6-12 months",
        triedOther: "Yes, 1-2 others",
      },
      journey: {
        startDate: "2024-11-05",
        endDate: "2024-12-03",
        durationDays: 28,
        villainVariable: "hair thinning",
        villainRatings: [
          { day: 1, rating: 2, note: "Same amount of hair in the drain today" },
          { day: 7, rating: 2, note: "Maybe slightly less shedding?" },
          { day: 14, rating: 3, note: "Noticeably less hair in my brush" },
          { day: 21, rating: 4, note: "My hairdresser noticed new growth!" },
          { day: 28, rating: 4, note: "Hair feels thicker and stronger" },
        ],
        keyQuotes: [
          { day: 21, quote: "My stylist pointed out baby hairs growing in - I was so happy I almost cried", context: "Check-in note" },
          { day: 28, quote: "I don't dread the shower anymore. The shedding is so much better.", context: "Final reflection" },
        ],
      },
      // No wearableMetrics for tier 4 (assessment-only)
      assessmentResult: createAssessmentResult(
        "reputable-hair",
        "Reputable Hair Health Assessment",
        "Hair Health",
        35, // baseline composite
        70, // endpoint composite
        3,  // baseline raw (hair health 3/10)
        7,  // endpoint raw (hair health 7/10)
        10
      ),
      photoDocumentation: {
        beforePhoto: "placeholder-before.jpg",
        afterPhoto: "placeholder-after.jpg",
      },
      verified: true,
      verificationId: "sample-hair-001",
      completedAt: "2024-12-03",
      overallRating: 4.5,
    },
  },
};

// Get sample story for a category
export function getSampleStoryForCategory(category: string): CategorySampleStory | undefined {
  return SAMPLE_STORIES_BY_CATEGORY[category.toLowerCase()];
}

// Get all sample stories
export function getAllSampleStories(): CategorySampleStory[] {
  return Object.values(SAMPLE_STORIES_BY_CATEGORY);
}

// Get sample stories by tier
export function getSampleStoriesByTier(tier: TierLevel): CategorySampleStory[] {
  return Object.values(SAMPLE_STORIES_BY_CATEGORY).filter(s => s.tier === tier);
}

// Get villain variables for a category
export function getVillainVariablesForCategory(category: string): VillainVariable[] {
  return VILLAIN_VARIABLES_BY_CATEGORY[category.toLowerCase()] || [];
}
