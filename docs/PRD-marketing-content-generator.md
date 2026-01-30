# PRD: Marketing Content Generator

*Product Requirements Document — Social Caption Generator & Content Playbook*
*Created: 2025-01-30*
*Status: Draft*
*Supersedes: PRD-marketing-launchpad.md (visual export features)*

---

## Table of Contents

1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [Strategic Direction (Validated)](#3-strategic-direction-validated)
4. [User Stories](#4-user-stories)
5. [Requirements](#5-requirements)
6. [UI Flow](#6-ui-flow)
7. [Caption Specifications](#7-caption-specifications)
8. [Technical Approach](#8-technical-approach)
9. [Acceptance Tests](#9-acceptance-tests)
10. [Success Metrics](#10-success-metrics)
11. [Open Questions](#11-open-questions)

---

## 1. Overview

### What We're Building

**Marketing Content Generator** — a focused feature that transforms rich participant narratives into ready-to-post social captions and a posting playbook.

Not visual design. Not Canva templates. **Words and strategy.**

When a brand clicks "Create Content" on a participant card, they get:
1. **Captions in 3 tones** — Casual, Professional, Urgency (copy-paste ready)
2. **Best Bits quick-copy** — Hero metric, key quote, struggle context, verification URL
3. **A playbook** — Where to post, what works best, how to repurpose

### The One-Liner

> Transform a verified participant's journey into social captions and posting strategy in 30 seconds — words, not graphics.

### Why This Scope (Not Visual Exports)

The original Marketing Launchpad attempted to be a visual design tool (Canva templates, carousel exports, asset generation). First-principles analysis revealed:

**Reputable's moat is verification, not design.**

- We will never out-Canva Canva
- Every brand's SMM already knows design tools
- Our unique advantage is the *narrative data* — the story arc from struggle to success
- The photo problem (real participants, privacy concerns) makes visual exports weak
- Captions are where verification language and narrative value live

### The Demo Moment

*"See this participant, Amanda? She cut her stress by 48%. Watch this..."*
*[clicks "Create Content" on her card]*
*"Here's three captions ready to paste — casual for Stories, professional for feed, urgency for ads. Here's her best quote about staying calm in an investor meeting. Here's the verification link to prove it's real. And here's where to post it. Your SMM copies, pastes, pairs with their own visuals, posts."*

This isn't magic. It's leverage. We give them the hardest part — the words that capture verified transformation.

---

## 2. Problem Statement

### Current State

Brands complete Reputable studies and receive verified participant stories with rich narrative data:
- Journey progression (villain ratings with notes)
- Key quotes with context
- Baseline struggle and motivation
- Before/after metrics
- Verification links

**But turning this into social content is still manual:**

```
Study Complete → Read participant card → Extract key details mentally →
Write caption from scratch → Wonder what tone to use → Post and hope
```

Time: 10-15 minutes per participant (when they do it at all)
Result: Underutilized narrative data, generic captions that don't leverage the story
Adoption: Low (they screenshot the card or skip social entirely)

### The Real Problem

The visual export approach (Canva templates) tried to solve the wrong problem. Brands don't need us to design — they need us to:

1. **Surface the most compelling narrative elements** — buried in journey data
2. **Write the words** — captions that capture verified transformation
3. **Provide verification language** — differentiator from regular testimonials
4. **Tell them what to do** — posting strategy, not just assets

### What We're NOT Building

| What | Why Not |
|------|---------|
| **Canva templates** | That's Canva's job. We're not competing with design tools. |
| **Visual carousel exports** | We lack participant photos and can't out-design their existing tools. |
| **Data cards** | Redundant. BeforeAfterCard already shows participant data effectively. |
| **Image generation** | Privacy concerns, photo quality issues, not our moat. |

---

## 3. Strategic Direction (Validated)

### Key Insight: Rich Narrative is the Enabler

What makes this feature work is **rich narrative data** — the story arc that turns "improved 47%" into a compelling post.

Without this, captions are thin:
> "Sarah improved her sleep by 47%."

With rich narrative (`baseline.motivation`, `villainRatings`, `keyQuotes`):
> "Sarah tried everything — melatonin, sleep apps, even prescription meds. Nothing worked. For 18 months, she tossed and turned for 45+ minutes every night. Then she tried [Product] for 28 days. Now she falls asleep in under 15 minutes. Her husband noticed on day 7. Her Oura Ring confirmed it by day 14."

This is Reputable's unique contribution. We collect the journey, not just the result.

### What Works

| Insight | Why It Matters |
|---------|----------------|
| **Caption copy is where our value lives** | Verification language, narrative arc, specific details — these differentiate from regular testimonials |
| **3 tones cover 90% of use cases** | Casual (organic), Professional (credibility), Urgency (ads) |
| **Best Bits = fast extraction** | Hero metric, best quote, struggle context, verification URL — the four things they need |
| **Playbook adds strategy** | "Where do I post this?" is the real blocker for many SMMs |
| **Attach to existing cards** | No new view. It's an action on participant cards they already browse |

### What Kills Adoption

| Anti-Pattern | Why It Fails |
|--------------|--------------|
| **Thin captions** | If we just template the numbers, they'll write their own |
| **Missing narrative data** | Captions require journey progression — we need to ensure data collection |
| **Too many options** | 3 tones is enough. More = decision paralysis |
| **Separate "launchpad" tab** | They're already on Results looking at cards. Don't make them navigate |

### The Core Principle

**Narrative > Numbers**

Anyone can write "47% improvement." Only Reputable has the journey from "I'd lie awake for hours with my mind racing" to "I went from 45+ minutes to fall asleep to about 15 minutes. My wife can't believe the difference."

That's what we monetize.

---

## 4. User Stories

### Primary Persona: Sarah (Social Media Manager)

| ID | Story | What "Done" Looks Like |
|----|-------|------------------------|
| **MC-01** | As Sarah, I want to generate caption copy from a participant story, so I don't stare at a blank text field | Three caption variations appear. Sarah reads the Casual one and says "yeah, I can post this" or "I'll tweak this one phrase." She does NOT say "I need to rewrite this." |
| **MC-02** | As Sarah, I want the caption to include the participant's actual journey, not just numbers, so my post tells a story that resonates | Caption references struggle, progression, and result — not just "X improved by Y%." Sarah feels like the caption *knows* this participant's story. |
| **MC-03** | As Sarah, I want to quickly copy the best quote, hero metric, and verification URL separately, so I can build my own content using these pieces | "Best Bits" section with one-click copy buttons. Sarah grabs the quote for Stories, the metric for a Reel hook, the URL for bio link. |
| **MC-04** | As Sarah, I want 3 tone options (casual, professional, urgency), so I pick the right one for each platform without overthinking | Clear labels, clear differences. Sarah immediately knows: Casual = Stories/organic, Professional = feed/LinkedIn, Urgency = ads. |
| **MC-05** | As Sarah, I want to access this from the participant card, not a separate page, so I don't lose context while browsing results | "Create Content" button on each card. Opens a drawer/modal. Sarah stays oriented on who this participant is. |

### Secondary Persona: Marcus (Head of Marketing)

| ID | Story | What "Done" Looks Like |
|----|-------|------------------------|
| **MC-06** | As Marcus, I want a posting playbook I can share with my SMM, so she knows what to post and where without asking me | PDF or single-page guide. When Sarah downloads it, she has everything she needs. Marcus never gets "what do I do with this?" |
| **MC-07** | As Marcus, I want the verification differentiator to be built into every caption, so our posts look different from regular testimonials | Every caption includes language like "verified by independent study" or ends with "See the proof: [link]." It's not optional. |
| **MC-08** | As Marcus, I want to generate content for multiple participants efficiently, so we can build a month of content in one session | Flow allows moving through participants. Not "one at a time, reload." Marcus can process 10 participants in 15 minutes. |

### Demo Persona: Kyle (Sales)

| ID | Story | What "Done" Looks Like |
|----|-------|------------------------|
| **MC-09** | As Kyle, I want to show prospects how their study data becomes social content, so they see the end-to-end value | Demo flow shows: participant card → click → caption appears. Kyle doesn't have to explain or apologize for WIP features. |
| **MC-10** | As Kyle, I want the captions to sound compelling even with demo data, so prospects say "that's good copy" | Demo participants have rich narrative data. Generated captions make Kyle's prospects say "who wrote that?" |

---

## 5. Requirements

### P0 — Must Have (MVP)

| ID | Requirement | Description | Why Non-Negotiable |
|----|-------------|-------------|-------------------|
| **P0-01** | **3 Caption Tones** | Casual, Professional, Urgency — each with distinct voice and length | Core value. Without this, feature has no purpose. |
| **P0-02** | **Narrative-Driven Captions** | Captions pull from `baseline.motivation`, `villainRatings`, `keyQuotes` — not just metrics | Thin captions = no differentiation from what brands do themselves. |
| **P0-03** | **Best Bits Quick-Copy** | Hero metric, best quote, struggle, verification URL — each with copy button | Covers "I want to use my own template but need the pieces" use case. |
| **P0-04** | **Verification Language in Every Caption** | "Verified by independent study" or verification URL in every generated caption | Non-negotiable differentiation. This is what makes Reputable content trustworthy. |
| **P0-05** | **Action on Participant Card** | "Create Content" button on BeforeAfterCard opens drawer/modal | No separate tab/page. Friction kills adoption. |
| **P0-06** | **Posting Playbook** | One-page guide: which tone for which platform, posting tips, repurposing ideas | "What do I do with this?" is the real blocker. |
| **P0-07** | **Works with Demo Studies** | Full functionality on simulated data with rich narratives | Kyle needs this for sales demos. |
| **P0-08** | **Graceful Degradation for Thin Data** | When narrative data is missing, show only what's available; don't generate garbage | Real data studies may have thin narratives. Don't embarrass us. |

### P1 — Should Have (V1.1)

| ID | Requirement | Description | Rationale |
|----|-------------|-------------|-----------|
| **P1-01** | **Batch Generation** | Select multiple participants, generate captions for all | Content calendar efficiency |
| **P1-02** | **Platform-Specific Formatting** | Caption length optimized for IG (2200 char), Twitter (280), LinkedIn (3000) | Different platforms, different constraints |
| **P1-03** | **Hashtag Suggestions** | Category-relevant hashtags appended to captions | Saves SMM time, increases reach |
| **P1-04** | **Copy-to-Clipboard Feedback** | Visual confirmation when caption is copied | Basic UX expected in 2025 |

### P2 — Nice to Have (V1.2+)

| ID | Requirement | Description |
|----|-------------|-------------|
| **P2-01** | **Brand Voice Training** | Learn from brand's existing content to match tone |
| **P2-02** | **AI Caption Regeneration** | "Try again" button for alternate versions |
| **P2-03** | **Email Snippet** | Caption formatted for Klaviyo/Mailchimp |
| **P2-04** | **A/B Variant Generation** | Multiple versions for testing |

### Out of Scope (Explicitly)

| What | Why |
|------|-----|
| **Image/graphic generation** | We lack photos, can't out-Canva Canva |
| **Canva integration** | Competing with tools they already use |
| **Carousel templates** | Visual design is not our moat |
| **Full export downloads** | They're copy-pasting words, not downloading files |

---

## 6. UI Flow

### 6.1 Entry Point — On the Participant Card

Content generation lives on the **existing participant cards** (BeforeAfterCard) in the Results tab.

```
Results Tab
├── Filter/sort participants
├── BeforeAfterCard (participant 1)
│   ├── Photo/initials, name, age
│   ├── Hero metric (before → after)
│   ├── Secondary metrics
│   ├── Quote
│   ├── [View Full Story] button
│   └── [Create Content] button  ← NEW: Opens content drawer
├── BeforeAfterCard (participant 2)
│   └── ...
└── ...
```

### 6.2 Content Generation Drawer

When user clicks "Create Content" on a participant card:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ← Back                    CREATE CONTENT FOR AMANDA K.                      │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════════ │
│                                                                             │
│  📋 BEST BITS (tap to copy)                                                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  HERO METRIC                                              [Copy]    │   │
│  │  "48% reduction in stress (Garmin-tracked HRV improved 47%)"       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  KEY QUOTE                                                [Copy]    │   │
│  │  "I stayed completely calm during a tough investor negotiation.    │   │
│  │   That would have destroyed me a month ago."                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  THE STRUGGLE                                             [Copy]    │   │
│  │  "My stress was through the roof. Constant meetings, endless       │   │
│  │   emails, and I couldn't switch off."                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  VERIFICATION LINK                                        [Copy]    │   │
│  │  reputable.health/verify/SENSATE-STRESS-001                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════════ │
│                                                                             │
│  ✍️  CAPTIONS (pick your tone)                                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  CASUAL — Organic posts, Stories                          [Copy]    │   │
│  │                                                                      │   │
│  │  Amanda was burning out. Constant meetings, stress through the      │   │
│  │  roof, and her Garmin showed she was in fight-or-flight mode 80%   │   │
│  │  of the day. She'd tried meditation apps, breathing exercises,     │   │
│  │  supplements — nothing stuck.                                        │   │
│  │                                                                      │   │
│  │  Then she tried Sensate for 28 days. Just 10 minutes a day.        │   │
│  │                                                                      │   │
│  │  Her COO asked if she'd changed something — apparently she seems   │   │
│  │  "less intense" in meetings now. Her HRV improved 47%. She         │   │
│  │  actually looks forward to her 10 minutes of calm.                  │   │
│  │                                                                      │   │
│  │  This isn't a testimonial. It's verified data from an independent  │   │
│  │  28-day study tracked with Garmin.                                  │   │
│  │                                                                      │   │
│  │  See Amanda's full verified results: reputable.health/verify/...   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  PROFESSIONAL — LinkedIn, credibility-focused             [Copy]    │   │
│  │                                                                      │   │
│  │  In a 28-day independent study, participant Amanda K. reduced her  │   │
│  │  stress levels by 48% using Sensate's vagus nerve stimulation      │   │
│  │  device.                                                            │   │
│  │                                                                      │   │
│  │  Key findings verified by Reputable:                                │   │
│  │  • HRV (heart rate variability) improved 47% (Garmin-tracked)      │   │
│  │  • Self-reported stress dropped from 8/10 to 4/10                   │   │
│  │  • "I stayed completely calm during a tough investor negotiation.  │   │
│  │     That would have destroyed me a month ago."                      │   │
│  │                                                                      │   │
│  │  Full verified results: reputable.health/verify/SENSATE-STRESS-001 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  URGENCY — Ads, Stories, Reels                            [Copy]    │   │
│  │                                                                      │   │
│  │  "My stress was through the roof. I couldn't switch off."          │   │
│  │                                                                      │   │
│  │  28 days later: 48% stress reduction. HRV up 47%.                   │   │
│  │                                                                      │   │
│  │  Amanda did it with 10 minutes a day. Verified by independent      │   │
│  │  study. See the proof in bio.                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════════ │
│                                                                             │
│  📖 POSTING PLAYBOOK                                    [Download PDF]      │
│                                                                             │
│  Quick guide: which tone for which platform, when to post,                 │
│  how to repurpose one story into 5 pieces of content.                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Playbook PDF Content

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  📖 SOCIAL PROOF PLAYBOOK                                                   │
│     Posting Strategy for Verified Participant Content                       │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════════ │
│                                                                             │
│  🎯 WHICH CAPTION GOES WHERE                                                │
│                                                                             │
│  CASUAL TONE                                                                │
│  Best for: Instagram Stories, organic feed posts, TikTok                   │
│  Why: Feels authentic, not salesy. Works for warm audiences.               │
│  Tip: Add 3-5 relevant hashtags at the end.                                │
│                                                                             │
│  PROFESSIONAL TONE                                                          │
│  Best for: LinkedIn, website testimonial pages, email campaigns            │
│  Why: Bullet points and data feel credible. Works for skeptical audiences. │
│  Tip: Great for B2B or health-conscious demographics.                      │
│                                                                             │
│  URGENCY TONE                                                               │
│  Best for: Paid ads, Story swipe-ups, Reels hooks                          │
│  Why: Short, punchy, drives action. Works for cold audiences.              │
│  Tip: Pair with strong visual. First line IS the hook.                     │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════════ │
│                                                                             │
│  📅 ONE PARTICIPANT = 5+ PIECES OF CONTENT                                  │
│                                                                             │
│  1. Full carousel post (caption + your design)                             │
│  2. Story with just the key quote                                          │
│  3. Reel/TikTok: hook with struggle, reveal with result                    │
│  4. Tweet: Hero metric + verification link                                 │
│  5. LinkedIn: Professional caption as-is                                   │
│  6. Email testimonial: Quote + verification link                           │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════════ │
│                                                                             │
│  ✓ THE VERIFICATION ADVANTAGE                                               │
│                                                                             │
│  Every caption includes a verification link. This is your differentiator.  │
│                                                                             │
│  When someone comments "is this real?" you respond:                         │
│  "Yes! You can see [Name]'s full verified results here: [link]"            │
│                                                                             │
│  This builds trust that testimonials alone never could.                    │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════════ │
│                                                                             │
│  💡 PRO TIPS                                                                │
│                                                                             │
│  • Post at YOUR peak engagement time (check your analytics)                │
│  • Use the "struggle" section as a hook — people relate to problems        │
│  • The key quote is gold for Stories and Reels captions                    │
│  • One study = months of content if you pace it right                      │
│  • When in doubt, use Casual. It performs best for most brands.            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Caption Specifications

### 7.1 Caption Structure

All captions follow a **narrative arc**:

1. **The Struggle** — What was life like before? (from `baseline.motivation`)
2. **The Attempt** — What did they try? (from `baseline.triedOther`)
3. **The Transformation** — What happened during the study? (from `villainRatings`)
4. **The Result** — The verified outcome (from `wearableMetrics`, `assessmentResult`)
5. **The Proof** — Verification language + link (from `verificationId`)

### 7.2 Tone Specifications

| Tone | Voice | Length | Structure |
|------|-------|--------|-----------|
| **Casual** | Conversational, warm, "friend telling a story" | 150-200 words | Paragraph flow, natural transitions |
| **Professional** | Credible, data-forward, "press release" | 100-150 words | Bullet points, structured data |
| **Urgency** | Punchy, short, "hook + result" | 50-80 words | Short sentences, action-oriented |

### 7.3 Required Elements (Non-Negotiable)

Every generated caption MUST include:

| Element | Why Required |
|---------|--------------|
| **Participant first name** | Humanizes the story |
| **Specific metric** | Credibility through data |
| **Duration** | "28 days" shows this isn't overnight |
| **Verification language** | "Verified by independent study" or similar |
| **Verification URL** | Proof link at the end |

### 7.4 Caption Quality Bar

A caption passes the quality bar if:

1. **It reads like a human wrote it** — not template-y, not robotic
2. **It tells a story** — not just "X improved by Y%"
3. **It uses specific details** — pulled from actual journey data
4. **It sounds like this brand could post it** — not generic, not clinical
5. **A skeptical reader would think "where's the proof?" and the link is right there**

### 7.5 Handling Thin Data

When narrative data is missing (`villainRatings` empty, no `keyQuotes`):

| Missing Data | Fallback |
|--------------|----------|
| No `baseline.motivation` | Use "was struggling with [category]" |
| No `baseline.triedOther` | Omit "tried everything" section |
| No `keyQuotes` | Use `finalTestimonial.quote` |
| No journey progression | Focus on before/after only |
| Mostly thin | Show only Best Bits, hide full captions with note: "Rich narrative data required for full captions" |

---

## 8. Technical Approach

### 8.1 Caption Generation

**Phase 1 (P0): Template-Based Generation**

```typescript
interface CaptionInput {
  participant: ParticipantStory;
  productName: string;
  studyDuration: number;
}

interface CaptionOutput {
  casual: string;
  professional: string;
  urgency: string;
  bestBits: {
    heroMetric: string;
    keyQuote: string;
    struggle: string;
    verificationUrl: string;
  };
}

function generateCaptions(input: CaptionInput): CaptionOutput {
  const { participant, productName, studyDuration } = input;

  // Extract narrative elements
  const struggle = participant.baseline?.motivation || `struggling with ${participant.journey?.villainVariable}`;
  const triedBefore = participant.baseline?.triedOther;
  const bestQuote = participant.journey?.keyQuotes?.[0]?.quote || participant.finalTestimonial?.quote;
  const heroMetric = formatHeroMetric(participant);
  const verificationUrl = `reputable.health/verify/${participant.verificationId}`;

  // Generate each tone
  const casual = generateCasualCaption({ struggle, triedBefore, bestQuote, heroMetric, productName, studyDuration, verificationUrl });
  const professional = generateProfessionalCaption({ /* ... */ });
  const urgency = generateUrgencyCaption({ /* ... */ });

  return { casual, professional, urgency, bestBits: { heroMetric, keyQuote: bestQuote, struggle, verificationUrl } };
}
```

**Phase 2 (P1): AI-Enhanced Generation**

- Use LLM to improve natural language flow
- Train on high-performing wellness brand posts
- Still constrained by template structure for consistency

### 8.2 Data Requirements

Caption quality depends on narrative richness. Required data fields:

| Field | Location | Critical? |
|-------|----------|-----------|
| `baseline.motivation` | Story baseline | Yes — powers "struggle" section |
| `baseline.triedOther` | Story baseline | Nice-to-have |
| `journey.villainRatings` | Journey | Nice-to-have — shows progression |
| `journey.keyQuotes` | Journey | Yes — best specific quote |
| `wearableMetrics` / `assessmentResult` | Story | Yes — quantified result |
| `verificationId` | Story | Yes — proof link |
| `finalTestimonial.quote` | Story | Fallback for keyQuotes |

### 8.3 Component Architecture

```
BrandResultsTab
└── ParticipantGrid
    └── BeforeAfterCard
        └── [Create Content] button
            └── ContentGeneratorDrawer
                ├── BestBitsSection
                │   ├── CopyableField (heroMetric)
                │   ├── CopyableField (keyQuote)
                │   ├── CopyableField (struggle)
                │   └── CopyableField (verificationUrl)
                ├── CaptionSection
                │   ├── CaptionCard (casual)
                │   ├── CaptionCard (professional)
                │   └── CaptionCard (urgency)
                └── PlaybookDownload
```

### 8.4 Playbook PDF Generation

Use **react-pdf** or html-to-pdf for client-side generation:

```typescript
interface PlaybookData {
  brandName: string;
  productName: string;
  categoryLabel: string; // "Sleep", "Stress", etc.
}

function generatePlaybook(data: PlaybookData): Blob {
  // Static content with dynamic brand name
  // Returns downloadable PDF
}
```

---

## 9. Acceptance Tests

These tests include **taste criteria** — not just technical pass/fail. Each test specifies **who judges** whether the output is "good enough."

---

### AT-1: Caption Quality — The "Post This" Test

**Persona:** Sarah (Social Media Manager)
**Judge:** A real SMM or someone who manages social for a wellness brand

**Setup:**
- Generate captions for 3 different participants with rich narrative data
- Print or display each Casual caption without branding

**The Test:**

The judge reads each caption and answers:

| Question | Pass Criteria |
|----------|---------------|
| "Would you post this as-is?" | At least 1 of 3 gets "yes" or "with minor tweaks" |
| "Does this sound like a human wrote it?" | All 3 get "yes" |
| "Does this tell a story, not just cite a number?" | All 3 get "yes" |
| "Is there anything cringeworthy or template-y?" | All 3 get "no" |
| "Does the verification language feel natural?" | All 3 get "yes" — not shoehorned |

**Failure Modes:**
- "This sounds like a bot wrote it"
- "I'd have to completely rewrite this"
- "The numbers are there but there's no story"
- "The verification part feels forced"
- "This could be about any product — nothing specific"

**Who Runs This Test:** Product team runs with real SMM or marketing professional. Not engineers. Not founders assessing their own work.

---

### AT-2: Tone Differentiation — "I Know Which to Use"

**Persona:** Sarah (Social Media Manager)
**Judge:** Anyone unfamiliar with the feature

**Setup:**
- Generate all 3 tones for one participant
- Display them side by side, labeled only as A, B, C (not Casual/Professional/Urgency)

**The Test:**

The judge reads all 3 and sorts them into:

1. "This is for organic social / Stories"
2. "This is for LinkedIn / formal contexts"
3. "This is for ads / short-form"

| Criteria | Pass |
|----------|------|
| Judge correctly sorts all 3 | Yes |
| Judge can articulate WHY each belongs in its category | Yes |
| Length differences are noticeable (short vs medium vs long) | Yes |
| Voice differences are noticeable (casual vs formal vs punchy) | Yes |

**Failure Modes:**
- "These all sound the same"
- "I'm not sure which is which"
- Judge misclassifies 2+ captions

**Who Runs This Test:** Anyone not involved in building the feature. Could be customer support, could be someone's friend. Must NOT know the intended labels.

---

### AT-3: Best Bits — "I Found What I Need in 10 Seconds"

**Persona:** Sarah (Social Media Manager)
**Judge:** Timer + observation

**Setup:**
- Open content drawer for a participant
- Start timer

**The Test:**

Sarah is asked: "Find and copy the participant's best quote."

| Criteria | Pass |
|----------|------|
| Time to locate and copy | < 10 seconds |
| Sarah didn't have to scroll | Yes |
| Copy confirmation was visible | Yes |
| Copied text is the actual best quote | Yes |

Repeat for: hero metric, struggle, verification URL.

**Failure Modes:**
- "Where is it?"
- Scrolling required to find Best Bits
- Copy button not obvious
- Copied wrong content

**Who Runs This Test:** Anyone unfamiliar with the UI. Literally time them.

---

### AT-4: The Demo Moment — "Prospect Says Wow"

**Persona:** Kyle (Sales)
**Judge:** Kyle + recorded prospect reaction

**Setup:**
- On a real demo call with screen share
- Navigate to a demo study participant
- Click "Create Content"

**The Test:**

Observe prospect reaction and record verbatim.

| Criteria | Pass |
|----------|------|
| Prospect reaction | Any of: "That's great", "I want that", "Who writes those?", impressed silence, forward lean |
| Kyle had to apologize or explain | No ("ignore this" or "this is still WIP" = fail) |
| Flow was instant | No loading spinners visible |
| Kyle could demo in < 30 seconds | Yes |

**Failure Modes:**
- Prospect: "When will this be ready?"
- Prospect: "So I still have to design everything?"
- Prospect: Visible confusion or disengagement
- Kyle: "So basically..." (meaning it wasn't self-explanatory)

**Who Runs This Test:** Kyle, on real calls. Product team reviews recordings.

---

### AT-5: Thin Data Graceful Degradation — "Don't Embarrass Us"

**Persona:** N/A (Technical)
**Judge:** Product team

**Setup:**
- Use a real data participant with thin narrative (no `villainRatings`, no `keyQuotes`, minimal `baseline`)
- Open content drawer

**The Test:**

| Criteria | Pass |
|----------|------|
| System doesn't crash or error | Yes |
| Generated caption isn't embarrassingly thin | Yes — must still tell SOME story |
| Missing sections are gracefully hidden, not blank | Yes |
| Clear indicator that richer data = better captions | Optional — nice to have |
| Verification link still present | Yes |

**Example of Passing Thin Caption:**
> "Lisa improved her sleep quality by 23% over 28 days using [Product]. Verified by independent study. See her results: [link]"

**Example of Failing Thin Caption:**
> "[Name] saw [metric] improve by [X]% in [N] days. [Empty paragraph]. [Another empty section]. See results: [link]"

**Failure Modes:**
- Visible template placeholders
- Empty sections with headers
- Caption that reads like Mad Libs
- No story at all — just numbers

**Who Runs This Test:** Product team. Test with 3+ real data participants with varying narrative richness.

---

### AT-6: Verification is Non-Negotiable — "The Link is Always There"

**Persona:** N/A (Product requirement)
**Judge:** Automated test + spot check

**Setup:**
- Generate captions for 10 participants
- Export each caption

**The Test:**

| Criteria | Pass |
|----------|------|
| Every caption contains verification URL | Yes — 10/10 |
| Every caption contains verification language | Yes — "verified", "independent study", or similar |
| Verification URL is correct (matches participant) | Yes — 10/10 |
| URL is at or near the end (not buried mid-paragraph) | Yes |
| Best Bits includes verification URL as copyable field | Yes |

**Failure Modes:**
- Any caption missing verification link
- Wrong verification ID in URL
- Verification language removed or optional
- URL buried so it's not clickable on platforms that truncate

**Who Runs This Test:** Automated + product team spot check.

---

### AT-7: The Playbook — "Sarah Knows What To Do"

**Persona:** Sarah (Social Media Manager)
**Judge:** Sarah (or SMM proxy)

**Setup:**
- Sarah downloads the playbook PDF
- Sarah has the 3 captions available
- Sarah has NOT used the feature before

**The Test:**

Give Sarah this task: "Post content about this participant on Instagram, LinkedIn, and as a paid ad."

| Criteria | Pass |
|----------|------|
| Sarah picks the right caption for each platform | Yes — without asking |
| Sarah understands why Casual = IG, Professional = LinkedIn, Urgency = Ads | Yes — can articulate it |
| Sarah knows to add the verification link to her bio/caption | Yes |
| Sarah feels confident, not overwhelmed | Yes — observe body language |
| Time to read playbook and feel ready | < 3 minutes |

**Failure Modes:**
- "Which one do I use for Instagram?"
- Sarah picks wrong tone for platform
- Sarah doesn't understand verification value
- Playbook is too long or text-heavy

**Who Runs This Test:** Real SMM or marketing coordinator. Not the product team.

---

### AT-8: End-to-End Time — "30 Seconds to Captions"

**Persona:** Sarah (Social Media Manager)
**Judge:** Timer

**Setup:**
- Sarah is on the Results tab looking at participant cards
- Timer starts when Sarah clicks "Create Content"

**The Test:**

| Checkpoint | Target |
|------------|--------|
| Content drawer opens | < 1 second |
| Best Bits visible | Immediately (no scroll) |
| Captions visible | Immediately (may scroll) |
| Copy first caption | < 5 seconds from drawer open |
| Copy Best Bits (all 4) | < 15 seconds total |
| Download playbook | < 3 seconds |
| **Total time: Click → Ready to post** | < 30 seconds |

**Failure Modes:**
- Loading spinner when drawer opens
- Captions generate slowly
- Sarah hunting for copy button
- Multiple clicks required to copy

**Who Runs This Test:** Product team with timer. Run 3 times, average.

---

### AT-9: Caption Taste — "The Pankaj Test"

**Persona:** Pankaj (Founder)
**Judge:** Pankaj

**Setup:**
- Generate Casual captions for 5 top-performing demo participants
- Present to Pankaj without product team present

**The Test:**

Pankaj reads each caption and answers:

| Question | Pass |
|----------|------|
| "Would I be embarrassed showing this to a customer?" | No — for all 5 |
| "Does this capture what makes Reputable different?" | Yes — for all 5 |
| "Does the verification language feel valuable, not forced?" | Yes — for all 5 |
| "Would a wellness brand CMO think 'this is good copy'?" | Yes — for at least 4 of 5 |
| "Is there anything that sounds like a software company wrote it?" | No — for all 5 |

**Failure Modes:**
- "This is too corporate"
- "This doesn't feel like a real person's story"
- "The verification thing feels shoehorned"
- "I wouldn't show this to Sensate"
- Any cringe reaction

**Who Runs This Test:** Pankaj, alone. Honest reaction, not polite feedback.

---

### AT-10: Narrative Richness — "The Story Comes Through"

**Persona:** Outsider with no context
**Judge:** Someone who has never heard of Reputable

**Setup:**
- Show the outsider 3 Casual captions (no UI, just the text)
- Don't explain anything about the product or company

**The Test:**

After reading each caption, the outsider summarizes the participant's journey:

| Criteria | Pass |
|----------|------|
| Outsider can describe what the person struggled with | Yes — for all 3 |
| Outsider can describe what changed | Yes — for all 3 |
| Outsider mentions a specific detail (not just "they improved") | Yes — for at least 2 of 3 |
| Outsider can articulate why this is more credible than a testimonial | Yes — mentions "verified" or "study" or "tracked" |

**Failure Modes:**
- "So they used some product and got better?"
- No recall of struggle or specific details
- Outsider doesn't notice the verification angle
- Stories are interchangeable/generic

**Who Runs This Test:** Product team with someone outside the company. Coffee shop test.

---

## 10. Success Metrics

### Primary Metrics

| Metric | Target | How We Measure |
|--------|--------|----------------|
| **Caption Copy Rate** | 60% of content drawer opens result in caption copy | Track `caption_copied` events |
| **Best Bits Usage** | 40% of sessions copy at least one Best Bit | Track `best_bit_copied` events |
| **Time to First Copy** | Median < 15 seconds | Timestamp from drawer open to first copy |
| **Repeat Usage** | 50% of brands use feature for multiple participants | Unique participants per brand |

### Secondary Metrics

| Metric | Target | How We Measure |
|--------|--------|----------------|
| **Playbook Downloads** | 30% of sessions download playbook | Track `playbook_downloaded` |
| **Tone Preference Distribution** | Track which tone is copied most | Breakdown by casual/professional/urgency |
| **Verification Link Clicks** | Track external clicks on verification URLs in the wild | Referrer data on verification pages |

### Qualitative Signals

- **Customer Feedback:** "These captions are actually good" (not just "this is useful")
- **Demo Reactions:** Prospects impressed by caption quality specifically
- **Social Monitoring:** Brands actually posting captions (look for our verification URLs in the wild)

### Anti-Metrics

| Anti-Metric | Threshold | Response |
|-------------|-----------|----------|
| **Drawer Close Without Action** | < 30% | Improve immediate value visibility |
| **"The captions are generic"** | Any feedback to this effect | Improve narrative extraction |
| **Verification Links Removed** | Track edited captions | Investigate, reinforce value |

---

## 11. Open Questions

### Content Decisions

1. **Hashtag Inclusion**
   - Question: Include hashtags in captions or leave for brands to add?
   - Recommendation: P0 = no hashtags (clean). P1 = optional hashtag suggestions.
   - Who Decides: Test with SMMs.

2. **Product Name Handling**
   - Question: Where does product name come from?
   - Current: Study metadata or brand info
   - Edge Case: What if product name ≠ brand name?

3. **Caption Personalization**
   - Question: Should we learn brand voice over time?
   - Recommendation: P2. Start with universal wellness brand tone.

### Data Questions

1. **Narrative Data Coverage**
   - Question: What % of completed participants have rich narrative data?
   - Action: Audit real data studies
   - Risk: If most participants have thin data, feature value is reduced

2. **Demo Data Quality**
   - Question: Do all demo studies have full narrative data?
   - Action: Verify `sensate-demo-stories.ts` and similar have complete journey data
   - Critical: Kyle's demo depends on this

### Technical Questions

1. **Caption Caching**
   - Question: Generate on-demand or pre-generate?
   - Recommendation: On-demand (captions are fast, data may change)

2. **Copy-to-Clipboard Implementation**
   - Question: HTML formatting preserved?
   - Answer: Plain text only for social compatibility

---

## Appendix: Comparison to Original Marketing Launchpad

| Original Scope | New Scope | Reason |
|----------------|-----------|--------|
| Canva carousel templates | **Removed** | Competing with Canva, not our moat |
| Instagram Story templates | **Removed** | Same reason |
| Ad creative templates | **Removed** | Same reason |
| 5-slide carousel preview | **Removed** | We don't have photos to fill them |
| ZIP download with assets | **Removed** | They're copy-pasting text, not downloading files |
| Visual export flow | **Removed** | Entire paradigm shift |
| **Caption copy (3 tones)** | **Kept** | Core value |
| **Playbook PDF** | **Kept** | Answers "what do I do with this" |
| **Best Bits quick-copy** | **NEW** | Fast extraction of key elements |
| **Action on card (not separate tab)** | **NEW** | Reduces friction |

### What This Enables

By removing visual exports, we can:
1. Ship faster (no Canva integration, no image generation)
2. Focus on what we're uniquely good at (narrative extraction)
3. Avoid the photo problem entirely
4. Create a feature that complements their existing design tools

### What We're Betting On

We're betting that:
1. Captions are the hard part, not graphics
2. Brands have their own design resources/tools
3. Verification language in captions is the differentiator
4. Rich narrative data is what makes captions valuable

If this bet is wrong, we'll see low caption copy rates and feedback like "we need visual assets." In that case, we revisit — but start with the simpler scope to validate.

---

## Appendix: Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2025-01-30 | 0.1 | Initial draft — simplified scope from Marketing Launchpad |

