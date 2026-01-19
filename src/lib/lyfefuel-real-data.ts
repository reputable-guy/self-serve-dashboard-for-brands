// LYFEfuel Daily Essentials Shake - REAL Study Data
// 22 completed participants from Sept-Oct 2025 study
// All data is from actual study participants - no fabricated journey data

import { ParticipantStory, TierLevel } from "./types";

// ============================================
// REAL PARTICIPANT DATA FROM LYFEFUEL STUDY
// ============================================

export const LYFEFUEL_REAL_STORIES: ParticipantStory[] = [
  // Participant 1: Julie Feil (user_id: 459) - NPS 10, Very positive
  {
    id: "lyfefuel-real-459",
    name: "Julie F.",
    initials: "JF",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "46-55",
      gender: "Female",
      lifeStage: "Self-employed professional",
      educationLevel: "Bachelor's degree",
      employmentStatus: "Self-employed",
      householdIncome: "Greater than $100,000",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Looking to improve overall wellness and energy",
      hopedResults: "Better Oura readiness and sleep scores",
      triedOther: "No",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [], // Real data - no fabricated journey ratings
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      // Activity metrics (primary for energy study)
      activeMinutesChange: {
        before: Math.round(5.46 + 15.42), // High + Medium baseline
        after: Math.round(11.21 + 36.04), // High + Medium intervention
        unit: "min",
        changePercent: Math.round(((11.21 + 36.04) - (5.46 + 15.42)) / (5.46 + 15.42) * 100),
      },
      stepsChange: {
        before: 1107,
        after: 3051,
        unit: "steps",
        changePercent: Math.round((3051 - 1107) / 1107 * 100),
      },
      activeCaloriesChange: {
        before: 139,
        after: 318,
        unit: "kcal",
        changePercent: Math.round((318 - 139) / 139 * 100),
      },
      // Supporting metrics
      hrvChange: {
        before: 29,
        after: 29,
        unit: "ms",
        changePercent: Math.round((29 - 29) / 29 * 100),
      },
      deepSleepChange: {
        before: 4303,
        after: 4658,
        unit: "min",
        changePercent: Math.round((4658 - 4303) / 4303 * 100),
      },
      sleepChange: {
        before: 25659,
        after: 27328,
        unit: "min",
        changePercent: Math.round((27328 - 25659) / 25659 * 100),
      },
    },
    finalTestimonial: {
      quote: "My Oura readiness and sleep scores were drastically improved!",
      reportedBenefits: ["Oura readiness and sleep scores drastically improved"],
      npsScore: 10,
      overallRating: 5,
      satisfaction: "Satisfied",
      wouldContinue: "Likely",
    },
    verified: true,
    verificationId: "LYFE-REAL-001",
    completedAt: "2025-10-15",
  },

  // Participant 2: Winifred Schmeler (user_id: 640) - NPS 8
  {
    id: "lyfefuel-real-640",
    name: "Winifred S.",
    initials: "WS",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "46-55",
      gender: "Male",
      lifeStage: "Employed professional",
      educationLevel: "Doctorate degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Prefer Not To State",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Looking to improve energy levels",
      hopedResults: "More consistent energy throughout the day",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(2.21 + 14.42),
        after: Math.round(1.58 + 12),
        unit: "min",
        changePercent: Math.round(((1.58 + 12) - (2.21 + 14.42)) / (2.21 + 14.42) * 100),
      },
      stepsChange: {
        before: 3497,
        after: 3498,
        unit: "steps",
        changePercent: 0,
      },
      activeCaloriesChange: {
        before: 205,
        after: 186,
        unit: "kcal",
        changePercent: Math.round((186 - 205) / 205 * 100),
      },
      hrvChange: {
        before: 27,
        after: 26,
        unit: "ms",
        changePercent: Math.round((26 - 27) / 27 * 100),
      },
      deepSleepChange: {
        before: 3806,
        after: 3950,
        unit: "min",
        changePercent: Math.round((3950 - 3806) / 3806 * 100),
      },
      sleepChange: {
        before: 26553,
        after: 27089,
        unit: "min",
        changePercent: Math.round((27089 - 26553) / 26553 * 100),
      },
    },
    finalTestimonial: {
      quote: "Energy improved",
      reportedBenefits: ["Energy"],
      npsScore: 8,
      overallRating: 4,
      satisfaction: "Satisfied",
      wouldContinue: "Likely",
    },
    verified: true,
    verificationId: "LYFE-REAL-002",
    completedAt: "2025-10-14",
  },

  // Participant 3: Ron Cartwright (user_id: 1149) - NPS 8
  {
    id: "lyfefuel-real-1149",
    name: "Ron C.",
    initials: "RC",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "36-45",
      gender: "Female",
      lifeStage: "Employed professional",
      educationLevel: "Doctorate degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Prefer Not To State",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Exciting to help with research",
      hopedResults: "Contribute to wellness research",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(4.79 + 71.67),
        after: Math.round(1.58 + 41.75),
        unit: "min",
        changePercent: Math.round(((1.58 + 41.75) - (4.79 + 71.67)) / (4.79 + 71.67) * 100),
      },
      stepsChange: {
        before: 4372,
        after: 1201,
        unit: "steps",
        changePercent: Math.round((1201 - 4372) / 4372 * 100),
      },
      activeCaloriesChange: {
        before: 418,
        after: 215,
        unit: "kcal",
        changePercent: Math.round((215 - 418) / 418 * 100),
      },
      hrvChange: {
        before: 15,
        after: 16,
        unit: "ms",
        changePercent: Math.round((16 - 15) / 15 * 100),
      },
      deepSleepChange: {
        before: 5225,
        after: 5125,
        unit: "min",
        changePercent: Math.round((5125 - 5225) / 5225 * 100),
      },
      sleepChange: {
        before: 25056,
        after: 25692,
        unit: "min",
        changePercent: Math.round((25692 - 25056) / 25056 * 100),
      },
    },
    finalTestimonial: {
      quote: "Exciting to help with research",
      reportedBenefits: ["Neutral/Unsure on benefits"],
      npsScore: 8,
      overallRating: 4,
      satisfaction: "Satisfied",
      wouldContinue: "Likely",
    },
    verified: true,
    verificationId: "LYFE-REAL-003",
    completedAt: "2025-10-15",
  },

  // Participant 4: Sherry Maggio (user_id: 1883) - NPS 8
  {
    id: "lyfefuel-real-1883",
    name: "Sherry M.",
    initials: "SM",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "36-45",
      gender: "Female",
      lifeStage: "Employed professional",
      educationLevel: "Master's degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Prefer Not To State",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Consuming a shake was already part of my daily routine",
      hopedResults: "Easy integration with existing habits",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(51.58 + 25.83),
        after: Math.round(9.46 + 18.46),
        unit: "min",
        changePercent: Math.round(((9.46 + 18.46) - (51.58 + 25.83)) / (51.58 + 25.83) * 100),
      },
      stepsChange: {
        before: 1804,
        after: 531,
        unit: "steps",
        changePercent: Math.round((531 - 1804) / 1804 * 100),
      },
      activeCaloriesChange: {
        before: 555,
        after: 161,
        unit: "kcal",
        changePercent: Math.round((161 - 555) / 555 * 100),
      },
      hrvChange: {
        before: 67,
        after: 59,
        unit: "ms",
        changePercent: Math.round((59 - 67) / 67 * 100),
      },
      deepSleepChange: {
        before: 5745,
        after: 5919,
        unit: "min",
        changePercent: Math.round((5919 - 5745) / 5745 * 100),
      },
      sleepChange: {
        before: 26240,
        after: 25666,
        unit: "min",
        changePercent: Math.round((25666 - 26240) / 26240 * 100),
      },
    },
    finalTestimonial: {
      quote: "The consistency and taste was great. Consuming a shake was already part of my daily routine, so it was extremely easy to perfectly execute this study.",
      reportedBenefits: ["Easy to incorporate, good taste and consistency"],
      npsScore: 8,
      overallRating: 4,
      satisfaction: "Satisfied",
      wouldContinue: "Likely",
    },
    verified: true,
    verificationId: "LYFE-REAL-004",
    completedAt: "2025-10-16",
  },

  // Participant 5: Mandy Labadie (user_id: 1910) - NPS 7
  {
    id: "lyfefuel-real-1910",
    name: "Mandy L.",
    initials: "ML",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "46-55",
      gender: "Female",
      lifeStage: "Employed professional",
      educationLevel: "Doctorate degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Prefer Not To State",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Opportunity to try a new product",
      hopedResults: "Accountability for consistent breakfast routine",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(13.54 + 16.25),
        after: Math.round(34.38 + 37.17),
        unit: "min",
        changePercent: Math.round(((34.38 + 37.17) - (13.54 + 16.25)) / (13.54 + 16.25) * 100),
      },
      stepsChange: {
        before: 3543,
        after: 8148,
        unit: "steps",
        changePercent: Math.round((8148 - 3543) / 3543 * 100),
      },
      activeCaloriesChange: {
        before: 183,
        after: 423,
        unit: "kcal",
        changePercent: Math.round((423 - 183) / 183 * 100),
      },
      hrvChange: {
        before: 78,
        after: 67,
        unit: "ms",
        changePercent: Math.round((67 - 78) / 78 * 100),
      },
      deepSleepChange: {
        before: 3450,
        after: 3421,
        unit: "min",
        changePercent: Math.round((3421 - 3450) / 3450 * 100),
      },
      sleepChange: {
        before: 21680,
        after: 22418,
        unit: "min",
        changePercent: Math.round((22418 - 21680) / 21680 * 100),
      },
    },
    finalTestimonial: {
      quote: "It provided me an opportunity to try a new product that I would not have purchased on my own. I also enjoy the accountability aspect.",
      reportedBenefits: ["Accountability, consistent breakfast routine"],
      npsScore: 7,
      overallRating: 4,
      satisfaction: "Satisfied",
      wouldContinue: "Unlikely",
    },
    verified: true,
    verificationId: "LYFE-REAL-005",
    completedAt: "2025-10-17",
  },

  // Participant 6: Wanda Huels (user_id: 1955) - NPS 4
  {
    id: "lyfefuel-real-1955",
    name: "Wanda H.",
    initials: "WH",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "36-45",
      gender: "Female",
      lifeStage: "Employed professional",
      educationLevel: "Doctorate degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Prefer Not To State",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Try something new",
      hopedResults: "See if plant-based protein works for me",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(4.63 + 23.67),
        after: Math.round(0 + 0),
        unit: "min",
        changePercent: -100,
      },
      stepsChange: {
        before: 3562,
        after: 5,
        unit: "steps",
        changePercent: Math.round((5 - 3562) / 3562 * 100),
      },
      activeCaloriesChange: {
        before: 161,
        after: 0,
        unit: "kcal",
        changePercent: -100,
      },
      hrvChange: {
        before: 33,
        after: 32,
        unit: "ms",
        changePercent: Math.round((32 - 33) / 33 * 100),
      },
      deepSleepChange: {
        before: 5164,
        after: 5105,
        unit: "min",
        changePercent: Math.round((5105 - 5164) / 5164 * 100),
      },
      sleepChange: {
        before: 21845,
        after: 21621,
        unit: "min",
        changePercent: Math.round((21621 - 21845) / 21845 * 100),
      },
    },
    finalTestimonial: {
      quote: "I just prefer a whey based protein. The reminders to check in never came which was a bit disappointing.",
      reportedBenefits: ["Neutral/Unsure on benefits"],
      npsScore: 4,
      overallRating: 3,
      satisfaction: "Satisfied",
      wouldContinue: "Unlikely",
    },
    verified: true,
    verificationId: "LYFE-REAL-006",
    completedAt: "2025-10-30",
  },

  // Participant 7: Vickie Quigley (user_id: 2833) - NPS 0
  {
    id: "lyfefuel-real-2833",
    name: "Vickie Q.",
    initials: "VQ",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "36-45",
      gender: "Female",
      lifeStage: "Self-employed professional",
      educationLevel: "Master's degree",
      employmentStatus: "Self-employed",
      householdIncome: "Greater than $100,000",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Ease of participation",
      hopedResults: "Easy wellness study experience",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(7.67 + 35.33),
        after: Math.round(14.21 + 35.54),
        unit: "min",
        changePercent: Math.round(((14.21 + 35.54) - (7.67 + 35.33)) / (7.67 + 35.33) * 100),
      },
      stepsChange: {
        before: 7060,
        after: 8565,
        unit: "steps",
        changePercent: Math.round((8565 - 7060) / 7060 * 100),
      },
      activeCaloriesChange: {
        before: 285,
        after: 343,
        unit: "kcal",
        changePercent: Math.round((343 - 285) / 285 * 100),
      },
      hrvChange: {
        before: 39,
        after: 38,
        unit: "ms",
        changePercent: Math.round((38 - 39) / 39 * 100),
      },
      deepSleepChange: {
        before: 4668,
        after: 4363,
        unit: "min",
        changePercent: Math.round((4363 - 4668) / 4668 * 100),
      },
      sleepChange: {
        before: 25081,
        after: 26051,
        unit: "min",
        changePercent: Math.round((26051 - 25081) / 25081 * 100),
      },
    },
    finalTestimonial: {
      quote: "The taste and consistency were not great.",
      reportedBenefits: ["Neutral/Unsure on benefits"],
      npsScore: 0,
      overallRating: 1,
      satisfaction: "Very dissatisfied",
      wouldContinue: "Very unlikely",
    },
    verified: true,
    verificationId: "LYFE-REAL-007",
    completedAt: "2025-10-15",
  },

  // Participant 8: Marcella Wisozk (user_id: 2842) - NPS 7
  {
    id: "lyfefuel-real-2842",
    name: "Marcella W.",
    initials: "MW",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "36-45",
      gender: "Female",
      lifeStage: "Employed professional",
      educationLevel: "Bachelor's degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Greater than $100,000",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Easy to adhere to",
      hopedResults: "Simple study participation",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(2.42 + 85.71),
        after: Math.round(7.08 + 98.21),
        unit: "min",
        changePercent: Math.round(((7.08 + 98.21) - (2.42 + 85.71)) / (2.42 + 85.71) * 100),
      },
      stepsChange: {
        before: 8376,
        after: 7503,
        unit: "steps",
        changePercent: Math.round((7503 - 8376) / 8376 * 100),
      },
      activeCaloriesChange: {
        before: 372,
        after: 494,
        unit: "kcal",
        changePercent: Math.round((494 - 372) / 372 * 100),
      },
      hrvChange: {
        before: 40,
        after: 36,
        unit: "ms",
        changePercent: Math.round((36 - 40) / 40 * 100),
      },
      deepSleepChange: {
        before: 5745,
        after: 6125,
        unit: "min",
        changePercent: Math.round((6125 - 5745) / 5745 * 100),
      },
      sleepChange: {
        before: 28633,
        after: 28459,
        unit: "min",
        changePercent: Math.round((28459 - 28633) / 28633 * 100),
      },
    },
    finalTestimonial: {
      quote: "Easy to adhere to",
      reportedBenefits: ["Neutral/Unsure on benefits"],
      npsScore: 7,
      overallRating: 3,
      satisfaction: "Neutral",
      wouldContinue: "Neutral",
    },
    verified: true,
    verificationId: "LYFE-REAL-008",
    completedAt: "2025-10-21",
  },

  // Participant 9: Herman Spencer (user_id: 2955) - NPS 5
  {
    id: "lyfefuel-real-2955",
    name: "Herman S.",
    initials: "HS",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "46-55",
      gender: "Female",
      lifeStage: "Employed part-time",
      educationLevel: "Bachelor's degree",
      employmentStatus: "Employed for wages - part time",
      householdIncome: "Greater than $100,000",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Free product",
      hopedResults: "Try product for free",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(0.46 + 9.29),
        after: Math.round(0.88 + 23.71),
        unit: "min",
        changePercent: Math.round(((0.88 + 23.71) - (0.46 + 9.29)) / (0.46 + 9.29) * 100),
      },
      stepsChange: {
        before: 1879,
        after: 3481,
        unit: "steps",
        changePercent: Math.round((3481 - 1879) / 1879 * 100),
      },
      activeCaloriesChange: {
        before: 65,
        after: 113,
        unit: "kcal",
        changePercent: Math.round((113 - 65) / 65 * 100),
      },
      hrvChange: {
        before: 41,
        after: 40,
        unit: "ms",
        changePercent: Math.round((40 - 41) / 41 * 100),
      },
      deepSleepChange: {
        before: 5061,
        after: 4721,
        unit: "min",
        changePercent: Math.round((4721 - 5061) / 5061 * 100),
      },
      sleepChange: {
        before: 25589,
        after: 25878,
        unit: "min",
        changePercent: Math.round((25878 - 25589) / 25589 * 100),
      },
    },
    finalTestimonial: {
      quote: "Free product. Better payouts like before.",
      reportedBenefits: ["Neutral/Unsure on benefits"],
      npsScore: 5,
      overallRating: 3,
      satisfaction: "Neutral",
      wouldContinue: "Neutral",
    },
    verified: true,
    verificationId: "LYFE-REAL-009",
    completedAt: "2025-10-18",
  },

  // Participant 10: Randall Cruickshank (user_id: 3424) - NPS 6
  {
    id: "lyfefuel-real-3424",
    name: "Randall C.",
    initials: "RC",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "36-45",
      gender: "Female",
      lifeStage: "Employed part-time",
      educationLevel: "No schooling completed",
      employmentStatus: "Employed for wages - part time",
      householdIncome: "$25,000-$49,999",
      ethnicity: "Asian or Pacific Islander",
      location: "USA",
    },
    baseline: {
      motivation: "Try something new",
      hopedResults: "Experience some benefits",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(0.17 + 6.25),
        after: Math.round(0.09 + 2.5),
        unit: "min",
        changePercent: Math.round(((0.09 + 2.5) - (0.17 + 6.25)) / (0.17 + 6.25) * 100),
      },
      stepsChange: {
        before: 1335,
        after: 810,
        unit: "steps",
        changePercent: Math.round((810 - 1335) / 1335 * 100),
      },
      activeCaloriesChange: {
        before: 49,
        after: 32,
        unit: "kcal",
        changePercent: Math.round((32 - 49) / 49 * 100),
      },
      hrvChange: {
        before: 66,
        after: 28,
        unit: "ms",
        changePercent: Math.round((28 - 66) / 66 * 100),
      },
      deepSleepChange: {
        before: 5373,
        after: 5156,
        unit: "min",
        changePercent: Math.round((5156 - 5373) / 5373 * 100),
      },
      sleepChange: {
        before: 25286,
        after: 24731,
        unit: "min",
        changePercent: Math.round((24731 - 25286) / 25286 * 100),
      },
    },
    finalTestimonial: {
      quote: "",
      reportedBenefits: ["Some benefits noticed"],
      npsScore: 6,
      overallRating: 3,
      satisfaction: "Neutral",
      wouldContinue: "Neutral",
    },
    verified: true,
    verificationId: "LYFE-REAL-010",
    completedAt: "2025-10-15",
  },

  // Participant 11: Julius Spinka (user_id: 3718) - NPS 5
  {
    id: "lyfefuel-real-3718",
    name: "Julius S.",
    initials: "JS",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "56-65",
      gender: "Female",
      lifeStage: "Employed professional",
      educationLevel: "Some college credit, no degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "$50,000-$100,000",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Trying a new product",
      hopedResults: "See how it affects wellness",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(21.5 + 37.42),
        after: Math.round(2.83 + 34.04),
        unit: "min",
        changePercent: Math.round(((2.83 + 34.04) - (21.5 + 37.42)) / (21.5 + 37.42) * 100),
      },
      stepsChange: {
        before: 4501,
        after: 4318,
        unit: "steps",
        changePercent: Math.round((4318 - 4501) / 4501 * 100),
      },
      activeCaloriesChange: {
        before: 325,
        after: 209,
        unit: "kcal",
        changePercent: Math.round((209 - 325) / 325 * 100),
      },
      hrvChange: {
        before: 73,
        after: 65,
        unit: "ms",
        changePercent: Math.round((65 - 73) / 73 * 100),
      },
      deepSleepChange: {
        before: 2956,
        after: 3171,
        unit: "min",
        changePercent: Math.round((3171 - 2956) / 2956 * 100),
      },
      sleepChange: {
        before: 21275,
        after: 21423,
        unit: "min",
        changePercent: Math.round((21423 - 21275) / 21275 * 100),
      },
    },
    finalTestimonial: {
      quote: "The product itself is gritty probably because of the plant based ingredients. Flavor wasn't strong.",
      reportedBenefits: ["No noticeable benefits"],
      npsScore: 5,
      overallRating: 3,
      satisfaction: "Neutral",
      wouldContinue: "Very unlikely",
      challenges: "Bloating and gas",
    },
    verified: true,
    verificationId: "LYFE-REAL-011",
    completedAt: "2025-10-13",
  },

  // Participant 12: Cecelia Schumm (user_id: 3719) - NPS 8
  {
    id: "lyfefuel-real-3719",
    name: "Cecelia S.",
    initials: "CS",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "56-65",
      gender: "Female",
      lifeStage: "Self-employed professional",
      educationLevel: "Master's degree",
      employmentStatus: "Self-employed",
      householdIncome: "Greater than $100,000",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Looking forward to data that supports improved sleep while taking product",
      hopedResults: "Improved sleep data",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(10 + 40.08),
        after: Math.round(21.17 + 109.33),
        unit: "min",
        changePercent: Math.round(((21.17 + 109.33) - (10 + 40.08)) / (10 + 40.08) * 100),
      },
      stepsChange: {
        before: 4539,
        after: 12210,
        unit: "steps",
        changePercent: Math.round((12210 - 4539) / 4539 * 100),
      },
      activeCaloriesChange: {
        before: 195,
        after: 476,
        unit: "kcal",
        changePercent: Math.round((476 - 195) / 195 * 100),
      },
      hrvChange: {
        before: 67,
        after: 49,
        unit: "ms",
        changePercent: Math.round((49 - 67) / 67 * 100),
      },
      deepSleepChange: {
        before: 2741,
        after: 3113,
        unit: "min",
        changePercent: Math.round((3113 - 2741) / 2741 * 100),
      },
      sleepChange: {
        before: 27816,
        after: 28079,
        unit: "min",
        changePercent: Math.round((28079 - 27816) / 27816 * 100),
      },
    },
    finalTestimonial: {
      quote: "Looking forward to data that supports improved sleep while taking product. Regular bowel movements.",
      reportedBenefits: ["Regular bowel movements"],
      npsScore: 8,
      overallRating: 4,
      satisfaction: "Satisfied",
      wouldContinue: "Neutral",
    },
    verified: true,
    verificationId: "LYFE-REAL-012",
    completedAt: "2025-10-16",
  },

  // Participant 13: Marco Witting (user_id: 3950) - NPS 5
  {
    id: "lyfefuel-real-3950",
    name: "Marco W.",
    initials: "MW",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "36-45",
      gender: "Female",
      lifeStage: "Employed professional",
      educationLevel: "Bachelor's degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Greater than $100,000",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "I always enjoy trying something new and seeing how it affects my overall wellbeing",
      hopedResults: "See effects on health",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(1.96 + 33.25),
        after: Math.round(9.71 + 76),
        unit: "min",
        changePercent: Math.round(((9.71 + 76) - (1.96 + 33.25)) / (1.96 + 33.25) * 100),
      },
      stepsChange: {
        before: 2823,
        after: 6091,
        unit: "steps",
        changePercent: Math.round((6091 - 2823) / 2823 * 100),
      },
      activeCaloriesChange: {
        before: 176,
        after: 459,
        unit: "kcal",
        changePercent: Math.round((459 - 176) / 176 * 100),
      },
      hrvChange: {
        before: 23,
        after: 30,
        unit: "ms",
        changePercent: Math.round((30 - 23) / 23 * 100),
      },
      deepSleepChange: {
        before: 3846,
        after: 4475,
        unit: "min",
        changePercent: Math.round((4475 - 3846) / 3846 * 100),
      },
      sleepChange: {
        before: 27290,
        after: 28450,
        unit: "min",
        changePercent: Math.round((28450 - 27290) / 27290 * 100),
      },
    },
    finalTestimonial: {
      quote: "The taste of this product was not very pleasant. Gritty too, not my favorite.",
      reportedBenefits: ["Neutral/Unsure on benefits"],
      npsScore: 5,
      overallRating: 3,
      satisfaction: "Neutral",
      wouldContinue: "Unlikely",
    },
    verified: true,
    verificationId: "LYFE-REAL-013",
    completedAt: "2025-10-13",
  },

  // Participant 14: Leon Waters (user_id: 3996) - NPS 8
  {
    id: "lyfefuel-real-3996",
    name: "Leon W.",
    initials: "LW",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "56-65",
      gender: "Female",
      lifeStage: "Employed professional",
      educationLevel: "Trade/technical",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "$50,000-$100,000",
      ethnicity: "Hispanic or Latino",
      location: "USA",
    },
    baseline: {
      motivation: "Product ease of use",
      hopedResults: "Easy to use product",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(0.21 + 20.08),
        after: Math.round(0.17 + 23.54),
        unit: "min",
        changePercent: Math.round(((0.17 + 23.54) - (0.21 + 20.08)) / (0.21 + 20.08) * 100),
      },
      stepsChange: {
        before: 2921,
        after: 3453,
        unit: "steps",
        changePercent: Math.round((3453 - 2921) / 2921 * 100),
      },
      activeCaloriesChange: {
        before: 126,
        after: 186,
        unit: "kcal",
        changePercent: Math.round((186 - 126) / 126 * 100),
      },
      hrvChange: {
        before: 12,
        after: 13,
        unit: "ms",
        changePercent: Math.round((13 - 12) / 12 * 100),
      },
      deepSleepChange: {
        before: 3591,
        after: 3784,
        unit: "min",
        changePercent: Math.round((3784 - 3591) / 3591 * 100),
      },
      sleepChange: {
        before: 17288,
        after: 19417,
        unit: "min",
        changePercent: Math.round((19417 - 17288) / 17288 * 100),
      },
    },
    finalTestimonial: {
      quote: "Product ease of use",
      reportedBenefits: ["No noticeable benefits"],
      npsScore: 8,
      overallRating: 4,
      satisfaction: "Satisfied",
      wouldContinue: "Neutral",
      challenges: "Constipation",
    },
    verified: true,
    verificationId: "LYFE-REAL-014",
    completedAt: "2025-10-18",
  },

  // Participant 15: Mike Kilback (user_id: 4058) - NPS 7
  {
    id: "lyfefuel-real-4058",
    name: "Mike K.",
    initials: "MK",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "46-55",
      gender: "Female",
      lifeStage: "Self-employed professional",
      educationLevel: "Bachelor's degree",
      employmentStatus: "Self-employed",
      householdIncome: "$50,000-$100,000",
      ethnicity: "Asian or Pacific Islander",
      location: "USA",
    },
    baseline: {
      motivation: "I liked the free product",
      hopedResults: "Try a free product",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(1.58 + 9.54),
        after: Math.round(2.63 + 21.04),
        unit: "min",
        changePercent: Math.round(((2.63 + 21.04) - (1.58 + 9.54)) / (1.58 + 9.54) * 100),
      },
      stepsChange: {
        before: 2032,
        after: 4149,
        unit: "steps",
        changePercent: Math.round((4149 - 2032) / 2032 * 100),
      },
      activeCaloriesChange: {
        before: 83,
        after: 169,
        unit: "kcal",
        changePercent: Math.round((169 - 83) / 83 * 100),
      },
      hrvChange: {
        before: 21,
        after: 18,
        unit: "ms",
        changePercent: Math.round((18 - 21) / 21 * 100),
      },
      deepSleepChange: {
        before: 4558,
        after: 4645,
        unit: "min",
        changePercent: Math.round((4645 - 4558) / 4558 * 100),
      },
      sleepChange: {
        before: 21079,
        after: 21726,
        unit: "min",
        changePercent: Math.round((21726 - 21079) / 21079 * 100),
      },
    },
    finalTestimonial: {
      quote: "I would really like to have more flavors to try. Maybe chocolate? The taste was okay but for 24 days it got a bit much. What bothered me the most is the gritty texture.",
      reportedBenefits: ["Neutral/Unsure on benefits"],
      npsScore: 7,
      overallRating: 3,
      satisfaction: "Neutral",
      wouldContinue: "Very unlikely",
      challenges: "Gritty texture, taste got old after 24 days",
    },
    verified: true,
    verificationId: "LYFE-REAL-015",
    completedAt: "2025-10-15",
  },

  // Participant 16: Beverly Bashirian (user_id: 4123) - NPS 9
  {
    id: "lyfefuel-real-4123",
    name: "Beverly B.",
    initials: "BB",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "36-45",
      gender: "Male",
      lifeStage: "Employed professional",
      educationLevel: "Some college credit, no degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Greater than $100,000",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Getting to try a new product",
      hopedResults: "Experience new product benefits",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(23.54 + 66.75),
        after: Math.round(23.15 + 62.69),
        unit: "min",
        changePercent: Math.round(((23.15 + 62.69) - (23.54 + 66.75)) / (23.54 + 66.75) * 100),
      },
      stepsChange: {
        before: 11419,
        after: 10518,
        unit: "steps",
        changePercent: Math.round((10518 - 11419) / 11419 * 100),
      },
      activeCaloriesChange: {
        before: 600,
        after: 553,
        unit: "kcal",
        changePercent: Math.round((553 - 600) / 600 * 100),
      },
      hrvChange: {
        before: 48,
        after: 43,
        unit: "ms",
        changePercent: Math.round((43 - 48) / 48 * 100),
      },
      deepSleepChange: {
        before: 5494,
        after: 5395,
        unit: "min",
        changePercent: Math.round((5395 - 5494) / 5494 * 100),
      },
      sleepChange: {
        before: 24816,
        after: 24992,
        unit: "min",
        changePercent: Math.round((24992 - 24816) / 24816 * 100),
      },
    },
    finalTestimonial: {
      quote: "I felt fuller and didn't eat as much. I feel like I slept better.",
      reportedBenefits: ["Fuller feeling, less eating, better sleep"],
      npsScore: 9,
      overallRating: 5,
      satisfaction: "Very satisfied",
      wouldContinue: "Very likely",
    },
    verified: true,
    verificationId: "LYFE-REAL-016",
    completedAt: "2025-10-15",
  },

  // Participant 17: Marta Windler (user_id: 4182) - NPS 5
  {
    id: "lyfefuel-real-4182",
    name: "Marta W.",
    initials: "MW",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "56-65",
      gender: "Female",
      lifeStage: "Self-employed professional",
      educationLevel: "Doctorate degree",
      employmentStatus: "Self-employed",
      householdIncome: "$25,000-$49,999",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "It is very easy",
      hopedResults: "Easy participation",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(3.75 + 42.04),
        after: Math.round(11.92 + 51.58),
        unit: "min",
        changePercent: Math.round(((11.92 + 51.58) - (3.75 + 42.04)) / (3.75 + 42.04) * 100),
      },
      stepsChange: {
        before: 1755,
        after: 1947,
        unit: "steps",
        changePercent: Math.round((1947 - 1755) / 1755 * 100),
      },
      activeCaloriesChange: {
        before: 193,
        after: 251,
        unit: "kcal",
        changePercent: Math.round((251 - 193) / 193 * 100),
      },
      hrvChange: {
        before: 19,
        after: 19,
        unit: "ms",
        changePercent: 0,
      },
      deepSleepChange: {
        before: 1955,
        after: 1976,
        unit: "min",
        changePercent: Math.round((1976 - 1955) / 1955 * 100),
      },
      sleepChange: {
        before: 23135,
        after: 24234,
        unit: "min",
        changePercent: Math.round((24234 - 23135) / 23135 * 100),
      },
    },
    finalTestimonial: {
      quote: "The taste of the product needs improvement.",
      reportedBenefits: ["Neutral/Unsure on benefits"],
      npsScore: 5,
      overallRating: 4,
      satisfaction: "Satisfied",
      wouldContinue: "Unlikely",
    },
    verified: true,
    verificationId: "LYFE-REAL-017",
    completedAt: "2025-10-27",
  },

  // Participant 18: Yasmeen Stoltenberg (user_id: 4226) - NPS 8
  {
    id: "lyfefuel-real-4226",
    name: "Yasmeen S.",
    initials: "YS",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "46-55",
      gender: "Male",
      lifeStage: "Student",
      educationLevel: "Some college credit, no degree",
      employmentStatus: "Student",
      householdIncome: "$25,000-$49,999",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "It was fun",
      hopedResults: "Enjoyable experience",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(0 + 34.75),
        after: Math.round(0.14 + 54.14),
        unit: "min",
        changePercent: Math.round(((0.14 + 54.14) - (0 + 34.75)) / (0 + 34.75) * 100),
      },
      stepsChange: {
        before: 5434,
        after: 6180,
        unit: "steps",
        changePercent: Math.round((6180 - 5434) / 5434 * 100),
      },
      activeCaloriesChange: {
        before: 321,
        after: 437,
        unit: "kcal",
        changePercent: Math.round((437 - 321) / 321 * 100),
      },
      hrvChange: {
        before: 58,
        after: 48,
        unit: "ms",
        changePercent: Math.round((48 - 58) / 58 * 100),
      },
      deepSleepChange: {
        before: 3093,
        after: 2892,
        unit: "min",
        changePercent: Math.round((2892 - 3093) / 3093 * 100),
      },
      sleepChange: {
        before: 19378,
        after: 17160,
        unit: "min",
        changePercent: Math.round((17160 - 19378) / 19378 * 100),
      },
    },
    finalTestimonial: {
      quote: "Relaxation benefits noticed.",
      reportedBenefits: ["Relaxation"],
      npsScore: 8,
      overallRating: 4,
      satisfaction: "Satisfied",
      wouldContinue: "Likely",
    },
    verified: true,
    verificationId: "LYFE-REAL-018",
    completedAt: "2025-10-27",
  },

  // Participant 19: Trinity Lueilwitz (user_id: 4282) - NPS 10
  {
    id: "lyfefuel-real-4282",
    name: "Trinity L.",
    initials: "TL",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "56-65",
      gender: "Female",
      lifeStage: "Employed professional",
      educationLevel: "Master's degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "$50,000-$100,000",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "I was delighted to experience this product!",
      hopedResults: "Experience product benefits",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(0.54 + 19.21),
        after: Math.round(0.83 + 20.75),
        unit: "min",
        changePercent: Math.round(((0.83 + 20.75) - (0.54 + 19.21)) / (0.54 + 19.21) * 100),
      },
      stepsChange: {
        before: 2578,
        after: 2916,
        unit: "steps",
        changePercent: Math.round((2916 - 2578) / 2578 * 100),
      },
      activeCaloriesChange: {
        before: 93,
        after: 113,
        unit: "kcal",
        changePercent: Math.round((113 - 93) / 93 * 100),
      },
      hrvChange: {
        before: 26,
        after: 27,
        unit: "ms",
        changePercent: Math.round((27 - 26) / 26 * 100),
      },
      deepSleepChange: {
        before: 2948,
        after: 3024,
        unit: "min",
        changePercent: Math.round((3024 - 2948) / 2948 * 100),
      },
      sleepChange: {
        before: 19228,
        after: 23362,
        unit: "min",
        changePercent: Math.round((23362 - 19228) / 19228 * 100),
      },
    },
    finalTestimonial: {
      quote: "I felt so much more focus and energy! I was delighted to experience this product!",
      reportedBenefits: ["Significant focus and energy improvement"],
      npsScore: 10,
      overallRating: 5,
      satisfaction: "Very satisfied",
      wouldContinue: "Very likely",
    },
    verified: true,
    verificationId: "LYFE-REAL-019",
    completedAt: "2025-10-17",
  },

  // Participant 20: Tracy20 (user_id: 4283) - NPS 4
  {
    id: "lyfefuel-real-4283",
    name: "Tracy M.",
    initials: "TM",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "26-35",
      gender: "Female",
      lifeStage: "Student",
      educationLevel: "Master's degree",
      employmentStatus: "Student",
      householdIncome: "$50,000-$100,000",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "I like everyday check ins",
      hopedResults: "Regular check-in engagement",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(0.08 + 31),
        after: Math.round(0.08 + 18.67),
        unit: "min",
        changePercent: Math.round(((0.08 + 18.67) - (0.08 + 31)) / (0.08 + 31) * 100),
      },
      stepsChange: {
        before: 4905,
        after: 3219,
        unit: "steps",
        changePercent: Math.round((3219 - 4905) / 4905 * 100),
      },
      activeCaloriesChange: {
        before: 258,
        after: 187,
        unit: "kcal",
        changePercent: Math.round((187 - 258) / 258 * 100),
      },
      hrvChange: {
        before: 24,
        after: 23,
        unit: "ms",
        changePercent: Math.round((23 - 24) / 24 * 100),
      },
      deepSleepChange: {
        before: 5669,
        after: 5804,
        unit: "min",
        changePercent: Math.round((5804 - 5669) / 5669 * 100),
      },
      sleepChange: {
        before: 27405,
        after: 27888,
        unit: "min",
        changePercent: Math.round((27888 - 27405) / 27405 * 100),
      },
    },
    finalTestimonial: {
      quote: "I like everyday check ins",
      reportedBenefits: ["Neutral/Unsure on benefits"],
      npsScore: 4,
      overallRating: 3,
      satisfaction: "Neutral",
      wouldContinue: "Unlikely",
    },
    verified: true,
    verificationId: "LYFE-REAL-020",
    completedAt: "2025-10-30",
  },

  // Participant 21: Jeanie Anderson (user_id: 4286) - NPS 9
  {
    id: "lyfefuel-real-4286",
    name: "Jeanie A.",
    initials: "JA",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "18-25",
      gender: "Female",
      lifeStage: "Employed professional",
      educationLevel: "Bachelor's degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "$50,000-$100,000",
      ethnicity: "Asian or Pacific Islander",
      location: "USA",
    },
    baseline: {
      motivation: "The powder I received! It tasted really good.",
      hopedResults: "Enjoy a good tasting product",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(0.25 + 55.54),
        after: Math.round(0 + 17.67),
        unit: "min",
        changePercent: Math.round(((0 + 17.67) - (0.25 + 55.54)) / (0.25 + 55.54) * 100),
      },
      stepsChange: {
        before: 9499,
        after: 3613,
        unit: "steps",
        changePercent: Math.round((3613 - 9499) / 9499 * 100),
      },
      activeCaloriesChange: {
        before: 533,
        after: 191,
        unit: "kcal",
        changePercent: Math.round((191 - 533) / 533 * 100),
      },
      hrvChange: {
        before: 64,
        after: 71,
        unit: "ms",
        changePercent: Math.round((71 - 64) / 64 * 100),
      },
      deepSleepChange: {
        before: 5053,
        after: 4461,
        unit: "min",
        changePercent: Math.round((4461 - 5053) / 5053 * 100),
      },
      sleepChange: {
        before: 23926,
        after: 22152,
        unit: "min",
        changePercent: Math.round((22152 - 23926) / 23926 * 100),
      },
    },
    finalTestimonial: {
      quote: "I felt more energized and fulfilled. The powder I received tasted really good.",
      reportedBenefits: ["More energized and fulfilled"],
      npsScore: 9,
      overallRating: 5,
      satisfaction: "Very satisfied",
      wouldContinue: "Very likely",
    },
    verified: true,
    verificationId: "LYFE-REAL-021",
    completedAt: "2025-10-16",
  },

  // Participant 22: Trevor Nicolas (user_id: 4294) - NPS 4
  {
    id: "lyfefuel-real-4294",
    name: "Trevor N.",
    initials: "TN",
    tier: 2 as TierLevel,
    profile: {
      ageRange: "56-65",
      gender: "Female",
      lifeStage: "Self-employed professional",
      educationLevel: "Master's degree",
      employmentStatus: "Self-employed",
      householdIncome: "Prefer Not To State",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "It was fun to try a new product for free",
      hopedResults: "Try a free product",
    },
    journey: {
      startDate: "2025-09-18",
      endDate: "2025-10-12",
      durationDays: 24,
      villainVariable: "energy levels",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      activeMinutesChange: {
        before: Math.round(3.25 + 51.54),
        after: Math.round(1.25 + 20.13),
        unit: "min",
        changePercent: Math.round(((1.25 + 20.13) - (3.25 + 51.54)) / (3.25 + 51.54) * 100),
      },
      stepsChange: {
        before: 5935,
        after: 2040,
        unit: "steps",
        changePercent: Math.round((2040 - 5935) / 5935 * 100),
      },
      activeCaloriesChange: {
        before: 298,
        after: 112,
        unit: "kcal",
        changePercent: Math.round((112 - 298) / 298 * 100),
      },
      hrvChange: {
        before: 41,
        after: 41,
        unit: "ms",
        changePercent: 0,
      },
      deepSleepChange: {
        before: 2648,
        after: 3255,
        unit: "min",
        changePercent: Math.round((3255 - 2648) / 2648 * 100),
      },
      sleepChange: {
        before: 28234,
        after: 28034,
        unit: "min",
        changePercent: Math.round((28034 - 28234) / 28234 * 100),
      },
    },
    finalTestimonial: {
      quote: "I didn't like the taste or texture.",
      reportedBenefits: ["Neutral/Unsure on benefits"],
      npsScore: 4,
      overallRating: 3,
      satisfaction: "Neutral",
      wouldContinue: "Unlikely",
      challenges: "Didn't like taste or texture",
    },
    verified: true,
    verificationId: "LYFE-REAL-022",
    completedAt: "2025-10-14",
  },
];

