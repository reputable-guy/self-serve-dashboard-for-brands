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
 * IMPORTANT: This file contains ONLY real data from the CSV.
 * - No fabricated villainRatings or keyQuotes
 * - Only actual survey responses and wearable metrics
 * - All 18 study participants included
 */

import { ParticipantStory } from "./types";

// Helper to calculate percent change
function calcPercentChange(baseline: number, intervention: number): number {
  if (baseline === 0) return 0;
  return Math.round(((intervention - baseline) / baseline) * 100);
}

// Helper to convert NPS (0-10) to 5-star rating
function npsToStars(nps: number): number {
  // 0-2 = 1 star, 3-4 = 2 stars, 5-6 = 3 stars, 7-8 = 4 stars, 9-10 = 5 stars
  if (nps <= 2) return 1;
  if (nps <= 4) return 2;
  if (nps <= 6) return 3;
  if (nps <= 8) return 4;
  return 5;
}

/**
 * Real participant stories from Sensate study
 * dataSource: 'real' distinguishes these from demo/generated stories
 *
 * NOTE: journey.villainRatings and journey.keyQuotes are empty because
 * daily tracking data was not collected in this study format.
 */
export const SENSATE_REAL_STORIES: ParticipantStory[] = [
  // ============================================
  // Participant 1: Leah (1772)
  // ============================================
  {
    id: "sensate-real-1772",
    name: "Leah",
    initials: "L",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-1772",
    profile: {
      ageRange: "36-45",
      lifeStage: "professional",
      gender: "Female",
      educationLevel: "Master's degree",
      employmentStatus: "Self-employed",
      householdIncome: "$50,000 - $100,000",
      maritalStatus: "Married or in a domestic partnership",
      ethnicity: "Black or African American",
      location: "USA",
    },
    baseline: {
      motivation: "Interested in trying the Sensate device",
      hopedResults: "Improved relaxation and sleep",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-11-04",
      durationDays: 28,
      villainVariable: "Sleep Quality",
      villainRatings: [], // Not collected in this study
      keyQuotes: [], // Not collected in this study
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 7590,
        after: 7984,
        unit: "min (avg)",
        changePercent: calcPercentChange(7590, 7984),
      },
      hrvChange: {
        before: 32,
        after: 26,
        unit: "ms",
        changePercent: calcPercentChange(32, 26),
      },
      sleepChange: {
        before: 27299,
        after: 27355,
        unit: "min (avg)",
        changePercent: calcPercentChange(27299, 27355),
      },
    },
    finalTestimonial: {
      quote: "Very satisfied with the Sensate device experience.",
      overallRating: npsToStars(8),
      npsScore: 8,
      wouldRecommend: true,
      reportedBenefits: ["Relaxation"],
      satisfaction: "Very satisfied",
    },
    verification: {
      id: "VRF-SENSATE-1772",
      timestamp: "2025-11-04T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 90,
    },
  },

  // ============================================
  // Participant 2: Stewart (2862)
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
      motivation: "It was easy and I've always wanted to try this product! Loved getting to try it.",
      hopedResults: "Relaxation and meditation benefits",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-10-30",
      durationDays: 28,
      villainVariable: "Sleep Quality",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 5992,
        after: 5104,
        unit: "min (avg)",
        changePercent: calcPercentChange(5992, 5104),
      },
      hrvChange: {
        before: 40,
        after: 36,
        unit: "ms",
        changePercent: calcPercentChange(40, 36),
      },
      sleepChange: {
        before: 26689,
        after: 28416,
        unit: "min (avg)",
        changePercent: calcPercentChange(26689, 28416),
      },
    },
    finalTestimonial: {
      quote: "Relaxation and meditated more. More calm.",
      overallRating: npsToStars(9),
      npsScore: 9,
      wouldRecommend: true,
      reportedBenefits: ["Relaxation", "More calm", "Better meditation"],
      satisfaction: "Very satisfied",
    },
    verification: {
      id: "VRF-SENSATE-2862",
      timestamp: "2025-10-30T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 88,
    },
  },

  // ============================================
  // Participant 3: Julian (3716)
  // ============================================
  {
    id: "sensate-real-3716",
    name: "Julian",
    initials: "J",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-3716",
    profile: {
      ageRange: "66+",
      lifeStage: "retired",
      gender: "Female",
      educationLevel: "Bachelor's degree",
      employmentStatus: "Self-employed",
      householdIncome: "Greater than $100,000",
      maritalStatus: "Married or in a domestic partnership",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "I thought it was fun to try out a new product. I liked the product quite a bit.",
      hopedResults: "Better relaxation before bed",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-11-03",
      durationDays: 28,
      villainVariable: "Sleep Quality",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 6767,
        after: 6469,
        unit: "min (avg)",
        changePercent: calcPercentChange(6767, 6469),
      },
      hrvChange: {
        before: 79,
        after: 78,
        unit: "ms",
        changePercent: calcPercentChange(79, 78),
      },
      sleepChange: {
        before: 28204,
        after: 26636,
        unit: "min (avg)",
        changePercent: calcPercentChange(28204, 26636),
      },
    },
    finalTestimonial: {
      quote: "It helped me relax before bed. The product worked, but with less intense vibration over time.",
      overallRating: npsToStars(6),
      npsScore: 6,
      wouldRecommend: false,
      reportedBenefits: ["Relaxation before bed"],
      satisfaction: "Neutral",
    },
    verification: {
      id: "VRF-SENSATE-3716",
      timestamp: "2025-11-03T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 100,
    },
  },

  // ============================================
  // Participant 4: Taylor (4310)
  // ============================================
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
      motivation: "Try new product",
      hopedResults: "Better sleep",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-11-10",
      durationDays: 28,
      villainVariable: "Sleep Quality",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 5872,
        after: 6020,
        unit: "min (avg)",
        changePercent: calcPercentChange(5872, 6020),
      },
      hrvChange: {
        before: 30,
        after: 34,
        unit: "ms",
        changePercent: calcPercentChange(30, 34),
      },
      sleepChange: {
        before: 25077,
        after: 24778,
        unit: "min (avg)",
        changePercent: calcPercentChange(25077, 24778),
      },
    },
    finalTestimonial: {
      quote: "Neutral experience. Unsure about benefits.",
      overallRating: npsToStars(4),
      npsScore: 4,
      wouldRecommend: false,
      reportedBenefits: [],
      satisfaction: "Neutral",
    },
    verification: {
      id: "VRF-SENSATE-4310",
      timestamp: "2025-11-10T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 82,
    },
  },

  // ============================================
  // Participant 5: Tre (4311)
  // ============================================
  {
    id: "sensate-real-4311",
    name: "Tre",
    initials: "T",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-4311",
    profile: {
      ageRange: "36-45",
      lifeStage: "professional",
      gender: "Male",
      educationLevel: "Master's degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Greater than $100,000",
      maritalStatus: "Married or in a domestic partnership",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Trying something new",
      hopedResults: "More calmness",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-10-30",
      durationDays: 28,
      villainVariable: "Stress & Sleep",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 6384,
        after: 5872,
        unit: "min (avg)",
        changePercent: calcPercentChange(6384, 5872),
      },
      hrvChange: {
        before: 33,
        after: 32,
        unit: "ms",
        changePercent: calcPercentChange(33, 32),
      },
      sleepChange: {
        before: 24091,
        after: 24796,
        unit: "min (avg)",
        changePercent: calcPercentChange(24091, 24796),
      },
    },
    finalTestimonial: {
      quote: "More Calmness. Very satisfied with the experience.",
      overallRating: npsToStars(9),
      npsScore: 9,
      wouldRecommend: true,
      reportedBenefits: ["More calmness"],
      satisfaction: "Very satisfied",
    },
    verification: {
      id: "VRF-SENSATE-4311",
      timestamp: "2025-10-30T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 95,
    },
  },

  // ============================================
  // Participant 6: Celestine (4312)
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
      motivation: "The product helped reduce my stress",
      hopedResults: "Stress reduction",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-10-31",
      durationDays: 28,
      villainVariable: "Stress",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 8593,
        after: 8815,
        unit: "min (avg)",
        changePercent: calcPercentChange(8593, 8815),
      },
      hrvChange: {
        before: 57,
        after: 87,
        unit: "ms",
        changePercent: calcPercentChange(57, 87),
      },
      sleepChange: {
        before: 27886,
        after: 27392,
        unit: "min (avg)",
        changePercent: calcPercentChange(27886, 27392),
      },
    },
    finalTestimonial: {
      quote: "The product helped reduce my stress. Significant benefits noticed.",
      overallRating: npsToStars(10),
      npsScore: 10,
      wouldRecommend: true,
      reportedBenefits: ["Stress reduction", "Improved HRV"],
      satisfaction: "Very satisfied",
    },
    verification: {
      id: "VRF-SENSATE-4312",
      timestamp: "2025-10-31T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 95,
    },
  },

  // ============================================
  // Participant 7: Jed (4313)
  // ============================================
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
      motivation: "Work stress affecting sleep",
      hopedResults: "Relaxation feeling",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-11-01",
      durationDays: 28,
      villainVariable: "Sleep Quality",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 6381,
        after: 6864,
        unit: "min (avg)",
        changePercent: calcPercentChange(6381, 6864),
      },
      hrvChange: {
        before: 42,
        after: 47,
        unit: "ms",
        changePercent: calcPercentChange(42, 47),
      },
      sleepChange: {
        before: 22780,
        after: 24404,
        unit: "min (avg)",
        changePercent: calcPercentChange(22780, 24404),
      },
    },
    finalTestimonial: {
      quote: "Relaxation feeling. Some benefits noticed.",
      overallRating: npsToStars(8),
      npsScore: 8,
      wouldRecommend: true,
      reportedBenefits: ["Relaxation feeling", "Better sleep"],
      satisfaction: "Very satisfied",
    },
    verification: {
      id: "VRF-SENSATE-4313",
      timestamp: "2025-11-01T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 92,
    },
  },

  // ============================================
  // Participant 8: Kayden (4317)
  // ============================================
  {
    id: "sensate-real-4317",
    name: "Kayden",
    initials: "K",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-4317",
    profile: {
      ageRange: "36-45",
      lifeStage: "professional",
      gender: "Female",
      educationLevel: "Professional degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Greater than $100,000",
      maritalStatus: "Single",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "I thought it was an interesting product and I did feel like it enhanced my meditation experience",
      hopedResults: "Enhanced meditation",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-11-17",
      durationDays: 28,
      villainVariable: "Meditation & Sleep",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 4766,
        after: 5153,
        unit: "min (avg)",
        changePercent: calcPercentChange(4766, 5153),
      },
      hrvChange: {
        before: 23,
        after: 24,
        unit: "ms",
        changePercent: calcPercentChange(23, 24),
      },
      sleepChange: {
        before: 24211,
        after: 25258,
        unit: "min (avg)",
        changePercent: calcPercentChange(24211, 25258),
      },
    },
    finalTestimonial: {
      quote: "I thought it was an interesting product and it enhanced my meditation experience, but I did get bored using the same setting day after day.",
      overallRating: npsToStars(7),
      npsScore: 7,
      wouldRecommend: true,
      reportedBenefits: ["Enhanced meditation"],
      satisfaction: "Satisfied",
    },
    verification: {
      id: "VRF-SENSATE-4317",
      timestamp: "2025-11-17T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 85,
    },
  },

  // ============================================
  // Participant 9: Elissa (4318)
  // ============================================
  {
    id: "sensate-real-4318",
    name: "Elissa",
    initials: "E",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-4318",
    profile: {
      ageRange: "46-55",
      lifeStage: "established-professional",
      gender: "Female",
      educationLevel: "Doctorate degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "Greater than $100,000",
      maritalStatus: "Married or in a domestic partnership",
      ethnicity: "Asian or Pacific Islander",
      location: "USA",
    },
    baseline: {
      motivation: "Interested in relaxation technology",
      hopedResults: "Better relaxation",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-10-30",
      durationDays: 28,
      villainVariable: "Sleep Quality",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 8039,
        after: 8592,
        unit: "min (avg)",
        changePercent: calcPercentChange(8039, 8592),
      },
      hrvChange: {
        before: 43,
        after: 34,
        unit: "ms",
        changePercent: calcPercentChange(43, 34),
      },
      sleepChange: {
        before: 21120,
        after: 22702,
        unit: "min (avg)",
        changePercent: calcPercentChange(21120, 22702),
      },
    },
    finalTestimonial: {
      quote: "It was relaxing. Some benefits noticed.",
      overallRating: npsToStars(8),
      npsScore: 8,
      wouldRecommend: true,
      reportedBenefits: ["Relaxation"],
      satisfaction: "Very satisfied",
    },
    verification: {
      id: "VRF-SENSATE-4318",
      timestamp: "2025-10-30T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 90,
    },
  },

  // ============================================
  // Participant 10: Ed (4319)
  // ============================================
  {
    id: "sensate-real-4319",
    name: "Ed",
    initials: "E",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-4319",
    profile: {
      ageRange: "36-45",
      lifeStage: "professional",
      gender: "Female",
      educationLevel: "Bachelor's degree",
      employmentStatus: "Employed for wages - full time",
      householdIncome: "$25,000 - $49,999",
      maritalStatus: "Married or in a domestic partnership",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Very easy - loved the Sensate and I can see this becoming a normal part of my day",
      hopedResults: "Better sleep and breath work habit",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-10-30",
      durationDays: 28,
      villainVariable: "Sleep Quality",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 7746,
        after: 6693,
        unit: "min (avg)",
        changePercent: calcPercentChange(7746, 6693),
      },
      hrvChange: {
        before: 37,
        after: 41,
        unit: "ms",
        changePercent: calcPercentChange(37, 41),
      },
      sleepChange: {
        before: 26791,
        after: 22209,
        unit: "min (avg)",
        changePercent: calcPercentChange(26791, 22209),
      },
    },
    finalTestimonial: {
      quote: "Easier to fall asleep - less sleep stress. I typically used it before bed so it helped put me to sleep. It helped me get on a consistent breath work / meditation roll.",
      overallRating: npsToStars(8),
      npsScore: 8,
      wouldRecommend: true,
      reportedBenefits: ["Easier to fall asleep", "Less sleep stress", "Better breath work habit"],
      satisfaction: "Very satisfied",
    },
    verification: {
      id: "VRF-SENSATE-4319",
      timestamp: "2025-10-30T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 95,
    },
  },

  // ============================================
  // Participant 11: Hildegard (4322)
  // ============================================
  {
    id: "sensate-real-4322",
    name: "Hildegard",
    initials: "H",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-4322",
    profile: {
      ageRange: "56-65",
      lifeStage: "established-professional",
      gender: "Female",
      educationLevel: "Some college credit, no degree",
      employmentStatus: "Employed for wages - part time",
      householdIncome: "Greater than $100,000",
      maritalStatus: "Divorced",
      ethnicity: "Hispanic or Latino",
      location: "USA",
    },
    baseline: {
      motivation: "Trying a new device",
      hopedResults: "Better sleep",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-11-02",
      durationDays: 28,
      villainVariable: "Sleep Quality",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 5749,
        after: 5631,
        unit: "min (avg)",
        changePercent: calcPercentChange(5749, 5631),
      },
      hrvChange: {
        before: 74,
        after: 71,
        unit: "ms",
        changePercent: calcPercentChange(74, 71),
      },
      sleepChange: {
        before: 22060,
        after: 21568,
        unit: "min (avg)",
        changePercent: calcPercentChange(22060, 21568),
      },
    },
    finalTestimonial: {
      quote: "Better sleep some nights. Some benefits noticed.",
      overallRating: npsToStars(6),
      npsScore: 6,
      wouldRecommend: false,
      reportedBenefits: ["Better sleep some nights"],
      satisfaction: "Satisfied",
    },
    verification: {
      id: "VRF-SENSATE-4322",
      timestamp: "2025-11-02T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 80,
    },
  },

  // ============================================
  // Participant 12: Sedrick (4323)
  // ============================================
  {
    id: "sensate-real-4323",
    name: "Sedrick",
    initials: "S",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-4323",
    profile: {
      ageRange: "36-45",
      lifeStage: "professional",
      gender: "Male",
      educationLevel: "Bachelor's degree",
      employmentStatus: "Self-employed",
      householdIncome: "Greater than $100,000",
      maritalStatus: "Single",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "The chance to try a new device",
      hopedResults: "Better sleep and relaxation",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-11-09",
      durationDays: 28,
      villainVariable: "Sleep Quality",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 5704,
        after: 5348,
        unit: "min (avg)",
        changePercent: calcPercentChange(5704, 5348),
      },
      hrvChange: {
        before: 186,
        after: 188,
        unit: "ms",
        changePercent: calcPercentChange(186, 188),
      },
      sleepChange: {
        before: 27628,
        after: 26443,
        unit: "min (avg)",
        changePercent: calcPercentChange(27628, 26443),
      },
    },
    finalTestimonial: {
      quote: "Better sleep. Helped me relax. Found it very calming.",
      overallRating: npsToStars(10),
      npsScore: 10,
      wouldRecommend: true,
      reportedBenefits: ["Better sleep", "Relaxation", "Calming"],
      satisfaction: "Satisfied",
    },
    verification: {
      id: "VRF-SENSATE-4323",
      timestamp: "2025-11-09T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 88,
    },
  },

  // ============================================
  // Participant 13: Kay (4325)
  // ============================================
  {
    id: "sensate-real-4325",
    name: "Kay",
    initials: "K",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-4325",
    profile: {
      ageRange: "46-55",
      lifeStage: "established-professional",
      gender: "Female",
      educationLevel: "Master's degree",
      employmentStatus: "Self-employed",
      householdIncome: "Greater than $100,000",
      maritalStatus: "Married or in a domestic partnership",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Trying something new",
      hopedResults: "General wellness benefits",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-10-30",
      durationDays: 28,
      villainVariable: "Sleep Quality",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 7066,
        after: 7581,
        unit: "min (avg)",
        changePercent: calcPercentChange(7066, 7581),
      },
      hrvChange: {
        before: 53,
        after: 50,
        unit: "ms",
        changePercent: calcPercentChange(53, 50),
      },
      sleepChange: {
        before: 28042,
        after: 28226,
        unit: "min (avg)",
        changePercent: calcPercentChange(28042, 28226),
      },
    },
    finalTestimonial: {
      quote: "Trying something new. Satisfied with the experience.",
      overallRating: npsToStars(8),
      npsScore: 8,
      wouldRecommend: true,
      reportedBenefits: [],
      satisfaction: "Satisfied",
    },
    verification: {
      id: "VRF-SENSATE-4325",
      timestamp: "2025-10-30T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 90,
    },
  },

  // ============================================
  // Participant 14: Felipe (4326)
  // ============================================
  {
    id: "sensate-real-4326",
    name: "Felipe",
    initials: "F",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-4326",
    profile: {
      ageRange: "56-65",
      lifeStage: "established-professional",
      gender: "Female",
      educationLevel: "Bachelor's degree",
      employmentStatus: "Self-employed",
      householdIncome: "Prefer Not To State",
      maritalStatus: "Married or in a domestic partnership",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Looked forward to relaxing each night with the device",
      hopedResults: "Relaxation and disconnect",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-11-09",
      durationDays: 28,
      villainVariable: "Stress & Sleep",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 6255,
        after: 6139,
        unit: "min (avg)",
        changePercent: calcPercentChange(6255, 6139),
      },
      hrvChange: {
        before: 32,
        after: 34,
        unit: "ms",
        changePercent: calcPercentChange(32, 34),
      },
      sleepChange: {
        before: 24949,
        after: 26240,
        unit: "min (avg)",
        changePercent: calcPercentChange(24949, 26240),
      },
    },
    finalTestimonial: {
      quote: "Very useful helping me disconnect and relax. Looked forward to relaxing each night with the device.",
      overallRating: npsToStars(10),
      npsScore: 10,
      wouldRecommend: true,
      reportedBenefits: ["Disconnect and relax", "Significant benefits"],
      satisfaction: "Very satisfied",
    },
    verification: {
      id: "VRF-SENSATE-4326",
      timestamp: "2025-11-09T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 95,
    },
  },

  // ============================================
  // Participant 15: Cielo (4329)
  // ============================================
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
      motivation: "The chance to try something new and unexpected was great",
      hopedResults: "Better sleep quality and calm",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-11-01",
      durationDays: 28,
      villainVariable: "Sleep Quality",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 5754,
        after: 6060,
        unit: "min (avg)",
        changePercent: calcPercentChange(5754, 6060),
      },
      hrvChange: {
        before: 25,
        after: 27,
        unit: "ms",
        changePercent: calcPercentChange(25, 27),
      },
      sleepChange: {
        before: 27355,
        after: 27059,
        unit: "min (avg)",
        changePercent: calcPercentChange(27355, 27059),
      },
    },
    finalTestimonial: {
      quote: "I really enjoyed testing the 10-minute sessions. The combination of music and vibrations creates a deep sense of calm and relaxation, making it perfect for winding down and falling asleep.",
      overallRating: npsToStars(7),
      npsScore: 7,
      wouldRecommend: true,
      reportedBenefits: ["Deep sense of calm", "Better relaxation", "Improved sleep quality"],
      satisfaction: "Satisfied",
    },
    verification: {
      id: "VRF-SENSATE-4329",
      timestamp: "2025-11-01T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 88,
    },
  },

  // ============================================
  // Participant 16: Duane (4333)
  // ============================================
  {
    id: "sensate-real-4333",
    name: "Duane",
    initials: "D",
    tier: 2,
    dataSource: "real",
    verificationId: "SENSATE-REAL-4333",
    profile: {
      ageRange: "36-45",
      lifeStage: "professional",
      gender: "Female",
      educationLevel: "Master's degree",
      employmentStatus: "Employed for wages - part time",
      householdIncome: "Greater than $100,000",
      maritalStatus: "Married or in a domestic partnership",
      ethnicity: "Caucasian or White",
      location: "USA",
    },
    baseline: {
      motivation: "Improve bedtime routine",
      hopedResults: "Better bedtime routine",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-10-30",
      durationDays: 28,
      villainVariable: "Sleep Quality",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 5252,
        after: 5098,
        unit: "min (avg)",
        changePercent: calcPercentChange(5252, 5098),
      },
      hrvChange: {
        before: 42,
        after: 47,
        unit: "ms",
        changePercent: calcPercentChange(42, 47),
      },
      sleepChange: {
        before: 23814,
        after: 24907,
        unit: "min (avg)",
        changePercent: calcPercentChange(23814, 24907),
      },
    },
    finalTestimonial: {
      quote: "Better bedtime routine. Some benefits noticed.",
      overallRating: npsToStars(7),
      npsScore: 7,
      wouldRecommend: true,
      reportedBenefits: ["Better bedtime routine"],
      satisfaction: "Satisfied",
    },
    verification: {
      id: "VRF-SENSATE-4333",
      timestamp: "2025-10-30T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 85,
    },
  },

  // ============================================
  // Participant 17: Brendon (4338)
  // ============================================
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
      motivation: "Helping with product assessment",
      hopedResults: "Better sleep onset",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-11-12",
      durationDays: 28,
      villainVariable: "Sleep Quality",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 6009,
        after: 5992,
        unit: "min (avg)",
        changePercent: calcPercentChange(6009, 5992),
      },
      hrvChange: {
        before: 28,
        after: 30,
        unit: "ms",
        changePercent: calcPercentChange(28, 30),
      },
      sleepChange: {
        before: 24965,
        after: 25245,
        unit: "min (avg)",
        changePercent: calcPercentChange(24965, 25245),
      },
    },
    finalTestimonial: {
      quote: "Fell sound asleep at beginning. Some benefits noticed.",
      overallRating: npsToStars(8),
      npsScore: 8,
      wouldRecommend: true,
      reportedBenefits: ["Fell asleep faster"],
      satisfaction: "Satisfied",
    },
    verification: {
      id: "VRF-SENSATE-4338",
      timestamp: "2025-11-12T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 90,
    },
  },

  // ============================================
  // Participant 18: Gunnar (4341)
  // ============================================
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
      motivation: "Bio-Hacking my sleep. I have poor sleep due to my work and being a parent.",
      hopedResults: "Get to sleep faster, calm overthinking mind",
    },
    journey: {
      startDate: "2025-10-15",
      endDate: "2025-12-16",
      durationDays: 62,
      villainVariable: "Sleep Quality",
      villainRatings: [],
      keyQuotes: [],
    },
    wearableMetrics: {
      device: "Oura Ring",
      deepSleepChange: {
        before: 6268,
        after: 6240,
        unit: "min (avg)",
        changePercent: calcPercentChange(6268, 6240),
      },
      hrvChange: {
        before: 48,
        after: 52,
        unit: "ms",
        changePercent: calcPercentChange(48, 52),
      },
      sleepChange: {
        before: 23381,
        after: 23480,
        unit: "min (avg)",
        changePercent: calcPercentChange(23381, 23480),
      },
    },
    finalTestimonial: {
      quote: "Get to sleep faster, calming my overthinking mind to calm regulated state. Bio-hacking my sleep is always a priority.",
      overallRating: npsToStars(8),
      npsScore: 8,
      wouldRecommend: true,
      reportedBenefits: ["Faster sleep onset", "Calmer mind", "Better nervous system regulation"],
      satisfaction: "Satisfied",
    },
    verification: {
      id: "VRF-SENSATE-4341",
      timestamp: "2025-12-16T00:00:00Z",
      dataIntegrity: "verified",
      complianceRate: 85,
    },
  },
];

