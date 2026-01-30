# PRD: Marketing Launchpad Visual Redesign

*Product Requirements Document — Carousel Template Visual Overhaul*
*Created: 2025-01-29*
*Status: Ready for Build*

---

## Table of Contents

1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [Design Direction](#3-design-direction)
4. [Slide-by-Slide Specifications](#4-slide-by-slide-specifications)
5. [Design System](#5-design-system)
6. [Technical Implementation](#6-technical-implementation)
7. [Acceptance Tests](#7-acceptance-tests)
8. [Success Criteria](#8-success-criteria)

---

## 1. Overview

### What We're Fixing

The Marketing Launchpad carousel templates exist and function, but **fail the visual quality bar**. Social media managers would rebuild these in Canva rather than use them as-is.

### The Goal

Transform the carousel templates from "clinical data report" to "premium DTC wellness content that a social media manager would post immediately."

### The One-Liner

> Make the carousel slides look like they came from Athletic Greens' Instagram, not a medical dashboard.

---

## 2. Problem Statement

### Current State (What's Broken)

| Slide | Current State | Problem |
|-------|---------------|---------|
| **Slide 1: Hook** | Plain teal gradient, initials in circle, metric text | Feels like a PowerPoint template. No visual drama. |
| **Slide 2: Struggle** | Gray background, small quote icon, baseline metrics as text | Looks like a report. Quote doesn't grab attention. |
| **Slide 3: Transformation** | Before→After with progress bars | Metrics look like a spreadsheet. No celebration. |
| **Slide 4: Testimonial** | Teal background, quote text, attribution | Plain. Quote doesn't feel impactful. |
| **Slide 5: CTA** | QR code centered, verification badge | Functional but not exciting. |

### AT-7 Visual Quality Failures

From the PRD acceptance tests, the current implementation fails:

- ❌ Slides look like a spreadsheet with colors
- ❌ All text is same size (no hierarchy)
- ❌ Metrics are displayed as plain text tables
- ❌ Layout feels clinical or medical
- ❌ "This looks like a template everyone uses"
- ❌ SMM would say "I'd need to redesign this in Canva"

### What Success Looks Like

- ✅ Hero metric is LARGE and attention-grabbing
- ✅ Layout has clear visual hierarchy
- ✅ Before→After has visual drama (big numbers, celebration)
- ✅ Aesthetic matches premium DTC wellness brands
- ✅ SMM says "I'd post this as-is" or "just swap my brand colors"

---

## 3. Design Direction

### Inspiration: Premium DTC Wellness Brands

Think: **Athletic Greens**, **Ritual**, **Seed**, **Momentous**, **LMNT**

These brands share:
- Bold, large typography for key numbers
- Warm, approachable color palettes (not clinical teal)
- Generous white space
- Human-centered (photos when available, warm tones)
- Confident, not busy

### Core Principles

| Principle | Application |
|-----------|-------------|
| **Bold Numbers** | Metrics should be the largest element. +65% should SHOUT. |
| **Visual Hierarchy** | 3 levels max: Hero (huge), Supporting (medium), Details (small) |
| **Warm & Approachable** | Earth tones, soft gradients, not clinical teal |
| **White Space** | Let elements breathe. Less is more. |
| **Human Touch** | Photos when available, warm avatar fallbacks |

### What We're NOT Doing

- ❌ Busy layouts with lots of elements
- ❌ Clinical/medical aesthetic
- ❌ Small, dense text
- ❌ Progress bars and data tables
- ❌ Generic stock photo backgrounds

---

## 4. Slide-by-Slide Specifications

### Slide 1: The Hook

**Purpose:** Stop the scroll. Show the hero result.

**Current → New:**

| Element | Current | New |
|---------|---------|-----|
| Background | Solid teal gradient | Warm gradient (cream → soft peach) OR brand primary with soft overlay |
| Metric Display | Medium text "+65%" | MASSIVE text "+65%" (takes 40% of slide height) |
| Metric Label | Small text below | Medium text, slightly muted |
| Avatar | Circle with initials, small | Large circle (25% of width), photo if available, warm gradient fallback |
| Name/Age | Small text | Clear, readable, humanizing |
| Brand Logo | Corner, small | Top corner, subtle |
| Verification | Bottom badge | Bottom corner, small but always present |

**Layout (1080×1350):**
```
┌─────────────────────────────────────┐
│  [Brand Logo]              [corner] │  ← Top 80px
│                                     │
│                                     │
│           +65%                      │  ← MASSIVE (180px font)
│        Deep Sleep                   │  ← 32px, muted
│                                     │
│                                     │
│         ┌──────┐                    │
│         │Photo │                    │  ← Large avatar (200px)
│         │  or  │                    │
│         │ Init │                    │
│         └──────┘                    │
│        William, 55                  │  ← Name, age
│                                     │
│  [Verified by Reputable]   [corner] │  ← Bottom 60px
└─────────────────────────────────────┘
```

**Typography:**
- Metric: 180px, Extra Bold (800)
- Label: 32px, Medium (500), 60% opacity
- Name: 28px, Semibold (600)

---

### Slide 2: The Struggle

**Purpose:** Build empathy. Show what they tried before.

**Current → New:**

| Element | Current | New |
|---------|---------|-----|
| Background | Plain gray | Off-white/cream with subtle texture |
| Quote | Small with quote icon | LARGE, prominent, italic |
| Quote Style | Generic quote marks | Large decorative " at start |
| Baseline Metrics | Row of small numbers | Subtle, secondary (or remove) |

**Layout (1080×1350):**
```
┌─────────────────────────────────────┐
│  [Brand Logo]                       │
│                                     │
│                                     │
│     "                               │  ← Large decorative quote (100px)
│                                     │
│   Racing thoughts                   │
│   kept me up until                  │  ← Quote text (42px, italic)
│   2-3am most nights.                │
│                                     │
│                                     │
│        ─── Before ───               │  ← Divider
│                                     │
│   Deep Sleep: 40min                 │  ← Baseline metrics (subtle, 18px)
│   HRV: 43ms                         │
│                                     │
│  [Verified by Reputable]            │
└─────────────────────────────────────┘
```

**Typography:**
- Quote: 42px, Italic, Medium weight
- Decorative ": 100px, Light weight, 20% opacity
- Baseline metrics: 18px, Regular, 50% opacity

---

### Slide 3: The Transformation

**Purpose:** Show the dramatic change. CELEBRATE the improvement.

**Current → New:**

| Element | Current | New |
|---------|---------|-----|
| Layout | Vertical list with progress bars | Side-by-side dramatic comparison |
| Numbers | Same size as labels | HUGE numbers, small labels |
| Change Indicator | Small percentage in corner | Large, celebratory with arrow/color |
| Visual Treatment | Clinical progress bars | Bold color blocks, no bars |

**Layout (1080×1350):**
```
┌─────────────────────────────────────┐
│  [Brand Logo]                       │
│                                     │
│        THE RESULTS                  │  ← Header (24px, caps, tracking)
│                                     │
│  ┌─────────────┬─────────────┐     │
│  │   BEFORE    │    AFTER    │     │
│  │             │             │     │
│  │    40       │    1h 5m    │     │  ← HUGE numbers (72px)
│  │    min      │             │     │
│  │             │   +63%  ↑   │     │  ← Celebration badge
│  │  Deep Sleep │  Deep Sleep │     │
│  └─────────────┴─────────────┘     │
│                                     │
│  ┌─────────────┬─────────────┐     │
│  │    43ms     │    55ms     │     │
│  │             │   +28%  ↑   │     │
│  │     HRV     │     HRV     │     │
│  └─────────────┴─────────────┘     │
│                                     │
│  [Verified by Reputable]            │
└─────────────────────────────────────┘
```

**Key Changes:**
- Before column: Muted (gray text, lighter background)
- After column: Vibrant (brand color, bold text)
- Change badge: Green with upward arrow, celebratory

**Typography:**
- "THE RESULTS": 24px, Bold, uppercase, letter-spacing 4px
- Numbers: 72px, Extra Bold
- Labels: 18px, Medium, muted
- Change badge: 24px, Bold, green (#10B981)

---

### Slide 4: The Testimonial

**Purpose:** Human connection. Let their words speak.

**Current → New:**

| Element | Current | New |
|---------|---------|-----|
| Background | Solid teal | Warm gradient or brand color (softer) |
| Quote | Medium text, centered | Large, left-aligned, impactful |
| Attribution | Small, below quote | Clear, with photo if available |
| Rating | Star icons | Large, prominent stars |

**Layout (1080×1350):**
```
┌─────────────────────────────────────┐
│  [Brand Logo]                       │
│                                     │
│                                     │
│  "My kids noticed                   │
│   I'm not cranky in                 │  ← Large quote (48px)
│   the morning anymore.              │
│   That says it all."                │
│                                     │
│                                     │
│   ┌────┐                            │
│   │ WD │  William D.                │  ← Avatar + name
│   └────┘  Verified Participant      │
│           ★★★★★                     │  ← Rating (gold stars)
│                                     │
│   28 days · Fitbit tracked          │  ← Study details (subtle)
│                                     │
│  [Verified by Reputable]            │
└─────────────────────────────────────┘
```

**Typography:**
- Quote: 48px, Medium weight (not italic here — feels more confident)
- Name: 28px, Semibold
- "Verified Participant": 18px, Regular, muted
- Stars: 24px, gold (#FFD700)

---

### Slide 5: The CTA

**Purpose:** Drive action. Verification proof.

**Current → New:**

| Element | Current | New |
|---------|---------|-----|
| Headline | Generic "See full story" | Action-oriented, personal |
| QR Code | Plain, centered | Styled with rounded container |
| Brand | Logo only | Logo + clear brand identity |

**Layout (1080×1350):**
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│     See William's                   │
│     Verified Results                │  ← Headline (48px)
│                                     │
│     ┌─────────────────┐             │
│     │                 │             │
│     │    [QR CODE]    │             │  ← Styled container
│     │                 │             │
│     └─────────────────┘             │
│                                     │
│     Scan to verify                  │  ← Subtitle (24px)
│                                     │
│     ───────────────────             │
│                                     │
│         [Brand Logo]                │  ← Centered, larger
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ✓ Verified by Reputable    │   │  ← Prominent badge
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## 5. Design System

### Color Palette

**Primary Palette (Default — brands can override):**

| Name | Hex | Usage |
|------|-----|-------|
| Warm Cream | `#FDF8F4` | Light backgrounds |
| Soft Peach | `#FEF0E7` | Gradient accent |
| Warm Gray | `#64748B` | Secondary text |
| Deep Charcoal | `#1E293B` | Primary text |
| Success Green | `#10B981` | Positive changes, verification |
| Gold | `#F59E0B` | Stars, highlights |

**Brand Color Application:**
- Brand primary → Slide 1 background gradient, Slide 4 background
- Brand secondary → Accent elements, change badges

### Typography Scale

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| Hero Metric | 180px | 800 (Extra Bold) | +65% on Slide 1 |
| Large Numbers | 72px | 700 (Bold) | Before/After numbers |
| Large Quote | 48px | 500 (Medium) | Testimonial quote |
| Medium Quote | 42px | 500 Italic | Struggle quote |
| Section Header | 24px | 700, uppercase | "THE RESULTS" |
| Body Large | 28px | 600 | Names, key labels |
| Body | 18px | 500 | Supporting text |
| Caption | 14px | 400 | Verification, details |

### Spacing

| Name | Value | Usage |
|------|-------|-------|
| Page Padding | 60px | All slides |
| Section Gap | 48px | Between major sections |
| Element Gap | 24px | Between related elements |
| Tight Gap | 12px | Label to value |

### Avatar Fallbacks

When no photo available:
- Circle with warm gradient (peach → coral)
- Initials in white, 64px, semibold
- Subtle shadow for depth

---

## 6. Technical Implementation

### File Location

`src/components/brand/marketing-kit/carousel-templates.tsx`

### Changes Required

1. **Update all 5 slide components** with new layouts
2. **Add new color utilities** for warm palette
3. **Update typography sizes** to match spec
4. **Add gradient backgrounds** (warm, not clinical)
5. **Improve metric display** (celebration, not data)

### Export Considerations

- html2canvas renders at 2x for retina
- Fonts must be loaded before export
- Gradients render well
- Avoid complex shadows (can blur on export)

### Brand Customization Points

```typescript
interface BrandSettings {
  primaryColor: string;      // Used for backgrounds, accents
  secondaryColor: string;    // Used for highlights
  textColor: string;         // Primary text (usually dark)
  backgroundColor: string;   // Light background base
  logoUrl?: string;
  logoPosition: "top-left" | "top-right";
  fontFamily: string;
}
```

---

## 7. Acceptance Tests

### AT-1: Visual Quality — SMM Would Post This

**Persona:** Jessica (Social Media Manager)
- Premium DTC wellness brand
- Posts daily to 50K+ followers
- Very particular about brand aesthetic

**Starting State:**
- Jessica opens Marketing Launchpad
- She generates a carousel for a participant

**Journey:**
1. Jessica reviews Slide 1 (Hook)
2. Jessica reviews Slide 3 (Transformation)
3. Jessica compares to her brand's existing Instagram
4. Jessica decides: post as-is, tweak colors, or rebuild?

**Checkpoints:**
- [ ] Slide 1 metric is LARGE and attention-grabbing (takes up significant space)
- [ ] Typography has clear 3-level hierarchy (hero → supporting → details)
- [ ] Before→After comparison feels celebratory, not clinical
- [ ] Colors feel warm and approachable (not medical teal)
- [ ] White space is generous (not cramped)
- [ ] Overall aesthetic could pass for premium DTC content
- [ ] Jessica says "I'd post this with my brand colors" or "I'd post this as-is"

**Failure Modes:**
- ❌ Metric is small or doesn't stand out
- ❌ All text looks the same size
- ❌ Transformation slide looks like a spreadsheet
- ❌ Colors feel clinical or cold
- ❌ Layout feels cramped or busy
- ❌ Jessica says "I'd rebuild this in Canva"

---

### AT-2: Plain English — Copy Clarity

**Persona:** Someone who's never used the product

**Starting State:**
- Reviewing all text on all 5 slides

**Checkpoints:**
- [ ] "THE RESULTS" is clear (not jargon)
- [ ] Metric labels are plain English ("Deep Sleep" not "SWS Duration")
- [ ] "Verified by Reputable" is understandable
- [ ] No acronyms without context
- [ ] Numbers include units where needed

**Failure Modes:**
- ❌ Any jargon or undefined acronym
- ❌ Metric that requires explanation

---

### AT-3: Export Quality

**Persona:** Technical requirement

**Starting State:**
- Download carousel as PNG

**Checkpoints:**
- [ ] Images are sharp at native resolution
- [ ] Colors match preview
- [ ] Text is crisp and readable
- [ ] Gradients render smoothly (no banding)
- [ ] Verification badge is legible

**Failure Modes:**
- ❌ Blurry text
- ❌ Color shift from preview
- ❌ Gradient banding

---

### AT-4: Brand Customization

**Persona:** Brand with different colors (purple primary)

**Starting State:**
- Brand has set custom primary color (#7C3AED purple)

**Checkpoints:**
- [ ] Slide 1 uses brand color appropriately
- [ ] Slide 4 uses brand color appropriately
- [ ] Success indicators still use green (not brand color)
- [ ] Text remains readable against brand color
- [ ] Overall aesthetic still feels premium

**Failure Modes:**
- ❌ Brand color makes text unreadable
- ❌ Brand color applied inconsistently
- ❌ Slides look worse with custom colors than default

---

## 8. Success Criteria

### Must Pass Before Launch

1. **AT-1 passes**: SMM would post this (or just swap colors)
2. **AT-2 passes**: No jargon, plain English throughout
3. **AT-3 passes**: Exports look good
4. **AT-4 passes**: Brand colors work

### Qualitative Bar

> "If I showed this to the marketing director at Athletic Greens, would they say 'that's nice' or 'that looks amateur'?"

The answer must be "that's nice."

### Quantitative (Post-Launch)

- Export rate increases (brands actually download)
- Support tickets about "ugly exports" go to zero
- Kyle can demo without saying "ignore how this looks"

---

## Appendix: Reference Examples

### Good Examples (Inspiration)

- Athletic Greens Instagram carousels — Bold numbers, clean layouts
- Ritual supplement posts — Warm tones, generous spacing
- Seed daily synbiotic — Premium, scientific but approachable
- LMNT hydration — Bold, confident, clear hierarchy

### Bad Examples (What to Avoid)

- Generic Canva templates — Seen a million times
- Medical/clinical charts — Too sterile
- Data dashboards — Too dense
- Stock photo backgrounds — Too generic

---

*PRD Complete. Ready for build.*
