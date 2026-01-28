# Sales Rep Critique: Brand View PRD

*Written from the perspective of someone who demos this platform 5× daily to DTC wellness brand executives.*

---

## Executive Summary

This PRD is a **solid B-**. The architecture is clean, the progressive disclosure concept is smart, and the component structure is engineer-heaven. But I'm not selling to engineers. I'm selling to a VP of Marketing at a collagen brand who has 10 minutes and a Calendly link to their next meeting. This PRD has at least **8 specific problems** that would cost me deals.

---

## Problem #1: The "Aha Moment" Comes Way Too Late

**Severity: DEAL-KILLER**

The tab order is: Overview → Live Insights → Results → Widget.

Overview is **numbers**. Enrolled: 47. Active: 23. Complete: 8. Cool. The exec nods politely. Energy: flat.

The actual "holy shit" moment — the Before/After card where Sarah M. went from Sleep Score 61 → 78 with a tearful quote — is buried in the **third tab**. That's 4-5 minutes into a 10-minute demo. By then, half my prospects are checking Slack under the table.

**What I need:** The Before/After card IS the product. Lead with it. I should be able to show a prospect a jaw-dropping transformation story within the first 90 seconds. The current flow is: context → context → more context → finally the thing that matters. That's a documentary structure. I need a movie trailer structure: **the best scene first, then explain how we got there.**

The PRD even calls `BrandBeforeAfterCard` "THE money component" — then buries it on the third tab. You named the problem and didn't fix it.

---

## Problem #2: No "Live Demo Magic" — Everything Is Static Snapshots

**Severity: HIGH**

The demo phases are Day 0, Day 1, Day 3, Day 28. I click a phase, the data loads. But there's no **motion**. No moment where the prospect watches something happen in real-time.

The best SaaS demos have a "watch this" moment. Gong has the "see this call being analyzed in real-time." Figma has "now watch me drag this." Here, I click "Day 1" and data appears. I click "Day 28" and more data appears. It's a slideshow.

**What I need:** A "simulate enrollment" button that I can click *during* the demo — and the prospect **watches** a new participant card animate onto the screen with their story, the counter ticks up, the timeline updates, a notification slides in. That 3-second animation is worth more than every static chart combined. The PRD mentions `simulateBatch()` but only for pre-loading phases. Give me a "drip" mode where I add one participant at a time with visible, delightful transitions.

---

## Problem #3: The Progressive Disclosure Story Is Actually Hard to Narrate

**Severity: HIGH**

The PRD thinks Day 1 → Day 28 is a clean narrative arc. It's not. Here's what actually happens when I try to tell it:

- **Day 0:** "So here's what it looks like before anyone enrolls." (Prospect: "Okay, it's empty.")
- **Day 1:** "Now we have 3 people." (Prospect: "Okay...")  
- **Day 3:** "Now we have 12 and patterns are emerging." (Prospect: "When do I see results?")
- **Day 28:** "HERE are the results!" (Prospect: "Finally.")

The middle phases (Day 1 and Day 3) are **boring in a demo context**. They're exciting in real life — when you're a brand exec checking your dashboard every morning. But in a 10-minute demo, "here's what 3 participants looks like" and "here's what 12 participants looks like" are not meaningfully different enough to justify two separate stops.

**What I need:** Collapse to **two phases**: "Here's what it looks like on Day 3 (study is running, stories are coming in)" and "Here's what it looks like on Day 28 (results are in, widget is ready)." Day 0 is boring — skip it. The 4-phase walk-through is an engineering demo, not a sales demo. I need fewer stops, more impact per stop.

---

## Problem #4: No Competitive Positioning Ammunition

**Severity: HIGH**

When a prospect says "We already use Yotpo for reviews" or "We have a Trustpilot badge," I need the dashboard itself to visually demonstrate why this is different. Right now, the Results tab shows before/after data — great — but there's no visual or verbal framing that positions this against alternatives.

