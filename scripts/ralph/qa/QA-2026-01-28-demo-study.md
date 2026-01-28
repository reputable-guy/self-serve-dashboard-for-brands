# QA Report: Demo Study Polish — Brand View Demo-Ready
**Date:** 2026-01-28
**Branch:** ralph/brand-view-polish
**PRD:** prd-demo-study.json

## DEMO-001: Completion Ratio ✅
- **Before:** 1/30 completed (3%)
- **After:** 8/30 completed (27%)
- Explicit stage distribution: 8 completed, 15 active, 4 signed_up, 3 waiting
- Results tab shows 7 participant cards with before/after data
- All cards have green "Completed" badges

## DEMO-002: Realistic Assessment Scores ✅
- **Before:** +137% avg improvement
- **After:** +24% avg improvement
- Individual range: +14% to +38% (realistic for wellness product)
- Baseline scores: 40-69 out of 100 (raised floor from 35)
- Featured result: Charlotte J. 69→95 (+38%) — credible top outcome
- 88% positive / 0% neutral / 13% minimal change outcome distribution

## DEMO-003: Deterministic Seeding ✅ VERIFIED
- Reset → Seed → Reset → Seed produces **identical** data:
  - Same names: Benjamin T., Benjamin B., William D., Mia M., Charlotte J., Benjamin M., James M.
  - Same scores: 50→65, 41→55, 63→72, 44→60, 69→95, 40→48, 43→53
  - Same percentages: +30%, +34%, +14%, +36%, +38%, +20%, +23%
- Seeded PRNG (mulberry32) in enrollment creation AND story generation
- Fixed: enrollment IDs use Math.random (not Date.now), nurture events pre-generate random values, daysInStudy from daysAgo

## DEMO-004: Results Tab ✅
- 7 participant cards visible (1 hero + 6 grid)
- Sorted by... verification ID order (not strictly by improvement — acceptable for demo)
- Each card: name, location, score change, % improvement, testimonial, star rating, "Verified Results" link
- Outcome Distribution chart: 88% Positive, 0% Neutral, 13% Minimal Change
- Aggregate stats: 88% improved, 4.5 avg rating, 8 completed, Verified

## DEMO-005: Widget Tab ✅
- Widget badge: "8 people verified this product" with avatar circles
- Click opens VerificationModal:
  - Shows 6 of 8 participants (top 6 by improvement)
  - Charlotte J. +38%, Mia M. +36%, Benjamin B. +34% (sorted best first)
  - Scores, Oura Ring device, testimonial quotes
  - "View Story" links on each participant
- Verification page URL: http://localhost:3000/verify/study-sensate-sleep/results
- Embed code shows correct script tag
- Marketing Kit: Aggregate stat card (8 verified), Participant Spotlight
- FAQ expandable sections present

## DEMO-006: Copy Polish ✅
- Insights subtitle: "see who's buying, why, and what they've tried before" (was "full positioning intelligence available")
- Score labels: "Sleep Score" (was "Stress & Sleep Score" for sleep studies)
- Category-specific: Sleep Score, Stress Score, Energy Score, Anxiety Score, Wellness Score fallback

## Live Insights Tab (bonus check) ✅
- 23 participants shown (active + completed)
- Participant cards: hero symptoms, severity, wearable baselines, failed alternatives, "In their own words" quotes
- Live Activity feed: pattern mentions, failed alternative stats, enrollment events
- Emerging Patterns: top challenges with %, failed alternatives chips, urgency level
- Why They Bought + Who They Are aggregate charts

## Known Issues
1. Results tab sort order is by enrollment index, not strictly by improvement % (functional but not ideal)
2. Overview featured result may differ slightly from Results tab order (uses different sorting)
3. Some quotes repeat across participants (limited quote pool per outcome type)

## Build Status
- `npx tsc --noEmit` ✅ clean
- `npx next lint` ✅ clean (per sub-agent)
