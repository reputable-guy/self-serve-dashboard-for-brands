# Brutal Product Critique: Brand View PRD

*Written by: Skeptical Product Advisor*
*Date: 2025-07-16*

---

## TL;DR

You're building a 28-component, 7-phase, 6-day project for a **demo tool** while the founder explicitly said "managed service first." This PRD is a beautifully written monument to over-engineering. It reads like the product team fell in love with progressive disclosure and forgot to ask: **"Would a brand exec actually log into this more than twice?"**

The demo-experience-spec has the right instinct (10 minutes, 5 beats, simple). The PRD then ignores that instinct and inflates it into a full product surface. These two documents are at war with each other.

---

## 1. Are We Building the Right Thing?

**No. We're building two things and pretending they're one.**

The PRD conflates two very different needs:
- **Need A:** A demo tool for sales reps to close deals (used 2-3x/week by 1-2 people)
- **Need B:** A dashboard for brand execs to check on their live study (used maybe 1x/week by 1 person)

These have WILDLY different requirements. A demo tool needs to be scripted, controlled, impressive. A live dashboard needs to be simple, real-time, and work with messy real data.

The PRD tries to build one UI that serves both. This is how you end up with a thing that's mediocre at both.

**The hard question nobody's asked:** Has a single brand executive ever said "I wish I had a dashboard to watch my study progress"? Or is this something we *think* they want because it sounds cool?

If this is a managed service, the brand exec gets an **email update** every week and a **PDF report** at the end. They don't log into dashboards. They're busy running a brand.

---

## 2. 28 Components Is Insane for an MVP

Let's count what the PRD actually specifies:

| Category | Components | Really Need? |
|----------|-----------|-------------|
| Shell/Nav | 5 (shell, header, tabs, footer, types) | Yes, but could be 2 |
| Overview | 5 (tab, hero numbers, timeline, activity, quote) | 2 would do |
| Insights | 8 (tab, waiting, carousel, card, timeline, patterns, aggregate, progress) | 3-4 max |
| Results | 6 (tab, hero stats, before/after, distribution, testimonial grid, waiting) | 2-3 max |
| Widget | 5 (tab, preview, embed, verify, steps) | 2 max |

That's **29 new files** plus modifications to existing ones. For what the demo spec describes as a "10-minute walkthrough."

**What you actually need to sell:**
1. A clean page with 3 hero numbers
2. 3-5 story cards that make the exec feel something
3. One killer before/after card with wearable data
4. A widget preview on a mock product page

That's **4 components**, not 28. Everything else is decoration.

---

## 3. The Riskiest Assumption

**"Progressive disclosure is the narrative"** — Design Principle #2.

This assumes brand execs will:
1. Log in at n=0 and feel excited about an empty state
2. Come back at n=3 and notice the patterns emerging
3. Return at n=10 and appreciate the aggregate charts
4. Check again at completion and see the full picture

**This will never happen.** Brand execs will:
1. See the demo (controlled by sales rep)
2. Maybe check once during the study ("is this thing running?")
3. Want the final report emailed to them

Progressive disclosure is a *developer's fantasy* about how users engage with data. Real brand execs have 47 tabs open and are in back-to-back meetings. They're not watching data trickle in like it's a Netflix series.

The only person who experiences "progressive disclosure" is the **sales rep** clicking through demo phases. And for that, you don't need 8 insight components — you need 4 slides.

---

## 4. Is the Demo Flow Compelling or Overthought?

**The demo-experience-spec is actually great.** Five beats, clear emotional arc, knows what to cut. 

**Then the PRD took that spec and gold-plated it.** 

The spec says "3-4 hero numbers." The PRD builds a phase-dependent hero number system with 4 different states (pre-launch, early, mid, completed) each showing different metrics. For a demo where the sales rep controls exactly what phase they're in.

The spec says "show 3-4 story cards." The PRD builds a horizontal carousel with a progress bar, a waiting state component, a separate patterns card, an aggregate panel, and a quote carousel that activates at n≥15. 

**Overthinking alert:** The "BrandWaitingState" component that shows "what you'll see" when n=0 — when would a brand exec EVER see this? If it's a demo, the sales rep skips past n=0 in 30 seconds. If it's a real study, the brand doesn't get access until enrollment starts. You're building a component for a state nobody will ever genuinely experience.

---