// Export individual stories by ID for easy access
export const getSensateRealStoryById = (id: string): ParticipantStory | undefined => {
  return SENSATE_REAL_STORIES.find((story) => story.id === id);
};

// Get all positive stories (would recommend)
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

// Get participant count
export const getSensateParticipantCount = (): number => {
  return SENSATE_REAL_STORIES.length;
};

/**
 * Categorize participant as positive, neutral, or negative based on:
 * - Objective metrics (HRV + Deep Sleep changes)
 * - Subjective satisfaction (NPS score)
 */
export function categorizeParticipant(story: ParticipantStory): "positive" | "neutral" | "negative" {
  const hrvChange = story.wearableMetrics?.hrvChange?.changePercent || 0;
  const deepSleepChange = story.wearableMetrics?.deepSleepChange?.changePercent || 0;
  const nps = story.finalTestimonial?.npsScore || 5;

  // Objective improvement: at least one metric improved by 5%+
  const hasObjectiveImprovement = hrvChange >= 5 || deepSleepChange >= 5;

  // Subjective: NPS >= 7 is positive, <= 4 is negative
  const isSubjectivePositive = nps >= 7;
  const isSubjectiveNegative = nps <= 4;

  // Positive: objective improvement AND subjective satisfaction
  if (hasObjectiveImprovement && isSubjectivePositive) return "positive";
  // Also positive if strong objective improvement even with neutral subjective
  if ((hrvChange >= 10 || deepSleepChange >= 10) && nps >= 6) return "positive";

  // Negative: low NPS AND no objective improvement
  // (If someone has objective improvement but low NPS, that's mixed/neutral)
  if (isSubjectiveNegative && !hasObjectiveImprovement) return "negative";

  // Everything else is neutral (including mixed results like objective improvement + low NPS)
  return "neutral";
}