The Verification badge says "✓ Verified by Reputable" but doesn't **contrast** against unverified alternatives. The widget preview shows our badge on a product page, but doesn't show what the competitor badge looks like next to ours.

**What I need:** A "Why This Is Different" moment, either:
- A comparison view: "Here's a Yotpo review. Here's a Reputable verified study result. See the difference?" Side-by-side mock.
- A credibility score breakdown: "Reviews: self-reported subjective. Reputable: objective wearable data + independent verification + controlled study design."
- The widget tab should show our badge **replacing** a generic review widget, not floating in isolation.

Without this, every competitor objection becomes a conversation I have to carry myself. The product should answer it for me.

---

## Problem #5: The Widget Tab Is an Anti-Climax

**Severity: MEDIUM-HIGH**

The demo ends on the Widget tab. Copy-paste embed code. A 3-step install guide. This is the last thing the prospect sees before I ask for the sale.

That's like ending a movie with the credits. The Widget tab is **operational** — it's telling the prospect about implementation. At the moment I need them to feel maximum desire, I'm showing them a `<script>` tag.

**What I need:** The demo should end on **ROI and emotion**, not implementation details. Either:
1. Move Widget before Results (so we end on the "holy shit" results moment), or
2. Add a "What Happens Next" / closing CTA section after Widget that re-shows the hero stats and says "Ready to run your study?" with a big, beautiful sign-up flow.
3. Better yet: the Widget tab should lead with "Here's what your customers will see on your product page" (emotional) and only show the embed code if they scroll or click "How do I install this?"

The Widget tab as specced is 50% embed code and verification URLs. That's a post-sale concern. Pre-sale, I need them drooling over how this looks on *their* product page.

---

## Problem #6: No Brand Personalization in the Demo

**Severity: MEDIUM-HIGH**

I demo 5 brands a day. Each one is different: sleep supplements, energy powders, stress adaptogens, collagen, mushroom blends. But the demo shows... "Study Name" with a generic brand logo placeholder.

Can I quickly swap in the prospect's actual brand name, logo, and product? The PRD mentions `brand?: { id: string; name: string; logoUrl?: string }` as an optional prop. **Optional.** That means no one will build the fast-swap UI.

**What I need:** A 60-second demo prep flow where I type the brand name, paste a logo URL, select the category (sleep/energy/mood/skin), and the entire demo populates with their branding. The widget shows THEIR product. The hero stats reference THEIR category. When the prospect sees their own name and logo on the dashboard, it stops being "a platform I'm evaluating" and becomes "my study." That's the difference between a 20% and a 60% close rate.

---

## Problem #7: The "Honest Imperfection" Principle Will Confuse Prospects

**Severity: MEDIUM**

The PRD says: "Include neutral/negative results. A study where everyone improves 30%+ feels fake." Design Principle #4: "Honest Imperfection."

I get the intent. Credibility. But in a 10-minute demo, when I show Mike R. with "+6% Sleep Score" and "Mixed results" and ⭐⭐⭐, the prospect WILL ask: "So what if our product doesn't work?" And now I'm spending 2 minutes managing anxiety about negative outcomes instead of selling.

**What I need:** The demo data should be credible but net-positive. Don't include outright failures. Include one "moderate improvement" participant (not "mixed results" with 3 stars). The word "neutral" should never appear in demo data. Frame it as "Some participants saw dramatic improvement, others saw gradual improvement" — never "some saw no improvement." Save the honest imperfection for the real study. In the demo, I need every data point to be defensible, not anxiety-inducing.

Or — if you insist on including mediocre results — give me a talk track. A tooltip that says "88% of participants saw meaningful improvement." Let me contextualize the outlier without the prospect spiraling.

---

## Problem #8: No Mobile Demo Path

**Severity: MEDIUM**