## 5. What a Competitor Does in 2 Weeks

A competitor doesn't build a dashboard. They build a **Loom video** showing the results.

Seriously. If you're a competitor watching Reputable:
1. Run a quick study (recruit 20 people via UserTesting.com or similar)
2. Collect wearable data via Oura/Whoop APIs
3. Generate a beautiful PDF report with before/after data
4. Record a 5-minute Loom walking through it
5. Send it to the brand with "Here's your study results. Want to put this on your product page?"

Total build time: 2 weeks. Total components: 0. 

They skip the dashboard entirely because **brands don't want dashboards, they want proof.** A PDF with verified results and a widget embed code is 90% of the value.

This is the fundamental risk: you're building an interactive experience when the customer might just want a deliverable.

---

## 6. "Cool Demo" vs "Thing Brands Use Daily"

**This PRD is 100% optimized for "cool demo."**

Evidence:
- "The emotional core of the demo" (Section 4.2)
- "THE money component" (Section 4.3)  
- "The credibility moment" (Section 4.3)
- "The action moment" (Section 4.4)
- 4 demo phases with a phase selector
- Empty states designed to "feel alive from Day 1"

**What's missing for daily use:**
- No notifications or alerts ("Sarah just completed her study!")
- No email/Slack integration
- No "here's what changed since last time you logged in"
- No export/download/share
- No role-based access (who at the brand can see what?)
- No way for brands to actually DO anything

It's a read-only view with no actions. Read-only views that brands access themselves have zero stickiness. They look once, maybe twice, then wait for the email summary.

**The honest answer:** This is a sales tool disguised as a product feature. That's fine — but call it what it is and scope it accordingly.

---

## 7. What Takes 3x Longer Than Expected

### Category Adaptations (Section 9)
The PRD casually describes a 4-tier category system where every component behaves differently based on whether it's sleep vs. energy vs. skin. This is presented as a "utility function" but it's actually **4 different product experiences** sharing a component shell.

Testing matrix: 4 tiers × 4 tabs × 4-5 progressive disclosure states × 2 data modes (real/demo) = **~120 distinct states to verify**. Each one needs to look right.

This alone could eat 3 days.

### The Before/After Card (Section 4.3)
The PRD specifies two variants (featured/compact), responsive behavior across 3 breakpoints, category-adaptive metric display, optional testimonials, verification links, star ratings, and an animated change bar chart. 

