// Sample Story Generator for Verification Previews
// Generates realistic preview stories based on study configuration

import { TierLevel, getCategoryConfig, getAssessmentById, AssessmentResult } from "./assessments";
import { ParticipantStory } from "./mock-data";

// Sample participant profiles for different categories
interface SampleProfile {
  name: string;
  initials: string;
  avatarUrl: string;
  ageRange: string;
  lifeStages: Record<string, string>;
  rating: number;
}

const SAMPLE_PROFILES: SampleProfile[] = [
  {
    name: "Sarah M.",
    initials: "SM",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    ageRange: "25-34",
    lifeStages: {
      sleep: "Busy professional balancing career and wellness",
      recovery: "Weekend warrior optimizing performance",
      fitness: "Active lifestyle enthusiast",
      stress: "High-achiever managing work-life balance",
      energy: "Remote worker seeking afternoon clarity",
      focus: "Creative professional with demanding deadlines",
      mood: "Parent navigating daily responsibilities",
      anxiety: "Professional facing high-stakes decisions",
      pain: "Desk worker managing chronic discomfort",
      skin: "Health-conscious adult investing in self-care",
      gut: "Clean eating advocate with digestive concerns",
      immunity: "Frequent traveler boosting resilience",
      hair: "Style-conscious professional",
      weight: "Fitness enthusiast optimizing body composition",
      libido: "Partner prioritizing relationship wellness",
    },
    rating: 4.8,
  },
];

// Category-specific story content templates
interface StoryTemplate {
  motivations: string[];
  hopedResults: string[];
  villainVariables: string[];
  wellnessGoals: string[];
  journeyHighlights: { day: number; note: string }[];
  keyQuotes: { context: string; quote: string }[];
  testimonialDay1: string;
  testimonialDay30Change: string;
  testimonialDay30Surprise: string;
}

