// Sensate - Demo Verified Stories
// These stories demonstrate the type of verified evidence Sensate can expect from Reputable
// Aligned with their marketing claims:
// - "Cut Stress by 48% in 28 days"
// - "Fall asleep 50% faster"
// - "Get 45-60 more minutes of quality sleep"
// - "Relieve anxieties and improve focus"
// - "10-minute vagus nerve device"

import { ParticipantStory } from "./types";
import { TierLevel } from "./assessments";
import {
  createAssessmentResult,
  BrandStudyStats,
  getStoriesForStudy,
  getStudyStats,
} from "./generators/story-utils";

// ============================================
// SENSATE STRESS RELIEF STUDY - SAMPLE STORIES
// Focus: "Cut Stress by 48% in 28 days"
// ============================================

export const SENSATE_STRESS_STORIES: ParticipantStory[] = [
  {
    id: "sensate-stress-1",
    name: "Amanda K.",
    initials: "AK",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "35-44",
      lifeStage: "High-pressure executive managing a growing team",
      primaryWellnessGoal: "Find a sustainable way to manage work stress",
      baselineStressLevel: 8,
    },
    baseline: {
      motivation: "My stress was through the roof. Constant meetings, endless emails, and I couldn't switch off. My Garmin showed elevated stress levels 80% of the day.",
      hopedResults: "I needed something quick and effective - 10 minutes sounded manageable even on my busiest days.",
      villainDuration: "1+ years",
      triedOther: "Yes, meditation apps, breathing exercises, supplements",
    },
    journey: {
      startDate: "2024-10-15",
      endDate: "2024-11-12",
      durationDays: 28,
      villainVariable: "chronic work stress",
      villainRatings: [
        { day: 1, rating: 2, note: "Stress levels still high. First session felt unusual but calming." },
        { day: 7, rating: 3, note: "Noticed I'm less reactive to stressful emails. Taking things in stride better." },
        { day: 14, rating: 4, note: "My team commented that I seem calmer. Stress score on Garmin dropping." },
        { day: 21, rating: 4, note: "Using Sensate before big meetings. Feeling more composed and clear-headed." },
        { day: 28, rating: 5, note: "Stress is down significantly. I actually look forward to my 10 minutes of calm." },
      ],
      keyQuotes: [
        { day: 14, quote: "My COO asked if I'd changed something - apparently I seem 'less intense' in meetings. That's a first.", context: "Week 2 check-in" },
        { day: 28, quote: "48% reduction in stress according to my assessment. My wearable data backs it up - HRV is the best it's been in years.", context: "Final reflection" },
      ],
    },
    // Tier 2: Wearable + Assessment co-primary
    wearableMetrics: {
      device: "Garmin Venu 3",
      sleepChange: { before: 365, after: 415, unit: "min", changePercent: 14 },
      hrvChange: { before: 38, after: 56, unit: "ms", changePercent: 47 },
    },
    assessmentResult: createAssessmentResult(
      "reputable-stress",
      "Reputable Stress Assessment",
      "Stress Management",
      32, // baseline composite (high stress = low score)
      72, // endpoint composite (low stress = high score)
      8,  // baseline raw (stress level 8/10 - high)
      4,  // endpoint raw (stress level 4/10 - low)
      10,
      false // lower stress is better
    ),
    verified: true,
    verificationId: "SENSATE-STRESS-001",
    completedAt: "2024-11-12",
    overallRating: 4.9,
  },
  {
    id: "sensate-stress-2",
    name: "Marcus J.",
    initials: "MJ",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "45-54",
      lifeStage: "Startup founder managing investor relations",
      primaryWellnessGoal: "Lower stress without medication",
      baselineStressLevel: 9,
    },
    baseline: {
      motivation: "Running a startup is non-stop stress. My doctor was suggesting anxiety medication but I wanted to try something natural first. The vagus nerve science convinced me.",
      hopedResults: "I wanted to feel calm in high-pressure situations without feeling sedated or foggy.",
      villainDuration: "1+ years",
      triedOther: "Yes, therapy, meditation, adaptogens",
    },
    journey: {
      startDate: "2024-10-15",
      endDate: "2024-11-12",
      durationDays: 28,
      villainVariable: "founder anxiety",
      villainRatings: [
        { day: 1, rating: 2, note: "Investor meeting stress still brutal. But the Sensate session helped me decompress after." },
        { day: 7, rating: 3, note: "Using it before pitch calls. Feeling more grounded and present." },
        { day: 14, rating: 4, note: "Board meeting went smoothly - stayed calm when challenged on numbers." },
        { day: 21, rating: 4, note: "My WHOOP recovery scores are improving alongside my stress levels." },
        { day: 28, rating: 5, note: "I'm handling pressure better. Making better decisions because I'm not reactive." },
      ],
      keyQuotes: [
        { day: 21, quote: "I stayed completely calm during a tough investor negotiation. That would have destroyed me a month ago.", context: "Week 3 check-in" },
        { day: 28, quote: "My doctor was impressed by my HRV improvement. Considering it a viable alternative to medication now.", context: "Final reflection" },
      ],
    },
    wearableMetrics: {
      device: "WHOOP 4.0",
      sleepChange: { before: 350, after: 408, unit: "min", changePercent: 17 },
      hrvChange: { before: 35, after: 52, unit: "ms", changePercent: 49 },
    },
    assessmentResult: createAssessmentResult(
      "reputable-stress",
      "Reputable Stress Assessment",
      "Stress Management",
      28, // baseline composite
      68, // endpoint composite
      9,  // baseline raw (stress level 9/10)
      4,  // endpoint raw (stress level 4/10)
      10,
      false
    ),
    verified: true,
    verificationId: "SENSATE-STRESS-002",
    completedAt: "2024-11-12",
    overallRating: 4.8,
  },
  {
    id: "sensate-stress-3",
    name: "Elena P.",
    initials: "EP",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "25-34",
      lifeStage: "Healthcare professional with demanding shifts",
      primaryWellnessGoal: "Decompress after stressful shifts",
      baselineStressLevel: 8,
    },
    baseline: {
      motivation: "ER nursing means constant stress. I come home wired and can't relax. My body stays in fight-or-flight mode even when I'm off the clock.",
      hopedResults: "I wanted something that could help me transition from work mode to rest mode quickly.",
      villainDuration: "6-12 months",
      triedOther: "Yes, hot baths, wine (not sustainable), yoga",
    },
    journey: {
      startDate: "2024-10-15",
      endDate: "2024-11-12",
      durationDays: 28,
      villainVariable: "post-shift stress",
      villainRatings: [
        { day: 1, rating: 2, note: "Used Sensate after a tough shift. Felt something shift in my body - hard to describe." },
        { day: 7, rating: 3, note: "Using it in my car before driving home. Arriving calmer." },
        { day: 14, rating: 4, note: "My transition from work to home is so much smoother now." },
        { day: 21, rating: 4, note: "Colleagues asking how I stay so calm. The vibrations really activate something." },
        { day: 28, rating: 5, note: "I can actually relax after work now. Game changer for healthcare workers." },
      ],
      keyQuotes: [
        { day: 14, quote: "I stopped snapping at my partner after work. The difference in my nervous system state is real.", context: "Week 2 check-in" },
        { day: 28, quote: "10 minutes in my car after my shift, and I'm a different person walking through my front door.", context: "Final reflection" },
      ],
    },
    wearableMetrics: {
      device: "Apple Watch Ultra",
      sleepChange: { before: 340, after: 395, unit: "min", changePercent: 16 },
      hrvChange: { before: 40, after: 58, unit: "ms", changePercent: 45 },
    },
    assessmentResult: createAssessmentResult(
      "reputable-stress",
      "Reputable Stress Assessment",
      "Stress Management",
      35, // baseline composite
      75, // endpoint composite
      8,  // baseline raw (stress level 8/10)
      3,  // endpoint raw (stress level 3/10)
      10,
      false
    ),
    verified: true,
    verificationId: "SENSATE-STRESS-003",
    completedAt: "2024-11-12",
    overallRating: 4.9,
  },
];

