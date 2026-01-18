# Seville Codebase Guidelines

## Architecture Overview

This is a Next.js 14 application using:
- **React 18** with TypeScript
- **Zustand** for state management (with localStorage persistence)
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components

## Core Principles

### 1. Single Source of Truth (SSOT)

Every piece of knowledge has ONE authoritative location:

| Concept | Source of Truth |
|---------|-----------------|
| Types | `src/lib/types/index.ts` |
| Categories | `src/lib/categories.ts` |
| Studies | `src/lib/studies-store.ts` |
| Brands | `src/lib/brands-store.ts` |
| Assessments | `src/lib/assessments.ts` |

**Do:** Import from the source. Derive what you need.
**Don't:** Duplicate definitions. Create your own type for an existing concept.

```typescript
// GOOD: Import from source
import { CategoryValue, Study } from '@/lib/types';
import { getCategory, getCategoryLabel } from '@/lib/categories';

// BAD: Redefine types
type MyCategory = 'sleep' | 'stress' | 'energy';
```

### 2. Normalize Data, Denormalize Views

Store IDs, compute relationships at render time.

```typescript
// GOOD: Store ID reference
interface Study {
  brandId: string;  // Just the ID
}
// Compute at render: brands.find(b => b.id === study.brandId)?.name

// BAD: Duplicate data
interface Study {
  brandId: string;
  brandName: string;  // Duplicated! Will get out of sync.
}
```

### 3. Colocate What Changes Together

If you change one file and must always change another, they should be in the same module.

### 4. Small, Focused Modules

- Components: < 200 lines
- Utilities/stores: < 300 lines
- If a file is hard to hold in your head, split it

### 5. Explicit Over Magic

- Make data flow visible and traceable
- Avoid hidden side effects in store middleware
- Prefer explicit function calls over implicit behaviors

## File Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── admin/               # Admin-only routes
│   ├── studies/             # Brand study management
│   ├── verify/              # Verification pages
│   └── layout.tsx           # Root layout
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   └── *.tsx                # Feature components
├── lib/
│   ├── types/               # ALL type definitions
│   │   └── index.ts         # Central type exports
│   ├── categories.ts        # Category definitions (SSOT)
│   ├── assessments.ts       # Assessment definitions and scoring
│   ├── studies-store.ts     # Study state management
│   ├── brands-store.ts      # Brand state management
│   ├── mock-data.ts         # Test/demo data
│   └── *.ts                 # Other utilities
└── hooks/                   # Shared React hooks
```

## Type System

### Centralized Types (`src/lib/types/index.ts`)

All domain types are defined here. When adding a new type:

1. Add it to `types/index.ts`
2. Export it from that file
3. Import it where needed

### Key Types

```typescript
// Categories
type CategoryValue = 'sleep' | 'recovery' | 'fitness' | ... ;
interface CategoryDefinition { value, label, tier, assessment, wearables }

// Tier System (1-4)
type TierLevel = 1 | 2 | 3 | 4;
// Tier 1: Wearables primary (sleep, recovery, fitness)
// Tier 2: Co-primary (stress)
// Tier 3: Assessment primary (energy, focus, mood, anxiety, pain, resilience)
// Tier 4: Assessment only (skin, gut, immunity, hair, weight, libido, satiety)

// Studies
interface Study { id, name, brandId, category, status, tier, ... }
type StudyStatus = 'draft' | 'recruiting' | 'filling-fast' | 'full' | 'active' | 'completed' | 'archived';

// Users
type UserRole = 'admin' | 'brand';
interface User { id, email, name, role, brandId? }
```

## State Management

### Zustand Stores

Stores are in `src/lib/*-store.ts`. They use localStorage persistence.

```typescript
// Reading state
const { studies, getStudyById } = useStudiesStore();

// Updating state
useStudiesStore.getState().updateStudy(id, updates);
```

### Context Providers

Some features use React Context for form state:
- `StudyFormContext` for study creation/editing

## Categories Configuration

Categories are defined in `src/lib/categories.ts`. Each category has:
- `value`: Unique identifier
- `label`: Display name
- `tier`: Measurement tier (1-4)
- `assessment`: Scoring configuration
- `wearables`: Device data configuration

```typescript
import { getCategory, getCategoryLabel, categorySupportsWearables } from '@/lib/categories';

const category = getCategory('sleep');  // Full definition
const label = getCategoryLabel('sleep'); // "Sleep"
const hasWearables = categorySupportsWearables('sleep'); // true
```

## Assessment System

Assessments are category-specific questionnaires. Key concepts:
- **Composite Score**: Normalized 0-100 score from all questions
- **Primary Score**: Key metric for headlines
- **Response Types**: scale_5, scale_10, frequency_5, etc.

```typescript
import { getAssessmentForCategory, calculateCompositeScore } from '@/lib/assessments';
```

## Styling Guidelines

### Tailwind CSS

- Use Tailwind utility classes directly
- Avoid custom CSS unless necessary
- Use design tokens from `tailwind.config.js`

### shadcn/ui Components

Located in `src/components/ui/`. Use these for consistent UI:
- Button, Card, Dialog, Input, etc.
- Import from `@/components/ui/[component]`

## Testing

Run builds to catch type errors:
```bash
npm run build
```

Use Playwright for E2E testing:
```bash
npx playwright test
```

## Common Patterns

### Adding a New Category

1. Add to `CATEGORIES` array in `src/lib/categories.ts`
2. That's it - everything else derives from this

### Adding a New Study Field

1. Add to `Study` interface in `src/lib/types/index.ts`
2. Update `studies-store.ts` if it affects state logic
3. Update relevant components

### Creating a New Feature

1. Start with types in `types/index.ts`
2. Add any shared state to appropriate store
3. Create components in `src/components/`
4. Add pages in `src/app/`

## Code Quality Checklist

Before committing:
- [ ] Types are imported from `@/lib/types`
- [ ] No duplicate type definitions
- [ ] No hardcoded category strings (use `CategoryValue`)
- [ ] Components are < 200 lines
- [ ] No magic strings for status values
- [ ] Build passes (`npm run build`)