const STORY_TEMPLATES: Record<string, StoryTemplate> = {
  sleep: {
    motivations: [
      "I've tried many sleep supplements, but nothing gave me lasting results. My wearable shows I'm barely getting any deep sleep.",
      "Between work stress and late-night screen time, my sleep quality has tanked. I need something that actually works.",
    ],
    hopedResults: [
      "I want to wake up feeling genuinely refreshed and see better sleep scores on my tracker.",
      "I'm hoping to finally break the cycle of tossing and turning and actually get restorative sleep.",
    ],
    villainVariables: ["poor sleep quality", "insomnia", "nighttime waking", "afternoon brain fog"],
    wellnessGoals: ["Better sleep quality", "More restorative rest", "Wake up energized"],
    journeyHighlights: [
      { day: 7, note: "Maybe falling asleep a bit faster? Hard to tell yet." },
      { day: 14, note: "Definitely noticing deeper sleep - my tracker shows more deep sleep minutes." },
      { day: 21, note: "Waking up refreshed more often. Husband noticed I'm less groggy." },
      { day: 28, note: "Best sleep I've had in months. The data backs up how I feel." },
    ],
    keyQuotes: [
      { context: "Week 2 check-in", quote: "I actually made it through a 3pm meeting without zoning out for the first time in months." },
      { context: "Final reflection", quote: "The improvement was gradual but undeniable. My wearable confirms what I feel - this actually worked." },
    ],
    testimonialDay1: "I wake up exhausted no matter how long I sleep. The afternoons are the worst - complete brain fog hits around 2pm.",
    testimonialDay30Change: "Night and day difference! I'm actually waking up refreshed and the afternoon crashes are basically gone.",
    testimonialDay30Surprise: "How quickly my wearable data reflected the changes I was feeling. The objective proof made it real.",
  },
  recovery: {
    motivations: [
      "Training hard but not recovering well. My WHOOP shows red recovery scores most days.",
      "I push myself in workouts but pay for it the next few days. Need better bounce-back.",
    ],
    hopedResults: [
      "Better HRV scores and feeling fresh for workouts more often.",
      "I want to train harder without feeling destroyed the next day.",
    ],
    villainVariables: ["poor recovery", "muscle soreness", "low HRV", "training fatigue"],
    wellnessGoals: ["Faster recovery", "Better HRV", "More training capacity"],
    journeyHighlights: [
      { day: 7, note: "Recovery feels slightly faster after yesterday's workout." },
      { day: 14, note: "Hit a PR on deadlift - actually felt fresh going in." },
      { day: 21, note: "Training 5x/week now without feeling beaten up." },
      { day: 28, note: "Best training block I've had in a year." },
    ],
    keyQuotes: [
      { context: "Week 3 check-in", quote: "My WHOOP finally showed green recovery for 5 days straight. That's never happened." },
      { context: "Final reflection", quote: "The data backs up how I feel - recovery metrics are the best they've been." },
    ],
    testimonialDay1: "I'm constantly sore and my WHOOP shows red recovery scores most days. It's limiting my training.",
    testimonialDay30Change: "My recovery scores are consistently green now. I can train harder and more often without feeling broken.",
    testimonialDay30Surprise: "How much better sleep quality affected my athletic performance. The HRV improvement was real.",
  },
  fitness: {
    motivations: [
      "Want to take my fitness to the next level but feel like I've plateaued.",
      "Looking for an edge to help me push through performance barriers.",
    ],
    hopedResults: [
      "Better endurance and more consistent energy during workouts.",
      "I want to see improvements in my workout performance metrics.",
    ],
    villainVariables: ["fitness plateau", "low endurance", "inconsistent energy", "slow progress"],
    wellnessGoals: ["Better performance", "More endurance", "Break through plateau"],
    journeyHighlights: [
      { day: 7, note: "Felt slightly more energy during morning workout." },
      { day: 14, note: "Pushed through a workout that would have gassed me before." },
      { day: 21, note: "Setting new PRs and feeling motivated to train more." },
      { day: 28, note: "Best fitness progress I've seen in months." },
    ],
    keyQuotes: [
      { context: "Week 3 check-in", quote: "I actually looked forward to my morning workout. That's new." },
      { context: "Final reflection", quote: "The performance gains were measurable. My tracker shows real improvement." },
    ],
    testimonialDay1: "I've been stuck at the same fitness level for months. Ready to break through.",
    testimonialDay30Change: "Finally seeing progress again. My workouts are stronger and I'm recovering better.",
    testimonialDay30Surprise: "How much better I felt during workouts, not just after. The energy was there when I needed it.",
  },
  stress: {
    motivations: [
      "Work stress has been off the charts. My watch says I'm always in the red zone for stress.",
      "I can't seem to turn my brain off at night. The anxiety is constant.",
    ],
    hopedResults: [
      "I want to feel calm and in control, even during busy days.",
      "Lower stress scores on my wearable and actually being able to relax.",
    ],
    villainVariables: ["work-related stress", "chronic anxiety", "racing thoughts", "tension"],
    wellnessGoals: ["Manage stress better", "Feel calmer", "Better work-life balance"],
    journeyHighlights: [
      { day: 7, note: "Feeling slightly calmer during meetings." },
      { day: 14, note: "More able to disconnect in the evenings." },
      { day: 21, note: "Colleagues noticed I seem calmer under pressure." },
      { day: 28, note: "Feel like I have my stress under control finally." },
    ],
    keyQuotes: [
      { context: "Week 3 check-in", quote: "My team said I seemed more relaxed in our strategy meeting. First time anyone's said that." },
      { context: "Final reflection", quote: "I finally feel like stress isn't controlling my life anymore." },
    ],
    testimonialDay1: "My stress levels have been through the roof. I lie awake thinking about tomorrow's meetings.",
    testimonialDay30Change: "I'm finally able to disconnect from work in the evenings. That alone is worth it.",
    testimonialDay30Surprise: "The improvement in my HRV tells the whole story. Objective stress markers improved alongside how I felt.",
  },
  energy: {
    motivations: [
      "I hit a wall every afternoon around 2pm. Coffee doesn't help anymore.",
      "I used to have so much energy but now I'm dragging through every day.",
    ],
    hopedResults: [
      "Consistent energy throughout the day without caffeine crashes.",
      "I want to be productive past 3pm for once.",
    ],
    villainVariables: ["low energy", "afternoon fatigue", "energy crashes", "mental exhaustion"],
    wellnessGoals: ["Sustainable energy", "No afternoon crashes", "Mental clarity"],
    journeyHighlights: [
      { day: 7, note: "Maybe a bit more alert in the afternoon?" },
      { day: 14, note: "Noticeably more energy after lunch." },
      { day: 21, note: "Powered through a 4pm meeting easily." },
      { day: 28, note: "Have energy for evening activities again!" },
    ],
    keyQuotes: [
      { context: "Week 2 check-in", quote: "I actually went for a run after work - haven't done that in months." },
      { context: "Final reflection", quote: "The difference in my productivity is measurable. I'm getting so much more done." },
    ],
    testimonialDay1: "I hit a wall every afternoon around 2pm. Coffee only makes it worse at this point.",
    testimonialDay30Change: "My 3pm slump is basically gone. Energy is consistent throughout the day now.",
    testimonialDay30Surprise: "How quickly the improvement happened. Within two weeks I noticed a real difference.",
  },
  focus: {
    motivations: [
      "I can't focus for more than 30 minutes without getting distracted.",
      "Brain fog has been terrible lately. I struggle to think clearly at work.",
    ],
    hopedResults: [
      "Better concentration and mental clarity during important tasks.",
      "I want to be able to focus deeply without my mind wandering.",
    ],
    villainVariables: ["brain fog", "poor concentration", "mental fatigue", "distractibility"],
    wellnessGoals: ["Better focus", "Mental clarity", "Improved concentration"],
    journeyHighlights: [
      { day: 7, note: "Slightly better focus during morning work." },
      { day: 14, note: "Completed a 2-hour deep work session without breaking." },
      { day: 21, note: "Brain fog is noticeably reduced." },
      { day: 28, note: "Mental clarity is the best it's been in months." },
    ],
    keyQuotes: [
      { context: "Week 2 check-in", quote: "Finished a whole project without reaching for distractions. That's new." },
      { context: "Final reflection", quote: "My thinking feels sharper. I can actually hold complex ideas in my head again." },
    ],
    testimonialDay1: "I struggle to focus on anything for more than 20 minutes. Brain fog hits hardest after lunch.",
    testimonialDay30Change: "My focus is back. I can work for hours without losing my train of thought.",
    testimonialDay30Surprise: "How much clearer my thinking became. It wasn't just focus - overall mental clarity improved.",
  },
  mood: {
    motivations: [
      "My mood has been all over the place. Some days are good, most are just flat.",
      "I want to feel more emotionally balanced and positive.",
    ],
    hopedResults: [
      "More consistent positive mood and emotional stability.",
      "I want to feel like myself again - more optimistic and resilient.",
    ],
    villainVariables: ["mood swings", "emotional flatness", "irritability", "low mood"],
    wellnessGoals: ["Better mood", "Emotional balance", "More positivity"],
    journeyHighlights: [
      { day: 7, note: "Felt a bit more positive this week." },
      { day: 14, note: "More good days than bad days now." },
      { day: 21, note: "Feeling more emotionally stable overall." },
      { day: 28, note: "My mood is consistently better than it's been in a while." },
    ],
    keyQuotes: [
      { context: "Week 2 check-in", quote: "I actually laughed at something silly today. Haven't felt that lightness in a while." },
      { context: "Final reflection", quote: "I feel more like myself again. More optimistic, more resilient." },
    ],
    testimonialDay1: "My mood has been flat for months. Not depressed exactly, just... muted.",
    testimonialDay30Change: "I feel more emotionally alive. The good days outnumber the blah days now.",
    testimonialDay30Surprise: "How much my mood affected everything else - energy, sleep, relationships. It all improved together.",
  },
  anxiety: {
    motivations: [
      "Anxiety has been running my life. Racing thoughts, constant worry.",
      "I want to feel calm without relying on medication.",
    ],
    hopedResults: [
      "Less anxious thoughts and more ability to relax.",
      "I want to stop the constant worrying and feel more at peace.",
    ],
    villainVariables: ["racing thoughts", "constant worry", "nervous energy", "anxiety spikes"],
    wellnessGoals: ["Less anxiety", "More calm", "Better relaxation"],
    journeyHighlights: [
      { day: 7, note: "Slightly fewer racing thoughts at night." },
      { day: 14, note: "Able to relax more easily in the evenings." },
      { day: 21, note: "Anxiety spikes are less frequent and intense." },
      { day: 28, note: "Feel calmer than I have in months." },
    ],
    keyQuotes: [
      { context: "Week 2 check-in", quote: "I sat through a stressful meeting without my heart racing. That's progress." },
      { context: "Final reflection", quote: "The constant background anxiety has quieted. I can actually be present now." },
    ],
    testimonialDay1: "My mind is always racing. I can't turn off the worry, even when there's nothing to worry about.",
    testimonialDay30Change: "The anxiety isn't gone, but it's quieter. I have more control over my thoughts now.",
    testimonialDay30Surprise: "How physical the improvement felt. My body is less tense, not just my mind calmer.",
  },
  pain: {
    motivations: [
      "Chronic pain has limited my life for years. Ready to try something new.",
      "The pain affects everything - my sleep, my mood, my ability to work.",
    ],
    hopedResults: [
      "Less daily pain and more ability to do the things I love.",
      "I want to manage my pain better without just masking it.",
    ],
    villainVariables: ["chronic pain", "joint discomfort", "back pain", "muscle tension"],
    wellnessGoals: ["Less pain", "Better mobility", "More comfort"],
    journeyHighlights: [
      { day: 7, note: "Pain levels slightly reduced today." },
      { day: 14, note: "More good days than bad days this week." },
      { day: 21, note: "Can do activities that used to hurt too much." },
      { day: 28, note: "Pain is more manageable than it's been in a while." },
    ],
    keyQuotes: [
      { context: "Week 2 check-in", quote: "I played with my kids without being laid up the next day. Huge win." },
      { context: "Final reflection", quote: "The pain isn't gone, but it doesn't run my life anymore." },
    ],
    testimonialDay1: "The pain is always there. Some days are better than others, but it limits everything I do.",
    testimonialDay30Change: "I have more good days now. The bad days are less intense and don't last as long.",
    testimonialDay30Surprise: "How much my sleep and mood improved alongside the pain. Everything is connected.",
  },
  skin: {
    motivations: [
      "My skin has been frustrating me for years. Breakouts, dullness, uneven texture.",
      "I want to feel confident without makeup covering up problem areas.",
    ],
    hopedResults: [
      "Clearer, more radiant skin that I feel good about.",
      "I want to see visible improvement in my skin's texture and tone.",
    ],
    villainVariables: ["breakouts", "dull skin", "uneven texture", "skin concerns"],
    wellnessGoals: ["Clearer skin", "Better texture", "More radiance"],
    journeyHighlights: [
      { day: 7, note: "Skin feels slightly smoother." },
      { day: 14, note: "Less breakouts this week. Skin looks brighter." },
      { day: 21, note: "Multiple people asked what I'm doing differently." },
      { day: 28, note: "Best my skin has looked in years." },
    ],
    keyQuotes: [
      { context: "Week 3 check-in", quote: "My sister asked what skincare I switched to. It's glowing from within." },
      { context: "Final reflection", quote: "The before/after photos don't lie. This actually worked." },
    ],
    testimonialDay1: "My skin has been dull and prone to breakouts. I've tried so many products with no lasting results.",
    testimonialDay30Change: "My skin is clearer and has a glow I haven't seen since my 20s.",
    testimonialDay30Surprise: "That the change came from within. No topical product ever worked this well.",
  },
  gut: {
    motivations: [
      "Bloating and digestive discomfort have been constant companions.",
      "I want to eat without dreading how I'll feel afterward.",
    ],
    hopedResults: [
      "Less bloating and more comfortable digestion.",
      "I want to feel good after meals, not uncomfortable.",
    ],
    villainVariables: ["bloating", "digestive discomfort", "irregular digestion", "gut issues"],
    wellnessGoals: ["Less bloating", "Better digestion", "Gut comfort"],
    journeyHighlights: [
      { day: 7, note: "Noticing less bloating after meals." },
      { day: 14, note: "Digestion feels smoother overall." },
      { day: 21, note: "Can eat foods that used to bother me." },
      { day: 28, note: "My gut feels better than it has in years." },
    ],
    keyQuotes: [
      { context: "Week 2 check-in", quote: "I wore my fitted jeans to dinner without worrying about bloating afterward." },
      { context: "Final reflection", quote: "The difference in my digestion is night and day. I wish I'd found this sooner." },
    ],
    testimonialDay1: "I deal with bloating after almost every meal. It's uncomfortable and embarrassing.",
    testimonialDay30Change: "I can eat without anxiety about bloating. My digestion actually works now.",
    testimonialDay30Surprise: "How much better my energy is now that my gut is happy. Everything improved.",
  },
  immunity: {
    motivations: [
      "I seem to catch every cold that goes around. My immune system needs help.",
      "I want to feel resilient and not constantly fighting off something.",
    ],
    hopedResults: [
      "Stronger immune response and fewer sick days.",
      "I want to feel robust and resilient, not vulnerable.",
    ],
    villainVariables: ["frequent illness", "weak immunity", "slow recovery from colds", "low resilience"],
    wellnessGoals: ["Stronger immunity", "Fewer sick days", "More resilience"],
    journeyHighlights: [
      { day: 7, note: "Feeling more energetic overall." },
      { day: 14, note: "Haven't caught the cold going around the office." },
      { day: 21, note: "Feeling more robust and resilient." },
      { day: 28, note: "First month without getting sick in ages." },
    ],
    keyQuotes: [
      { context: "Week 3 check-in", quote: "Everyone in my house got sick except me. That never happens." },
      { context: "Final reflection", quote: "I feel more resilient. Like my body can actually fight things off now." },
    ],
    testimonialDay1: "I catch every bug that goes around. It feels like my immune system is on vacation.",
    testimonialDay30Change: "I made it through cold season without getting sick. That's a first.",
    testimonialDay30Surprise: "How much my overall vitality improved. I didn't realize how much energy fighting off bugs took.",
  },
  hair: {
    motivations: [
      "My hair has been thinning and I'm worried about where it's headed.",
      "I want thicker, healthier-looking hair.",
    ],
    hopedResults: [
      "Less hair shedding and more volume.",
      "I want to feel confident about my hair again.",
    ],
    villainVariables: ["hair thinning", "excess shedding", "lack of volume", "dull hair"],
    wellnessGoals: ["Less shedding", "More volume", "Healthier hair"],
    journeyHighlights: [
      { day: 7, note: "Less hair in the shower drain." },
      { day: 14, note: "Hair feels thicker when I run my fingers through it." },
      { day: 21, note: "Stylist commented that my hair looks healthier." },
      { day: 28, note: "Noticeable improvement in volume and shine." },
    ],
    keyQuotes: [
      { context: "Week 3 check-in", quote: "My hair stylist asked what I changed. She noticed more volume." },
      { context: "Final reflection", quote: "The photos show real improvement. My hair looks and feels healthier." },
    ],
    testimonialDay1: "I'm losing more hair than I'm comfortable with. It's affecting my confidence.",
    testimonialDay30Change: "The shedding has reduced noticeably. My hair feels thicker and looks healthier.",
    testimonialDay30Surprise: "That it actually worked. I've tried so many things that promised results and didn't deliver.",
  },
  weight: {
    motivations: [
      "I've been struggling with cravings and my metabolism feels sluggish.",
      "I want to support my body's natural ability to manage weight.",
    ],
    hopedResults: [
      "Better appetite control and more consistent energy.",
      "I want to feel in control of my eating, not controlled by cravings.",
    ],
    villainVariables: ["strong cravings", "slow metabolism", "appetite struggles", "weight plateau"],
    wellnessGoals: ["Better appetite control", "Metabolism support", "Healthy weight"],
    journeyHighlights: [
      { day: 7, note: "Afternoon cravings seem less intense." },
      { day: 14, note: "Skipped my usual stress snack without thinking about it." },
      { day: 21, note: "Feel satisfied with smaller portions." },
      { day: 28, note: "Feel more in control of my appetite than I have in years." },
    ],
    keyQuotes: [
      { context: "Week 2 check-in", quote: "I walked past the office candy without even thinking about it." },
      { context: "Final reflection", quote: "For the first time, I feel in control of my appetite rather than controlled by it." },
    ],
    testimonialDay1: "The cravings are constant. I eat well then give in to sugar cravings every afternoon.",
    testimonialDay30Change: "My relationship with food has shifted. I eat when I'm hungry, not out of craving.",
    testimonialDay30Surprise: "That it wasn't about willpower. My body just stopped demanding the constant snacks.",
  },
  libido: {
    motivations: [
      "My interest in intimacy has declined and I want to feel like myself again.",
      "I want to support my overall wellness including this important area.",
    ],
    hopedResults: [
      "More interest and energy for intimate connection.",
      "I want to feel more balanced and vital overall.",
    ],
    villainVariables: ["low interest", "lack of energy", "decreased vitality", "wellness imbalance"],
    wellnessGoals: ["More vitality", "Better energy", "Overall wellness"],
    journeyHighlights: [
      { day: 7, note: "Feeling slightly more energetic overall." },
      { day: 14, note: "Noticing improvement in overall vitality." },
      { day: 21, note: "Feeling more like myself in this area." },
      { day: 28, note: "Significant improvement in overall wellness." },
    ],
    keyQuotes: [
      { context: "Week 3 check-in", quote: "My partner noticed a difference. Things feel more natural again." },
      { context: "Final reflection", quote: "This area of my life feels balanced again. I feel like myself." },
    ],
    testimonialDay1: "This is an area where I've noticed a decline. It's affecting my relationship.",
    testimonialDay30Change: "I feel more balanced and vital. This part of my life is better than it's been in a while.",
    testimonialDay30Surprise: "How connected everything is. Better sleep and less stress improved this area too.",
  },
};