This is a mini-application, not a component. Getting it to look "premium" (Design Principle #5) across all states and screen sizes will take longer than the entire Overview tab.

### Demo Phase Control (Phase 7)
Resetting enrollment stores, batch-simulating data, updating study metadata, and ensuring all derived state recomputes correctly is integration testing hell. Every time you add a component, you need to verify it works across all 4 demo phases.

### "Instant" View Switching
"View switching between Admin ↔ Brand is instantaneous (no page reload)" — this means both views need to be in memory simultaneously, sharing stores but rendering completely different UI trees. Edge cases around store hydration, URL state, and tab memory will add time.

---

## 8. The ABSOLUTE MINIMUM That Sells (Real Phase 1)

**Ship in 3 days. Four screens. No progressive disclosure.**

### Screen 1: Brand Overview
- Study name + status badge
- 3 numbers: Enrolled, Active, Completed
- One featured quote
- That's it. One component.

### Screen 2: Participant Stories  
- Vertical list of 3-5 story cards (NOT a carousel — carousels are fiddly)
- Reuse existing `ParticipantStoryCard` with zero modifications
- Show for the demo phase only (Day 3 / Day 28 — skip n=0 and n=1 states entirely)

### Screen 3: Results
- One `BrandBeforeAfterCard` — featured variant only
- 3 hero stat numbers hardcoded above it
- A simple list of 2-3 more compact stories below
- Skip outcome distribution, skip testimonial grid

### Screen 4: Widget
- Reuse existing `FloatingBadgeWidget` as-is
- Embed code in a `<pre>` block with a copy button
- A link to the verification page
- Skip the mock product page context (fancy but not necessary)

### Glue
- `BrandViewShell` with a header, 4 tabs, and a "Back to Admin" button
- Hard-code it to show Day 28 demo data only. Skip the phase selector.

**Total new components: ~8-10.** Not 28.

**What you're cutting:**
- All empty/waiting states (nobody sees these)
- All progressive disclosure logic (premature optimization)
- Category adaptations (just do sleep first)
- Demo phase selector (just show the end state)
- Horizontal carousel (use a simple list)
- Aggregate panel, patterns card, quote carousel (nice-to-have)
- Outcome distribution bar (nice-to-have)
- Mock product page wrapper (nice-to-have)
- Brand study timeline (nice-to-have)
- Latest activity feed (nice-to-have)
- Progress bar (nice-to-have)

---

## 9. The Managed Service Contradiction

The demo-experience-spec literally says the close is:

> "We set up your study (we do this). You email your customers this link. Results in 4-6 weeks."

And the PRD's stated purpose is:

> "Brand View is the 10-minute demo that sells Reputable."

So the thing being sold is: **we do everything for you.**

But the thing being built is: **a self-serve dashboard where you can watch your study.**

These are contradictory value propositions. If Reputable is a managed service, the brand doesn't need a dashboard. They need a sales demo, a weekly email update, and a final report.

Building a full Brand View with 4 tabs and progressive disclosure signals "self-serve platform" — exactly the opposite of what the founder is selling.

**The dangerous implication:** When the sales rep shows this polished dashboard, the brand exec might think, "Great, so I have to log in and manage this?" — which is the OPPOSITE of the intended message.

**What actually aligns with managed service:**
1. A read-only demo mode (sales tool only — never given to brands)
2. A PDF/email report generator (what brands actually receive)
3. The embeddable widget + verification page (the deliverable)

Building a Brand View the exec "can log into themselves during a live study" is building for a self-serve future that isn't today's business model.

---

## 10. What to Cut to Ship in 3 Days

Starting from the PRD's 7 phases:

| PRD Phase | Days | Cut? | Why |
|-----------|------|------|-----|
| Phase 1: Shell & Nav | 1 | **Keep but slim** — 3 components, not 5 |
| Phase 2: Overview | 0.5 | **Keep but minimal** — hero numbers + quote, skip timeline/activity |
| Phase 3: Live Insights | 1.5 | **Gut it** — story list only, no carousel/waiting/patterns/aggregate/progress |
| Phase 4: Results | 1 | **Keep core** — before/after card + hero stats, skip distribution/grid |
| Phase 5: Widget | 0.5 | **Keep but simple** — reuse existing widget, skip mock product page |
| Phase 6: Polish | 1 | **Cut entirely** — ship sleep only, polish later |
| Phase 7: Demo Phases | 1 | **Cut entirely** — hard-code Day 28 data |

**3-day plan:**
- **Day 1:** Shell + Overview + Story list (reuse existing cards)
- **Day 2:** Before/After card + Hero stats + Widget tab
- **Day 3:** Wire up demo data + view switching + basic testing

Ship it. Get feedback from actual sales calls. Then decide what Phase 2 is based on what the sales rep actually needs mid-demo, not what a PRD imagined they'd need.

---

## The Bottom Line

This PRD is technically excellent. The component architecture is clean. The data flow is well-thought-out. The category adaptation system is elegant.

**It's also about 3x more product than the problem requires.**

The demo-experience-spec understood the assignment: 5 beats, 10 minutes, make the exec feel something. Then the PRD turned that into a 1,150-line specification for 28 components with responsive breakpoints and 4-tier category adaptations.

Build the demo, not the dashboard. If brands actually start logging in (they won't for a managed service), you'll know what to add. If they don't, you saved 3 days.

**Ship the skeleton. Let reality tell you what's missing. Right now, your biggest risk isn't "not enough components" — it's "never shipping because the spec is too ambitious."**

---

## Appendix: Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Brand execs never log in | High | Low (sales tool still works) | Accept it. Build for sales. |
| Progressive disclosure feels empty | High | Medium | Skip it. Show Day 28 state. |
| Category adaptations delay launch | High | High | Ship sleep only. Add categories later. |
| Before/after card takes 2x expected | High | Medium | Ship featured variant only. Skip compact. |
| Demo phase control is buggy | Medium | High | Hard-code demo data. Skip phase selector. |
| "View switching" has edge cases | Medium | Low | Just use a URL param. Don't over-engineer. |
| Competitor ships PDF-based alternative | Medium | High | Ship faster. The dashboard is a moat only if it exists. |
| Founder changes mind about self-serve | Medium | High | Build modular. Don't couple demo and dashboard. |
