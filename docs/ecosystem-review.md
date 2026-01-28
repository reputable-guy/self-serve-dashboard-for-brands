# Reputable Ecosystem Review

*Reviewed: January 28, 2026*

## Overview

Reputable has **three main codebases**:

| Component | Stack | Purpose |
|-----------|-------|---------|
| **Clinical Dashboard** | Next.js 14, Prisma, Auth0 | Internal tool for running rigorous studies, nurturing participants, reporting |
| **Mobile API** | Fastify, TypeScript, Prisma | Backend for mobile app - auth, data, wearables |
| **Mobile App** | React Native 0.76.7 | Participant experience - onboarding, check-ins, insights |

Plus the **Self-Serve Dashboard** (what we reviewed yesterday) — a new frontend for brand self-service.

---

## Architecture Summary

### Clinical Dashboard (`reputable-dashboard-develop`)

**Tech:** Next.js 14, Prisma ORM, Auth0, SendGrid, Twilio, Firebase

**Architecture:**
```
Components → Services ("use server") → Repositories → Prisma
```

**Status:**
- ~10% migrated to clean architecture
- Legacy `db.ts` has 2,175 lines of raw SQL
- Chat/Notifications fully refactored ✅
- Remaining ~100 functions need migration

**Key Features:**
- Study creation and management
- Participant monitoring (compliance, calendar view)
- Chat with participants
- Nurture email system
- Feedback collection
- Skin image analysis (for skin studies)
- Video testimonial requests

### Mobile API (`reputable-mobile-api-main`)

**Tech:** Fastify, TypeScript, Prisma, Awilix (DI), Vitest

**Architecture:**
```
Routes → Handlers → Services → Repositories → Prisma
```

**Well-structured with:**
- Dependency injection via Awilix
- Auto-discovered modules
- Zod validation
- Docker Compose for local dev
- Test coverage

**Key Modules:**
- User management
- Study/Experiment management
- Form responses (check-ins)
- Wearable metrics
- Heartbeats (rewards system)
- Daily instructions
- Survey reminders

### Mobile App (`reputable-mobile-master`)

**Tech:** React Native 0.76.7, TypeScript, Zustand, React Query

**Architecture:** Feature-Sliced Design
```
shared/ → features/ → widgets/ → screens/ → navigation/
```

**Wearable Integration:**
- Uses **Vital** (`@tryvital/vital-health-react-native`) — NOT Junction
- Supports: Oura, Whoop, Garmin, Fitbit, Apple Health
- OAuth flow via Vital's hosted link

**Key Features:**
- Study onboarding
- Daily check-ins
- Insights dashboard
- Wearable connection
- Rewards/Heartbeats system
- In-app chat
- Video testimonial capture

---

## Data Model (Prisma Schema)

### Core Entities

```
Experiment (Study)
├── ExperimentDesign (configuration, questions, rewards)
├── ExperimentCode (admin/participant codes)
├── ExperimentCompliance (per-user tracking)
├── DailyInstructions
└── ExperimentResource (links, docs)

User (Participant)
├── FormResponses (check-in data)
├── UserMetrics (wearable data)
├── Onboarding (progress)
├── HeartbeatTransactions (rewards)
└── Feedback

HeartbeatCatalogue (reward items)
HeartbeatTransactions (earned points)
```

### Key Fields on ExperimentCompliance

- `daysTagged` / `daysMissed` — compliance tracking
- `completed` — study completion flag
- `testimonial_request` — "Not Requested" | "Requested" | "Received"
- `testimonial_url` — VideoAsk link
- `assignedRctArm` — for randomized controlled trials

### Key Fields on ExperimentDesign

- `baselineDaysRequired` — days before intervention (default 30)
- `heartbeatsEnabled` — rewards system toggle
- `wearable` — array of supported devices
- `video_ask_link` — for testimonial capture
- `category` / `subcategory` — sleep, stress, etc.
- `rct` — randomized controlled trial flag
- `rct_arm` / `rct_group_names` — for RCT configuration

---

## Wearable Integration Details

**Provider:** Vital (tryvital.io) — not Junction as mentioned earlier

