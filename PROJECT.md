# Reputable Self-Serve Dashboard

A comprehensive platform for managing wellness product efficacy studies with real participant data verification.

## Overview

The Reputable platform enables wellness brands to run scientific studies proving their products work. The platform manages the entire study lifecycle:

1. **Recruitment** - Brands create studies, participants sign up
2. **Data Collection** - Daily check-ins, wearable device syncing, assessments
3. **Verification** - Real participant data transformed into verified testimonials
4. **Results** - Categorized outcomes, aggregate statistics, individual participant stories

### Core Value Proposition

Unlike traditional testimonials, Reputable provides **verified** proof by:
- Tracking participants via wearable devices (Oura Ring, Whoop, Apple Watch, etc.)
- Administering validated assessments at baseline and endpoint
- Monitoring daily compliance and engagement
- Generating transparent verification pages with real data

---

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand with localStorage persistence
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts (for compliance trends)
- **QR Codes**: qrcode.react

---

## Architecture

### Single Source of Truth (SSOT)

| Concept | Source File |
|---------|-------------|
| Types | `src/lib/types/index.ts` |
| Categories | `src/lib/categories.ts` |
| Studies | `src/lib/studies-store.ts` |
| Brands | `src/lib/brands-store.ts` |
| Assessments | `src/lib/assessments.ts` |
| Compliance | `src/lib/compliance-store.ts` |
| Interim Insights | `src/lib/interim-insights-store.ts` |

### Tier System

Categories are organized into 4 tiers based on measurement approach:

| Tier | Measurement | Categories |
|------|-------------|------------|
| 1 | Wearables PRIMARY | Sleep, Recovery, Fitness |
| 2 | Co-Primary (wearables + assessment) | Stress |
| 3 | Assessment PRIMARY | Energy, Focus, Mood, Anxiety, Pain, Resilience |
| 4 | Assessment ONLY | Skin, Gut, Immunity, Hair, Weight, Libido, Satiety |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin dashboard routes
│   │   ├── brands/               # Brand management
│   │   ├── studies/              # Study management
│   │   └── settings/             # Platform settings
│   ├── verify/                   # Public verification pages
│   │   ├── [id]/                 # Individual participant verification
│   │   ├── sensate-results/      # Sensate aggregate results
│   │   └── lyfefuel-results/     # LYFEfuel aggregate results
│   ├── study/[id]/               # Study preview pages
│   ├── pricing/                  # Pricing page
│   └── testimonials/             # Testimonials display
├── components/
│   ├── admin/                    # Admin-specific components
│   │   └── study-detail/         # Study detail tabs
│   ├── compliance/               # Compliance monitoring
│   ├── results/                  # Results & interim insights
│   ├── shipping/                 # Fulfillment components
│   ├── verification/             # Verification page components
│   └── ui/                       # shadcn/ui primitives
└── lib/
    ├── types/                    # Type definitions
    └── *-store.ts                # Zustand stores
