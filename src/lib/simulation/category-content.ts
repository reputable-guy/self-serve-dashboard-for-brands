/**
 * Category-Specific Content
 *
 * All category-specific quotes, symptoms, failed alternatives, motivations, etc.
 * This is the SINGLE SOURCE OF TRUTH for category content used in simulation.
 */

import type { ParticipantArchetype } from '../types';

// ============================================================================
// CATEGORY + ARCHETYPE SPECIFIC QUOTES
// These are the verbatim quotes participants share about their journey.
// Organized by category, then by archetype personality type.
// ============================================================================

export const CATEGORY_ARCHETYPE_QUOTES: Record<string, Record<ParticipantArchetype, string[]>> = {
  sleep: {
    desperate: [
      "I haven't slept through the night in 3 years. I've tried everything - melatonin, prescription pills, therapy. This is my last hope.",
      "My insomnia is destroying my marriage. I'm too exhausted to be present for my kids. I need this to work.",
      "I've spent thousands on sleep specialists and supplements. Nothing has worked for more than a week. I'm desperate.",
      "The bags under my eyes are permanent now. I can't remember the last time I woke up feeling rested. Please work.",
      "I'm so tired I made a dangerous mistake at work last week. I need to fix this before something worse happens.",
    ],
    skeptic: [
      "I've been burned by 'miracle sleep supplements' before. But my friend swears by this, so I'll give it a shot.",
      "The science looks decent, but I'm not expecting miracles. If I can fall asleep even 15 minutes faster, I'll call it a win.",
      "Another sleep product... we'll see. I'm tracking everything so I'll know if it actually works or if it's placebo.",
      "I'm joining mostly to see the data. Not convinced yet, but willing to try.",
    ],
    power_user: [
      "My Oura shows 4 hours of deep sleep average, but I want 5+. Looking for that last optimization lever.",
      "I've dialed in sleep hygiene, temperature, light exposure. Supplements are the final frontier for my sleep stack.",
      "My HRV tanks when I don't sleep well. Curious if this can help me maintain consistency in my recovery metrics.",
      "I track everything. If this moves my sleep efficiency from 85% to 90%, it's worth it.",
    ],
    struggler: [
      "The racing thoughts at night are exhausting. I just want my brain to quiet down so I can sleep.",
      "I wake up at 3am every night and stare at the ceiling. It's been months of this and I'm worn down.",
      "Sleep used to be easy. Now it's the hardest part of my day. Something changed and I need help fixing it.",
      "I'm not a complete insomniac, but I never feel rested. It's affecting everything else in my life.",
    ],
    optimist: [
      "My friend started sleeping like a baby after trying this. Can't wait to see what it does for me!",
      "I've heard great things and I'm excited to finally prioritize my sleep. Ready for better mornings!",
      "Even if my sleep is okay, I know it could be better. Excited to level up!",
    ],
  },
  stress: {
    desperate: [
      "My anxiety is so bad I've started having panic attacks at work. I'm on the verge of taking medical leave.",
      "I can't stop the racing thoughts. They follow me everywhere - work, home, even trying to relax. I need relief.",
      "The tension in my body is constant. My jaw hurts from clenching, my shoulders are rocks. I'm falling apart.",
      "I've been on anti-anxiety meds for years. I want to find something that helps me depend on them less.",
      "Stress has taken over my life. My relationships are suffering, my health is declining. I have to do something.",
    ],
    skeptic: [
      "Stress supplements usually just make expensive pee. But I'll track my HRV and see if this one's different.",
      "I'm skeptical of anything that claims to 'reduce stress' - it's such a vague promise. We'll see.",
      "My therapist suggested trying supplements alongside therapy. Not expecting much, but worth a shot.",
    ],
    power_user: [
      "I've optimized most variables but my HRV still tanks during stressful weeks. Looking for adaptogenic support.",
      "I meditate daily and exercise regularly. Adding targeted supplementation to complete my stress resilience stack.",
      "My Whoop shows my strain-to-recovery ratio is off. Need something to help my body adapt better.",
    ],
    struggler: [
      "Work pressure just keeps building. I used to handle it fine, but now I feel on edge constantly.",
      "The worry follows me home. I can't enjoy evenings with my family because my mind is still at work.",
      "I know I need to manage stress better. This seems like a good place to start.",
      "Tension headaches are becoming weekly. The stress is literally hurting me now.",
    ],
    optimist: [
      "Life is good but busy! Looking forward to having a tool in my toolkit for the hectic days.",
      "I believe in proactive wellness. Why wait until stress becomes a problem?",
      "Excited to feel even more calm and centered. Already do yoga, this is the next step!",
    ],
  },
  energy: {
    desperate: [
      "I'm exhausted from the moment I wake up. Coffee doesn't even work anymore. I have no life outside of surviving.",
      "The afternoon crash is ruining my career. I can barely function after 2pm. Something has to change.",
      "I've had every blood test done. Everything's 'normal' but I feel like I'm running on empty constantly.",
      "My energy is so low I had to cut back my work hours. I can't afford to keep declining like this.",
      "I used to be full of energy. Now I'm a shell of myself. I need to find what's missing.",
    ],
    skeptic: [
      "Energy supplements are usually just caffeine in disguise. I'll track my energy levels carefully.",
      "I've tried B vitamins, iron, everything. Doubtful this will be different, but I'm running out of options.",
      "The ingredient list looks interesting. I'll give it a fair trial before I judge.",
    ],
    power_user: [
      "My energy is good but not great. Looking for consistent optimization without stimulant dependency.",
      "I've cut caffeine to reduce the crashes. Looking for something that provides sustained energy naturally.",
      "My continuous glucose monitor shows stable levels. Time to optimize the other energy levers.",
    ],
    struggler: [
      "The 2pm wall hits me every single day. I've tried everything to push through it.",
      "By evening I have nothing left. My family gets the tired, irritable version of me.",
      "I'm not sleeping poorly, but I never feel energized. Something's off.",
      "I've accepted low energy as my normal. But I want to see if normal can be better.",
    ],
    optimist: [
      "I'm already pretty energetic, but more sustainable energy sounds amazing!",
      "Ready to go from good energy to great energy. Let's do this!",
      "If I can skip the afternoon coffee and still feel great, that's a win.",
    ],
  },
  focus: {
    desperate: [
      "I can't finish a single task anymore. My ADHD has gotten worse and medication isn't enough.",
      "I'm making mistakes at work I never used to make. My job is at risk because I can't concentrate.",
      "Brain fog has taken over my life. I used to be sharp. Now I feel like I'm thinking through molasses.",
      "I've tried every focus app, every technique. Nothing sticks. I'm losing my edge.",
    ],
    skeptic: [
      "Nootropics are usually overhyped. But the research on these ingredients is interesting.",
      "I'll track my focused work time objectively. Either it helps or it doesn't.",
      "Not expecting a miracle, but even 10% improvement in focus would be worthwhile.",
    ],
    power_user: [
      "I've optimized my environment and routines. Looking for the cognitive edge that comes from proper supplementation.",
      "My work requires intense concentration. I need sustainable focus, not stimulant peaks and crashes.",
      "I track my deep work hours. Looking to go from 4 hours to 6 hours of quality focus time.",
    ],
    struggler: [
      "I start tasks with good intentions but my mind wanders within minutes. It's frustrating.",
      "Reading has become impossible. I re-read the same paragraph over and over.",
      "The mental fog makes everything harder. Simple decisions feel overwhelming.",
    ],
    optimist: [
      "I'm already pretty focused, but sharpening that edge sounds great for my career!",
      "Excited to see what I can accomplish with better concentration.",
    ],
  },
  recovery: {
    desperate: [
      "My HRV has been in the red for months. I'm overtraining but can't afford to stop. Need faster recovery.",
      "I'm sore for 4-5 days after every workout. My training is suffering because I can't recover.",
      "Used to recover overnight. Now it takes me a week to feel ready again. Something's broken.",
      "My performance has plateaued. I think it's a recovery problem, not a training problem.",
    ],
    skeptic: [
      "Recovery supplements are a dime a dozen. I'll track my HRV and soreness objectively.",
      "The ingredient profile looks solid, but I've been disappointed before.",
      "My coach suggested this. Willing to try it for a proper training block.",
    ],
    power_user: [
      "My Whoop recovery scores average 60%. I want to consistently hit 75%+.",
      "I've optimized sleep and nutrition. Supplementation for recovery is the next optimization layer.",
      "Looking to reduce DOMS and improve my HRV response to hard training days.",
    ],
    struggler: [
      "I love training but the soreness keeps me sidelined. Want to train more consistently.",
      "My recovery is unpredictable. Some days I bounce back, others I'm wrecked.",
      "Age is catching up to me. Recovery isn't what it used to be.",
    ],
    optimist: [
      "Ready to train harder knowing I can recover faster!",
      "Excited to see what I can do when recovery isn't the limiting factor.",
    ],
  },
  default: {
    desperate: [
      "I've tried everything and nothing has worked. This is my last hope.",
      "My quality of life has declined so much. I need something to change.",
    ],
    skeptic: [
      "I'm skeptical but willing to give it a fair try and track the results.",
      "Not expecting miracles, but open to seeing if it helps.",
    ],
    power_user: [
      "I've optimized the basics. Looking for the next level of improvement.",
      "I track everything and want to see measurable improvement.",
    ],
    struggler: [
      "I've been dealing with this for a while and finally decided to try something.",
      "It's not terrible, but I know I could feel better.",
    ],
    optimist: [
      "Excited to see what this can do for me!",
      "Ready for positive changes in my wellness journey.",
    ],
  },
};

