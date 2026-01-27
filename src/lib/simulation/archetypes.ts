/**
 * Archetype Definitions
 *
 * Participant archetypes for simulation. Each archetype represents a
 * distinct customer personality type with specific characteristics.
 */

import type { ParticipantArchetype } from '../types';

export interface ArchetypeConfig {
  weight: number;
  desperationLevel: [number, number];  // min, max
  commitmentLevel: [number, number];
  painDurations: string[];
  failedAlternativeCounts: [number, number];
  heroSymptomSeverity: [number, number];
  quotes: string[];
  hopedOutcomes: string[];
  timeframes: string[];
}

export const ARCHETYPE_DATA: Record<ParticipantArchetype, ArchetypeConfig> = {
  skeptic: {
    weight: 0.15,
    desperationLevel: [3, 5],
    commitmentLevel: [4, 6],
    painDurations: ["1-6 months", "6-12 months"],
    failedAlternativeCounts: [1, 2],
    heroSymptomSeverity: [4, 6],
    quotes: [
      "I've tried a few things before, nothing really worked. Figured I'd give this a shot.",
      "My friend recommended this, so I'm skeptical but willing to try.",
      "Not expecting miracles, but maybe it'll help a little.",
      "I've been let down before, but the reviews looked decent.",
    ],
    hopedOutcomes: [
      "See some improvement, even if small",
      "Find something that actually works for once",
      "Not waste my money on another product that doesn't help",
    ],
    timeframes: ["Within 2 weeks", "Within a month"],
  },
  desperate: {
    weight: 0.25,
    desperationLevel: [8, 10],
    commitmentLevel: [9, 10],
    painDurations: ["1+ years", "2+ years", "5+ years"],
    failedAlternativeCounts: [3, 7],
    heroSymptomSeverity: [8, 10],
    quotes: [
      "I haven't slept through the night in 3 years. I'm willing to try anything at this point.",
      "This has been ruining my life. I've tried everything - prescription meds, therapy, apps, you name it.",
      "My anxiety has gotten so bad I can barely function at work. This is my last hope.",
      "I've spent thousands on treatments. If this doesn't work, I don't know what else to do.",
      "My relationships are suffering because of this. I need something to change.",
    ],
    hopedOutcomes: [
      "Finally get relief after years of struggling",
      "Feel normal again",
      "Get my life back",
      "Stop suffering every single day",
    ],
    timeframes: ["As soon as possible", "Within a week", "I need this now"],
  },
  power_user: {
    weight: 0.20,
    desperationLevel: [5, 7],
    commitmentLevel: [8, 10],
    painDurations: ["6-12 months", "1+ years"],
    failedAlternativeCounts: [2, 4],
    heroSymptomSeverity: [5, 7],
    quotes: [
      "I track everything with my Oura ring. Looking for something to move the needle on my HRV.",
      "I've optimized diet and exercise. This is the last piece of the puzzle.",
      "My sleep scores are good but I want great. Always looking to optimize.",
      "I read the research papers on this. The mechanism of action looks promising.",
      "I've tried the competitors. This one has the best formulation based on my research.",
    ],
    hopedOutcomes: [
      "Measurable improvement in my biometrics",
      "Optimize my already-good baseline",
      "See the data prove it works",
      "Get that extra 5-10% improvement",
    ],
    timeframes: ["2-4 weeks to see data", "30 days for full assessment"],
  },
  struggler: {
    weight: 0.30,
    desperationLevel: [6, 8],
    commitmentLevel: [5, 7],
    painDurations: ["1-6 months", "6-12 months", "1+ years"],
    failedAlternativeCounts: [1, 3],
    heroSymptomSeverity: [6, 8],
    quotes: [
      "The afternoon crashes are killing my productivity. I need help.",
      "I feel like I'm just going through the motions every day.",
      "It's not unbearable, but I know I could feel so much better.",
      "I've been dealing with this for a while and finally decided to do something about it.",
      "My doctor said to try lifestyle changes first. This seems worth a shot.",
    ],
    hopedOutcomes: [
      "Feel more like myself again",
      "Have energy for the things I enjoy",
      "Stop feeling so run down all the time",
      "Be more present with my family",
    ],
    timeframes: ["Within 2-3 weeks", "By the end of the month"],
  },
  optimist: {
    weight: 0.10,
    desperationLevel: [2, 4],
    commitmentLevel: [7, 9],
    painDurations: ["Less than 1 month", "1-6 months"],
    failedAlternativeCounts: [0, 1],
    heroSymptomSeverity: [3, 5],
    quotes: [
      "Excited to see what this can do for me!",
      "A friend had amazing results, I can't wait to try it myself.",
      "I believe in being proactive about health. This looks perfect.",
      "The testimonials convinced me. Ready to be the next success story!",
    ],
    hopedOutcomes: [
      "Feel even better than I already do",
      "Proactively improve my wellness",
      "Join the happy customers I read about",
      "Take my health to the next level",
    ],
    timeframes: ["Hoping to feel something within a week!", "Can't wait to see results"],
  },
};

/**
 * Select an archetype based on configured weights
 */
export function selectArchetype(): ParticipantArchetype {
  const archetypes = Object.keys(ARCHETYPE_DATA) as ParticipantArchetype[];
  const weights = archetypes.map(a => ARCHETYPE_DATA[a].weight);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < archetypes.length; i++) {
    random -= weights[i];
    if (random <= 0) return archetypes[i];
  }
  return archetypes[archetypes.length - 1];
}

/**
 * Get archetype configuration
 */
export function getArchetypeConfig(archetype: ParticipantArchetype): ArchetypeConfig {
  return ARCHETYPE_DATA[archetype];
}

/**
 * Get baseline score modifier for archetype
 * Desperate people tend to have worse baselines, optimists better
 */
export function getArchetypeScoreModifier(archetype: ParticipantArchetype): number {
  switch (archetype) {
    case 'desperate': return -15;
    case 'skeptic': return -5;
    case 'optimist': return 10;
    case 'power_user': return 5;
    default: return 0;
  }
}
