# PRD: Marketing Launchpad

*Product Requirements Document — Marketing Launchpad*
*Created: 2025-01-30*
*Status: Draft*

---

## Table of Contents

1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [Strategic Direction (Validated)](#3-strategic-direction-validated)
4. [User Stories](#4-user-stories)
5. [Requirements](#5-requirements)
6. [UI Flow](#6-ui-flow)
7. [Asset Specifications](#7-asset-specifications)
8. [Technical Approach](#8-technical-approach)
9. [Acceptance Tests](#9-acceptance-tests)
10. [Success Metrics](#10-success-metrics)
11. [Open Questions](#11-open-questions)

---

## 1. Overview

### What We're Building

**Marketing Launchpad** — a feature that transforms verified study results into ready-to-post marketing content in under 5 minutes.

Not files. A **recipe**.

When a brand finishes their study, they get:
1. **Beautiful visual assets** — Canva templates pre-filled with their participant data
2. **Ready-to-use copy** — Captions, hooks, and CTAs for each post
3. **A playbook** — Which asset goes where, what to post when
4. **Verification built-in** — Small, tasteful "Verified by Reputable" badge

### The One-Liner

> Click a button, get a complete social media campaign with your verified participant stories — not ingredients, a finished dish.

### Why Now

Every brand completing a Reputable study today hits the same wall: amazing verified data, no way to use it. They're screenshotting, manually recreating in Canva, and copying stats by hand. This takes **1.5-2 hours per participant**. 

For a 20-person study, that's 30-40 hours of tedious work that should take 30 minutes total.

### The Demo Moment (Kyle's Pitch)

*"See this participant? Sarah saw her deep sleep improve 147%. Watch this..."*
*[clicks one button]*
*"Now you have Instagram posts, Stories, ad creative — all with your brand colors and this data already filled in. Caption copy written. A playbook telling you what to post and when. Your marketing person downloads, customizes in Canva for 90 seconds, and posts. That's it."*

This needs to feel magical. One click → campaign ready.

---

## 2. Problem Statement

### Current State

Brands complete Reputable studies and receive:
- Verified participant testimonials
- Before/after wearable metrics (sleep, HRV, recovery)
- Assessment score changes
- Consent-approved photos

**But the path to marketing content is broken:**

```
Study Complete → Screenshot Dashboard → Recreate in Canva → 
Copy Stats Manually → Lose Verification → Hope It Looks Good → Post
```

Time: 1.5-2 hours per participant
Result: Generic-looking posts without proof of verification
Adoption: Low (too painful)

### The Real Problem (From Persona Research)

We talked to two personas — Sarah (Social Media Manager) and Marcus (Head of Marketing). Key insights:

**Sarah said:**
> "I'm already drowning in content creation. If I have to design from scratch, I'll screenshot and move on. Give me something 80% done that I can polish in 90 seconds."

**Marcus said:**
> "Don't give me ingredients. Give me a recipe. I'll still customize it, but I need to see the finished dish first. What do I post? Where? When? That's what my team needs."

### What We're NOT Building

Previous approaches tried to build an in-house design tool. That's:
- ❌ Competing with Canva (we lose)
- ❌ Reinventing the wheel (they're already good at Canva)
- ❌ Too much friction ("another tool to learn")

We're building a **launchpad**, not a design studio.

---

## 3. Strategic Direction (Validated)

We ran persona critics (Sarah the SMM, Marcus the Head of Marketing) on potential approaches. Here's what we learned:

### What Works ✅

| Insight | Why It Matters |
|---------|----------------|
| **Canva templates with data pre-filled** | They already know Canva. 90 seconds with Brand Kit vs 2 hours from scratch. |
| **80% done + 20% customizable** | "Will use every time" — both personas agreed |
| **Copy is as important as design** | Captions, hooks, email subject lines — not just images |
| **Playbook, not just files** | "Which asset goes where, what's the posting schedule" |
| **Bite-sized versions** | One stat for Stories, one quote for Reels |
| **Warm, approachable aesthetic** | Wellness brands want warm vibes, not clinical |

### What Kills Adoption ❌

| Anti-Pattern | Why It Fails |
|--------------|--------------|
| **Wrong dimensions** | 4:5 for feed, 9:16 for Stories — mixing these up = unusable |
| **Clinical/sterile vibes** | Wellness brands reject anything that feels like a medical report |
| **Oversized Reputable branding** | "This looks like an ad for you, not us" |
| **No clear "what do I do next"** | Files without a playbook = abandoned in Drive |
| **Asking them to design** | If they have to start from scratch, they won't |

### The Core Principle

**Recipe > Ingredients**

Don't give them raw participant data and say "go make content."
Give them the finished dish and say "adjust to taste."

---

## 4. User Stories

### Primary Persona: Sarah (Social Media Manager)

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| **ML-01** | As Sarah, I want to get ready-to-post Instagram content from study results, so I can fill my content calendar without starting from scratch | One-click access to Canva templates with data pre-filled |
| **ML-02** | As Sarah, I want caption copy written for me, so I don't stare at a blank text field | 3 caption variations per asset (casual, professional, urgency) |
| **ML-03** | As Sarah, I want the right dimensions for each platform, so I don't have to resize anything | 4:5 feed, 9:16 Story, 1:1 ad — all provided |
| **ML-04** | As Sarah, I want to customize in my existing tools (Canva), so I don't learn a new design app | Canva template links, not a proprietary editor |
| **ML-05** | As Sarah, I want a playbook telling me what to post when, so I have a content strategy not just files | One-pager with posting schedule and platform guidance |

### Secondary Persona: Marcus (Head of Marketing)

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| **ML-06** | As Marcus, I want my team to execute without handholding, so I can assign "launch the study content" and trust it gets done | Self-explanatory flow, playbook included |
| **ML-07** | As Marcus, I want verification to be visible but not overwhelming, so we maintain credibility without looking like a Reputable ad | Small, tasteful badge — not a banner |
| **ML-08** | As Marcus, I want multiple participants exportable at once, so we can build a month of content in one session | Batch export (P1) |
| **ML-09** | As Marcus, I want to know what claims are safe to make, so we don't get in regulatory trouble | Compliance guidance (P1) |

### Demo Persona: Kyle (Sales)

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| **ML-10** | As Kyle, I want to demo this feature and have prospects say "wow", so I close more deals | One-click "wow" moment, instant preview, no loading screens |
| **ML-11** | As Kyle, I want to show real-looking outputs without live customer data, so I can demo with confidence | Works with DEMO studies, looks realistic |

---

## 5. Requirements

### P0 — Must Have (MVP)

These are non-negotiable for launch.

| ID | Requirement | Description | Rationale |
|----|-------------|-------------|-----------|
| **P0-01** | **Instagram Carousel Template (4:5)** | Canva template link for 3-5 slide carousel, pre-filled with participant data | Primary social format; takes 30% more screen real estate |
| **P0-02** | **Instagram Story Template (9:16)** | Canva template link for single vertical story | Stories get 500M+ daily users; essential format |
| **P0-03** | **Ad Creative Template (1:1)** | Canva template link for square ad unit | Meta/Google ads; paid media staple |
| **P0-04** | **Pre-filled Participant Data** | Templates include: name, age, photo, quote, top 3 metrics, study duration | No copy-paste; data is already there |
| **P0-05** | **Caption Copy (3 Versions)** | Each asset includes 3 caption variations: Casual, Professional, Urgency | Copy is as important as design |
| **P0-06** | **One-Pager Playbook** | PDF with: what to post, which platform, suggested schedule, posting tips | Recipe, not ingredients |
| **P0-07** | **"Verified by Reputable" Badge** | Small, tasteful badge on every asset linking to verification page | Non-negotiable differentiation |
| **P0-08** | **Single Participant Export** | Select one participant → get all their assets | Start simple, batch comes later |
| **P0-09** | **Demo Study Support** | Full functionality on demo/simulated studies | Kyle needs this for sales calls |
| **P0-10** | **< 5 Minute Flow** | From "I want content" to "I have assets" in under 5 minutes | This is the bar |

### P1 — Should Have (V1.1)

Important but can wait for next iteration.

| ID | Requirement | Description | Rationale |
|----|-------------|-------------|-----------|
| **P1-01** | **Email HTML Snippet** | Copy-paste HTML for Klaviyo/Mailchimp with participant story | High time savings; frequently requested |
| **P1-02** | **Batch Export** | Select multiple participants → get organized ZIP | Content calendar efficiency |
| **P1-03** | **Compliance Language Guide** | "What claims are safe" reference document | Reduces legal anxiety |
| **P1-04** | **UGC-Style Templates** | More casual, phone-screenshot aesthetic | Performs better for some brands |
| **P1-05** | **Reel/TikTok Caption Hooks** | Short hooks optimized for vertical video | Different copy style needed |

### P2 — Nice to Have (V1.2+)

Future enhancements.

| ID | Requirement | Description |
|----|-------------|-------------|
| **P2-01** | **Video/Animated Templates** | Motion versions of carousels |
| **P2-02** | **Deep Canva API Integration** | Auto-apply brand kit, skip manual step |
| **P2-03** | **Direct Publish to Meta/IG** | Connect account, post from dashboard |
| **P2-04** | **A/B Test Variants** | Multiple creative directions to test |
| **P2-05** | **AI Caption Personalization** | Adapt tone to brand voice |

### Out of Scope (Explicitly)

| What | Why Not |
|------|---------|
| **In-house design editor** | We're not competing with Canva |
| **Exact brand guideline matching** | They customize in Canva; that's 90 seconds |
| **Video/animated content (P0)** | Complexity; static first |
| **Multiple brand kit presets** | One brand = one kit; keep it simple |

---

## 6. UI Flow

### 6.1 Entry Point

Marketing Launchpad lives on the **Marketing Kit tab** in the study detail view.

```
Study Detail Page
├── Overview Tab
├── Participants Tab  
├── Results Tab
├── Marketing Kit Tab  ← Marketing Launchpad lives here
│   └── "Launch Your Content" section
└── Widget Tab
```

### 6.2 Launchpad Home View

When a brand lands on Marketing Kit tab, they see:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  🚀 MARKETING LAUNCHPAD                                                     │
│                                                                             │
│  Turn your study results into ready-to-post content in minutes.             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  YOUR TOP PERFORMERS                                                 │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ [Photo]      │  │ [Photo]      │  │ [Photo]      │              │   │
│  │  │ Sarah, 34    │  │ Mike, 41     │  │ Lisa, 28     │              │   │
│  │  │              │  │              │  │              │              │   │
│  │  │ +47 min      │  │ +38 min      │  │ +51 min      │              │   │
│  │  │ Deep Sleep   │  │ Deep Sleep   │  │ Deep Sleep   │              │   │
│  │  │              │  │              │  │              │              │   │
│  │  │ [Launch →]   │  │ [Launch →]   │  │ [Launch →]   │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                      │   │
│  │  +12 more participants with verified results                         │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📖 WHAT YOU'LL GET                                                         │
│                                                                             │
│  ✓ Instagram Carousel (4:5) — Pre-filled Canva template                    │
│  ✓ Instagram Story (9:16) — Ready for Stories                              │
│  ✓ Ad Creative (1:1) — Meta/Google ready                                   │
│  ✓ 3 Caption Variations — Casual, Professional, Urgency                    │
│  ✓ Playbook PDF — What to post, where, when                                │
│                                                                             │
│  Total time: ~5 minutes → Ready to post                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**
- Top performers highlighted (best metrics first)
- Clear "what you'll get" preview — no mystery
- Time estimate builds confidence
- "Launch" as the verb — feels exciting, not clinical

### 6.3 Launch Flow (Single Participant)

When user clicks "Launch →" on a participant:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ← Back                          SARAH'S MARKETING KIT                      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │                    [PREVIEW CAROUSEL]                                │   │
│  │                                                                      │   │
│  │    ┌────────────────────────────────────────────────────────────┐   │   │
│  │    │                                                             │   │   │
│  │    │         +47 MINUTES                                         │   │   │
│  │    │         more deep sleep                                     │   │   │
│  │    │                                                             │   │   │
│  │    │              [Photo]                                        │   │   │
│  │    │             Sarah, 34                                       │   │   │
│  │    │                                                             │   │   │
│  │    │    [Verified by Reputable ✓]           [Your Logo]         │   │   │
│  │    │                                                             │   │   │
│  │    └────────────────────────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  │    ← Slide 1 of 5: The Hook                [1] [2] [3] [4] [5] →   │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📦 YOUR KIT INCLUDES                                                       │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │                 │  │                 │  │                 │            │
│  │  📱 Carousel    │  │  📱 Story       │  │  🎯 Ad Creative │            │
│  │  4:5 Feed Post  │  │  9:16 Vertical  │  │  1:1 Square     │            │
│  │  5 slides       │  │  1 slide        │  │  1 image        │            │
│  │                 │  │                 │  │                 │            │
│  │  [Preview]      │  │  [Preview]      │  │  [Preview]      │            │
│  │                 │  │                 │  │                 │            │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                             │
│  📝 CAPTION COPY (tap to copy)                                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  CASUAL                                               [Copy]        │   │
│  │  "Sarah tried everything for sleep. Nothing worked. Then she        │   │
│  │   tried [Product] — 28 days later, she's getting 47 more            │   │
│  │   minutes of deep sleep every night. Real results, verified..."     │   │
│  │                                                                      │   │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │   │
│  │                                                                      │   │
│  │  PROFESSIONAL                                         [Copy]        │   │
│  │  "Verified results from our 28-day study: Sarah improved her        │   │
│  │   deep sleep by 147%. No gimmicks — real people, real data,         │   │
│  │   independently verified by Reputable..."                           │   │
│  │                                                                      │   │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │   │
│  │                                                                      │   │
│  │  URGENCY                                              [Copy]        │   │
│  │  "Sarah used to toss and turn for hours. Now? 47 extra minutes      │   │
│  │   of deep sleep every single night. Want the same? Link in bio..."  │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  🎨 Open in Canva (customize fonts, colors)                         │   │
│  │                                                                      │   │
│  │  [Open Carousel Template]  [Open Story Template]  [Open Ad Template]│   │
│  │                                                                      │   │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │   │
│  │                                                                      │   │
│  │  📥 Download Everything                                              │   │
│  │                                                                      │   │
│  │  [Download Kit (.zip)]  — All assets + captions + playbook          │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**
- Big, beautiful preview — this is the "wow" moment
- All formats visible at once — no hunting
- Caption copy is PROMINENT — not hidden in a dropdown
- Two paths: "Open in Canva" (customize) or "Download Everything" (quick)
- Clear what's included before any action

### 6.4 Playbook PDF Preview

What the one-pager playbook includes:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  📖 YOUR SOCIAL PROOF PLAYBOOK                                              │
│     [Brand Name] x [Product Name] Study Results                             │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  🎯 YOUR ASSETS                                                             │
│                                                                             │
│  • Instagram Carousel (4:5) — 5 slides featuring Sarah's story             │
│  • Instagram Story (9:16) — Single stat highlight                          │
│  • Ad Creative (1:1) — Quote + result for paid media                       │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📅 SUGGESTED POSTING SCHEDULE                                              │
│                                                                             │
│  DAY 1: Instagram Feed                                                      │
│         Post the carousel at your peak engagement time                      │
│         Use the "Casual" caption variation                                  │
│                                                                             │
│  DAY 2: Instagram Stories                                                   │
│         Post the Story template (add link sticker to product page)          │
│         Repurpose for Reels by adding voiceover                             │
│                                                                             │
│  DAY 3-5: Paid Ads                                                          │
│         Use the 1:1 ad creative in Meta Ads Manager                         │
│         Test the "Urgency" caption as ad copy                               │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ✍️ CAPTION COPY (all 3 variations)                                         │
│                                                                             │
│  [Full caption text included here for easy copy-paste]                      │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ✓ VERIFICATION                                                             │
│                                                                             │
│  All assets include a "Verified by Reputable" badge that links to:          │
│  reputable.health/verify/[study-id]/[participant-id]                        │
│                                                                             │
│  This proves to your audience that the results are real and independently   │
│  verified — not just a testimonial you made up.                             │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  💡 TIPS FOR BEST RESULTS                                                   │
│                                                                             │
│  • Post carousels when your audience is most active (check Insights)        │
│  • Add your brand colors in Canva using Brand Kit (~90 seconds)             │
│  • Use the verification badge as a conversation starter in comments         │
│  • Repurpose: one participant's story = 3-5 pieces of content               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Asset Specifications

### 7.1 Instagram Carousel (4:5)

**Dimensions:** 1080 × 1350 pixels (4:5 vertical)
**Slides:** 5

| Slide | Name | Content |
|-------|------|---------|
| 1 | **The Hook** | Hero metric in large type ("**+47 minutes** more deep sleep"), participant photo, verification badge |
| 2 | **The Struggle** | Quote about what they tried before, baseline metrics subtle |
| 3 | **The Transformation** | Before → After metrics with visual emphasis (big numbers, green arrows) |
| 4 | **The Testimonial** | Full quote, participant attribution, "28-day verified study" |
| 5 | **The CTA** | QR code to verification page, brand logo centered, "See the proof" |

**Design Direction:**
- Warm, approachable (not clinical)
- Plenty of white space
- Large, readable typography
- Metrics as visual elements (not tables)
- Verification badge: small, bottom corner, tasteful

### 7.2 Instagram Story (9:16)

**Dimensions:** 1080 × 1920 pixels (9:16 vertical)
**Slides:** 1

**Content:**
- One hero stat ("**+47 min** Deep Sleep")
- Participant photo (circular crop)
- Short quote (1-2 sentences max)
- Verification badge
- "Swipe up" or "Link" CTA zone at bottom

**Design Direction:**
- Bold, attention-grabbing
- Less content than carousel (scannable)
- Clear visual hierarchy
- Safe zones respected (no text at top/bottom edges)

### 7.3 Ad Creative (1:1)

**Dimensions:** 1080 × 1080 pixels (square)
**Slides:** 1

**Content:**
- Hero quote + metric
- Participant photo
- Brand logo
- Verification badge
- Clean, professional aesthetic

**Design Direction:**
- Optimized for paid media
- Less text (20% rule friendly)
- High contrast for feed scroll
- CTA-focused layout

### 7.4 Caption Copy Specifications

Each asset includes **3 caption variations**:

| Version | Tone | Length | Best For |
|---------|------|--------|----------|
| **Casual** | Conversational, friendly, emoji-light | Medium (100-150 words) | Organic feed posts, engaged audiences |
| **Professional** | Credible, data-forward, no emoji | Medium (100-150 words) | B2B contexts, skeptical audiences |
| **Urgency** | Action-oriented, FOMO, direct | Short (50-80 words) | Paid ads, Stories, Reels |

**Structure for each:**
1. **Hook** — First line that stops the scroll
2. **Story** — Brief context about the participant
3. **Result** — The verified outcome
4. **Proof** — Mention of Reputable verification
5. **CTA** — What to do next

**Example (Casual):**

```
Sarah tried everything for sleep. Melatonin. Sleep apps. Even prescription meds.
Nothing worked.

Then she tried [Product] for 28 days.

The result? +47 minutes of deep sleep. Every. Single. Night.

This isn't just a testimonial — it's verified data from an independent study.
Tracked with Oura Ring. Analyzed by Reputable.

Want proof? Tap the link in bio to see Sarah's full story and verified results.

#sleep #wellness #verified #realresults
```

### 7.5 Verification Badge

**Placement:** Bottom corner of every asset (opposite from brand logo)
**Size:** Small — approximately 8-10% of image width
**Design:** 
- "Verified by Reputable" text
- Small checkmark icon
- Links to: `reputable.health/verify/[study-id]/[participant-id]`

**Non-negotiable:** Cannot be removed, hidden, or resized below minimum.

---

## 8. Technical Approach

### 8.1 Canva Template Strategy

**Phase 1 (P0): Manual Template Links**

1. We create master Canva templates (one per format)
2. Templates have placeholder text/images
3. User opens template in Canva → manually replaces placeholders with their data
4. Data is displayed in dashboard for easy copy-paste

**Why this works for MVP:**
- Zero integration complexity
- Brands already know Canva
- 90 seconds to customize with Brand Kit
- We can launch fast

**Phase 2 (P1): Pre-filled Templates**

1. Use Canva's "Create design from template" URL parameters
2. Pass participant data as URL parameters
3. Template opens with data pre-filled
4. Brand applies Brand Kit to customize

**Implementation notes:**
- Canva supports `text` parameters in template URLs (limited)
- For images, may need a hosted asset URL approach
- Research Canva partner API for deeper integration

### 8.2 Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Study Data     │────▶│  Launchpad UI   │────▶│  Canva Template │
│                 │     │                 │     │                 │
│  - Participant  │     │  - Preview      │     │  - User edits   │
│  - Metrics      │     │  - Copy buttons │     │  - Brand Kit    │
│  - Photos       │     │  - Template     │     │  - Download     │
│  - Quotes       │     │    links        │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 8.3 Copy Generation

Caption copy is **templated, not AI-generated** for P0:

```typescript
interface CaptionTemplate {
  version: 'casual' | 'professional' | 'urgency';
  template: string; // Uses {{variables}}
}

const casualTemplate = `
{{participantName}} tried everything for {{problem}}. {{whatTheyTried}}.
Nothing worked.

Then {{pronoun}} tried {{productName}} for {{studyDuration}}.

The result? {{heroMetric}}. {{frequency}}.

This isn't just a testimonial — it's verified data from an independent study.
Tracked with {{wearableType}}. Analyzed by Reputable.

Want proof? Tap the link in bio to see {{participantName}}'s full story and verified results.

#{{hashtag1}} #{{hashtag2}} #verified #realresults
`;
```

### 8.4 Playbook PDF Generation

Use **react-pdf** to generate the playbook PDF client-side:

```typescript
interface PlaybookData {
  brandName: string;
  productName: string;
  participantName: string;
  assets: Asset[];
  captions: Caption[];
  verificationUrl: string;
  tips: string[];
}

// Generate PDF with all content pre-filled
const playbook = generatePlaybookPDF(playbookData);
```

### 8.5 File Structure (Download Kit)

When user clicks "Download Kit":

```
sarah-marketing-kit/
├── assets/
│   ├── instagram-carousel/
│   │   ├── slide-1-hook.png
│   │   ├── slide-2-struggle.png
│   │   ├── slide-3-transformation.png
│   │   ├── slide-4-testimonial.png
│   │   └── slide-5-cta.png
│   ├── instagram-story/
│   │   └── story.png
│   └── ad-creative/
│       └── ad-1x1.png
├── captions/
│   └── captions.txt
├── playbook.pdf
└── README.txt
```

**README.txt contents:**
```
Sarah's Marketing Kit
Generated by Reputable

Quick Start:
1. Open Canva templates (links below) to customize with your brand colors
2. Or use the PNG files directly if no customization needed
3. Copy captions from captions.txt
4. Follow the playbook for posting schedule

Canva Template Links:
- Carousel: [link]
- Story: [link]
- Ad: [link]

Verification URL:
https://reputable.health/verify/[study-id]/sarah

Questions? support@reputable.health
```

---

## 9. Acceptance Tests

Following HOW-TO-PRD.md structure: Persona → Starting State → Journey → Checkpoints → Failure Modes.

---

### AT-1: Sarah (SMM) — First-Time Export

**Persona:** Sarah (Social Media Manager)
- Goal: Get ready-to-post Instagram content from study results
- Constraint: Needs it done in <5 minutes, no design skills required
- Context: Has 15 participant stories, needs content for this week

**Starting State:**
- Sarah is logged into the Reputable dashboard
- Her brand has a completed study with verified participants
- She navigates to the Marketing Kit tab

**Journey:**
1. Sarah lands on Marketing Kit tab and sees Launchpad
2. Sarah identifies the best participant (top performer highlighted)
3. Sarah clicks "Launch" on that participant
4. Sarah sees preview of all assets and captions
5. Sarah copies the Casual caption
6. Sarah opens the Carousel template in Canva
7. Sarah applies her Brand Kit in Canva (90 seconds)
8. Sarah downloads from Canva
9. Sarah downloads the playbook PDF

**Checkpoints:**
- [ ] Step 1: "Marketing Launchpad" is the first thing visible (not buried)
- [ ] Step 1: Clear value prop ("ready-to-post content in minutes")
- [ ] Step 2: Top performers are visually highlighted (not alphabetical list)
- [ ] Step 2: Key metric visible on card without clicking
- [ ] Step 3: ONE click opens the kit (no intermediary pages)
- [ ] Step 4: Preview shows actual content (not wireframes)
- [ ] Step 4: All 3 formats visible without scrolling
- [ ] Step 4: Captions are prominently displayed (not collapsed)
- [ ] Step 5: "Copy" button copies to clipboard with feedback
- [ ] Step 6: Canva link opens directly to template (not Canva homepage)
- [ ] Step 6: Template has correct dimensions (4:5)
- [ ] Step 7: Placeholders are clearly marked for replacement
- [ ] Step 9: Playbook PDF includes posting schedule

**End State:**
- Sarah has carousel images ready to post
- Sarah has caption text copied
- Sarah has playbook with next steps
- Total time: <5 minutes

**Failure Modes (test FAILS if ANY are true):**
- ❌ Sarah had to navigate multiple pages to find Launchpad
- ❌ Sarah couldn't identify best performer without checking each one
- ❌ Sarah had to configure settings before seeing preview
- ❌ Captions were hidden in a dropdown/accordion
- ❌ Canva template was wrong dimensions
- ❌ Sarah said "I'd just do this in Canva from scratch"
- ❌ Total time exceeded 5 minutes

---

### AT-2: Marcus (Head of Marketing) — Team Handoff

**Persona:** Marcus (Head of Marketing)
- Goal: Assign "launch study content" to team member and trust it gets done
- Constraint: Can't handhold; needs self-explanatory flow
- Context: Wants to leverage study results without doing it himself

**Starting State:**
- Marcus is reviewing the completed study
- He wants to assign content creation to Sarah (his SMM)

**Journey:**
1. Marcus navigates to Marketing Kit tab
2. Marcus scans to understand what's available
3. Marcus shares the dashboard link with Sarah
4. Sarah (independently) follows the flow
5. Marcus reviews the output Sarah produced

**Checkpoints:**
- [ ] Step 1: Tab name is clear ("Marketing Kit" not "Export" or "Assets")
- [ ] Step 2: "What you'll get" section explains without jargon
- [ ] Step 2: No setup required before Sarah can use it
- [ ] Step 3: Shareable link works (no re-auth required for team member)
- [ ] Step 4: Sarah can complete flow without Marcus's help
- [ ] Step 4: Playbook answers "what do I do with these files"
- [ ] Step 5: Output is on-brand enough for Marcus to approve

**End State:**
- Marcus can delegate this task with confidence
- Sarah executes independently
- No back-and-forth required

**Failure Modes:**
- ❌ Sarah asked Marcus "what is this?" or "what do I do with these?"
- ❌ Flow required Marcus to configure something first
- ❌ Playbook didn't explain what to post and when
- ❌ Sarah needed design skills beyond Canva Brand Kit
- ❌ Marcus had to approve each step rather than final output

---

### AT-3: Kyle (Sales) — Demo "Wow" Moment

**Persona:** Kyle (Sales Rep / Co-founder)
- Goal: Demo this feature and have prospects say "wow"
- Constraint: On a live call, screen sharing, needs to impress
- Context: Prospect asked "What can I actually DO with study results?"

**Starting State:**
- Kyle is on a demo call, screen sharing
- He's in the dashboard with a DEMO study
- Prospect wants to see what the output looks like

**Journey:**
1. Kyle navigates to Marketing Kit tab
2. Kyle clicks on a demo participant
3. Kyle shows the preview (carousel, story, ad)
4. Kyle scrolls through carousel slides
5. Kyle shows the caption copy
6. Kyle shows the playbook concept
7. Kyle says "and you can customize in Canva in 90 seconds"

**Checkpoints:**
- [ ] Step 1: Marketing Kit tab is easy to find (main nav, not sub-menu)
- [ ] Step 2: Click opens INSTANTLY (no loading spinner)
- [ ] Step 3: Preview looks impressive on screen share (not cramped)
- [ ] Step 3: Design quality makes prospect say "that looks good"
- [ ] Step 4: Slide navigation is smooth and visible
- [ ] Step 5: Caption copy is visible without scrolling/clicking
- [ ] Step 6: Playbook concept is explainable in 10 seconds
- [ ] Step 7: Canva link opens real template (not placeholder)

**End State:**
- Prospect is impressed ("I want that")
- Kyle didn't have to say "ignore this" or "this is still WIP"
- Demo moment took <60 seconds

**Failure Modes:**
- ❌ Loading spinner visible (any duration)
- ❌ Preview looked like a wireframe or placeholder
- ❌ Design looked clinical/template-y
- ❌ Kyle had to scroll to show captions
- ❌ Kyle had to explain what something meant
- ❌ Prospect said "when will this be ready?" (implying not polished)

---

### AT-4: Plain English Critic — Copy Clarity

**Persona:** Plain English Critic
- Goal: Flag jargon, acronyms, and confusing copy
- Constraint: Pretend you've never used Reputable or marketing tools
- Context: Reading all user-facing text in the feature

**Starting State:**
- Reviewer opens Marketing Launchpad for the first time
- No prior context about the product

**Journey:**
1. Read the Launchpad home page copy
2. Read the participant kit page copy
3. Read the caption variations
4. Read the playbook PDF

**Checkpoints:**
- [ ] Step 1: "Marketing Launchpad" name is intuitive (not jargon)
- [ ] Step 1: Value prop uses plain language ("ready-to-post content")
- [ ] Step 1: No undefined acronyms (CTA, UGC, B2B, etc.)
- [ ] Step 2: "4:5" and "9:16" are explained or obvious from context
- [ ] Step 2: "Verified by Reputable" is self-explanatory
- [ ] Step 3: Captions use words a normal person would use
- [ ] Step 3: No marketing jargon ("leverage", "optimize", "synergy")
- [ ] Step 4: Playbook is actionable without needing to Google anything
- [ ] Step 4: Hashtag suggestions are relevant, not generic

**Failure Modes:**
- ❌ Any text that requires Googling to understand
- ❌ Acronyms used without definition (first occurrence)
- ❌ Industry jargon that assumes marketing experience
- ❌ Copy that a first-time user couldn't understand
- ❌ Instructions that say "you know what to do" (they don't)

**Specific Copy to Check:**
- "Carousel" — OK (common enough)
- "Story" — OK (Instagram Stories are mainstream)
- "4:5" — Needs context ("vertical format for Instagram feed")
- "9:16" — Needs context ("full-screen vertical for Stories")
- "CTA" — NOT OK, say "call-to-action" or "what to do next"
- "Brand Kit" — Needs context ("your brand colors and fonts in Canva")

---

### AT-5: Demo Study Verification

**Persona:** N/A (Technical requirement)
- Goal: Ensure Launchpad works on demo/test studies
- Constraint: Kyle uses demo data for sales calls
- Context: Cannot depend on real customer data for demos

**Starting State:**
- User is viewing a DEMO study (simulated participants)

**Journey:**
1. Navigate to Marketing Kit tab for demo study
2. Click "Launch" on a demo participant
3. View all assets and captions
4. Open Canva template
5. Download playbook PDF

**Checkpoints:**
- [ ] Step 1: Launchpad appears for demo studies (not hidden)
- [ ] Step 2: "Launch" button is enabled (not grayed out)
- [ ] Step 3: Preview shows realistic demo data (not "Lorem ipsum")
- [ ] Step 3: Demo participant has photo, quote, and metrics
- [ ] Step 4: Canva template opens and is usable
- [ ] Step 5: Playbook generates with demo data filled in

**Failure Modes:**
- ❌ "Not available for demo studies" message
- ❌ Missing data (blank photos, empty quotes)
- ❌ Demo data looks obviously fake
- ❌ Any functionality disabled for demo

---

### AT-6: Verification Badge — Non-Negotiable

**Persona:** N/A (Product requirement)
- Goal: Verification badge appears on every asset
- Constraint: This is our differentiation — cannot be optional or removable
- Context: Every exported asset must maintain verifiability

**Starting State:**
- Any export, any format

**Journey:**
1. Preview carousel slides
2. Preview story template
3. Preview ad creative
4. Download/export assets

**Checkpoints:**
- [ ] Badge appears on EVERY carousel slide
- [ ] Badge appears on story template
- [ ] Badge appears on ad creative
- [ ] Badge is readable at actual post size (not tiny)
- [ ] Badge position is consistent (same corner on all)
- [ ] Badge cannot be toggled off in settings
- [ ] Badge includes or links to verification URL
- [ ] Playbook mentions verification and explains it

**Failure Modes:**
- ❌ Any asset missing the verification badge
- ❌ Badge too small to read when posted
- ❌ User found a way to hide/remove badge
- ❌ Verification URL is broken or wrong
- ❌ Badge placement looks awkward or unintentional

---

### AT-7: Visual Quality — Not Template-y

**Persona:** Sarah (Social Media Manager)
- Goal: Determine if exports are post-ready or need rework
- Constraint: Her brand has a premium aesthetic; can't post amateur content
- Context: Comparing Reputable export to what she'd create manually

**Starting State:**
- Sarah has previewed/downloaded the carousel
- She's comparing to her brand's existing Instagram

**Journey:**
1. Review Slide 1 (The Hook)
2. Review Slide 3 (The Transformation)
3. Compare to her brand's typical posts
4. Decide: post as-is, customize, or rebuild?

**Checkpoints:**
- [ ] Hero metric is LARGE and eye-catching (not small body text)
- [ ] Typography has clear hierarchy (not all same size)
- [ ] Metrics use visual emphasis (not plain text tables)
- [ ] Colors are warm/approachable (not clinical/corporate)
- [ ] Layout has intentional white space (not cramped)
- [ ] Overall aesthetic matches premium DTC wellness brands
- [ ] Verdict: "I'd customize colors and post" (not "I'd rebuild")

**Failure Modes:**
- ❌ Slides look like a data report or spreadsheet
- ❌ All text is same size (no visual hierarchy)
- ❌ Layout feels clinical or medical
- ❌ Sarah says "This looks like a template everyone uses"
- ❌ Sarah says "I'd need to redesign this completely"

---

### AT-8: Time-to-Value — Under 5 Minutes

**Persona:** Sarah (SMM)
- Goal: Complete the flow in under 5 minutes
- Constraint: This is THE success metric
- Context: Any longer and they'll screenshot instead

**Starting State:**
- Timer starts when Sarah clicks "Marketing Kit" tab
- Sarah has never used Launchpad before

**Journey:**
1. Land on Launchpad (understand what it is)
2. Select a participant
3. Preview assets and captions
4. Copy one caption
5. Open Canva template
6. Download playbook

**Checkpoints:**
- [ ] 0:00-0:30 — Understand what Launchpad offers
- [ ] 0:30-1:00 — Select participant and click "Launch"
- [ ] 1:00-2:00 — Review preview, copy caption
- [ ] 2:00-3:30 — Open Canva template, understand placeholders
- [ ] 3:30-5:00 — Download playbook, ready to customize in Canva
- [ ] Total: Under 5 minutes

**End State:**
- Sarah has everything she needs to post
- Canva customization (90 seconds) happens outside this timer
- Sarah didn't get stuck or confused at any step

**Failure Modes:**
- ❌ Total time exceeds 5 minutes
- ❌ Sarah got stuck at any step for >30 seconds
- ❌ Sarah needed to re-read instructions or go back
- ❌ Sarah asked "what do I do next?" at any point

---

## 10. Success Metrics

### Primary Metrics

| Metric | Target | How We Measure |
|--------|--------|----------------|
| **Launchpad Adoption** | 70% of brands with completed studies use Launchpad within 14 days | Track `launchpad_opened` event per brand |
| **Time to First Export** | Median < 5 minutes | Timestamp from `launchpad_opened` to `kit_downloaded` |
| **Assets Downloaded per Study** | Average 5+ per study | Count `kit_downloaded` events per study |
| **Repeat Usage** | 50% of brands return to Launchpad for additional participants | Unique sessions per brand per study |

### Secondary Metrics

| Metric | Target | How We Measure |
|--------|--------|----------------|
| **Caption Copy Rate** | 80% of sessions include caption copy | Track `caption_copied` events |
| **Canva Template Opens** | 60% of sessions open Canva template | Track `canva_template_opened` event |
| **Playbook Downloads** | 70% of sessions download playbook | Track `playbook_downloaded` event |
| **Format Distribution** | Track which formats are most used | Breakdown by carousel/story/ad |

### Qualitative Signals

- **Customer Feedback:** "This saves me hours" in support/calls
- **Demo Reactions:** Prospects say "I want that" (Kyle feedback)
- **Social Proof of Social Proof:** Brands actually post the content (we can track verification badge clicks from social)

### Anti-Metrics (What We DON'T Want)

| Anti-Metric | Threshold | Response |
|-------------|-----------|----------|
| **Bounce Rate** | <20% leave without any action | Improve value prop clarity |
| **Support Tickets** | <3 per month about Launchpad | Improve UX or docs |
| **"Where's the export?" Questions** | Zero after launch | Entry point is obvious |
| **Verification Badge Removal Attempts** | Track any | Badge must stay; investigate if frequent |

---

## 11. Open Questions

### Design Decisions Needed

1. **Template Aesthetic Direction**
   - Options: Minimal/modern, Warm/friendly, Bold/attention-grabbing
   - Recommendation: Warm/friendly (matches wellness brand vibe)
   - Need: Design review with 2-3 templates

2. **Verification Badge Placement**
   - Options: Bottom-left, Bottom-right, Top corner
   - Consideration: Opposite from brand logo
   - Need: Test with actual brand logos

3. **Caption Copy Tone**
   - Current: Casual, Professional, Urgency
   - Question: Should we add more variations?
   - Recommendation: Start with 3, add based on feedback

### Technical Questions

1. **Canva Template Approach**
   - P0: Manual template links (user replaces placeholders)
   - P1: URL parameters for pre-fill
   - Question: What's Canva's current API capability?
   - Action: Research Canva partner program

2. **Image Asset Generation**
   - Option A: User downloads from Canva (simplest)
   - Option B: We generate PNGs server-side (more control)
   - Recommendation: Start with Option A for MVP

3. **Demo Study Data**
   - Need: Realistic demo participants with photos, quotes, metrics
   - Action: Create 5 high-quality demo participants
   - Constraint: Cannot use real customer data

### Business Questions

1. **Pricing/Gating**
   - Question: Is Launchpad available to all plans?
   - Recommendation: Yes (drives study completion value)
   
2. **White-Labeling**
   - Question: Can brands remove "Reputable" entirely?
   - Answer: NO — verification badge is non-negotiable

---

## Appendix: Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2025-01-30 | 0.1 | Initial draft |

---

## Appendix: Persona Research Summary

### Sarah (Social Media Manager)

**Key Quotes:**
> "I'm already drowning in content creation. If I have to design from scratch, I'll screenshot and move on."

> "Give me something 80% done that I can polish in 90 seconds."

> "Wrong dimensions = unusable. I need 4:5 for feed, 9:16 for Stories, and I don't want to resize anything."

**What She Wants:**
- Ready-to-post content (not ingredients)
- Correct dimensions out of the box
- Caption copy so she doesn't stare at blank text field
- Customize in tools she knows (Canva)

**What Kills Adoption:**
- Having to design from scratch
- Wrong dimensions
- Clinical/cold aesthetic
- No guidance on "what do I do with this"

### Marcus (Head of Marketing)

**Key Quotes:**
> "Don't give me ingredients. Give me a recipe. I'll still customize it, but I need to see the finished dish first."

> "Which asset goes where? What's the posting schedule? That's what my team needs."

> "If my team can't execute without handholding, I won't assign it."

**What He Wants:**
- Self-explanatory flow for his team
- Playbook (not just files)
- Verification visible but not overwhelming
- Batch export for content calendar efficiency

**What Kills Adoption:**
- Requiring him to configure or explain
- No clear "what to do next"
- Team comes back with questions
- Looking like a Reputable ad (oversized branding)
