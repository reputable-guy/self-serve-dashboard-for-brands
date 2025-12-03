# Reputable Health - Brand Self-Serve Dashboard

## Project Overview

A self-serve dashboard where wellness brands create "rebate studies." Participants buy products at full price, complete a 30-day tracking study using their wearables, and receive a rebate upon completion. Brands get verified testimonials with real biometric data.

This is a Next.js 14 application built with TypeScript, Tailwind CSS, and shadcn/ui components. It serves as the brand-facing admin dashboard for managing studies, viewing participant data, and embedding recruitment widgets.

## How Rebate Studies Work

1. Brand creates a study (product info, rebate amount, what metrics to track)
2. Brand embeds our widget on their checkout page
3. Customer buys product, sees offer: "Complete our 30-day study, get $X back"
4. Customer downloads Reputable app, joins study, connects wearable
5. For 30 days: wearable syncs automatically + daily check-in questions
6. Upon completion: customer gets rebate, brand gets verified testimonial

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **State Management**: React Context + localStorage
- **Icons**: Lucide React
- **Data**: Mock data (no backend yet)

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with StudyProvider
│   ├── page.tsx                 # Dashboard home (study list)
│   ├── studies/
│   │   ├── new/                 # Study creation wizard
│   │   │   ├── page.tsx         # Step 1: Product info
│   │   │   ├── settings/        # Step 2: Study settings + check-in questions
│   │   │   └── review/          # Step 3: Review generated content
│   │   └── [id]/
│   │       ├── page.tsx         # Study detail page with participants
│   │       ├── edit/            # Edit existing study
│   │       └── verify/[participantId]/ # Participant verification page
│   └── embed/[id]/              # Embeddable widget preview
├── components/
│   ├── ui/                      # shadcn/ui base components
│   ├── participant-detail-panel.tsx  # Slide-out panel for participant data
│   ├── video-testimonial-card.tsx    # Video testimonial display
│   └── ... other components
└── lib/
    ├── mock-data.ts             # Mock studies & participant data
    ├── study-context.tsx        # React Context for study form state
    └── utils.ts                 # Utility functions (cn helper)
```

## Key Features

### 1. Study Creation Wizard (`/studies/new`)
A 3-step wizard for brands to create new studies:
- **Step 1 - Product Info**: Name, image, description, price, URL, category
- **Step 2 - Settings**: Rebate amount, duration, spots, device requirements, metrics to track, check-in questions
- **Step 3 - Review**: AI-generated content preview (study title, hook question, discover items, daily routine, rewards)

### 2. Study Dashboard (`/studies/[id]`)
Comprehensive view of a study including:
- Overview stats (spots filled, completion rate, active participants)
- Participant list with status badges
- Click-through to participant detail panel
- Tabs for Overview, Participants, Content, Analytics, Settings

### 3. Participant Detail Panel
A slide-out panel showing individual participant data:
- Enrollment info and status
- Biometric trends with sparkline charts
- Check-in response history
- Support for different question types (text, multiple choice, Likert scale)

### 4. Check-in Questions System
Two types of check-in questions:

**Hero Symptom Check-in (Weekly)**
- Based on the "villain variable" (e.g., "afternoon brain fog")
- Automatically asked on days 7, 14, 21, 28
- Tracks improvement in the target symptom over time

**Additional Questions (Custom)**
- Custom questions with flexible scheduling (any of the 30 days)
- Four question types:
  - **Text**: Free-form text responses
  - **Multiple Choice**: Predefined options
  - **Voice & Text**: Audio recording with transcript
  - **Likert Scale (1-10)**: Rating scale with customizable labels

### 5. Embed Widget (`/embed/[id]`)
Preview of the embeddable widget brands place on checkout pages to recruit participants.

### 6. Participant Verification (`/studies/[id]/verify/[participantId]`)
Page for verifying participant data and testimonials.

## Data Model

### StudyFormData (Context State)
```typescript
interface StudyFormData {
  // Product Info
  productName: string;
  productImage: string;
  productDescription: string;
  productPrice: string;
  productUrl: string;
  category: string;

  // Study Settings
  rebateAmount: string;
  durationDays: string;
  totalSpots: string;
  requiredDevice: string;
  metricsToTrack: string[];

  // Check-in Questions
  villainVariable: string;
  villainQuestionDays: number[];
  customQuestions: CustomQuestion[];

  // Generated Content
  studyTitle: string;
  hookQuestion: string;
  discoverItems: DiscoverItem[];
  dailyRoutine: RoutineStep[];
  whatYouGet: ValueItem[];
}
```

### CustomQuestion
```typescript
interface CustomQuestion {
  questionText: string;
  questionType: "multiple_choice" | "text" | "voice_and_text" | "likert_scale";
  options: string[];           // For multiple choice
  showOnDays: number[];        // Days 1-30 when question appears
  // Likert scale specific
  likertMin?: number;          // Default: 1
  likertMax?: number;          // Default: 10
  likertMinLabel?: string;     // e.g., "Not at all"
  likertMaxLabel?: string;     // e.g., "Extremely"
}
```

### Participant
```typescript
interface Participant {
  id: string;
  name: string;
  email: string;
  enrolledDate: string;
  status: "Active" | "Completed" | "Dropped";
  daysCompleted: number;
  checkInsCompleted: number;
  device: string;
  lastSync: string;
  metrics: ParticipantMetrics;  // Sleep, HRV, RHR trends
  checkInResponses: CheckInResponse[];
}
```

### CheckInResponse
```typescript
interface CheckInResponse {
  day: number;
  date: string;
  questionType: "villain" | "multiple_choice" | "text" | "voice_and_text" | "likert_scale";
  question: string;
  answer: string;
  // Likert scale metadata
  likertValue?: number;
  likertMin?: number;
  likertMax?: number;
  likertMinLabel?: string;
  likertMaxLabel?: string;
}
```

## Design System

### Colors
- **Background**: Dark theme (#111827)
- **Primary Accent**: Teal (#00D1C1)
- **Status Colors**:
  - Recruiting: Teal
  - Filling Fast: Yellow with lightning icon
  - Completed: Green
  - Dropped: Red

### Components
- Cards with subtle borders, 12-16px rounded corners
- Status badges with contextual colors
- Collapsible sections for optional content
- Sparkline charts for trend visualization
- Slide-out panels for detail views

## State Management

### StudyContext
Located in `src/lib/study-context.tsx`, provides:
- `formData`: Current study form state
- `updateField()`: Update single field
- `updateFields()`: Update multiple fields
- `resetForm()`: Clear all form data
- `loadStudy()`: Load existing study for editing

### localStorage
Studies are persisted to localStorage for demo purposes. Key: `reputable-studies`

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Recent Updates

### PR #7: Likert Scale Questions
- Added Likert Scale (1-10) as a question type option
- Custom min/max labels (e.g., "Not at all" to "Extremely")
- Visual scale display in participant detail panel

### Check-in Questions UI Improvements
- Separated "Weekly Hero Symptom Check-in" from "Additional Questions"
- 30-day selector for custom questions (any day, not just weekly)
- Auto-expand custom questions section when editing studies with existing questions

### Participant Detail Panel
- Sparkline charts for biometric trends
- Connected check-in responses to study-specific questions
- Support for all question types including Likert scale visualization