// ============================================================================
// CATEGORY-SPECIFIC HOPED OUTCOMES
// What participants hope to achieve, phrased in their own aspirational words.
// ============================================================================

export const CATEGORY_HOPED_OUTCOMES: Record<string, string[]> = {
  sleep: [
    "Finally fall asleep within 15 minutes of lying down",
    "Sleep through the night without waking at 3am",
    "Wake up actually feeling refreshed for once",
    "Stop the racing thoughts when my head hits the pillow",
    "Get my deep sleep percentage above 20%",
    "Not need sleep aids to fall asleep anymore",
    "Have consistent sleep, not good nights and bad nights",
    "Feel rested enough to exercise in the morning again",
  ],
  stress: [
    "Feel calm even when work gets hectic",
    "Stop carrying work stress home to my family",
    "Release the constant tension in my shoulders and jaw",
    "Handle pressure without feeling overwhelmed",
    "Enjoy evenings instead of ruminating about tomorrow",
    "Have a lower baseline anxiety level",
    "Not feel on edge all the time",
    "Actually relax when I try to relax",
  ],
  energy: [
    "Have steady energy from morning to evening",
    "Eliminate the afternoon crash completely",
    "Not need coffee just to function",
    "Have enough energy for my family after work",
    "Feel alert and present throughout the day",
    "Wake up energized instead of hitting snooze",
    "Stop feeling like I'm running on fumes",
    "Have the energy to exercise again",
  ],
  focus: [
    "Finish tasks without my mind wandering",
    "Stay focused in long meetings",
    "Read a whole chapter without losing my place",
    "Clear the mental fog that clouds my thinking",
    "Make decisions quickly and confidently",
    "Be fully present in conversations",
    "Complete deep work for hours without distraction",
    "Feel mentally sharp again",
  ],
  recovery: [
    "Recover overnight instead of over days",
    "Train hard without being sore for a week",
    "See my HRV improve consistently",
    "Maintain performance across a full training block",
    "Wake up ready to train again",
    "Not be the limiting factor in my progress",
    "Feel as recovered as my younger self",
    "Hit PRs without extended recovery periods",
  ],
  default: [
    "Feel noticeably better day to day",
    "See measurable improvement in how I feel",
    "Have evidence that something is actually working",
    "Feel more like my best self",
    "Improve my overall quality of life",
  ],
};

