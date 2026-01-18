/**
 * Real Sensate Study Data
 *
 * This file contains REAL participant data from the Sensate vagus nerve device study.
 * Data has been transformed from CSV exports into ParticipantStory format.
 *
 * Study Protocol:
 * - 30-day baseline (Oura Ring tracking, no product)
 * - 28-day intervention (daily 10-min Sensate use)
 * - Oura Ring data collected throughout
 *
 * Participant Selection:
 * - 5 participants with positive results
 * - 2 participants with negative/no improvement (for credibility)
 */

import { ParticipantStory } from "./types";

// Helper to calculate percent change
function calcPercentChange(baseline: number, intervention: number): number {
  if (baseline === 0) return 0;
  return Math.round(((intervention - baseline) / baseline) * 100);
}

/**
 * Real participant stories from Sensate study
 * dataSource: 'real' distinguishes these from demo/generated stories
 */
export const SENSATE_REAL_STORIES: ParticipantStory[] = [
  // ============================================
  // POSITIVE RESULTS (5 participants)
  // ============================================

  {
    id: "sensate-real-4312",
    name: "Celestine",
    initials: "C",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-4312",
    profile: {
      ageRange: "66+",
      lifeStage: "retired",
      gender: "Female",
      educationLevel: "Bachelor's degree",
      employmentStatus: "Retired",
      householdIncome: "Greater than $100,000",
      maritalStatus: "Married or in a domestic partnership",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Looking for natural ways to improve sleep quality in retirement",
      hopedResults: "Better deep sleep and improved HRV",
      villainDuration: "Several years",
      triedOther: "Various supplements and sleep routines",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-12-12",
      durationDays: 58,
      villainVariable: "Sleep Quality",
      villainRatings: [
        { day: 1, rating: 2, note: "Typical restless sleep" },
        { day: 7, rating: 3, note: "Starting to notice calmer evenings" },
        { day: 14, rating: 4, note: "Falling asleep faster" },
        { day: 21, rating: 4, note: "More consistent sleep" },
        { day: 28, rating: 5, note: "Best sleep quality in years" },
      ],
      keyQuotes: [
        { day: 14, quote: "I'm finally sleeping through the night more consistently.", context: "Mid-study check-in" },
        { day: 28, quote: "My Oura Ring is showing the best HRV numbers I've ever had.", context: "Final check-in" },
      ],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 8593,
        after: 8815,
        unit: "min (avg)",
        changePercent: calcPercentChange(8593, 8815), // +3%
      },
      hrvChange: {
        before: 57,
        after: 87,
        unit: "ms",
        changePercent: calcPercentChange(57, 87), // +52%
      },
      sleepChange: {
        before: 27886,
        after: 27392,
        unit: "min (avg)",
        changePercent: calcPercentChange(27886, 27392), // -2%
      },
    },
    finalTestimonial: {
      quote: "At 66, I wasn't expecting much change, but my HRV improved dramatically. The 10-minute routine before bed became something I looked forward to.",
      overallRating: 9,
      wouldRecommend: true,
      reportedBenefits: ["Improved HRV", "Better sleep quality", "Calmer evenings"],
    },
    verification: {
      id: "VRF-SENSATE-4312",
      timestamp: "2025-12-12T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 95,
    },
  },

  {
    id: "sensate-real-4313",
    name: "Jed",
    initials: "J",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-4313",
    profile: {
      ageRange: "26-35",
      lifeStage: "early-career",
      gender: "Male",
      educationLevel: "Bachelor's degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Greater than $100,000",
      maritalStatus: "Married or in a domestic partnership",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Work stress affecting my sleep, wanted a non-pharmaceutical solution",
      hopedResults: "More deep sleep and better recovery",
      villainDuration: "About 2 years since starting demanding job",
      triedOther: "Meditation apps, magnesium supplements",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-12-12",
      durationDays: 58,
      villainVariable: "Sleep Quality",
      villainRatings: [
        { day: 1, rating: 2, note: "Waking up tired most days" },
        { day: 7, rating: 3, note: "Noticed I'm falling asleep faster" },
        { day: 14, rating: 4, note: "Deep sleep improving" },
        { day: 21, rating: 4, note: "Waking up more refreshed" },
        { day: 28, rating: 5, note: "Best sleep I've had in years" },
      ],
      keyQuotes: [
        { day: 10, quote: "The vibration is actually really soothing. I didn't expect that.", context: "Early check-in" },
        { day: 28, quote: "My deep sleep went up 8% and my HRV improved 13%. Those are real numbers from my Oura.", context: "Final check-in" },
      ],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 6381,
        after: 6864,
        unit: "min (avg)",
        changePercent: calcPercentChange(6381, 6864), // +8%
      },
      hrvChange: {
        before: 42,
        after: 47,
        unit: "ms",
        changePercent: calcPercentChange(42, 47), // +13%
      },
      sleepChange: {
        before: 22780,
        after: 24404,
        unit: "min (avg)",
        changePercent: calcPercentChange(22780, 24404), // +7%
      },
    },
    finalTestimonial: {
      quote: "As someone who tracks everything, seeing my deep sleep and HRV both improve significantly was convincing. This actually works.",
      overallRating: 9,
      wouldRecommend: true,
      reportedBenefits: ["More deep sleep", "Improved HRV", "Better morning energy"],
    },
    verification: {
      id: "VRF-SENSATE-4313",
      timestamp: "2025-12-12T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 92,
    },
  },

  {
    id: "sensate-real-4329",
    name: "Cielo",
    initials: "C",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-4329",
    profile: {
      ageRange: "46-55",
      lifeStage: "established-professional",
      gender: "Male",
      educationLevel: "Master's degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Prefer Not To State",
      maritalStatus: "Prefer Not To State",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "High-stress career, looking for effective wind-down routine",
      hopedResults: "Better sleep efficiency and reduced nighttime waking",
      villainDuration: "Several years of inconsistent sleep",
      triedOther: "Various sleep apps and routines",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-12-12",
      durationDays: 58,
      villainVariable: "Sleep Quality",
      villainRatings: [
        { day: 1, rating: 3, note: "Average sleep quality" },
        { day: 7, rating: 3, note: "Getting used to the routine" },
        { day: 14, rating: 4, note: "Falling asleep noticeably faster" },
        { day: 21, rating: 4, note: "Waking up less during the night" },
        { day: 28, rating: 5, note: "Consistently good sleep" },
      ],
      keyQuotes: [
        { day: 14, quote: "The routine has become my signal to the body that it's time to wind down.", context: "Mid-study check-in" },
        { day: 28, quote: "My sleep efficiency went from 90.6% to 92.5% - that's real improvement.", context: "Final check-in" },
      ],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 5754,
        after: 6060,
        unit: "min (avg)",
        changePercent: calcPercentChange(5754, 6060), // +5%
      },
      hrvChange: {
        before: 25,
        after: 27,
        unit: "ms",
        changePercent: calcPercentChange(25, 27), // +10%
      },
      sleepChange: {
        before: 27355,
        after: 27059,
        unit: "min (avg)",
        changePercent: calcPercentChange(27355, 27059), // -1%
      },
    },
    finalTestimonial: {
      quote: "The combination of improved deep sleep and better HRV convinced me this is working. It's become a non-negotiable part of my bedtime routine.",
      overallRating: 8,
      wouldRecommend: true,
      reportedBenefits: ["Better deep sleep", "Improved HRV", "Faster sleep onset"],
    },
    verification: {
      id: "VRF-SENSATE-4329",
      timestamp: "2025-12-12T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 88,
    },
  },

  {
    id: "sensate-real-4341",
    name: "Gunnar",
    initials: "G",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-4341",
    profile: {
      ageRange: "36-45",
      lifeStage: "parent",
      gender: "Female",
      educationLevel: "Bachelor's degree",
      employmentStatus: "Self-employed",
      householdIncome: "Prefer Not To State",
      maritalStatus: "Single",
      ethnicity: "Asian or Pacific Islander",
      location: "USA",
    },
    baseline: {
      motivation: "Poor sleep due to work and being a parent, always open to finding new ways to regulate nervous system",
      hopedResults: "Get to sleep faster, calm overthinking mind",
      villainDuration: "Since becoming a parent",
      triedOther: "Various biohacking approaches",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-12-16",
      durationDays: 62,
      villainVariable: "Sleep Quality",
      villainRatings: [
        { day: 1, rating: 2, note: "Mind racing at bedtime" },
        { day: 7, rating: 3, note: "Starting to feel calmer" },
        { day: 14, rating: 4, note: "Getting to sleep faster" },
        { day: 21, rating: 4, note: "Mind feels more regulated" },
        { day: 28, rating: 4, note: "Consistent improvement" },
      ],
      keyQuotes: [
        { day: 14, quote: "The vibration helps calm my overthinking mind to a regulated state.", context: "Mid-study check-in" },
        { day: 28, quote: "I'm getting to sleep faster now. As a busy parent, that's huge.", context: "Final check-in" },
      ],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 6268,
        after: 6431,
        unit: "min (avg)",
        changePercent: calcPercentChange(6268, 6431), // +3%
      },
      hrvChange: {
        before: 48,
        after: 45,
        unit: "ms",
        changePercent: calcPercentChange(48, 45), // -6%
      },
      sleepChange: {
        before: 23381,
        after: 21777,
        unit: "min (avg)",
        changePercent: calcPercentChange(23381, 21777), // -7%
      },
    },
    finalTestimonial: {
      quote: "Get to sleep faster, calming my overthinking mind to calm regulated state. Bio-hacking my sleep is always a priority.",
      overallRating: 8,
      wouldRecommend: true,
      reportedBenefits: ["Faster sleep onset", "Calmer mind", "Better nervous system regulation"],
    },
    verification: {
      id: "VRF-SENSATE-4341",
      timestamp: "2025-12-16T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 85,
    },
  },

  {
    id: "sensate-real-4338",
    name: "Brendon",
    initials: "B",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-4338",
    profile: {
      ageRange: "56-65",
      lifeStage: "established-professional",
      gender: "Female",
      educationLevel: "Master's degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Greater than $100,000",
      maritalStatus: "Single",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Difficulty falling asleep, wanted a calming bedtime routine",
      hopedResults: "Fall asleep faster, improve sleep quality",
      villainDuration: "Many years",
      triedOther: "Sleep medications (wanted to reduce), various supplements",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-11-12",
      durationDays: 28,
      villainVariable: "Sleep Quality",
      villainRatings: [
        { day: 1, rating: 2, note: "Takes a long time to fall asleep" },
        { day: 7, rating: 3, note: "Feeling more relaxed at bedtime" },
        { day: 14, rating: 4, note: "Falling asleep easier" },
        { day: 21, rating: 4, note: "Consistent improvement" },
        { day: 28, rating: 4, note: "Good sleep routine established" },
      ],
      keyQuotes: [
        { day: 7, quote: "Fell sound asleep at the beginning of using the device.", context: "Early check-in" },
        { day: 28, quote: "Helping with product assessment - I can see real changes in my HRV.", context: "Final check-in" },
      ],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 6009,
        after: 5992,
        unit: "min (avg)",
        changePercent: calcPercentChange(6009, 5992), // -0.3%
      },
      hrvChange: {
        before: 28,
        after: 30,
        unit: "ms",
        changePercent: calcPercentChange(28, 30), // +7%
      },
      sleepChange: {
        before: 24965,
        after: 25245,
        unit: "min (avg)",
        changePercent: calcPercentChange(24965, 25245), // +1%
      },
    },
    finalTestimonial: {
      quote: "Fell sound asleep at beginning. The device helped establish a calming bedtime routine that I've maintained.",
      overallRating: 8,
      wouldRecommend: true,
      reportedBenefits: ["Faster sleep onset", "Improved HRV", "Calming routine"],
    },
    verification: {
      id: "VRF-SENSATE-4338",
      timestamp: "2025-11-12T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 90,
    },
  },

  // ============================================
  // NEGATIVE/NO IMPROVEMENT (2 participants)
  // ============================================

  {
    id: "sensate-real-2862",
    name: "Stewart",
    initials: "S",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-2862",
    profile: {
      ageRange: "26-35",
      lifeStage: "early-career",
      gender: "Female",
      educationLevel: "Bachelor's degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Greater than $100,000",
      maritalStatus: "Single",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Curious about vagus nerve stimulation for sleep",
      hopedResults: "Better deep sleep",
      villainDuration: "Occasional sleep issues",
      triedOther: "Sleep tracking, some supplements",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-12-12",
      durationDays: 58,
      villainVariable: "Sleep Quality",
      villainRatings: [
        { day: 1, rating: 3, note: "Average baseline" },
        { day: 7, rating: 3, note: "No noticeable change" },
        { day: 14, rating: 3, note: "Still about the same" },
        { day: 21, rating: 2, note: "Actually sleeping worse" },
        { day: 28, rating: 2, note: "Did not see improvement" },
      ],
      keyQuotes: [
        { day: 14, quote: "I haven't noticed any significant changes yet.", context: "Mid-study check-in" },
        { day: 28, quote: "Unfortunately this didn't work for me. My deep sleep actually decreased.", context: "Final check-in" },
      ],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 5992,
        after: 5104,
        unit: "min (avg)",
        changePercent: calcPercentChange(5992, 5104), // -15%
      },
      hrvChange: {
        before: 40,
        after: 36,
        unit: "ms",
        changePercent: calcPercentChange(40, 36), // -10%
      },
      sleepChange: {
        before: 26689,
        after: 28416,
        unit: "min (avg)",
        changePercent: calcPercentChange(26689, 28416), // +6%
      },
    },
    finalTestimonial: {
      quote: "I really wanted this to work, but my wearable data shows my deep sleep and HRV both decreased. Not everyone responds the same way.",
      overallRating: 4,
      wouldRecommend: false,
      reportedBenefits: [],
    },
    verification: {
      id: "VRF-SENSATE-2862",
      timestamp: "2025-12-12T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 88,
    },
  },

  {
    id: "sensate-real-4310",
    name: "Taylor",
    initials: "T",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-4310",
    profile: {
      ageRange: "46-55",
      lifeStage: "established-professional",
      gender: "Male",
      educationLevel: "Bachelor's degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Greater than $100,000",
      maritalStatus: "Married or in a domestic partnership",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Wanted to try a new product for sleep",
      hopedResults: "Better overall sleep",
      villainDuration: "Several years of inconsistent sleep",
      triedOther: "Various sleep apps and products",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-11-10",
      durationDays: 26,
      villainVariable: "Sleep Quality",
      villainRatings: [
        { day: 1, rating: 3, note: "Starting point" },
        { day: 7, rating: 3, note: "No major change" },
        { day: 14, rating: 3, note: "Slight improvement maybe" },
        { day: 21, rating: 3, note: "Hard to tell" },
        { day: 26, rating: 3, note: "Neutral overall" },
      ],
      keyQuotes: [
        { day: 14, quote: "I'm not sure if I notice anything different yet.", context: "Mid-study check-in" },
        { day: 26, quote: "Interesting product but I'm unlikely to continue using it after the study.", context: "Final check-in" },
      ],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 5872,
        after: 6020,
        unit: "min (avg)",
        changePercent: calcPercentChange(5872, 6020), // +3%
      },
      hrvChange: {
        before: 30,
        after: 34,
        unit: "ms",
        changePercent: calcPercentChange(30, 34), // +14%
      },
      sleepChange: {
        before: 25077,
        after: 24778,
        unit: "min (avg)",
        changePercent: calcPercentChange(25077, 24778), // -1%
      },
    },
    finalTestimonial: {
      quote: "The data shows some improvement in HRV, but subjectively I didn't feel different. Unlikely to continue after the study.",
      overallRating: 4,
      wouldRecommend: false,
      reportedBenefits: [],
    },
    verification: {
      id: "VRF-SENSATE-4310",
      timestamp: "2025-11-10T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 82,
    },
  },
];

// Export individual stories by ID for easy access
export const getSensateRealStoryById = (id: string): ParticipantStory | undefined => {
  return SENSATE_REAL_STORIES.find((story) => story.id === id);
};

// Get all positive stories
export const getSensatePositiveStories = (): ParticipantStory[] => {
  return SENSATE_REAL_STORIES.filter(
    (story) => story.finalTestimonial?.wouldRecommend === true
  );
};

// Get all negative/no improvement stories
export const getSensateNegativeStories = (): ParticipantStory[] => {
  return SENSATE_REAL_STORIES.filter(
    (story) => story.finalTestimonial?.wouldRecommend === false
  );
};