// Default template for unknown categories
const DEFAULT_TEMPLATE: StoryTemplate = STORY_TEMPLATES.sleep;

/**
 * Generate wearable metrics based on category tier
 */
function generateSampleWearableMetrics(category: string): ParticipantStory["wearableMetrics"] {
  // Category available for future tier-specific metric generation
  void category;

  const devices = ["Oura Ring", "Apple Watch", "WHOOP", "Garmin", "Fitbit"];
  const device = devices[Math.floor(Math.random() * devices.length)];

  // Generate realistic improvement metrics
  const sleepBefore = 340 + Math.floor(Math.random() * 60);
  const sleepAfter = sleepBefore + 40 + Math.floor(Math.random() * 30);
  const deepSleepBefore = 35 + Math.floor(Math.random() * 15);
  const deepSleepAfter = deepSleepBefore + 10 + Math.floor(Math.random() * 10);
  const hrvBefore = 35 + Math.floor(Math.random() * 15);
  const hrvAfter = hrvBefore + 8 + Math.floor(Math.random() * 8);
  const rhBefore = 60 + Math.floor(Math.random() * 8);
  const rhAfter = rhBefore - 3 - Math.floor(Math.random() * 4);

  return {
    device,
    sleepChange: {
      before: sleepBefore,
      after: sleepAfter,
      unit: "min",
      changePercent: Math.round(((sleepAfter - sleepBefore) / sleepBefore) * 100),
    },
    deepSleepChange: {
      before: deepSleepBefore,
      after: deepSleepAfter,
      unit: "min",
      changePercent: Math.round(((deepSleepAfter - deepSleepBefore) / deepSleepBefore) * 100),
    },
    hrvChange: {
      before: hrvBefore,
      after: hrvAfter,
      unit: "ms",
      changePercent: Math.round(((hrvAfter - hrvBefore) / hrvBefore) * 100),
    },
    restingHrChange: {
      before: rhBefore,
      after: rhAfter,
      unit: "bpm",
      changePercent: Math.round(((rhAfter - rhBefore) / rhBefore) * 100),
    },
  };
}