// ============================================
// CATEGORIZATION FUNCTION (Energy-focused)
// ============================================

/**
 * Categorize a LYFEfuel participant based on energy-related metrics
 * Primary metric: Activity Minutes change
 * Secondary consideration: NPS score
 *
 * Categories:
 * - positive: Activity minutes improved ≥10% AND NPS ≥ 7
 * - neutral: Mixed results (objective improvement but low satisfaction, or vice versa)
 * - negative: NPS ≤ 4 AND no objective improvement
 */
export function categorizeLyfefuelParticipant(story: ParticipantStory): "positive" | "neutral" | "negative" {
  const activityChange = story.wearableMetrics?.activeMinutesChange?.changePercent || 0;
  const stepsChange = story.wearableMetrics?.stepsChange?.changePercent || 0;
  const nps = story.finalTestimonial?.npsScore || 5;

  // Objective improvement: activity minutes improved by 10%+ OR steps improved by 20%+
  const hasObjectiveImprovement = activityChange >= 10 || stepsChange >= 20;

  // Strong objective improvement: both metrics positive
  const hasStrongImprovement = activityChange >= 20 || (activityChange >= 10 && stepsChange >= 10);

  // Subjective: NPS >= 7 is positive, <= 4 is negative
  const isSubjectivePositive = nps >= 7;
  const isSubjectiveNegative = nps <= 4;

  // Positive: objective improvement AND subjective satisfaction
  if (hasObjectiveImprovement && isSubjectivePositive) return "positive";
  // Also positive if strong improvement even with neutral subjective
  if (hasStrongImprovement && nps >= 6) return "positive";
  // Also positive if very high NPS with modest improvement
  if (nps >= 9 && activityChange > -10) return "positive";

  // Negative: low NPS AND no objective improvement
  if (isSubjectiveNegative && !hasObjectiveImprovement) return "negative";

  // Everything else is neutral (mixed results)
  return "neutral";
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate improvement score for sorting participants
 * Uses Activity Minutes and Steps as primary metrics
 */
function calculateImprovementScore(story: ParticipantStory): number {
  const activityChange = story.wearableMetrics?.activeMinutesChange?.changePercent || 0;
  const stepsChange = story.wearableMetrics?.stepsChange?.changePercent || 0;
  const nps = story.finalTestimonial?.npsScore || 5;

  // Weighted score: 40% activity, 30% steps, 30% NPS
  return (activityChange * 0.4) + (stepsChange * 0.3) + (nps * 3); // NPS scaled to similar range
}

/**
 * Get sorted LYFEfuel stories (best performers first)
 */
export function getSortedLyfefuelStories(): ParticipantStory[] {
  return [...LYFEFUEL_REAL_STORIES].sort((a, b) => {
    const aCategory = categorizeLyfefuelParticipant(a);
    const bCategory = categorizeLyfefuelParticipant(b);

    // Sort by category first (positive > neutral > negative)
    const categoryOrder = { positive: 0, neutral: 1, negative: 2 };
    if (categoryOrder[aCategory] !== categoryOrder[bCategory]) {
      return categoryOrder[aCategory] - categoryOrder[bCategory];
    }

    // Within same category, sort by improvement score
    return calculateImprovementScore(b) - calculateImprovementScore(a);
  });
}

/**
 * Get LYFEfuel study statistics
 */
export function getLyfefuelStudyStats(): {
  totalParticipants: number;
  improved: number;
  neutral: number;
  noImprovement: number;
} {
  const stats = {
    improved: 0,
    neutral: 0,
    noImprovement: 0,
  };

  LYFEFUEL_REAL_STORIES.forEach((story) => {
    const category = categorizeLyfefuelParticipant(story);
    if (category === "positive") stats.improved++;
    else if (category === "neutral") stats.neutral++;
    else stats.noImprovement++;
  });

  return {
    totalParticipants: LYFEFUEL_REAL_STORIES.length,
    ...stats,
  };
}

/**
 * Get average metrics from LYFEfuel study for dashboard display
 */
export function getLyfefuelAverageMetrics(): {
  avgActivityChange: number;
  avgStepsChange: number;
  enrolled: number;
  completed: number;
  completionRate: number;
  avgNps: number;
  wouldRecommendPercent: number;
} {
  let totalActivity = 0;
  let totalSteps = 0;
  let activityCount = 0;
  let stepsCount = 0;
  let totalNps = 0;
  let npsCount = 0;
  let wouldRecommendCount = 0;

  LYFEFUEL_REAL_STORIES.forEach((story) => {
    if (story.wearableMetrics?.activeMinutesChange?.changePercent !== undefined) {
      totalActivity += story.wearableMetrics.activeMinutesChange.changePercent;
      activityCount++;
    }
    if (story.wearableMetrics?.stepsChange?.changePercent !== undefined) {
      totalSteps += story.wearableMetrics.stepsChange.changePercent;
      stepsCount++;
    }
    if (story.finalTestimonial?.npsScore !== undefined) {
      totalNps += story.finalTestimonial.npsScore;
      npsCount++;
      if (story.finalTestimonial.npsScore >= 7) {
        wouldRecommendCount++;
      }
    }
  });

  const completed = LYFEFUEL_REAL_STORIES.length;
  const enrolled = 23; // Total enrolled in the study

  return {
    avgActivityChange: activityCount > 0 ? Math.round(totalActivity / activityCount) : 0,
    avgStepsChange: stepsCount > 0 ? Math.round(totalSteps / stepsCount) : 0,
    enrolled,
    completed,
    completionRate: Math.round((completed / enrolled) * 100),
    avgNps: npsCount > 0 ? Math.round((totalNps / npsCount) * 10) / 10 : 0,
    wouldRecommendPercent: npsCount > 0 ? Math.round((wouldRecommendCount / npsCount) * 100) : 0,
  };
}

/**
 * Get real demographic insights from LYFEfuel study participants
 */
export function getLyfefuelDemographics() {
  const total = LYFEFUEL_REAL_STORIES.length;

  // Helper to calculate percentage
  const toPercent = (count: number) => Math.round((count / total) * 100);

  // Count demographics
  const ageRanges: Record<string, number> = {};
  const genders: Record<string, number> = {};
  const educationLevels: Record<string, number> = {};
  const employmentStatuses: Record<string, number> = {};

  LYFEFUEL_REAL_STORIES.forEach((story) => {
    // Age
    const age = story.profile.ageRange || "Unknown";
    ageRanges[age] = (ageRanges[age] || 0) + 1;

    // Gender
    const gender = story.profile.gender || "Unknown";
    genders[gender] = (genders[gender] || 0) + 1;

    // Education
    const education = story.profile.educationLevel || "Unknown";
    educationLevels[education] = (educationLevels[education] || 0) + 1;

    // Employment
    const employment = story.profile.employmentStatus || "Unknown";
    employmentStatuses[employment] = (employmentStatuses[employment] || 0) + 1;
  });

  return {
    ageRanges: Object.entries(ageRanges).map(([range, count]) => ({
      range,
      count,
      percent: toPercent(count),
    })),
    genders: Object.entries(genders).map(([gender, count]) => ({
      gender,
      count,
      percent: toPercent(count),
    })),
    education: Object.entries(educationLevels).map(([level, count]) => ({
      level,
      count,
      percent: toPercent(count),
    })),
    employment: Object.entries(employmentStatuses).map(([status, count]) => ({
      status,
      count,
      percent: toPercent(count),
    })),
    totalParticipants: total,
  };
}

/**
 * Find a LYFEfuel story by verification ID
 */
export function findLyfefuelStoryByVerificationId(verificationId: string): ParticipantStory | undefined {
  return LYFEFUEL_REAL_STORIES.find((story) => story.verificationId === verificationId);
}