// Category-specific motivation statements
export const CATEGORY_MOTIVATIONS: Record<string, string[]> = {
  sleep: [
    "I've been struggling to fall asleep for months",
    "Want to wake up feeling more refreshed",
    "Tired of relying on sleep aids",
    "My sleep tracker shows poor sleep quality",
    "Looking for natural ways to improve sleep",
    "I wake up multiple times every night and can't get back to sleep",
    "My partner says I toss and turn all night — I need a real fix",
    "I average less than 5 hours of deep sleep a week according to my Oura Ring",
    "The racing thoughts at bedtime have gotten worse over the past year",
    "I want to stop needing melatonin every single night",
    "My sleep used to be great — something changed after turning 40",
    "I've tried weighted blankets, white noise, blue light glasses — nothing sticks",
    "My job requires early mornings and I can't keep dragging myself out of bed",
    "Hoping to improve my HRV through better sleep quality",
    "I fall asleep fine but wake up at 3am every single night",
    "Looking to optimize my sleep stack — this is the missing piece I think",
    "My recovery scores on Whoop have been tanking and I'm sure it's sleep-related",
    "Stress from work carries into nighttime and ruins my sleep",
    "I feel like I haven't had a truly restful night in over a year",
    "My doctor said my sleep efficiency is below 80% — trying to fix that naturally",
    "Training for a marathon and sleep is the bottleneck in my recovery",
    "I'm a light sleeper and need something to help me stay in deep sleep longer",
    "My kids finally sleep through the night — now I need to learn how to again",
    "I want to see if improving sleep helps my chronic brain fog",
    "Tried prescription sleep meds and hated the side effects — want something natural",
    "My Fitbit shows I barely get any REM sleep and I want to change that",
    "I need 8 hours but I'm only getting 5.5 — and I feel every missing minute",
    "Looking to break the cycle of poor sleep → caffeine → poor sleep",
    "Heard about this from a friend who said it fixed her sleep in two weeks",
    "I just want one full week of consistent, restful sleep — is that too much to ask?",
  ],
  stress: [
    "Work stress has been overwhelming lately",
    "Looking for better ways to manage anxiety",
    "Want to feel calmer throughout the day",
    "Need help with daily stress management",
    "Trying to reduce tension and worry",
  ],
  energy: [
    "Experiencing afternoon energy crashes",
    "Want consistent energy throughout the day",
    "Tired of feeling fatigued all the time",
    "Looking for natural energy solutions",
    "Need more stamina for daily activities",
  ],
  focus: [
    "Difficulty concentrating at work",
    "Mind wanders during important tasks",
    "Want better mental clarity",
    "Looking to improve productivity",
    "Need help staying focused longer",
  ],
  recovery: [
    "Muscles feel sore after workouts",
    "Takes too long to recover from exercise",
    "Want to improve my HRV scores",
    "Looking for faster post-workout recovery",
    "Need better athletic performance",
  ],
  default: [
    "Looking to improve my overall wellness",
    "Heard great things about this product",
    "Want to feel better day to day",
    "Ready to try something new",
    "Hoping for positive changes",
  ],
};