```

---

## Pages & Routes

### Admin Dashboard (`/admin`)

The main admin dashboard showing:
- Platform health metrics
- Active alerts requiring attention
- Brand overview table
- Quick actions (Create Study, Manage Brands, Settings)

### Admin Study Detail (`/admin/studies/[id]`)

Five-tab interface for managing individual studies:

1. **Overview Tab**
   - Study status banner (draft, recruiting, active, completed)
   - Launch checklist for draft studies
   - Key metrics (participants, compliance, completion)
   - Timeline/lifecycle visualization

2. **Fulfillment Tab**
   - Recruitment status by cohort
   - Participant shipping tracker
   - Tracking number entry
   - Cohort management

3. **Compliance Tab**
   - Study progress by cohort
   - Compliance trend chart (daily/weekly)
   - At-risk participant alerts
   - Simulation controls (for demo/testing)
   - Compliance settings configuration

4. **Results Tab**
   - Aggregate results (context-aware based on study status)
   - Interim insights (for active studies)
   - Participant stories (for completed studies)
   - Export options

5. **Configuration Tab**
   - Study settings
   - Assessment configuration
   - Wearable requirements
   - Custom questions

### Verification Pages (`/verify`)

Public-facing pages showing verified participant data:

- **Individual Verification** (`/verify/[id]`) - Single participant story
- **Aggregate Results** (`/verify/sensate-results`, `/verify/lyfefuel-results`) - Study-wide results
- **Sample Stories** (`/verify/samples`) - Example verification pages

---

## Key Features

### 1. Cohort-Based Study Management

Participants join in rolling cohorts, each starting at different times:

```
Cohort 1: Starts Day 1   → Day 21-28 (furthest along)
Cohort 2: Starts Day 8   → Day 14-21
Cohort 3: Starts Day 15  → Day 7-14
```

Each cohort has:
- Its own start date and expected completion date
- Independent progress tracking
- Separate compliance monitoring

### 2. Interim Insights (N of 1 Trials)

During active studies, shows early participant data:
- Individual participant cards with status (improving/stable/declining)
- Expandable cards with detailed progress
- Villain variable tracking (what participants are measuring)
- Wearable metrics trends

**Important**: Interim insights show per-participant data, not global study data. Each participant has their own study day based on their cohort.

### 3. Compliance Monitoring

Real-time tracking of participant engagement:
- Daily check-in completion
- Wearable sync status
- "Lifeline" system for missed days
- At-risk participant alerts
- Compliance trend visualization

### 4. Verification Pages

Public-facing proof of efficacy:
- Verified participant stories with real data
- Wearable metrics (before/after comparisons)
- Assessment results with score changes
- QR codes linking to verification
- "How We Verify" transparency section

### 5. Results Categorization

Participant outcomes are categorized:

| Category | Criteria |
|----------|----------|
| Improved | Objective improvement in metrics |
| Neutral | Low NPS but objective improvement |
| No Improvement | No measurable improvement |

---

## Data Models

### Study

```typescript
interface Study {
  id: string;
  name: string;
  brandId: string;
  category: CategoryValue;
  status: 'draft' | 'recruiting' | 'active' | 'completed' | 'archived';
  tier: 1 | 2 | 3 | 4;
  participants: number;
  targetParticipants: number;
  hasWearables: boolean;
  villainVariable?: string;  // What participants track (e.g., "energy levels")
  launchChecklist?: LaunchChecklist;
  // ... additional fields
}
```

### ParticipantStory

```typescript
interface ParticipantStory {
  id: string;
  name: string;
  initials: string;
  tier: TierLevel;
  dataSource: 'real' | 'demo' | 'generated';
  cohortNumber?: number;
  profile: { ageRange, gender, ... };
  baseline: { motivation, hopedResults, ... };
  journey: {
    startDate: string;
    endDate: string;
    villainVariable: string;
    villainRatings: { day, rating, note }[];
    keyQuotes: { day, quote, context }[];
  };
  wearableMetrics?: WearableMetrics;
  assessmentResults?: AssessmentResult[];
  finalTestimonial?: { quote, overallRating, npsScore, ... };
  verification?: { id, dataIntegrity, complianceRate };
}
```

### Compliance Data

```typescript
interface ComplianceParticipant {
  id: string;
  displayName: string;
  studyDay: number;          // Calculated per-cohort
  cohortNumber: number;
  checkInsCompleted: number;
  lastCheckIn: string;
  missedDays: number;
  riskLevel: 'low' | 'medium' | 'high';
  lifelinesRemaining: number;
}
```

---

## Zustand Stores

### studies-store.ts
- All study CRUD operations
- Study status transitions
- Launch checklist updates

### brands-store.ts
- Brand management
- Brand-study relationships

### compliance-store.ts
- Per-participant compliance tracking
- Cohort-aware day calculations
- Risk level determination
- Lifeline management

### interim-insights-store.ts
- Mock participant data generation
- Status determination (improving/stable/declining)
- Per-cohort progress tracking

### alerts-store.ts
- Platform health monitoring
- Attention-required alerts

---

## Real Study Data

The platform includes two real studies with actual participant data:

### Sensate Study (`src/lib/sensate-real-data.ts`)
- Vagus nerve stimulation device
- 18 verified participants
- Oura Ring wearable data
- 28-day intervention period

### LYFEfuel Study (`src/lib/lyfefuel-real-data.ts`)
- Greens supplement for energy
- 22 verified participants
- Assessment-based measurements
- Daily energy tracking

---

## UI Components

### Admin Components
- `AttentionAlerts` - Urgent alerts requiring admin action
- `PlatformHealth` - Overall platform status
- `LifecycleBar` - Study lifecycle visualization
- `LaunchChecklist` - Pre-launch requirements

### Compliance Components
- `StudyProgressCard` - Cohort-based progress display
- `ComplianceStatsCards` - Key compliance metrics
- `ComplianceTrendChart` - Daily/weekly trends
- `AtRiskParticipants` - Participants needing attention

### Results Components
- `InterimInsights` - Active study participant cards
- `ParticipantInterimCard` - Individual interim data
- `ParticipantStoryCard` - Completed participant story

### Verification Components
- `VerificationPage` - Full verification display
- `TrustStack` - How verification works
- `VillainJourneyProgress` - Week-by-week villain tracking
- `AssessmentResultCard` - Assessment score changes

---

## Important Concepts

### Villain Variable
The "villain" is what participants are tracking/fighting against. Each category has a default:
- Sleep → "sleep quality"
- Energy → "energy levels"
- Stress → "stress levels"

This appears in check-in questions: "How would you rate your {villainVariable} today?"

### Rolling Recruitment Model
Unlike traditional studies with fixed start dates, participants join in cohorts:
- Each cohort starts ~7 days apart
- Progress is tracked per-cohort, not globally
- Completion dates vary by cohort

### Data Sources
Stories are tagged with their origin:
- `real` - Actual participant data
- `demo` - Manually crafted demo data
- `generated` - Algorithmically generated mock data

---

## Development

### Running the App
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run linting
```

### Key Files to Understand
1. `src/lib/types/index.ts` - All type definitions
2. `src/lib/categories.ts` - Category configuration (SSOT)
3. `src/lib/compliance-store.ts` - Compliance logic with cohort handling
4. `src/components/admin/study-detail/*.tsx` - Study management tabs

### Design Principles
1. **Single Source of Truth** - Don't duplicate definitions
2. **Normalize Data, Denormalize Views** - Store IDs, compute at render
3. **Cohort Awareness** - Never assume global study day/completion date
4. **Per-Participant Tracking** - Each participant has their own journey

---

## Recent Updates

### Cohort-Aware Progress (January 2026)
- Fixed compliance store to calculate participant days based on cohort
- Removed misleading global "Day X of 28" displays
- Added cohort badges and expected completion dates
- Made interim insights cohort-aware

### Categorized Results (January 2026)
- Added result categorization (Improved/Neutral/No Improvement)
- Context-aware aggregate results based on study status
- Instagram carousel download for results
