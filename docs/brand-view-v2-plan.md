# Brand View v2 — Iteration Plan

## Context
Built v1 shell + 4 tabs. Ran 4 sub-agent critiques (brand exec, sales rep, product, design). Founder calibrated the feedback: the buyer is a **curious brand founder willing to try**, not a skeptical enterprise VP. Journey/trust matters. FrontrowMD is the widget reference. Ship sleep-first.

---

## What The Critiques Got Right (Act On)

### 1. Before/After story should be more prominent
**Every critique flagged this.** The transformation story is the product's differentiator. Currently buried in Results tab (tab 3).
- **Fix:** Add a "Featured Result" card to the Overview tab. When completions exist, show the best before/after story alongside enrollment numbers. Journey + outcome together, not sequentially.

### 2. Demo should start at Day 28
**Every critique flagged this.** Empty states in a demo = empty restaurant.
- **Fix:** Wire the existing demo phase selector to the Brand View. Default demo opens at Day 28. Salesperson can optionally walk backward to show methodology.

### 3. Ship sleep category first
**Product + founder aligned.** Category adaptation (4 tiers × 4 tabs × 5 states) is scope death.
- **Fix:** Hard-code sleep/stress category language. Add category config later as a lightweight swap.

### 4. Widget already follows FrontrowMD model ✅
**Founder confirmed:** Widget component is already iterated and solid. Avatar stacks, named sources, "Verified by Reputable" attribution. No redesign needed — just fix prop wiring in the Brand View Widget Tab.

## What The Critiques Got Wrong (Park)

| Suggestion | Why Not Now | When |
|---|---|---|
| ROI/conversion dashboard | Chicken-and-egg: no data yet | After first brand completes a study |
| Ad/marketing asset export | Delight feature, not launch blocker | Phase 2, after validation |
| Quick brand personalization | Nice but adds complexity | After core flow is solid |
| Interactive data viz widget | FrontrowMD proves simple works | Revisit if widget underperforms |
| Competitive positioning built-in | Need brands first | After 3+ brands onboard |

## Concrete Changes (Priority Order)

### P0 — Must ship
1. **Overview tab: blend journey + featured result**
   - Keep hero numbers (enrolled, active, completed, study day)
   - Add "Featured Result" card below hero numbers when completions > 0
   - Shows best before/after with Oura data + quote
   - Empty state: "Your first verified result will appear here"

2. **Wire demo phase selector to Brand View**
   - Brand View respects the study's demo state (Day 0/1/14/28)
   - Default demo starts at Day 28 for sales flow
   - All tabs populate accordingly
   - Data comes from SIMULATION PIPELINE (enrollment store + baseline generator + story generator)
   - NOT from Sensate's limited real data — demo must show FULL collection capability
   - Simulated data already includes: pain stories, villain products, hero symptoms, buying decisions, baseline assessments, wearable metrics, testimonials

3. **Fix widget tab prop wiring**
   - Widget component is already well-designed (FrontrowMD-inspired, iterated)
   - Bug was wrong props in Widget Tab: passed `studyId` instead of `participantCount`, `studyTitle`, `onOpenModal`
   - Fix: pass correct props from simulation data into existing FloatingBadgeWidget

### P1 — Should ship
5. **Widget tab: improve product page preview**
   - Widget component is solid — make the mock product page more realistic
   - Add FAQ accordion to the tab (not widget): "How was this study conducted?", "Who are the participants?", "How is data verified?"
   - Keep embed code section

6. **Results tab: hero the transformation**
   - Large before/after delta (48pt green text, not buried)
   - Photo/avatar + name + location + Oura-verified badge
   - Star rating + testimonial quote
   - Make it visually obvious this isn't a text review

7. **Insights tab: reduce scroll at n=10+**
   - 2-column layout for aggregate charts
   - Story cards in compact grid, not carousel

### P2 — Nice to have
8. Overview tab: "How It Works" collapsible methodology section
9. Export/share: downloadable results summary card (social-ready image)
10. Live activity feed animation (subtle pulse/fade-in for new enrollments)

---

## Implementation Order

**Round 1 (now):** P0 items 1-4 — make the Brand View actually useful with real data
**Round 2:** P1 items 5-7 — polish the key selling screens
**Round 3:** P2 items 8-10 — delight features

---

## Sub-Agent Learnings (For Next Iteration)

### What worked
- 4 perspectives surfaced blind spots the builder wouldn't catch
- Convergent findings (3+ critiques agree) = high-confidence signals
- Divergent findings revealed assumptions about buyer persona

### What to improve next time
1. **Give sub-agents the ACTUAL buyer persona.** All 4 assumed a skeptical enterprise buyer. The real buyer is a curious brand founder willing to experiment. Next time, include: company stage, buyer type, risk tolerance, competitive landscape.

2. **Give sub-agents the competitive reference.** The FrontrowMD screenshot would have prevented the "widget looks like SSL cert" critique. Show them what the founder is modeling after.

3. **Ask sub-agents to rank by company stage.** "What matters at 0-5 customers? At 5-20? At 20-100?" Forces them to think in phases, not ideal state.

4. **Run a synthesis agent after critiques.** Instead of dumping 4 raw critiques, run a 5th agent that reads all 4 + founder context and produces a prioritized, conflict-resolved plan. This prevents Frankenstein.

5. **Fewer agents, more targeted.** 4 was too many for this scope. Next time: 2 critiques max (the two most relevant perspectives), then founder review, then plan.