// Category-specific hoped results
export const CATEGORY_HOPED_RESULTS: Record<string, string[]> = {
  sleep: [
    "Fall asleep faster and stay asleep",
    "Wake up feeling energized",
    "Better deep sleep scores on my tracker",
    "Less tossing and turning",
    "Feel rested in the morning",
  ],
  stress: [
    "Feel calmer and more relaxed",
    "Handle stressful situations better",
    "Lower overall anxiety levels",
    "Better HRV and recovery scores",
    "More peace of mind",
  ],
  energy: [
    "Steady energy all day long",
    "No more afternoon crashes",
    "Feel more alert and awake",
    "Better morning energy",
    "Increased daily productivity",
  ],
  focus: [
    "Better concentration at work",
    "Clearer thinking and decision making",
    "Less mental fog",
    "Improved memory and recall",
    "Sustained attention on tasks",
  ],
  recovery: [
    "Faster muscle recovery",
    "Improved HRV scores",
    "Less soreness after training",
    "Better athletic performance",
    "More energy for workouts",
  ],
  default: [
    "Overall improvement in how I feel",
    "Better daily energy and mood",
    "Noticeable positive changes",
    "Improved wellbeing",
    "Feel healthier overall",
  ],
};

// Category-specific hero symptom questions and responses
export const CATEGORY_HERO_SYMPTOMS: Record<string, { question: string; responses: string[] }> = {
  sleep: {
    question: "What's your biggest challenge with sleep right now?",
    responses: [
      "I can't fall asleep — my mind races the moment my head hits the pillow",
      "I wake up at 3am every night and can't get back to sleep",
      "I sleep 8 hours but wake up exhausted like I didn't sleep at all",
      "Racing thoughts keep me up until 2-3am most nights",
      "I'm dependent on sleep aids and want to stop",
      "Light sleep all night — I never feel like I hit deep sleep",
      "Takes me over an hour to fall asleep, no matter how tired I am",
      "I wake up 3-4 times a night and each time it takes 20+ minutes to fall back asleep",
      "My sleep schedule is completely inconsistent — I have no rhythm",
      "I get plenty of sleep time but my Oura shows barely any deep sleep",
      "Work anxiety follows me to bed and I literally cannot turn off my brain",
      "I've tried melatonin, magnesium, valerian — nothing gives me consistent relief",
      "My sleep got worse after having kids and never recovered even though they sleep through now",
      "I feel wired at bedtime but exhausted all day — my circadian rhythm is broken",
      "Hot flashes and night sweats wake me up multiple times",
      "I snore badly according to my partner, and I wake up with headaches",
      "Anxiety medication helps me fall asleep but I wake up groggy and foggy",
      "I haven't slept through the night in over a year — it's affecting my work performance",
      "My deep sleep percentage is 8% according to my watch — should be closer to 20%",
      "I grind my teeth at night from stress and wake up with jaw pain",
      "I fall asleep on the couch but can't fall asleep in bed — it's psychological at this point",
      "Sunday night insomnia ruins my whole Monday. It's like clockwork every week.",
      "Travel for work has destroyed whatever sleep habits I had",
      "I wake up too early (5am) no matter when I go to bed and can't fall back asleep",
      "The quality of my sleep is so poor that 8 hours feels like 4",
    ],
  },
  stress: {
    question: "What's your biggest source of stress right now?",
    responses: [
      "Work pressure is constant and overwhelming",
      "I can't stop worrying about everything, even small things",
      "Physical tension - my shoulders and jaw are always tight",
      "My mind never stops racing, even when I try to relax",
      "Anxiety spikes at random times throughout the day",
      "I feel on edge constantly, waiting for the next crisis",
    ],
  },
  energy: {
    question: "When is your energy lowest and how does it affect you?",
    responses: [
      "2-3pm crash every single day - I can barely keep my eyes open",
      "I'm exhausted from the moment I wake up until I go to bed",
      "My energy is unpredictable - some days I crash hard, others I'm okay",
      "I need caffeine just to function, and even that's not enough anymore",
      "By dinner time I have nothing left for my family",
      "Brain fog and fatigue make it hard to focus on anything",
    ],
  },
  focus: {
    question: "How does your lack of focus impact your daily life?",
    responses: [
      "I can't concentrate on work tasks - constantly getting distracted",
      "My mind wanders during important conversations and meetings",
      "I start tasks but can't finish them - my attention just drifts",
      "Reading has become impossible - I re-read the same paragraph over and over",
      "I'm making mistakes at work I never used to make",
      "Brain fog makes even simple decisions feel overwhelming",
    ],
  },
  recovery: {
    question: "What recovery challenges are you experiencing?",
    responses: [
      "My muscles are sore for days after workouts",
      "I used to recover quickly but now everything takes longer",
      "My HRV is consistently low despite sleeping enough",
      "I feel depleted even after rest days",
      "Performance is declining even though I'm training consistently",
      "Takes me 3-4 days to feel ready for another hard workout",
    ],
  },
  default: {
    question: "What's the biggest wellness challenge you're facing?",
    responses: [
      "I just don't feel like myself anymore",
      "My overall wellbeing has declined noticeably",
      "I'm not sick, but I'm definitely not thriving",
      "Something feels off and I can't pinpoint what",
      "I want to feel better but don't know where to start",
      "My quality of life isn't where it should be",
    ],
  },
};