// ============================================
// SENSATE SLEEP QUALITY STUDY - SAMPLE STORIES
// Focus: "Fall asleep 50% faster, get 45-60 more minutes of quality sleep"
// ============================================

export const SENSATE_SLEEP_STORIES: ParticipantStory[] = [
  {
    id: "sensate-sleep-1",
    name: "Thomas R.",
    initials: "TR",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "35-44",
      lifeStage: "Tech executive with racing mind at bedtime",
      primaryWellnessGoal: "Fall asleep faster and stop ruminating",
      baselineStressLevel: 7,
    },
    baseline: {
      motivation: "I'd lie in bed for hours with my mind racing. Work problems, tomorrow's meetings, random anxieties. My Oura showed I was taking 45+ minutes to fall asleep.",
      hopedResults: "I wanted to quiet my mind at night and fall asleep like a normal person.",
      villainDuration: "1+ years",
      triedOther: "Yes, melatonin, magnesium, sleep apps, white noise",
    },
    journey: {
      startDate: "2024-11-20",
      endDate: "2024-12-18",
      durationDays: 28,
      villainVariable: "racing thoughts at bedtime",
      villainRatings: [
        { day: 1, rating: 2, note: "Used Sensate before bed. Mind still racing but body felt calmer." },
        { day: 7, rating: 3, note: "Sleep latency down to 25 minutes. Progress!" },
        { day: 14, rating: 4, note: "Falling asleep in under 20 minutes most nights. Mind is quieter." },
        { day: 21, rating: 4, note: "Oura showing consistent improvement. Deep sleep also up." },
        { day: 28, rating: 5, note: "15-minute sleep latency on average. This is life-changing." },
      ],
      keyQuotes: [
        { day: 14, quote: "For the first time in years, I'm not dreading bedtime. The racing thoughts just... stop.", context: "Week 2 check-in" },
        { day: 28, quote: "I went from 45+ minutes to fall asleep to about 15 minutes. My wife can't believe the difference.", context: "Final reflection" },
      ],
    },
    wearableMetrics: {
      device: "Oura Ring Gen 3",
      sleepChange: { before: 355, after: 425, unit: "min", changePercent: 20 },
      deepSleepChange: { before: 42, after: 68, unit: "min", changePercent: 62 },
      hrvChange: { before: 45, after: 58, unit: "ms", changePercent: 29 },
    },
    assessmentResult: createAssessmentResult(
      "reputable-sleep",
      "Reputable Sleep Assessment",
      "Sleep Quality",
      38, // baseline composite
      82, // endpoint composite
      4,  // baseline raw (sleep quality 4/10)
      9,  // endpoint raw (sleep quality 9/10)
      10,
      true
    ),
    verified: true,
    verificationId: "SENSATE-SLEEP-001",
    completedAt: "2024-12-18",
    overallRating: 4.9,
  },
  {
    id: "sensate-sleep-2",
    name: "Lisa H.",
    initials: "LH",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "45-54",
      lifeStage: "Working parent with sleep quality issues",
      primaryWellnessGoal: "Get more deep, restorative sleep",
      baselineStressLevel: 6,
    },
    baseline: {
      motivation: "I was sleeping 7 hours but waking up exhausted. My WHOOP showed terrible recovery - mostly light sleep, almost no deep sleep. I felt like I was running on empty.",
      hopedResults: "I wanted to wake up feeling actually rested, not just like I'd been unconscious.",
      villainDuration: "6-12 months",
      triedOther: "Yes, sleep supplements, sleep hygiene protocols",
    },
    journey: {
      startDate: "2024-11-20",
      endDate: "2024-12-18",
      durationDays: 28,
      villainVariable: "poor sleep quality",
      villainRatings: [
        { day: 1, rating: 2, note: "Still tired in the morning but Sensate session was deeply relaxing." },
        { day: 7, rating: 3, note: "WHOOP showing slightly better deep sleep. Feeling a bit more rested." },
        { day: 14, rating: 4, note: "Deep sleep up significantly. Waking up feeling noticeably better." },
        { day: 21, rating: 4, note: "Getting 70+ minutes of deep sleep now. Energy during the day is transformed." },
        { day: 28, rating: 5, note: "Sleep quality is completely different. I feel like a different person." },
      ],
      keyQuotes: [
        { day: 21, quote: "My WHOOP recovery went from consistently red to mostly green. The deep sleep increase is remarkable.", context: "Week 3 check-in" },
        { day: 28, quote: "I'm getting almost an hour more of actual restorative sleep. The tiredness that defined my life is gone.", context: "Final reflection" },
      ],
    },
    wearableMetrics: {
      device: "WHOOP 4.0",
      sleepChange: { before: 380, after: 435, unit: "min", changePercent: 14 },
      deepSleepChange: { before: 35, after: 72, unit: "min", changePercent: 106 },
      hrvChange: { before: 42, after: 55, unit: "ms", changePercent: 31 },
    },
    assessmentResult: createAssessmentResult(
      "reputable-sleep",
      "Reputable Sleep Assessment",
      "Sleep Quality",
      35, // baseline composite
      78, // endpoint composite
      3,  // baseline raw (sleep quality 3/10)
      8,  // endpoint raw (sleep quality 8/10)
      10,
      true
    ),
    verified: true,
    verificationId: "SENSATE-SLEEP-002",
    completedAt: "2024-12-18",
    overallRating: 4.8,
  },
  {
    id: "sensate-sleep-3",
    name: "James W.",
    initials: "JW",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "25-34",
      lifeStage: "Entrepreneur with irregular schedule",
      primaryWellnessGoal: "Improve sleep consistency despite schedule",
      baselineStressLevel: 7,
    },
    baseline: {
      motivation: "My sleep schedule was all over the place. Late nights, early meetings across time zones. Even when I had time to sleep, I couldn't wind down.",
      hopedResults: "I wanted to be able to fall asleep on demand and get quality rest regardless of when I go to bed.",
      villainDuration: "1+ years",
      triedOther: "Yes, blue light blocking, sleep masks, various supplements",
    },
    journey: {
      startDate: "2024-11-20",
      endDate: "2024-12-18",
      durationDays: 28,
      villainVariable: "inability to wind down",
      villainRatings: [
        { day: 1, rating: 2, note: "Even late at night, mind was still going. Sensate helped but still took a while." },
        { day: 7, rating: 3, note: "Starting to associate Sensate with sleep. Body knows it's wind-down time." },
        { day: 14, rating: 4, note: "Can switch off much faster now. 10 minutes of Sensate = ready for sleep." },
        { day: 21, rating: 4, note: "Even with a 2am bedtime, I fall asleep quickly and sleep well." },
        { day: 28, rating: 5, note: "Sensate is my 'off switch'. Works regardless of what time I go to bed." },
      ],
      keyQuotes: [
        { day: 14, quote: "I finally have a reliable way to shift from 'on' to 'off'. It's like a shutdown sequence for my brain.", context: "Week 2 check-in" },
        { day: 28, quote: "Whether I go to bed at 10pm or 2am, Sensate helps me fall asleep in 10-15 minutes. That flexibility is invaluable.", context: "Final reflection" },
      ],
    },
    wearableMetrics: {
      device: "Apple Watch Series 9",
      sleepChange: { before: 320, after: 395, unit: "min", changePercent: 23 },
      deepSleepChange: { before: 38, after: 62, unit: "min", changePercent: 63 },
      hrvChange: { before: 48, after: 62, unit: "ms", changePercent: 29 },
    },
    assessmentResult: createAssessmentResult(
      "reputable-sleep",
      "Reputable Sleep Assessment",
      "Sleep Quality",
      40, // baseline composite
      80, // endpoint composite
      4,  // baseline raw (sleep quality 4/10)
      8,  // endpoint raw (sleep quality 8/10)
      10,
      true
    ),
    verified: true,
    verificationId: "SENSATE-SLEEP-003",
    completedAt: "2024-12-18",
    overallRating: 4.7,
  },
];