/**
 * Generate sample assessment result for tiers 2-4
 */
function generateSampleAssessmentResult(category: string): AssessmentResult | undefined {
  const config = getCategoryConfig(category);
  if (!config || config.tier === 1) return undefined;

  const assessment = getAssessmentById(config.assessmentId);
  if (!assessment) return undefined;

  // Generate realistic baseline (30-45) and endpoint (65-82) scores
  const baselineComposite = 32 + Math.floor(Math.random() * 15);
  const endpointComposite = 68 + Math.floor(Math.random() * 14);
  const baselinePrimaryRaw = 3 + Math.floor(Math.random() * 2);
  const endpointPrimaryRaw = 7 + Math.floor(Math.random() * 2);
  const primaryMax = 10;

  const compositePoints = endpointComposite - baselineComposite;
  const compositePercent = Math.round((compositePoints / baselineComposite) * 100);

  const categoryLabel = config.label;
  const rawPercentChange = Math.round(((endpointPrimaryRaw - baselinePrimaryRaw) / baselinePrimaryRaw) * 100);
  const headline = `${categoryLabel} improved from ${baselinePrimaryRaw}/${primaryMax} to ${endpointPrimaryRaw}/${primaryMax} (+${rawPercentChange}%)`;

  return {
    assessmentId: assessment.id,
    assessmentName: assessment.name,
    categoryLabel,
    baseline: {
      date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      compositeScore: baselineComposite,
      primaryScore: baselinePrimaryRaw * 10,
      primaryRaw: baselinePrimaryRaw,
      primaryMax,
      responses: [],
    },
    endpoint: {
      date: new Date(),
      compositeScore: endpointComposite,
      primaryScore: endpointPrimaryRaw * 10,
      primaryRaw: endpointPrimaryRaw,
      primaryMax,
      responses: [],
    },
    change: {
      compositePoints,
      compositePercent,
      primaryPoints: (endpointPrimaryRaw - baselinePrimaryRaw) * 10,
      primaryPercent: rawPercentChange,
    },
    improved: true,
    headline,
  };
}