The responsive section says "Mobile: Single column, story cards full width." That's layout. But half my demos happen on Zoom where the prospect is watching on a laptop, and sometimes they ask to see it on their phone ("Our customers shop on mobile — how does the widget look?").

The PRD has no concept of a mobile demo flow or a shareable demo link I can text/email before the call. I can't send a prospect a link to explore on their own. "View as Brand" lives behind admin auth.

**What I need:** A shareable, public demo URL. Something like `demo.reputable.health/sleep-study` that I can drop in a pre-call email: "Check this out before our call tomorrow." This gives the prospect context before I even show up, and it lets me demo on any device.

---

## Screens I Would Skip

1. **Overview tab** — Boring. Numbers without context. I'd flash it for 15 seconds max then immediately go to Insights or Results.
2. **Day 0 phase** — "Here's an empty dashboard" is never compelling. Start at Day 1 minimum.
3. **Widget embed code section** — Post-sale. Skip in demo, mention it verbally.
4. **Aggregate demographics panel** (age distribution, baseline scores) — Too analytical for a brand exec. They care about stories, not histograms.

---

## What Makes Me Confident This Could Sell

1. **The Before/After card is genuinely powerful.** Objective wearable data + emotional quote + star rating + verification link. If this is polished, it's a killer.
2. **The progressive disclosure concept is right for the real product.** A brand exec logging in on Day 3 vs. Day 14 vs. Day 28 and seeing the study come alive — that's sticky.
3. **Category adaptations are smart.** Being able to demo sleep vs. energy vs. mood without switching products shows platform maturity.
4. **Read-only is correct.** No accidental button clicks during a demo. Clean.

---

## What Makes Me Nervous

1. **No ROI framing anywhere.** How much does a study cost? What's the conversion lift from having a Reputable badge? If the prospect asks "what's the ROI?" I have nothing on screen to point at.
2. **No social proof in the demo itself.** Which brands have already done this? If I can't namedrop, at least show "Join 30+ brands using Reputable" somewhere.
3. **7 implementation days before I can demo.** The implementation order says Day 1-6 for a full demo. That's an engineering timeline, not a sales emergency. If I need this next week, I'm screwed.
4. **Demo phase switching is admin-only.** If my internet hiccups and the admin sidebar flashes on screen during a demo, I've broken the immersion. Phase switching should work via keyboard shortcuts invisible to the audience.

---

## The One Thing That Would Double My Close Rate

**A 60-second brand customization flow.**

Before every demo, I type the brand name, paste their logo, select their category, and optionally paste their product page URL. The entire Brand View populates with:
- Their logo in the header
- Their category's metrics (sleep/energy/mood)
- Their product in the widget mock-up (screenshot of their actual PDP)
- Their brand name in all copy ("Your SleepWell Study" not "Study Name")

When a prospect sees **their own brand** inside the platform, it's no longer a pitch. It's a preview of their future. That emotional shift — from "evaluating a vendor" to "imagining my study" — is the single highest-leverage thing you could build for sales.

Every enterprise SaaS company that figured this out (Gong, Chorus, Clari) saw demo-to-close rates jump. It's not a feature. It's the feature.

---

## Summary: Top 5 Changes (Priority Order)

| # | Change | Impact | Effort |
|---|--------|--------|--------|
| 1 | Lead with Before/After card, not Overview numbers | Close rate +15% | Low (reorder tabs or add hero card to Overview) |
| 2 | 60-second brand customization flow | Close rate +25% | Medium (UI for name/logo/category swap) |
| 3 | Live "add participant" animation during demo | Demo engagement +40% | Medium (animate simulateEnrollment) |
| 4 | Collapse demo to 2 phases instead of 4 | Narrative clarity +50% | Low (reduce phase presets) |
| 5 | End demo on ROI/emotion, not embed code | Urgency to buy +20% | Low (reorder or add closing section) |

---

*Written by someone who will be on the hook for quota when this ships. Please listen.*