// Category-specific failed alternatives
export const CATEGORY_FAILED_ALTERNATIVES: Record<string, string[]> = {
  sleep: [
    "Melatonin",
    "Prescription sleep aids",
    "Sleep apps",
    "CBT-i",
    "Weighted blanket",
    "Blue light glasses",
    "Magnesium",
    "Lavender",
  ],
  stress: [
    "Meditation apps",
    "Therapy/counseling",
    "Breathing exercises",
    "Yoga",
    "CBD",
    "Prescription anxiety meds",
    "Journaling",
    "Exercise",
  ],
  energy: [
    "Coffee/caffeine",
    "Energy drinks",
    "B vitamins",
    "Iron supplements",
    "Napping",
    "Exercise",
    "Better sleep",
    "Reducing sugar",
  ],
  focus: [
    "Caffeine",
    "Nootropics",
    "Meditation",
    "Pomodoro technique",
    "Focus apps",
    "Prescription stimulants",
    "Brain games",
    "Eliminating distractions",
  ],
  recovery: [
    "Protein supplements",
    "Foam rolling",
    "Ice baths",
    "Compression",
    "Sleep optimization",
    "Massage",
    "BCAAs",
    "Electrolytes",
  ],
  default: [
    "Various supplements",
    "Lifestyle changes",
    "Diet modifications",
    "Exercise",
    "Sleep changes",
    "Mindfulness",
  ],
};