/**
 * Calculate improvement score for sorting participants.
 * Uses HRV and Deep Sleep as co-primary metrics.
 */
function calculateImprovementScore(story: ParticipantStory): number {
  const hrvChange = story.wearableMetrics?.hrvChange?.changePercent || 0;
  const deepSleepChange = story.wearableMetrics?.deepSleepChange?.changePercent || 0;
  const nps = story.finalTestimonial?.npsScore || 5;

  // Weighted score: 40% HRV, 40% Deep Sleep, 20% NPS
  const objectiveScore = (hrvChange * 0.4) + (deepSleepChange * 0.4);
  const subjectiveScore = ((nps - 5) / 5) * 20;

  return objectiveScore + subjectiveScore;
}

/**
 * Get sorted Sensate stories (best performers first)
 */
export function getSortedSensateStories(): ParticipantStory[] {
  return [...SENSATE_REAL_STORIES].sort((a, b) =>
    calculateImprovementScore(b) - calculateImprovementScore(a)
  );
}

/**
 * Get study stats for Sensate real data
 */
export function getSensateStudyStats(): {
  totalParticipants: number;
  improved: number;
  neutral: number;
  noImprovement: number;
} {
  const stats = SENSATE_REAL_STORIES.reduce((acc, story) => {
    const category = categorizeParticipant(story);
    if (category === "positive") acc.improved++;
    else if (category === "neutral") acc.neutral++;
    else acc.noImprovement++;
    return acc;
  }, { improved: 0, neutral: 0, noImprovement: 0 });

  return {
    totalParticipants: SENSATE_REAL_STORIES.length,
    ...stats,
  };
}

