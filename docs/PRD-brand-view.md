# PRD: Brand View

*Product Requirements Document — Self-Serve Dashboard Brand View*
*Created: 2025-07-16*

---

## Table of Contents

1. [Overview](#1-overview)
2. [User Stories](#2-user-stories)
3. [Information Architecture](#3-information-architecture)
4. [Detailed Tab Specs](#4-detailed-tab-specs)
5. [Component Architecture](#5-component-architecture)
6. [Data Flow](#6-data-flow)
7. [View Switching](#7-view-switching)
8. [Demo Mode](#8-demo-mode)
9. [Category Adaptations](#9-category-adaptations)
10. [Edge Cases](#10-edge-cases)
11. [File Structure](#11-file-structure)
12. [Implementation Order](#12-implementation-order)

---

## 1. Overview

### What We're Building

A **Brand View** — a clean, read-only, emotionally compelling presentation of a brand's study — that lives alongside the existing Admin View within the self-serve dashboard. Sales reps set up studies in Admin View; they demo in Brand View. Brand executives see their study's progress, participant stories, results, and embeddable widget without any operational noise.

### Why

The Admin View is built for operations: enrollment management, compliance tracking, configuration, fulfillment. A brand executive watching a demo doesn't care about email templates or enrollment caps. They care about:

1. **People** — Who is trying my product, and why?
2. **Proof** — Did it actually work? Show me the data.
3. **Action** — How do I put this on my website?

Brand View is the 10-minute demo that sells Reputable. It's also the view a brand exec can log into themselves during a live study and feel excited about what's happening.

### Key Constraint

Brand View must work across **all study categories**:
- **Wearable-primary (Tier 1–2):** sleep, recovery, fitness, stress — Oura/Whoop data front-and-center
- **Assessment-primary (Tier 3–4):** energy, focus, mood, anxiety, etc. — assessment scores front-and-center

The same component set adapts its display based on category tier.

### Success Criteria

- Brand exec understands any screen in ≤5 seconds
- Zero operational/config UI visible in Brand View
- Study feels alive from the moment n=1 (never "nothing to see")
- Sales can run a full demo end-to-end in 10 minutes
- View switching between Admin ↔ Brand is instantaneous (no page reload)

---

## 2. User Stories

### Brand Executive (Primary User)

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| BV-01 | As a brand exec, I want to see how many people are in my study and what stage it's in, so I feel confident things are progressing | Overview shows 3–4 hero numbers + status badge |
| BV-02 | As a brand exec, I want to read real participant stories, so I understand who is trying my product | Participant cards show name, struggle, what they tried, baseline data |
| BV-03 | As a brand exec, I want to see before/after results with objective data, so I believe the product works | Results tab shows wearable + assessment changes with testimonials |
| BV-04 | As a brand exec, I want to see an embeddable widget ready for my product page, so I understand the deliverable | Widget tab shows preview + embed code + verification link |
| BV-05 | As a brand exec, I want to see patterns emerging across participants, so I know the study is revealing real insights | Live Insights tab shows emerging patterns when n≥3 |
| BV-06 | As a brand exec, I want the dashboard to feel alive even with 1 participant, so I stay engaged during early days | n=1 shows first story card; n=0 shows anticipatory state |

### Sales Rep

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| BV-07 | As a sales rep, I want to switch to Brand View with one click, so I can demo without showing internal tools | "View as Brand" button in Admin header switches view |
| BV-08 | As a sales rep, I want demo data pre-loaded at different study phases, so I can walk through Day 1 → Day 28 | Demo studies have `currentDay` or phase controls |
| BV-09 | As a sales rep, I want to return to Admin View quickly, so I can answer operational questions if asked | "Back to Admin" button in Brand View header |
| BV-10 | As a sales rep, I want the demo to work for sleep AND energy categories, so I can pitch different verticals | Category-adaptive components show correct metrics |

### Admin (Internal)

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| BV-11 | As an admin, I want the Brand View to pull from the same data stores, so I don't maintain separate data | Brand View reads from `useEnrollmentStore`, `useEarlyInsightsStore`, simulation stores |
| BV-12 | As an admin, I want to preview what the brand sees, so I can QA before a demo | "View as Brand" toggle works from any admin tab |

---

## 3. Information Architecture

### Tab Structure

```
ADMIN VIEW (existing)              BRAND VIEW (new)
┌────────────────────────┐         ┌──────────────────────────┐
│ Overview               │         │ Overview                 │
│ Enrollment             │ ──→     │ Live Insights            │
│ Participants           │ Brand   │ Results                  │
│ Fulfillment            │ View    │ Your Widget              │
│ Compliance             │         └──────────────────────────┘
│ Results                │
│ Config                 │
└────────────────────────┘
```

### Brand View Tab IDs

```typescript
type BrandViewTab = "brand-overview" | "brand-insights" | "brand-results" | "brand-widget";
```

### Component Hierarchy

```
<BrandViewShell>                          // Layout shell (no sidebar, clean chrome)
  ├── <BrandViewHeader>                   // Study name, brand logo, status, "Back to Admin"
  ├── <BrandViewTabs>                     // 4-tab navigation
  │   ├── <BrandOverviewTab>             // Hero numbers + study snapshot
  │   ├── <BrandInsightsTab>             // Progressive disclosure of participant data
  │   │   ├── <BrandStoryCarousel>       // Horizontal participant story cards
  │   │   ├── <BrandTimeline>            // Live activity feed
  │   │   ├── <BrandPatternsCard>        // Emerging patterns (n≥3)
  │   │   └── <BrandAggregatePanel>      // Demographics + charts (n≥10)
  │   ├── <BrandResultsTab>             // Before/after + aggregate stats
  │   │   ├── <BrandHeroStats>           // 3–4 aggregate numbers
  │   │   ├── <BrandBeforeAfterCard>     // Individual before/after stories
  │   │   └── <BrandTestimonialGrid>     // Completed participant testimonials
  │   └── <BrandWidgetTab>              // Widget preview + embed
  │       ├── <BrandWidgetPreview>       // Live widget rendering
  │       ├── <BrandWidgetProductPage>   // Mock product page context
  │       └── <BrandWidgetEmbed>         // Copy-paste embed code
  └── <BrandViewFooter>                  // "Powered by Reputable" + verification link
```

---

## 4. Detailed Tab Specs

### 4.1 Overview Tab (`<BrandOverviewTab>`)

**Purpose:** "Here's your study running right now." The exec understands the status in 5 seconds.

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│  [Brand Logo]  Study Name                    ● LIVE      │
│  ─────────────────────────────────────────────────────── │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │    47     │  │    23    │  │    8     │  │  +23%    │ │
│  │ enrolled  │  │  active  │  │ complete │  │  avg Δ   │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │  Study Timeline                                      ││
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━             ││
│  │  Day 1              Day 14 (now)         Day 28      ││
│  └──────────────────────────────────────────────────────┘│
│                                                          │
│  ┌────────────────────────┐ ┌───────────────────────────┐│
│  │  Latest Enrollment     │ │  Quick Quote              ││
│  │  Sarah M. joined 12m   │ │  "I haven't slept through ││
│  │  ago                   │ │   the night in 3 years"   ││
│  └────────────────────────┘ └───────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

#### Components

| Component | Description | Data Source |
|-----------|-------------|-------------|
| `<BrandHeroNumbers>` | 3–4 stat cards in a row | `useEnrollmentStore.getEnrollmentStats()` + study status |
| `<BrandStudyTimeline>` | Linear progress bar showing study day | `study.currentDay`, `study.startDate`, `study.endDate` |
| `<BrandLatestActivity>` | Most recent enrollment or milestone | `useEnrollmentStore` sorted by timestamp |
| `<BrandQuoteHighlight>` | Random featured quote from participant | `useEarlyInsightsStore.computeInsights().notableQuotes` |

#### Props Interface

```typescript
interface BrandOverviewTabProps {
  study: StudyData;
  brand?: { id: string; name: string; logoUrl?: string };
}
```

#### Hero Number Behavior

| Study Phase | Numbers Shown |
|-------------|--------------|
| Pre-launch (n=0) | Enrollment link clicks, Days until launch, Target participants, — |
| Early (n=1–9) | Enrolled, Active, Days in study, First insights ready |
| Mid-study (n=10+) | Enrolled, Active, Completed, Avg improvement |
| Completed | Total participants, Completion rate, Avg improvement, NPS |

#### Category Adaptations

- **Wearable studies (Tier 1–2):** "Avg improvement" card shows primary wearable metric change (e.g., "+23% Sleep Score")
- **Assessment studies (Tier 3–4):** "Avg improvement" card shows assessment score change (e.g., "+18% Energy Score")

---

### 4.2 Live Insights Tab (`<BrandInsightsTab>`)

**Purpose:** "Meet your customers — here's why they bought your product." The emotional core of the demo.

#### Progressive Disclosure States

```
┌─────────────────────────────────────────────────────────┐
│  STATE: n=0 (Waiting)                                   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  🔆 Customer Insights                [Waiting]  │    │
│  │                                                 │    │
│  │  The first participant story will appear here    │    │
│  │  the moment someone enrolls.                    │    │
│  │                                                 │    │
│  │  What you'll see:                               │    │
│  │  • Real customer pain stories and quotes        │    │
│  │  • What they've tried before                    │    │
│  │  • Their desperation and commitment levels      │    │
│  │  • Patterns emerging across participants        │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  STATE: n=1–2 (Individual Stories)                      │
│                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐     │
│  │ Sarah M. • Portland  │  │ Mike R. • Austin     │     │
│  │ "I haven't slept..." │  │ "My energy crashes..."│    │
│  │ Tried: CBD, Ambien   │  │ Tried: Coffee, B12  │     │
│  │ ⌚ Sleep Score: 61    │  │ 📊 Energy: 42/100   │     │
│  └──────────────────────┘  └──────────────────────┘     │
│                                                         │
│  📍 Live Timeline                                       │
│  ├─ Sarah M. enrolled • 12 min ago                     │
│  └─ Mike R. enrolled • 2 hours ago                     │
│                                                         │
│  ░░░░░░░░░░░░░ 2/10 toward full analytics              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  STATE: n=3–9 (+ Emerging Patterns)                     │
│                                                         │
│  [Story Cards — horizontal scroll up to 5]              │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 🔍 Emerging Patterns (5 participants)             │   │
│  │                                                   │   │
│  │ Top Pain Points:                                  │   │
│  │ ████████████░░ Can't fall asleep (60%)            │   │
│  │ █████████░░░░░ Wake up exhausted (40%)            │   │
│  │                                                   │   │
│  │ Avg Urgency: ████████░░ 7.8/10                    │   │
│  │ Most struggling for: 2+ years                     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  📍 Live Timeline (last 4 events)                      │
│  ░░░░░░░░░░░░░ 5/10 toward full analytics              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  STATE: n=10+ (+ Aggregate Charts)                      │
│                                                         │
│  [Story Cards — horizontal scroll up to 5]              │
│  [Emerging Patterns]                                    │
│  [Timeline]                                             │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Top Motivations          How Long Struggling     │   │
│  │ ██████ Better sleep 45%  ██████ 2+ years 50%     │   │
│  │ ████ Tried everything    ████ 6-12 months 30%    │   │
│  │ ███ Doctor rec'd 20%     ██ Less than 6mo 20%    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │ Age Distribution │  │ Baseline Score  │               │
│  │ 25-34: 35%      │  │ Avg: 48/100     │               │
│  │ 35-44: 40%      │  │ "Room to grow"  │               │
│  │ 45-54: 25%      │  │                 │               │
│  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Shows at | Description |
|-----------|----------|-------------|
| `<BrandWaitingState>` | n=0 | Anticipatory card with "what you'll see" |
| `<BrandStoryCarousel>` | n≥1 | Horizontal scrollable participant story cards |
| `<BrandStoryCard>` | n≥1 | Individual participant card (reuses/wraps `ParticipantStoryCard`) |
| `<BrandTimeline>` | n≥1 | Live activity feed (wraps `InsightsTimeline`) |
| `<BrandPatternsCard>` | n≥3 | Emerging patterns (wraps `EmergingPatternsCard`) |
| `<BrandQuoteCarousel>` | n≥15 | Rotating notable quotes |
| `<BrandAggregatePanel>` | n≥10 | Demographics, motivations, baseline charts |
| `<BrandProgressBar>` | n<10 | "X/10 toward full analytics" |

#### Props Interface

```typescript
interface BrandInsightsTabProps {
  study: StudyData;
  studyCategory: string;
}
```

#### Data Sources

- `useEarlyInsightsStore.computeInsights(studyId, category)` → `EarlyInsightsData`
- `useEarlyInsightsStore.getBaselineCount(studyId)` → participant count
- `useEnrollmentStore.getEnrollmentsByStudy(studyId)` → raw enrollment data

---

### 4.3 Results Tab (`<BrandResultsTab>`)

**Purpose:** "Here's what happened after 28 days." The credibility moment — objective data + subjective experience.

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│  HERO STATS ROW                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  +23%    │  │  87%     │  │  4.6/5   │  │  NPS 72 │ │
│  │Sleep Scr │  │ improved │  │ avg rating│  │         │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                                                          │
│  COMPLETED PARTICIPANT STORIES                           │
│  ┌──────────────────────────────────────────────────┐    │
│  │ ✅ Sarah M. — Completed Day 28                   │    │
│  │                                                  │    │
│  │ BEFORE              AFTER                        │    │
│  │ Sleep Score: 61     Sleep Score: 78  (+28%) 📈   │    │
│  │ Deep Sleep: 42m     Deep Sleep: 68m  (+62%) 📈   │    │
│  │ Energy Score: 38    Energy Score: 71 (+87%) 📈   │    │
│  │                                                  │    │
│  │ "I can't believe it. I'm actually sleeping       │    │
│  │  through the night for the first time in years." │    │
│  │                                                  │    │
│  │ ⭐⭐⭐⭐⭐ Would recommend                     │    │
│  │ 🔗 View Verified Results →                       │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │ ⚖️ Mike R. — Completed Day 28 (Neutral)          │    │
│  │                                                  │    │
│  │ "Slight improvement but not dramatic..."         │    │
│  │ Sleep Score: 65 → 69 (+6%)                       │    │
│  │ ⭐⭐⭐ Mixed results                            │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  OUTCOME DISTRIBUTION                                    │
│  ┌──────────────────────────────────────────────────┐    │
│  │ ████████████████████░░░ 78% Positive             │    │
│  │ █████░░░░░░░░░░░░░░░░░ 15% Neutral              │    │
│  │ ██░░░░░░░░░░░░░░░░░░░░  7% Minimal change       │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

#### Progressive States

| Study Phase | What's Shown |
|-------------|-------------|
| No completed participants | "Results will appear here as participants complete their 28-day journey." + show interim insights if study is mid-way |
| 1–2 completed | Individual before/after cards (no aggregate stats yet) |
| 3+ completed | Hero stats row + individual cards + outcome distribution |
| Study complete | Full results: hero stats, all stories, distribution, verification links |

#### Component Breakdown

| Component | Description |
|-----------|-------------|
| `<BrandHeroStats>` | 3–4 aggregate stat cards (improvement %, satisfaction, NPS, etc.) |
| `<BrandBeforeAfterCard>` | Individual before/after story (THE money component) |
| `<BrandOutcomeDistribution>` | Horizontal bar showing positive/neutral/negative split |
| `<BrandInterimInsights>` | Mid-study interim data (wraps existing `InterimInsights`) |
| `<BrandResultsWaiting>` | Empty state when no completions yet |

#### Before/After Card Detailed Design

```typescript
interface BrandBeforeAfterCardProps {
  story: ParticipantStory;
  studyCategory: string;
  /** Compact mode for grid layout, expanded for featured position */
  variant: "featured" | "compact";
}
```

**Featured variant (first story):**
```
┌─────────────────────────────────────────────────────────┐
│  ✅ Sarah M. • Portland, OR • 35-44                    │
│                                                         │
│  ┌────────────────────┐   ┌────────────────────┐       │
│  │  BEFORE (Baseline)  │   │  AFTER (Day 28)    │       │
│  │                     │   │                     │       │
│  │  Sleep Score: 61    │   │  Sleep Score: 78    │       │
│  │  Deep Sleep: 42m    │   │  Deep Sleep: 68m    │       │
│  │  RHR: 68 bpm        │   │  RHR: 62 bpm        │       │
│  │  Energy: 38/100     │   │  Energy: 71/100     │       │
│  └────────────────────┘   └────────────────────┘       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 📈 Changes                                      │   │
│  │ Sleep Score   ████████████████████░░░  +28%     │   │
│  │ Deep Sleep    ██████████████████████████ +62%    │   │
│  │ Energy Score  ██████████████████████████████ +87%│   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  "I can't believe it. I'm actually sleeping through     │
│   the night for the first time in years. My Oura data   │
│   doesn't lie."                                         │
│                                                         │
│  ⭐⭐⭐⭐⭐  |  Would recommend  |  🔗 Verify →       │
└─────────────────────────────────────────────────────────┘
```

**Compact variant (subsequent stories):**
- Condensed to 2 rows: name + key metric change + quote snippet + rating + verify link

#### Data Sources

- `getCompletedStoriesFromEnrollments(enrollments, category)` from `@/lib/simulation`
- `categorizeStory(story)` → `'positive' | 'neutral' | 'negative'`
- For real data studies: `SORTED_SENSATE_STORIES`, `SORTED_LYFEFUEL_STORIES` from `mock-data.ts`
- For demo studies: `generateMockParticipants(category)` + `getParticipantInsights(category)`

---

### 4.4 Widget Tab (`<BrandWidgetTab>`)

**Purpose:** "Here's how you use this on your product page." The action moment.

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│  YOUR VERIFIED WIDGET                                    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  MOCK PRODUCT PAGE                               │    │
│  │                                                  │    │
│  │  [Product Image]  Product Name                   │    │
│  │                   ⭐⭐⭐⭐⭐ (142 reviews)      │    │
│  │                   $49.99                          │    │
│  │                                                  │    │
│  │         ┌────────────────────────┐               │    │
│  │         │ ✓ Verified by Reputable │               │    │
│  │         │ 28-Day Study • 47 ppl  │               │    │
│  │         │ +23% Sleep Score       │               │    │
│  │         │ View Full Study →      │               │    │
│  │         └────────────────────────┘               │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │ EMBED CODE                                       │    │
│  │ <!-- Reputable Verification Widget -->            │    │
│  │ <script src="https://embed.reputable.health/...  │    │
│  │                                 [📋 Copy Code]   │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │ VERIFICATION PAGE                                │    │
│  │ Your public results page:                        │    │
│  │ https://verify.reputable.health/study/abc-123    │    │
│  │                                [🔗 Open Page]    │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  3 Simple Steps:                                        │
│  1. Copy the embed code above                           │
│  2. Paste it into your product page HTML                │
│  3. The widget auto-updates as results come in          │
└──────────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Description |
|-----------|-------------|
| `<BrandWidgetPreview>` | Wraps `FloatingBadgeWidget` with mock product page context |
| `<BrandWidgetEmbed>` | Embed code block with copy button |
| `<BrandWidgetVerifyLink>` | Verification page URL with open button |
| `<BrandWidgetSteps>` | 3-step installation guide |

#### Props Interface

```typescript
interface BrandWidgetTabProps {
  studyId: string;
  studyName: string;
}
```

#### Widget Display Mode

Reuses existing `getBestWidgetMode(studyId)` from `@/lib/widget-data`. The Brand View does **not** expose mode selection or color configuration — that stays in Admin View's `WidgetSection`. Brand View shows the widget in its current configured state (read-only).

#### Pre-completion State

If study has no completed participants yet (widget has no data):
- Show a preview with placeholder data
- Badge reads "Study in progress — widget activates when results are ready"
- Embed code section is dimmed with note: "Available when first results complete"

---

## 5. Component Architecture

### New Components Needed

```
src/components/brand/                       # Brand View root
├── brand-view-shell.tsx                   # Layout shell
├── brand-view-header.tsx                  # Study header + back button
├── brand-view-tabs.tsx                    # Tab navigation
├── brand-view-footer.tsx                  # "Powered by Reputable"
├── index.ts                               # Barrel exports
│
├── overview/                              # Overview tab
│   ├── brand-overview-tab.tsx             # Tab container
│   ├── brand-hero-numbers.tsx             # Stat card row
│   ├── brand-study-timeline.tsx           # Progress bar
│   ├── brand-latest-activity.tsx          # Recent enrollment/milestone
│   └── brand-quote-highlight.tsx          # Featured quote
│
├── insights/                              # Live Insights tab
│   ├── brand-insights-tab.tsx             # Tab container (progressive states)
│   ├── brand-waiting-state.tsx            # n=0 anticipatory card
│   ├── brand-story-carousel.tsx           # Horizontal story card scroll
│   ├── brand-story-card.tsx               # Wrapper around ParticipantStoryCard
│   ├── brand-timeline.tsx                 # Wrapper around InsightsTimeline
│   ├── brand-patterns-card.tsx            # Wrapper around EmergingPatternsCard
│   ├── brand-aggregate-panel.tsx          # Demographics + charts
│   └── brand-progress-bar.tsx             # "X/10 toward full analytics"
│
├── results/                               # Results tab
│   ├── brand-results-tab.tsx              # Tab container
│   ├── brand-hero-stats.tsx               # Aggregate stat cards
│   ├── brand-before-after-card.tsx        # Before/after individual story
│   ├── brand-outcome-distribution.tsx     # Positive/neutral/negative bar
│   ├── brand-testimonial-grid.tsx         # Grid of completed stories
│   └── brand-results-waiting.tsx          # Empty state
│
└── widget/                                # Widget tab
    ├── brand-widget-tab.tsx               # Tab container
    ├── brand-widget-preview.tsx           # Widget on mock product page
    ├── brand-widget-embed.tsx             # Embed code block
    ├── brand-widget-verify-link.tsx       # Verification page link
    └── brand-widget-steps.tsx             # 3-step install guide
```

### Existing Components to Reuse

| Existing Component | Reuse Strategy | Notes |
|-------------------|----------------|-------|
| `ParticipantStoryCard` | Wrap in `BrandStoryCard` | May add "brand mode" prop to simplify display |
| `InsightsTimeline` | Wrap in `BrandTimeline` | Pass `compact` prop, limit to 4 events |
| `EmergingPatternsCard` | Wrap in `BrandPatternsCard` | No changes needed |
| `HorizontalBarChart` | Direct reuse | From `study-detail/shared` |
| `QuoteCarousel` | Direct reuse | From `study-detail/shared` |
| `DesperationGauge` | Direct reuse | From `study-detail/shared` |
| `WearableMetricCard` | Direct reuse | From `study-detail/shared` |
| `FloatingBadgeWidget` | Direct reuse | From `widgets/compact-badge-widget` |
| `VerificationModal` | Direct reuse | From `widgets/verification-modal` |
| `InterimInsights` | Wrap in `BrandInterimInsights` | From `components/results/interim-insights` |

### Shared Components (Extracted for Both Views)

Some components currently in `study-detail/shared.tsx` should be accessible to both Admin and Brand views. No move needed — they're already importable.

---

## 6. Data Flow

### Store → Component Data Flow

```
┌───────────────────────────────────────────────────────────────┐
│                        STORES                                  │
│                                                                │
│  useEnrollmentStore ─────────────────────────────────┐        │
│    .getEnrollmentsByStudy(id)                         │        │
│    .getEnrollmentStats(id)                            │        │
│                                                       ▼        │
│  useEarlyInsightsStore ──────────────────────► BrandView       │
│    .computeInsights(id, category)             Components       │
│    .getBaselineCount(id)                              ▲        │
│    .hasAnyParticipants(id)                            │        │
│    .hasEnoughForPatterns(id)                          │        │
│    .hasEnoughForAggregates(id)                        │        │
│                                                       │        │
│  useStudiesStore ─────────────────────────────────────┘        │
│    .getStudyById(id) → StudyData                               │
│                                                                │
│  Simulation ──────────────────────────────────────────────────│
│    getCompletedStoriesFromEnrollments() → ParticipantStory[]   │
│    categorizeStory() → 'positive' | 'neutral' | 'negative'    │
│                                                                │
│  Widget Data ─────────────────────────────────────────────────│
│    getBestWidgetMode(id)                                       │
│    getWidgetDataForStudy(id)                                   │
│    hasWidgetData(id)                                           │
└───────────────────────────────────────────────────────────────┘
```

### Data Dependencies Per Tab

| Tab | Primary Store | Key Functions |
|-----|--------------|---------------|
| Overview | `useEnrollmentStore`, `useStudiesStore` | `getEnrollmentStats()`, study metadata |
| Live Insights | `useEarlyInsightsStore`, `useEnrollmentStore` | `computeInsights()`, `getBaselineCount()` |
| Results | `useEnrollmentStore`, simulation | `getCompletedStoriesFromEnrollments()`, `categorizeStory()` |
| Widget | `@/lib/widget-data` | `getBestWidgetMode()`, `getWidgetDataForStudy()` |

### No New Stores Needed

Brand View is read-only. It consumes existing stores. The only new state is:

```typescript
// In brand-view-shell.tsx or a context provider
interface BrandViewState {
  activeTab: BrandViewTab;
  studyId: string;
}
```

This can be managed via URL params or React state — no Zustand store required.

---

## 7. View Switching

### Mechanism

View switching is controlled at the **study detail page level** (`src/app/admin/studies/[id]/page.tsx` or equivalent).

```typescript
// State at the study detail page level
const [viewMode, setViewMode] = useState<"admin" | "brand">("admin");
```

### Admin → Brand

A **"View as Brand"** button appears in the Admin View header:

```typescript
// In the admin study detail header/toolbar
<Button
  variant="outline"
  onClick={() => setViewMode("brand")}
  className="gap-2"
>
  <Eye className="h-4 w-4" />
  View as Brand
</Button>
```

When clicked:
1. `viewMode` switches to `"brand"`
2. The admin tabs + sidebar are replaced by `<BrandViewShell>`
3. URL optionally updates to `?view=brand` (preserves on refresh)
4. Animation: crossfade or instant swap (no page navigation)

### Brand → Admin

A **"Back to Admin"** button appears in the Brand View header:

```typescript
// In BrandViewHeader
<Button
  variant="ghost"
  onClick={() => setViewMode("admin")}
  className="gap-2 text-muted-foreground"
>
  <ArrowLeft className="h-4 w-4" />
  Back to Admin
</Button>
```

### URL Strategy

```
/admin/studies/study-sleep-001                    → Admin View (default)
/admin/studies/study-sleep-001?view=brand         → Brand View
/admin/studies/study-sleep-001?view=brand&tab=results  → Brand View, Results tab
```

### Implementation

```typescript
// src/app/admin/studies/[id]/page.tsx (simplified)

export default function StudyDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const viewMode = searchParams.get('view') === 'brand' ? 'brand' : 'admin';
  const study = useStudiesStore(s => s.getStudyById(params.id));

  if (viewMode === 'brand') {
    return <BrandViewShell study={study} />;
  }

  return <AdminStudyDetail study={study} />;
}
```

---

## 8. Demo Mode

### How Sales Pre-Loads Data

Demo studies have `isDemo: true` on the `StudyData` object. When `isDemo` is true, the dashboard uses mock/simulated data instead of (empty) real data.

### Demo Flow Phases

Sales walks through 4 phases, corresponding to study progression. The demo system allows jumping between phases.

| Phase | Study State | What Brand View Shows |
|-------|------------|----------------------|
| **Day 0** | `status: "recruiting"`, n=0 | Overview: enrollment link ready, zero participants. Insights: waiting state. |
| **Day 1** | `status: "active"`, n=3, `currentDay: 1` | Overview: 3 enrolled. Insights: 3 story cards + emerging patterns starting. |
| **Day 3** | `status: "active"`, n=12, `currentDay: 3` | Overview: 12 enrolled. Insights: full aggregate charts + patterns. |
| **Day 28** | `status: "completed"`, n=47, completions=31 | Overview: completed. Results: hero stats + before/after cards. Widget: fully configured. |

### Demo Phase Control

In Admin View, a demo study shows a **Phase Selector** (not visible in Brand View):

```typescript
interface DemoPhaseSelector {
  phases: Array<{
    label: string;      // "Day 0", "Day 1", "Day 3", "Day 28"
    description: string; // "First enrollment", "Patterns emerging", etc.
    enrollmentCount: number;
    completedCount: number;
    currentDay: number;
    status: StudyStatus;
  }>;
  activePhase: number;
  onSelectPhase: (index: number) => void;
}
```

When a phase is selected:
1. `useEnrollmentStore.resetEnrollments()` is called
2. Simulated enrollments are batch-loaded: `simulateBatch(studyId, slug, count, category)`
3. Study metadata is updated: `updateStudy(studyId, { status, currentDay, participants })`

This already partially exists — `simulateBatch()` and `addSimulatedEnrollment()` are in the enrollment store.

### Demo Data Requirements

Per demo-experience-spec.md, the demo data must:
- Include at least one participant with **minimal improvement** (credibility through honesty)
- Have quotes that sound like real human speech
- Show realistic (not too perfect) improvement numbers
- Include 3-4 archetypes: Desperate, Skeptic, Optimizer, Struggler
- Mix wearable data quality (some missing days, some inconsistent)

The existing simulation infrastructure (`baseline-generator.ts`, `completed-story-generator.ts`, `archetypes.ts`) already handles this.

---

## 9. Category Adaptations

### Tier-Based Display Logic

The category tier determines what data is prominently displayed:

| Component | Tier 1 (Sleep, Recovery, Fitness) | Tier 2 (Stress) | Tier 3 (Energy, Focus, Mood) | Tier 4 (Skin, Gut, Hair) |
|-----------|----------------------------------|-----------------|------------------------------|--------------------------|
| **Story Cards** | Wearable baseline prominent (Sleep Score, Deep Sleep, etc.) | Both wearable + assessment | Assessment score prominent | Assessment score only |
| **Before/After** | Wearable metrics top, assessment below | Side-by-side equal | Assessment metrics top, wearable below | Assessment only |
| **Hero Stats** | Primary: wearable change (e.g., +23% Sleep Score) | Primary: wearable + assessment | Primary: assessment change (e.g., +18% Energy Score) | Primary: assessment change |
| **Widget** | Headlines use wearable metric | Flexible | Headlines use assessment metric | Assessment metric |

### Implementation Strategy

The `CategoryDefinition` type already includes tier information and wearable config:

```typescript
// From categories.ts
interface CategoryDefinition {
  value: CategoryValue;
  tier: TierLevel;   // 1, 2, 3, or 4
  wearables: {
    supported: boolean;
    metricType: "sleep" | "activity" | "hrv" | "stress" | "none";
    primaryField?: string;
    displayLabels?: { primary: string; secondary?: string };
  };
  assessment: {
    metricLabel: string;
    higherIsBetter: boolean;
  };
}
```

Brand View components accept `studyCategory: string` and look up the category definition:

```typescript
// Utility function used across brand components
import { getCategoryByValue } from "@/lib/categories";

function useCategoryConfig(category: string) {
  const catDef = getCategoryByValue(category);
  return {
    tier: catDef?.tier ?? 3,
    hasWearables: catDef?.wearables?.supported ?? false,
    wearableLabel: catDef?.wearables?.displayLabels?.primary ?? "Wearable Data",
    assessmentLabel: catDef?.assessment?.metricLabel ?? "wellness score",
    higherIsBetter: catDef?.assessment?.higherIsBetter ?? true,
    isWearablePrimary: (catDef?.tier ?? 3) <= 2,
  };
}
```

### Specific Adaptations

**Sleep Study (Tier 1):**
- Story card shows: Sleep Score, Deep Sleep, Total Sleep, RHR, HRV, Sleep Efficiency
- Before/After card leads with wearable changes, assessment below
- Hero stat: "+23% Sleep Score" (wearable)
- Widget headline: "23% Better Sleep Score"

**Energy Study (Tier 3):**
- Story card shows: Energy Score /100, assessment badge
- Wearable data (steps, active minutes) shown as supporting evidence, smaller
- Before/After card leads with Energy Score change, wearable below
- Hero stat: "+18% Energy Score" (assessment)
- Widget headline: "87% Reported More Energy"

**Skin Study (Tier 4):**
- Story card shows: Skin Score /100, photo documentation badge if available
- No wearable data section
- Before/After may include photos if `photoDocumentation` exists
- Hero stat: "+25% Skin Score" (assessment only)

---

## 10. Edge Cases

### Empty States

| Scenario | Component | Behavior |
|----------|-----------|----------|
| n=0 participants | `BrandInsightsTab` | Shows `<BrandWaitingState>` with "what you'll see" preview |
| n=0 participants | `BrandOverviewTab` | Shows "0 enrolled" with enrollment link and anticipatory copy |
| n=0 completions | `BrandResultsTab` | Shows `<BrandResultsWaiting>` with "results appear after participants complete" |
| No widget data | `BrandWidgetTab` | Shows preview with placeholder + "activates when results ready" |
| Study is draft | All tabs | Brand View should still be accessible for preview, with draft badge |

### Insufficient Data

| Scenario | Behavior |
|----------|----------|
| n=1, no wearable data | Story card omits wearable section entirely (graceful degradation) |
| n=2, one dropped out | Show remaining participant, don't highlight dropouts |
| 1 completion, bad result | Show it honestly — don't hide negative results |
| No testimonial quote | Before/After card omits quote section, shows metrics only |

### Error Handling

| Scenario | Behavior |
|----------|----------|
| Store not hydrated (SSR) | Show loading skeleton, wait for `_hasHydrated` |
| Study ID not found | Redirect to study list with error toast |
| Widget data unavailable | Widget tab shows "coming soon" state |
| Category not recognized | Fall back to Tier 3 (assessment-primary) defaults |

### Responsive Design

| Breakpoint | Behavior |
|------------|----------|
| Desktop (≥1024px) | Full layout as designed |
| Tablet (768–1023px) | Hero numbers stack 2×2, story cards narrower |
| Mobile (<768px) | Single column, story cards full width, hero numbers stack vertically |

---

## 11. File Structure

### New Files

```
src/
├── components/
│   └── brand/
│       ├── index.ts                          # Barrel exports
│       ├── brand-view-shell.tsx              # Main layout component
│       ├── brand-view-header.tsx             # Header with study info
│       ├── brand-view-tabs.tsx               # Tab navigation
│       ├── brand-view-footer.tsx             # Footer
│       ├── types.ts                          # Brand View specific types
│       │
│       ├── overview/
│       │   ├── index.ts
│       │   ├── brand-overview-tab.tsx
│       │   ├── brand-hero-numbers.tsx
│       │   ├── brand-study-timeline.tsx
│       │   ├── brand-latest-activity.tsx
│       │   └── brand-quote-highlight.tsx
│       │
│       ├── insights/
│       │   ├── index.ts
│       │   ├── brand-insights-tab.tsx
│       │   ├── brand-waiting-state.tsx
│       │   ├── brand-story-carousel.tsx
│       │   ├── brand-story-card.tsx
│       │   ├── brand-timeline.tsx
│       │   ├── brand-patterns-card.tsx
│       │   ├── brand-aggregate-panel.tsx
│       │   └── brand-progress-bar.tsx
│       │
│       ├── results/
│       │   ├── index.ts
│       │   ├── brand-results-tab.tsx
│       │   ├── brand-hero-stats.tsx
│       │   ├── brand-before-after-card.tsx
│       │   ├── brand-outcome-distribution.tsx
│       │   ├── brand-testimonial-grid.tsx
│       │   └── brand-results-waiting.tsx
│       │
│       └── widget/
│           ├── index.ts
│           ├── brand-widget-tab.tsx
│           ├── brand-widget-preview.tsx
│           ├── brand-widget-embed.tsx
│           ├── brand-widget-verify-link.tsx
│           └── brand-widget-steps.tsx
│
├── lib/
│   └── hooks/
│       └── use-category-config.ts            # Shared hook for tier-based display
│
└── app/
    └── admin/
        └── studies/
            └── [id]/
                └── page.tsx                   # Modified: add viewMode toggle
```

### Modified Files

| File | Change |
|------|--------|
| `src/app/admin/studies/[id]/page.tsx` | Add `viewMode` state + `?view=brand` URL param support |
| `src/components/admin/study-detail/types.ts` | Add `BrandViewTab` type export |
| `src/components/admin/study-detail/overview-tab.tsx` | Add "View as Brand" button |

### Naming Conventions

- **Component files:** `kebab-case.tsx` (e.g., `brand-hero-numbers.tsx`)
- **Component names:** `PascalCase` (e.g., `BrandHeroNumbers`)
- **Type files:** `types.ts` in each directory
- **Index files:** Barrel exports via `index.ts`
- **Props:** `ComponentNameProps` (e.g., `BrandHeroNumbersProps`)
- **Prefix:** All Brand View components prefixed with `Brand` to distinguish from admin equivalents

---

## 12. Implementation Order

### Phase 1: Shell & Navigation (Day 1)

**Goal:** You can switch between Admin and Brand View. Brand View renders with tabs but empty content.

1. **`brand-view-shell.tsx`** — Layout container
2. **`brand-view-header.tsx`** — Study name, status badge, "Back to Admin" button
3. **`brand-view-tabs.tsx`** — 4-tab navigation (Overview, Live Insights, Results, Widget)
4. **`brand-view-footer.tsx`** — "Powered by Reputable" + verify link
5. **`types.ts`** — `BrandViewTab` type, `BrandViewProps` interface
6. **Modify study detail page** — Add `viewMode` state, render `BrandViewShell` when `brand`
7. **Add "View as Brand" button** to admin header

**Dependencies:** None — this is pure layout.
**Deliverable:** Click "View as Brand" → see clean shell with 4 tabs. Click "Back to Admin" → return.

### Phase 2: Overview Tab (Day 1–2)

**Goal:** The first tab has real content — hero numbers and study timeline.

1. **`brand-overview-tab.tsx`** — Container that orchestrates sub-components
2. **`brand-hero-numbers.tsx`** — 3–4 stat cards reading from enrollment store
3. **`brand-study-timeline.tsx`** — Linear progress bar
4. **`brand-latest-activity.tsx`** — Most recent enrollment event
5. **`brand-quote-highlight.tsx`** — Featured participant quote
6. **`use-category-config.ts`** — Shared hook for tier-based display logic

**Dependencies:** Phase 1 (shell exists).
**Deliverable:** Overview tab shows live data from existing stores.

### Phase 3: Live Insights Tab (Day 2–3)

**Goal:** Progressive disclosure of participant stories — the emotional core.

1. **`brand-insights-tab.tsx`** — Container with progressive state logic
2. **`brand-waiting-state.tsx`** — n=0 anticipatory card
3. **`brand-story-card.tsx`** — Wrapper around existing `ParticipantStoryCard` (read-only mode)
4. **`brand-story-carousel.tsx`** — Horizontal scroll container for story cards
5. **`brand-timeline.tsx`** — Wrapper around existing `InsightsTimeline`
6. **`brand-patterns-card.tsx`** — Wrapper around existing `EmergingPatternsCard`
7. **`brand-aggregate-panel.tsx`** — Demographics + motivation charts (n≥10)
8. **`brand-progress-bar.tsx`** — "X/10 toward full analytics" indicator

**Dependencies:** Phase 1 (shell exists). Relies on existing `EarlyInsightsCard`, `ParticipantStoryCard`, `InsightsTimeline`, `EmergingPatternsCard`.
**Deliverable:** Full progressive disclosure flow works. Add participants in Admin → switch to Brand View → see stories appear.

### Phase 4: Results Tab (Day 3–4)

**Goal:** Before/after stories with objective + subjective proof.

1. **`brand-results-tab.tsx`** — Container with completion-count-based states
2. **`brand-results-waiting.tsx`** — Empty state (no completions)
3. **`brand-hero-stats.tsx`** — 3–4 aggregate stat cards (improvement %, satisfaction, NPS)
4. **`brand-before-after-card.tsx`** — THE money component — featured + compact variants
5. **`brand-outcome-distribution.tsx`** — Positive/neutral/negative horizontal bar
6. **`brand-testimonial-grid.tsx`** — Grid layout of compact before/after cards

**Dependencies:** Phase 1. Relies on existing `getCompletedStoriesFromEnrollments()`, `categorizeStory()`, `InterimInsights`.
**Deliverable:** Completed participants show beautiful before/after cards. Aggregate stats visible at 3+ completions.

### Phase 5: Widget Tab (Day 4)

**Goal:** Widget preview on mock product page + embed code + verify link.

1. **`brand-widget-tab.tsx`** — Container
2. **`brand-widget-preview.tsx`** — `FloatingBadgeWidget` rendered in mock product page context
3. **`brand-widget-embed.tsx`** — Code block with copy button
4. **`brand-widget-verify-link.tsx`** — Verification page URL
5. **`brand-widget-steps.tsx`** — 3-step installation guide

**Dependencies:** Phase 1. Relies on existing `FloatingBadgeWidget`, `VerificationModal`, `@/lib/widget-data`.
**Deliverable:** Widget tab shows live widget, embed code, and verification link.

### Phase 6: Polish & Category Adaptations (Day 5)

**Goal:** Everything works perfectly for both wearable-primary and assessment-primary studies.

1. Test with sleep category (Tier 1) — verify wearable metrics prominent
2. Test with energy category (Tier 3) — verify assessment scores prominent
3. Test with skin category (Tier 4) — verify no wearable sections shown
4. Polish responsive layouts (tablet, mobile)
5. Add loading skeletons for store hydration
6. Add error boundaries for graceful failures
7. Review all empty states across all tabs

**Dependencies:** Phases 1–5 complete.
**Deliverable:** Brand View works flawlessly across categories and screen sizes.

### Phase 7: Demo Phase Control (Day 5–6)

**Goal:** Sales can jump between Day 0 / Day 1 / Day 3 / Day 28 with one click.

1. Build `<DemoPhaseSelector>` component (Admin View only)
2. Define 4 demo phase presets (enrollment counts, completion counts, currentDay, status)
3. Wire to `simulateBatch()`, `resetEnrollments()`, `updateStudy()`
4. Test full demo flow end-to-end

**Dependencies:** All phases complete.
**Deliverable:** Sales rep can run the full 10-minute demo in Brand View.

---

## Appendix: Key Type References

### From `src/lib/types/index.ts`

```typescript
// Used by Brand Results tab
interface ParticipantStory {
  id: string;
  name: string;
  initials: string;
  tier: TierLevel;
  profile: { ageRange: string; lifeStage: string; location?: string; ... };
  baseline: { motivation: string; hopedResults: string; ... };
  journey: { villainRatings: [...]; keyQuotes: [...]; ... };
  wearableMetrics?: WearableMetrics;
  assessmentResults?: AssessmentResult[];
  finalTestimonial?: { quote: string; overallRating: number; ... };
  verification?: { id: string; dataIntegrity: "verified" | "partial" | "unverified"; ... };
}

// Used by Brand Insights tab
interface EarlyInsightsData {
  participantCards: ParticipantInsightCard[];
  timeline: InsightTimelineEvent[];
  emergingPatterns?: EmergingPatterns;
  notableQuotes: { quote: string; initials: string; context: string; }[];
  demographics: EarlyInsightsDemographics;
  baselineScores?: BaselineScoreDistribution;
  baselineQuestions: BaselineQuestionAggregation[];
}

// Used by Brand Story Card
interface ParticipantInsightCard {
  id: string;
  displayName: string;
  initials: string;
  heroSymptom: string;
  heroSymptomSeverity: number;
  painDuration: string;
  failedAlternatives: string[];
  desperationLevel: number;
  primaryGoal: string;
  baselineScore?: number;
  archetype?: ParticipantArchetype;
  wearableBaseline?: WearableBaselineData;
}
```

### From `src/components/admin/study-detail/types.ts`

```typescript
interface StudyData {
  id: string;
  isDemo?: boolean;
  name: string;
  category: string;
  categoryLabel: string;
  status: StudyStatus;
  participants: number;
  targetParticipants: number;
  hasWearables: boolean;
  currentDay?: number;
  enrollmentConfig?: EnrollmentConfig;
  fulfillmentModel?: "recruited" | "rebate";
  // ... (full definition in types.ts)
}
```

---

## Appendix: Design Principles

1. **5-Second Rule:** Every screen must communicate its core message in 5 seconds or less.
2. **Progressive Disclosure IS the Narrative:** Don't explain that insights grow over time — just show it happening.
3. **Objective + Subjective = Credibility:** Neither wearable data alone nor testimonials alone are convincing. Together, they're undeniable.
4. **Honest Imperfection:** Include neutral/negative results. A study where everyone improves 30%+ feels fake.
5. **Premium Feel:** Clean whitespace, subtle gradients, confident typography. This is a $10K+ product.
6. **Read-Only:** Brand View has zero editing, configuration, or operational controls. No buttons that change state.
7. **Alive from Day 1:** n=1 should feel exciting, not empty. The anticipation is part of the experience.