// Wellness goals (category-agnostic)
export const WELLNESS_GOALS = [
  "Better sleep quality",
  "More daily energy",
  "Reduced stress",
  "Improved focus",
  "Better overall health",
  "Weight management",
  "Enhanced recovery",
  "Mental clarity",
];

// Life stages
export const LIFE_STAGES = [
  "Student",
  "Early career professional",
  "Parent with young children",
  "Established professional",
  "Retired or semi-retired",
];
export const LIFE_STAGE_WEIGHTS = [0.1, 0.25, 0.25, 0.3, 0.1];

// Age ranges
export const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"] as const;
export const AGE_WEIGHTS = [0.1, 0.3, 0.3, 0.2, 0.08, 0.02];

// Pain duration options
export const VILLAIN_DURATIONS = [
  "Less than 1 month",
  "1-6 months",
  "6-12 months",
  "1+ years",
];

// Tried other options
export const TRIED_OTHER_OPTIONS = [
  "No, this is my first",
  "Yes, 1-2 others",
  "Yes, several others",
];

// US States for location
export const US_STATES = [
  "California", "Texas", "Florida", "New York", "Pennsylvania",
  "Illinois", "Ohio", "Georgia", "North Carolina", "Michigan",
  "New Jersey", "Virginia", "Washington", "Arizona", "Massachusetts",
  "Tennessee", "Indiana", "Missouri", "Maryland", "Wisconsin",
];

// First and last names for simulation
export const FIRST_NAMES = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
  'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia',
];
export const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson',
];

/**
 * Get content for a specific category, with fallback to default
 */
export function getCategoryContent(category: string | undefined) {
  const cat = category || 'default';
  return {
    motivations: CATEGORY_MOTIVATIONS[cat] || CATEGORY_MOTIVATIONS.default,
    hopedResults: CATEGORY_HOPED_RESULTS[cat] || CATEGORY_HOPED_RESULTS.default,
    heroSymptoms: CATEGORY_HERO_SYMPTOMS[cat] || CATEGORY_HERO_SYMPTOMS.default,
    failedAlternatives: CATEGORY_FAILED_ALTERNATIVES[cat] || CATEGORY_FAILED_ALTERNATIVES.default,
    hopedOutcomes: CATEGORY_HOPED_OUTCOMES[cat] || CATEGORY_HOPED_OUTCOMES.default,
    archetypeQuotes: CATEGORY_ARCHETYPE_QUOTES[cat] || CATEGORY_ARCHETYPE_QUOTES.default,
  };
}

/**
 * Get category-specific quotes for a given archetype
 */
export function getArchetypeQuotesForCategory(
  category: string | undefined,
  archetype: ParticipantArchetype
): string[] {
  const cat = category || 'default';
  const categoryQuotes = CATEGORY_ARCHETYPE_QUOTES[cat] || CATEGORY_ARCHETYPE_QUOTES.default;
  return categoryQuotes[archetype] || categoryQuotes.struggler;
}

/**
 * Get category-specific hoped outcomes
 */
export function getHopedOutcomesForCategory(category: string | undefined): string[] {
  const cat = category || 'default';
  return CATEGORY_HOPED_OUTCOMES[cat] || CATEGORY_HOPED_OUTCOMES.default;
}

/**
 * Check if a category has specific content (vs falling back to default)
 */
export function hasSpecificCategoryContent(category: string): boolean {
  return category in CATEGORY_HERO_SYMPTOMS && category !== 'default';
}