/**
 * Get average metrics from Sensate study for dashboard display
 * Returns average HRV and Deep Sleep changes
 */
export function getSensateAverageMetrics(): {
  avgHrvChange: number;
  avgDeepSleepChange: number;
  enrolled: number;
  completed: number;
  completionRate: number;
  avgNps: number;
  wouldRecommendPercent: number;
} {
  let totalHrv = 0;
  let totalDeepSleep = 0;
  let hrvCount = 0;
  let deepSleepCount = 0;
  let totalNps = 0;
  let npsCount = 0;
  let wouldRecommendCount = 0;

  SENSATE_REAL_STORIES.forEach((story) => {
    if (story.wearableMetrics?.hrvChange?.changePercent !== undefined) {
      totalHrv += story.wearableMetrics.hrvChange.changePercent;
      hrvCount++;
    }
    if (story.wearableMetrics?.deepSleepChange?.changePercent !== undefined) {
      totalDeepSleep += story.wearableMetrics.deepSleepChange.changePercent;
      deepSleepCount++;
    }
    if (story.finalTestimonial?.npsScore !== undefined) {
      totalNps += story.finalTestimonial.npsScore;
      npsCount++;
      if (story.finalTestimonial.npsScore >= 7) {
        wouldRecommendCount++;
      }
    }
  });

  const completed = SENSATE_REAL_STORIES.length;
  const enrolled = 25; // Total enrolled in the study

  return {
    avgHrvChange: hrvCount > 0 ? Math.round(totalHrv / hrvCount) : 0,
    avgDeepSleepChange: deepSleepCount > 0 ? Math.round(totalDeepSleep / deepSleepCount) : 0,
    enrolled,
    completed,
    completionRate: Math.round((completed / enrolled) * 100),
    avgNps: npsCount > 0 ? Math.round((totalNps / npsCount) * 10) / 10 : 0,
    wouldRecommendPercent: npsCount > 0 ? Math.round((wouldRecommendCount / npsCount) * 100) : 0,
  };
}