/**
 * Generate a sample story for verification page preview
 */
export function generateSampleStory(
  productName: string,
  category: string,
  durationDays: number = 28
): ParticipantStory {
  const profile = SAMPLE_PROFILES[0];
  const template = STORY_TEMPLATES[category] || DEFAULT_TEMPLATE;
  const config = getCategoryConfig(category);
  const tier: TierLevel = config?.tier || 1;

  // Select content from templates
  const motivation = template.motivations[Math.floor(Math.random() * template.motivations.length)];
  const hopedResult = template.hopedResults[Math.floor(Math.random() * template.hopedResults.length)];
  const villainVariable = template.villainVariables[Math.floor(Math.random() * template.villainVariables.length)];
  const wellnessGoal = template.wellnessGoals[Math.floor(Math.random() * template.wellnessGoals.length)];
  const lifeStage = profile.lifeStages[category] || profile.lifeStages.sleep;

  // Generate journey ratings with improvement trend
  const villainRatings = template.journeyHighlights.map((highlight, index) => ({
    day: highlight.day,
    rating: index === 0 ? 2 : index === 1 ? 3 : index === 2 ? 4 : 5,
    note: highlight.note,
  }));

  // Select key quotes
  const keyQuotes = template.keyQuotes.map((kq) => ({
    day: kq.context.includes("Final") ? durationDays : Math.floor(durationDays / 2),
    quote: kq.quote,
    context: kq.context,
  }));

  // Generate tier-specific data
  const wearableMetrics = generateSampleWearableMetrics(category);
  const assessmentResult = tier >= 2 ? generateSampleAssessmentResult(category) : undefined;
  const testimonialResponses = tier === 1 ? [
    {
      day: 1,
      question: `What's your biggest challenge with ${config?.label.toLowerCase() || category} right now?`,
      response: template.testimonialDay1,
    },
    {
      day: 30,
      question: `How has your ${config?.label.toLowerCase() || category} changed over the past month?`,
      response: template.testimonialDay30Change,
    },
    {
      day: 30,
      question: "What surprised you most about this experience?",
      response: template.testimonialDay30Surprise,
    },
  ] : undefined;

  // Generate narrative
  const narrativeParts = [
    `${profile.name.split(" ")[0]}, a ${profile.ageRange.replace("-", "-year-old in the ")} age range, was struggling with ${villainVariable}.`,
    motivation,
    `Within the first few weeks of taking ${productName}, things began to change.`,
    template.keyQuotes[0].quote,
  ];

  if (assessmentResult) {
    narrativeParts.push(`Their ${config?.label || category} assessment improved by ${assessmentResult.change.compositePercent}%.`);
  }

  narrativeParts.push(`"${template.testimonialDay30Change}"`);

  const generatedNarrative = narrativeParts.join(" ");

  return {
    id: "sample-story-preview",
    name: profile.name,
    initials: profile.initials,
    avatarUrl: profile.avatarUrl,
    tier,
    profile: {
      ageRange: profile.ageRange,
      lifeStage,
      primaryWellnessGoal: wellnessGoal,
      baselineStressLevel: 6 + Math.floor(Math.random() * 3),
    },
    baseline: {
      motivation,
      hopedResults: hopedResult,
      villainDuration: ["3-6 months", "6-12 months", "1+ years"][Math.floor(Math.random() * 3)],
      triedOther: "Yes, several others",
    },
    journey: {
      startDate: new Date(Date.now() - durationDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      durationDays,
      villainVariable,
      villainRatings,
      keyQuotes,
    },
    wearableMetrics,
    assessmentResult,
    testimonialResponses,
    generatedNarrative,
    verified: true,
    verificationId: "SAMPLE-001",
    completedAt: new Date().toISOString().split("T")[0],
    overallRating: profile.rating,
  };
}

/**
 * Generate multiple sample stories for a category
 */
export function generateSampleStories(
  productName: string,
  category: string,
  durationDays: number = 28,
  count: number = 3
): ParticipantStory[] {
  return Array.from({ length: count }, (_, i) => {
    const story = generateSampleStory(productName, category, durationDays);
    return {
      ...story,
      id: `sample-story-${i + 1}`,
      verificationId: `SAMPLE-${String(i + 1).padStart(3, "0")}`,
      overallRating: 4.4 + Math.random() * 0.5,
    };
  });
}

/**
 * Get the primary headline for a sample story
 * Used for quick preview text
 */
export function getSampleHeadline(category: string, productName: string): string {
  // productName available for future personalized headlines
  void productName;

  const config = getCategoryConfig(category);
  const tier = config?.tier || 1;
  const label = config?.label || category;

  if (tier === 1) {
    // Wearables primary - focus on wearable metric
    const metrics = {
      sleep: "23% more deep sleep",
      recovery: "18% better recovery scores",
      fitness: "15% improvement in activity metrics",
    };
    return metrics[category as keyof typeof metrics] || `Significant improvement in ${label.toLowerCase()} metrics`;
  } else if (tier === 2) {
    // Co-primary - mention both
    return `Stress reduced 57% - verified by both wearable data AND assessment scores`;
  } else {
    // Assessment primary
    return `${label} improved from 4/10 to 8/10 (+100%)`;
  }
}

/**
 * Get sample benefit bullets for a category
 */
export function getSampleBenefits(category: string): string[] {
  const benefitMap: Record<string, string[]> = {
    sleep: ["Fall asleep faster", "Wake up refreshed", "Better deep sleep"],
    recovery: ["Faster recovery", "Better HRV scores", "More training capacity"],
    fitness: ["More endurance", "Better performance", "Consistent energy"],
    stress: ["Feel calmer", "Better stress response", "Improved HRV"],
    energy: ["No afternoon crashes", "Consistent energy", "Better focus"],
    focus: ["Sharper thinking", "Better concentration", "Less brain fog"],
    mood: ["More positive outlook", "Emotional balance", "Better resilience"],
    anxiety: ["Quieter mind", "More relaxation", "Less worry"],
    pain: ["Reduced discomfort", "Better mobility", "Improved function"],
    skin: ["Clearer complexion", "Better texture", "More radiance"],
    gut: ["Less bloating", "Better digestion", "More comfort"],
    immunity: ["Fewer sick days", "Faster recovery", "More resilience"],
    hair: ["Less shedding", "More volume", "Healthier appearance"],
    weight: ["Better appetite control", "Fewer cravings", "Sustained energy"],
    libido: ["More vitality", "Better energy", "Improved wellness"],
  };

  return benefitMap[category] || ["Improved wellness", "Better results", "Verified data"];
}