// ============================================
// SENSATE ANXIETY & FOCUS STUDY - SAMPLE STORIES
// Focus: "Relieve anxieties and improve focus"
// ============================================

export const SENSATE_ANXIETY_STORIES: ParticipantStory[] = [
  {
    id: "sensate-anxiety-1",
    name: "Rachel M.",
    initials: "RM",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "25-34",
      lifeStage: "Graduate student with presentation anxiety",
      primaryWellnessGoal: "Manage anxiety without medication",
      baselineStressLevel: 8,
    },
    baseline: {
      motivation: "I have crippling anxiety before presentations and exams. My heart races, I can't think clearly, and sometimes I freeze up. I needed something to calm my nervous system.",
      hopedResults: "I wanted to feel calm and focused during high-pressure academic situations.",
      villainDuration: "1+ years",
      triedOther: "Yes, beta blockers (side effects), therapy, breathing techniques",
    },
    journey: {
      startDate: "2024-12-01",
      endDate: "2024-12-29",
      durationDays: 28,
      villainVariable: "performance anxiety",
      villainRatings: [
        { day: 1, rating: 2, note: "Still anxious about upcoming thesis defense. Sensate calming but temporary." },
        { day: 7, rating: 3, note: "Using it before practice presentations. Noticing less physical anxiety symptoms." },
        { day: 14, rating: 4, note: "Practiced my defense and actually felt composed. Heart rate stayed normal." },
        { day: 21, rating: 4, note: "Building resilience. Daily use is training my nervous system to stay calm." },
        { day: 28, rating: 5, note: "Defended my thesis successfully. Calm, focused, articulate. Sensate was key." },
      ],
      keyQuotes: [
        { day: 21, quote: "I realized the anxiety wasn't controlling me anymore. I could feel it trying to rise, but my body stayed calm.", context: "Week 3 check-in" },
        { day: 28, quote: "I defended my thesis without the usual panic. My committee commented on how composed I was. Inside, I was amazed.", context: "Final reflection" },
      ],
    },
    wearableMetrics: {
      device: "Fitbit Sense 2",
      // Anxiety studies only track HRV - not sleep metrics
      hrvChange: { before: 42, after: 58, unit: "ms", changePercent: 38 },
    },
    assessmentResult: createAssessmentResult(
      "reputable-anxiety",
      "Reputable Anxiety Assessment",
      "Anxiety Relief",
      30, // baseline composite (high anxiety = low score)
      75, // endpoint composite (low anxiety = high score)
      8,  // baseline raw (anxiety level 8/10 - high)
      3,  // endpoint raw (anxiety level 3/10 - low)
      10,
      false // lower anxiety is better
    ),
    verified: true,
    verificationId: "SENSATE-ANXIETY-001",
    completedAt: "2024-12-29",
    overallRating: 4.9,
  },
  {
    id: "sensate-anxiety-2",
    name: "Daniel F.",
    initials: "DF",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "35-44",
      lifeStage: "Creative professional with deadline pressure",
      primaryWellnessGoal: "Stay focused without anxiety spirals",
      baselineStressLevel: 7,
    },
    baseline: {
      motivation: "Deadlines trigger massive anxiety for me. I'd procrastinate, then panic, then produce mediocre work while stressed out of my mind. The cycle was exhausting.",
      hopedResults: "I wanted to approach deadlines with calm focus instead of frantic anxiety.",
      villainDuration: "6-12 months",
      triedOther: "Yes, CBD, meditation apps, time management systems",
    },
    journey: {
      startDate: "2024-12-01",
      endDate: "2024-12-29",
      durationDays: 28,
      villainVariable: "deadline anxiety",
      villainRatings: [
        { day: 1, rating: 2, note: "Big project deadline looming. Usual anxiety building. Started Sensate." },
        { day: 7, rating: 3, note: "Using it before deep work sessions. Less scattered, more focused." },
        { day: 14, rating: 4, note: "Deadline approaching but I'm calm. Working methodically instead of frantically." },
        { day: 21, rating: 4, note: "Delivered project early. First time that's happened in years." },
        { day: 28, rating: 5, note: "My relationship with deadlines has changed. They don't control me emotionally anymore." },
      ],
      keyQuotes: [
        { day: 14, quote: "I sat down to work on a tight deadline and felt... calm? That's never happened before.", context: "Week 2 check-in" },
        { day: 28, quote: "I'm producing my best work because I'm focused instead of anxious. The quality difference is obvious.", context: "Final reflection" },
      ],
    },
    wearableMetrics: {
      device: "Garmin Venu 2",
      // Anxiety studies only track HRV - not sleep metrics
      hrvChange: { before: 40, after: 55, unit: "ms", changePercent: 38 },
    },
    assessmentResult: createAssessmentResult(
      "reputable-anxiety",
      "Reputable Anxiety Assessment",
      "Anxiety Relief",
      35, // baseline composite
      72, // endpoint composite
      7,  // baseline raw (anxiety level 7/10)
      3,  // endpoint raw (anxiety level 3/10)
      10,
      false
    ),
    verified: true,
    verificationId: "SENSATE-ANXIETY-002",
    completedAt: "2024-12-29",
    overallRating: 4.8,
  },
  {
    id: "sensate-anxiety-3",
    name: "Sarah C.",
    initials: "SC",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "45-54",
      lifeStage: "Caregiver managing multiple responsibilities",
      primaryWellnessGoal: "Find moments of calm in chaos",
      baselineStressLevel: 9,
    },
    baseline: {
      motivation: "Caring for aging parents while working full-time, I was constantly anxious. Every phone call made my heart race. I couldn't find peace even when things were okay.",
      hopedResults: "I wanted to stop living in a constant state of high alert and find moments of genuine calm.",
      villainDuration: "1+ years",
      triedOther: "Yes, anxiety medication (didn't like side effects), therapy, exercise",
    },
    journey: {
      startDate: "2024-12-01",
      endDate: "2024-12-29",
      durationDays: 28,
      villainVariable: "constant hypervigilance",
      villainRatings: [
        { day: 1, rating: 2, note: "Always on edge. Sensate provided 10 minutes of actual calm. First peace in months." },
        { day: 7, rating: 3, note: "The calm is lasting longer after sessions. Less reactive to phone calls." },
        { day: 14, rating: 4, note: "Starting to recognize when I'm escalating and using Sensate to reset." },
        { day: 21, rating: 4, note: "My baseline anxiety is lower. I'm not starting each day already stressed." },
        { day: 28, rating: 5, note: "I can handle stressful situations and return to calm. That was impossible before." },
      ],
      keyQuotes: [
        { day: 14, quote: "I got a call from the nursing home and didn't panic. I stayed calm, dealt with it, and moved on. That's huge.", context: "Week 2 check-in" },
        { day: 28, quote: "I finally feel like I have some control over my nervous system. The constant anxiety doesn't rule my life anymore.", context: "Final reflection" },
      ],
    },
    wearableMetrics: {
      device: "Apple Watch SE",
      // Anxiety studies only track HRV - not sleep metrics
      hrvChange: { before: 35, after: 50, unit: "ms", changePercent: 43 },
    },
    assessmentResult: createAssessmentResult(
      "reputable-anxiety",
      "Reputable Anxiety Assessment",
      "Anxiety Relief",
      25, // baseline composite (very high anxiety)
      70, // endpoint composite
      9,  // baseline raw (anxiety level 9/10)
      4,  // endpoint raw (anxiety level 4/10)
      10,
      false
    ),
    verified: true,
    verificationId: "SENSATE-ANXIETY-003",
    completedAt: "2024-12-29",
    overallRating: 4.9,
  },
];