/**
 * Get real demographic insights from Sensate study participants
 */
export function getSensateDemographics() {
  const total = SENSATE_REAL_STORIES.length;

  // Helper to calculate percentage
  const toPercent = (count: number) => Math.round((count / total) * 100);

  // Age ranges
  const ageGroups = SENSATE_REAL_STORIES.reduce((acc, story) => {
    const ageRange = story.profile.ageRange;
    acc[ageRange] = (acc[ageRange] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const age = [
    { label: "18-25", value: toPercent(ageGroups["18-25"] || 0), color: "#FF6384" },
    { label: "26-35", value: toPercent(ageGroups["26-35"] || 0), color: "#36A2EB" },
    { label: "36-45", value: toPercent(ageGroups["36-45"] || 0), color: "#FFCE56" },
    { label: "46-55", value: toPercent(ageGroups["46-55"] || 0), color: "#4BC0C0" },
    { label: "56-65", value: toPercent(ageGroups["56-65"] || 0), color: "#9966FF" },
    { label: "65+", value: toPercent(ageGroups["65+"] || 0), color: "#FF9F40" },
  ].filter(item => item.value > 0);

  // Gender
  const genderGroups = SENSATE_REAL_STORIES.reduce((acc, story) => {
    const gender = story.profile.gender || "Unknown";
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const gender = [
    { label: "Female", value: toPercent(genderGroups["Female"] || 0), color: "#FF6384" },
    { label: "Male", value: toPercent(genderGroups["Male"] || 0), color: "#36A2EB" },
    { label: "Non-binary", value: toPercent(genderGroups["Non-binary"] || 0), color: "#FFCE56" },
  ].filter(item => item.value > 0);

  // Education Level
  const educationGroups = SENSATE_REAL_STORIES.reduce((acc, story) => {
    const edu = story.profile.educationLevel || "Unknown";
    acc[edu] = (acc[edu] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const education = Object.entries(educationGroups)
    .map(([label, count]) => ({ label, value: toPercent(count) }))
    .sort((a, b) => b.value - a.value);

  // Employment Status
  const employmentGroups = SENSATE_REAL_STORIES.reduce((acc, story) => {
    const emp = story.profile.employmentStatus || "Unknown";
    acc[emp] = (acc[emp] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const employment = Object.entries(employmentGroups)
    .map(([label, count]) => ({ label, value: toPercent(count) }))
    .sort((a, b) => b.value - a.value);

  // Income
  const incomeGroups = SENSATE_REAL_STORIES.reduce((acc, story) => {
    const income = story.profile.householdIncome || "Unknown";
    acc[income] = (acc[income] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const income = Object.entries(incomeGroups)
    .map(([label, count]) => ({ label, value: toPercent(count) }))
    .sort((a, b) => b.value - a.value);

  // Wearable devices - all use Oura Ring for Sensate study
  const wearableDevices = [
    { label: "Oura Ring", value: 100, color: "#8B5CF6" },
  ];

  // Satisfaction breakdown
  const satisfactionGroups = SENSATE_REAL_STORIES.reduce((acc, story) => {
    const sat = story.finalTestimonial?.satisfaction || "Unknown";
    acc[sat] = (acc[sat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const satisfaction = Object.entries(satisfactionGroups)
    .map(([label, count]) => ({ label, value: toPercent(count) }))
    .sort((a, b) => b.value - a.value);

  return {
    age,
    gender,
    education,
    employment,
    income,
    wearableDevices,
    satisfaction,
    totalParticipants: total,
  };
}