**Supported Devices:**
- Oura
- Whoop v2
- Garmin
- Fitbit
- Apple Health Kit

**Flow:**
1. User selects device in app
2. App calls API to generate Vital OAuth link
3. User completes OAuth in browser
4. Callback redirects back to app
5. Vital syncs data to Reputable backend

**Apple Health:** Direct integration via `@tryvital/vital-health-react-native`

---

## How Self-Serve Connects

The **Self-Serve Dashboard** is designed as a simpler frontend that will eventually connect to the same backend:

| Self-Serve Need | Existing Backend Support |
|-----------------|-------------------------|
| Study creation | ✅ `ExperimentDesign` model |
| Enrollment tracking | ✅ `ExperimentCompliance` model |
| Participant check-ins | ✅ `FormResponses` model |
| Wearable data | ✅ `UserMetrics` model |
| Email nurturing | ✅ SendGrid integration exists |
| Testimonials | ✅ VideoAsk integration exists |

**Gap:** Self-Serve currently uses localStorage. To connect:
1. Add API routes to Mobile API (or create new API)
2. Auth for brand users (separate from Auth0 participant auth?)
3. Brand-to-study association (multi-tenant)

---

## Observations & Recommendations

### What's Working Well

1. **Mobile app architecture** — Feature-Sliced Design is clean and scalable
2. **API structure** — Fastify + Awilix is well-organized
3. **Wearable integration** — Vital handles the complexity
4. **Data model** — Comprehensive, supports RCTs, rewards, compliance

### Areas for Improvement

1. **Clinical Dashboard legacy code** — 2,175 lines in `db.ts` needs migration
2. **Two dashboards** — Clinical vs Self-Serve could share components
3. **No brand auth** — Self-Serve needs brand user management
4. **Testimonial video quality** — Known challenge, consider alternatives

### Self-Serve Integration Path

**Option A: Connect to existing Mobile API**
- Add brand auth layer
- Add brand-facing endpoints
- Reuse existing Prisma models
- Pros: Single backend, shared data
- Cons: Mobile API not designed for brand users

**Option B: New API for Self-Serve**
- Dedicated Next.js API routes
- Same database, different access patterns
- Brand-specific auth (Clerk?)
- Pros: Clean separation, optimized for brand UX
- Cons: Two backends to maintain

**Recommendation:** Option B for MVP, merge later if needed

---

## Testing Strategy (Based on Research)

Given the codebase:

### Mobile App (Highest Priority)
- **Framework:** Maestro (YAML-based, cross-platform)
- **Critical Flows:** Onboarding, Check-in, Wearable connection
- **CI:** Maestro Cloud ($49/mo) to avoid local simulator pain

### Mobile API
- **Framework:** Already using Vitest ✅
- **Add:** Integration tests with test database
- **Add:** API contract tests

### Clinical Dashboard
- **Framework:** Playwright for E2E
- **Priority:** Participant management, study creation
- **Add:** Visual regression for data displays

### Self-Serve Dashboard
- **Framework:** Playwright (matches clinical dashboard)
- **Priority:** Study creation flow, enrollment tracking

---

## Files for Reference

```
reputable-ecosystem/
├── reputable-dashboard-develop/    # Clinical Dashboard
│   ├── ARCHITECTURE.md             # Clean architecture guide
│   ├── prisma/schema.prisma        # Shared with API
│   └── src/
│       ├── services/               # Business logic
│       ├── repositories/           # Data access
│       └── actions/db.ts           # Legacy (2,175 lines)
│
├── reputable-mobile-api-main/      # Backend API
│   ├── CLAUDE.md                   # Dev guide
│   └── src/
│       ├── modules/                # Feature modules
│       ├── database/prisma/        # Schema + repos
│       └── tests/                  # Vitest tests
│
└── reputable-mobile-master/        # Mobile App
    ├── CLAUDE.md                   # Dev guide
    ├── UI-DESIGN-SYSTEM.md         # Design system
    └── src/
        ├── features/               # Business logic
        ├── screens/                # UI screens
        └── shared/                 # Common utilities
```