// ============================================
// AGGREGATE DATA FOR DISPLAY
// ============================================

// Re-export BrandStudyStats as SensateStudyStats for backwards compatibility
export type SensateStudyStats = BrandStudyStats;

export const SENSATE_STUDY_STATS: SensateStudyStats[] = [
  {
    studyId: "study-sensate-stress",
    studyName: "Sensate Stress Relief Study",
    category: "stress",
    participants: 48,
    completionRate: 92,
    averageImprovement: 48, // Matches their "48% stress reduction" claim
    topHeadline: "92% of participants reported significant stress reduction with HRV improvements averaging 47%",
    stories: SENSATE_STRESS_STORIES,
  },
  {
    studyId: "study-sensate-sleep",
    studyName: "Sensate Sleep Quality Study",
    category: "sleep",
    participants: 35,
    completionRate: 88,
    averageImprovement: 55, // Sleep latency and deep sleep improvements
    topHeadline: "86% of participants fell asleep faster with an average of 52 additional minutes of deep sleep",
    stories: SENSATE_SLEEP_STORIES,
  },
  {
    studyId: "study-sensate-anxiety",
    studyName: "Sensate Anxiety & Focus Study",
    category: "anxiety",
    participants: 28,
    completionRate: 85,
    averageImprovement: 58, // Anxiety reduction
    topHeadline: "89% of participants reported reduced anxiety with improved focus and emotional regulation",
    stories: SENSATE_ANXIETY_STORIES,
  },
];

// Combined array of all Sensate stories for easy lookup
export const ALL_SENSATE_STORIES: ParticipantStory[] = [
  ...SENSATE_STRESS_STORIES,
  ...SENSATE_SLEEP_STORIES,
  ...SENSATE_ANXIETY_STORIES,
];

// Get all Sensate stories
export function getAllSensateStories(): ParticipantStory[] {
  return ALL_SENSATE_STORIES;
}

// Get stories for a specific Sensate study
export function getSensateStoriesForStudy(studyId: string): ParticipantStory[] {
  return getStoriesForStudy(SENSATE_STUDY_STATS, studyId);
}

// Get study stats for Sensate
export function getSensateStudyStats(studyId: string): SensateStudyStats | undefined {
  return getStudyStats(SENSATE_STUDY_STATS, studyId);
}
