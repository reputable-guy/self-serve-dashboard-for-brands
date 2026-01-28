# UX Design Critique: Brand View PRD

*Reviewed by: UX Design Lead*
*Date: 2025-07-16*
*Verdict: Strong conceptual foundation. Serious execution gaps that will kill the demo.*

---

## Executive Summary

The PRD gets the *why* right — brand execs care about People, Proof, and Action. The information architecture is sound. The progressive disclosure model is the right instinct. But the actual component designs have **critical problems** that will undermine the emotional impact this view is supposed to deliver. The before/after moment — the single most important thing in this entire product — is buried under data noise. The participant stories read like database records, not human beings. And the widget preview will look like a wireframe, not a product page.

I found **9 specific design problems**, ranked by severity.

---

## Problem #1: The Before/After Card Is a Spreadsheet, Not a Story (CRITICAL)

**Where:** `BrandBeforeAfterCard` — Results Tab, Section 4.3

This is THE money component. The PRD literally calls it that. And yet the design is a **data table with a quote glued underneath.**

Look at the "featured variant" spec:

```
BEFORE (Baseline)       AFTER (Day 28)
Sleep Score: 61         Sleep Score: 78
Deep Sleep: 42m         Deep Sleep: 68m
RHR: 68 bpm             RHR: 62 bpm
Energy: 38/100          Energy: 71/100
```

This is how an engineer thinks about before/after. Two columns. Labels and numbers. The user's eye has to **do math** to feel the transformation. Nobody sitting in a demo is going to look at "42m → 68m" and feel something.

**What's missing:**
- No visual delta. No bars growing. No color shift from red to green. No animation.
- The change percentages (`+28%`, `+62%`) are shoved into a separate "Changes" section below the columns instead of being the HERO of each row.
- Four metrics shown equally. In reality, one metric matters most to each participant. Lead with it.
- The testimonial quote is at the bottom — after the user has already tuned out from 8 numbers.

**Fix:** The before/after card should feel like a **transformation story**, not a comparison table. Lead with the quote. Show ONE hero metric with a dramatic visual (animated gauge, big number flying up). Then reveal supporting metrics on hover or click. The delta IS the content — make it 48pt font, green, impossible to miss. Consider a horizontal bar that visually "grows" from the baseline to the result.

---

## Problem #2: Participant Story Cards Feel Like CRM Records, Not Humans (CRITICAL)

**Where:** `ParticipantStoryCard` (existing component, reused in Brand View)

The existing `ParticipantStoryCard` component was designed for the Admin View. It works there — admins need structured data. But wrapping it in a `BrandStoryCard` wrapper and calling it "brand mode" is a **category error.**

Look at what a brand exec sees:
- "10px uppercase tracking-wide" labels everywhere: `WHY THEY'RE TRYING YOUR PRODUCT`, `STRUGGLING FOR`, `ALREADY TRIED`, `URGENCY`, `HOPES TO ACHIEVE`, `SLEEP SCORE`
- A "Severity: 7.8/10" label under the quote
- A "DesperationGauge" component
- An archetype badge ("Seeking Help", "Optimizer")

**The problem:** This card has **nine distinct information zones** in the collapsed state. Nine! A brand exec doesn't need to know the participant's archetype classification. They don't need a "desperation gauge." These are researcher affordances leaking into a storytelling interface.

A human story needs: a face, a name, a struggle, and hope. That's it. Four things.

**What a brand exec actually needs to feel:**
> "Sarah M., 38, Portland — hasn't slept through the night in 3 years. She's tried CBD, melatonin, even Ambien. Nothing worked."

That's it. That's the story. Everything else is noise in Brand View.

**Fix:** `BrandStoryCard` should NOT be a wrapper around `ParticipantStoryCard`. It should be its own component with a fundamentally different information hierarchy:
1. Name + location (identity)
2. Quote (emotion) — BIG, readable, the centerpiece
3. "Tried X, Y, Z — nothing worked" (one line, not a grid)
4. One key number if relevant (Sleep Score: 61 — with context like "clinically poor")

Kill the urgency gauge, archetype badge, severity score, grid layout, and expand/collapse for Brand View. These are internal tools.

---

## Problem #3: The Live Insights Tab Will Be a Scroll Nightmare at n=10+ (HIGH)

**Where:** `BrandInsightsTab` — Section 4.2

At n=10+, this tab renders:
1. Story card carousel (horizontal scroll)
2. Live timeline (4 events)
3. Emerging patterns card
4. Notable quotes carousel (n≥15)
5. Top motivations bar chart
6. How long struggling bar chart
7. Age distribution panel
8. Life stage panel
9. Baseline score summary
10. Progress bar

That's **TEN distinct sections** stacked vertically. On a laptop screen during a video call (the stated use case), you're going to see maybe 2.5 of these at a time. The rest require scrolling. A sales rep scrolling during a demo while saying "and if we scroll down... and down a bit more..." is death.

The n=3-9 state is worse than n=10+ because the progress bar at the bottom ("5/10 toward full analytics") is frankly embarrassing to show a brand exec. "Your study isn't done yet" is not a confidence-building message during a demo.

**Fix:**
- At n=10+, use a **2-column layout**: stories + timeline on the left, patterns + aggregates on the right. Everything above the fold.
- Kill the progress bar entirely in Brand View. It's an admin affordance. A brand exec should never see "X/10 toward full analytics." Instead, label the patterns section "Early patterns (5 participants)" — the count is the context.
- Consider making the aggregate panels collapsible or behind a "See demographics" toggle. Not everyone cares about age distribution.

---

## Problem #4: The Widget Product Page Preview Will Look Fake (HIGH)

**Where:** `BrandWidgetTab` — Section 4.4

The PRD spec shows a "MOCK PRODUCT PAGE" with:
```
[Product Image]  Product Name
                 ⭐⭐⭐⭐⭐ (142 reviews)
                 $49.99
```

This is going to look like a wireframe from 2015. If the brand exec can't immediately see their Reputable badge on something that **looks like a real e-commerce page**, the "here's how it looks on YOUR site" moment falls flat.

The PRD mentions `BrandWidgetProductPage` but gives zero spec for how it should look. No Shopify template. No dark mode option. No product image placeholder strategy. This is a "mock product page context" — but what context?

**Fix:**
- Use a realistic e-commerce template. Steal the layout from a Shopify product page. Include a real-looking product image area (gradient placeholder with the brand's colors if no image available), realistic typography, an "Add to Cart" button, fake reviews section.
- Better yet: let the admin upload a screenshot of their actual product page and composite the widget onto it. This is a 10x improvement in perceived realism.
- At minimum, offer 2-3 template styles (Shopify, DTC minimal, Amazon-like) so it doesn't look like one generic wireframe for every demo.

---

## Problem #5: n=0 State Is Patronizing, Not Anticipatory (MEDIUM)

**Where:** `BrandWaitingState` / `BrandOverviewTab` n=0

The n=0 state shows:
> "The first participant story will appear here the moment someone enrolls."
> "What you'll see: • Real customer pain stories and quotes • What they've tried before..."

This reads like a **loading screen with a feature list.** It's the UX equivalent of "please hold, your call is important to us." For a product that costs $10K+ and promises to feel "alive from Day 1," showing a bullet list of upcoming features is a failure of imagination.

The existing `EarlyInsightsCard` n=0 state has the same problem — and includes a "Demo tip" about using the enrollment tab. That must NEVER appear in Brand View.

**Fix:** The n=0 state should feel like a countdown, not a placeholder. Options:
- Show a stylized enrollment link with a "Share this with your first customer" CTA (action-oriented, not passive)
- Show a blurred/ghosted example of what a story card will look like — visual anticipation, not verbal
- Show real-time enrollment link click data if available ("14 people have visited your enrollment page")
- Animate something. A subtle pulse, a countdown to study start date, anything that communicates motion.

---

## Problem #6: Typography Scale Creates Visual Monotony (MEDIUM)

**Where:** Across all components

The PRD uses `text-[10px] uppercase tracking-wide` for section labels throughout EVERY component. Look at the participant story card alone — it uses this pattern for:
- "Why they're trying your product"
- "Struggling for"
- "Already tried"
- "Urgency"
- "Hopes to achieve"
- "Sleep Score"
- "Baseline Wearable Data"

When everything is labeled the same way, nothing stands out. The typography creates a **flat information hierarchy** where every piece of data screams at the same volume. The 10px uppercase labels are also borderline illegible on lower-resolution laptop screens — which is exactly where this will be demoed (via screen share during a Zoom call, likely at 720p or 1080p with compression artifacts).

**Fix:**
- Establish 3 clear typographic levels: hero (the one thing that matters), supporting (2-3 context items), and detail (everything else, hidden by default).
- In Brand View specifically, cut the label count by 60%. Don't label things that are self-evident. If you show "Portland, OR" next to someone's name, you don't need an "LOCATION" label. If you show a quote in italics with quotation marks, you don't need a "WHY THEY'RE TRYING YOUR PRODUCT" label.
- Increase base font sizes for Brand View. Admin View's density works because admins are power users. Brand execs are scanning. Minimum 14px body, 16px for quotes, 32px+ for hero numbers.

---

## Problem #7: No Visual Breathing Room Between Sections (MEDIUM)

**Where:** `EarlyInsightsCard`, `BrandInsightsTab`

The existing `EarlyInsightsCard` uses `space-y-6` (24px) between major sections. For an admin tool, fine. For a premium demo experience targeting executives? This is cramped.

Every section bleeds into the next. Story carousel → timeline → patterns → quotes → charts → demographics → baseline scores. There's no moment where the eye rests. No visual separator that says "we're moving to a new chapter of this story."

During a demo, the sales rep needs natural pause points: "Here are the people... [pause] ...and here's what patterns are emerging... [pause] ...now let's look at the results." The current design offers no visual cues for these transitions.

**Fix:**
- Use `space-y-12` or even `space-y-16` between major sections in Brand View.
- Add subtle section dividers — not `<hr>` tags, but visual breathing room: a background color change, a gentle gradient shift, or a larger heading that acts as a chapter title.
- Consider a card-per-section approach where each major content block is its own elevated card, rather than everything living inside one mega-card.

---

## Problem #8: Hero Numbers Have No Emotional Weight (MEDIUM)

**Where:** `BrandHeroNumbers` — Overview Tab

The hero numbers are spec'd as:
```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐
│    47     │  │    23    │  │    8     │  │  +23%    │
│ enrolled  │  │  active  │  │ complete │  │  avg Δ   │
└──────────┘  └──────────┘  └──────────┘  └─────────┘
```

Four equal-sized boxes. Same visual weight. But these numbers are NOT equally important. "+23% avg improvement" is worth 100x more than "47 enrolled" to a brand exec. The operational numbers (enrolled, active, complete) are for admins. The brand exec cares about **one thing**: does my product work?

Yet the design gives all four numbers identical treatment.

**Fix:**
- Make the improvement stat the HERO: 3x larger, different background color (green gradient), maybe even animated on load.
- Group the operational numbers (enrolled/active/complete) into a single smaller "Study Progress" sub-section.
- Consider showing the improvement stat as a before→after: "Sleep Score: 61 → 78 (+23%)" with visual weight on the delta.

---

## Problem #9: No Mobile/Laptop Demo Consideration for Horizontal Carousels (LOW-MEDIUM)

**Where:** `BrandStoryCarousel` — Insights Tab

The story carousel uses horizontal scrolling (`overflow-x-auto`) with `340px`-wide cards. On a 13" laptop at native resolution, you'll see approximately 2.5 cards. The scroll affordance (scrollbar-thin) is nearly invisible on macOS.

During a screen-share demo, the sales rep will need to:
1. Know to scroll horizontally (no visual cue)
2. Actually perform the scroll gesture smoothly (trackpad swipe mid-presentation)
3. Hope the browser doesn't jitter or lag during scroll

Horizontal scroll carousels are notoriously bad for content you actually want people to see. They hide content behind a gesture that many users (especially older execs on desktop) don't intuit.

**Fix:**
- For n≤3, show all cards in a grid (no scroll needed).
- For n=4-5, use a 2-row grid or a "featured + thumbnails" layout.
- If you must use horizontal scroll, add explicit left/right arrow buttons (visible, large enough to click) and a dot indicator showing position.
- Add a "See all stories" link that opens a full-page grid view.

---

## The Single Biggest UX Improvement

**Redesign the Before/After Card from scratch.**

This is the component that sells Reputable. It's the "holy shit" moment. If a brand exec watches a demo and doesn't feel the transformation viscerally, the deal dies.

The current design is a data comparison table. It should be a **transformation narrative:**

1. **Open with the person** — photo placeholder, name, one-sentence context ("Sarah, 38, hadn't slept through the night in 3 years")
2. **Show the struggle** — their baseline number, big, red/amber, with human context ("Sleep Score: 61 — clinically poor")
3. **Reveal the transformation** — animate the number rising, green, celebration ("Sleep Score: 78 — healthy range ✓"). Make this a moment. A beat. Not just a second column.
4. **Let them speak** — the testimonial quote, large, centered, the emotional payoff
5. **Verify** — small "Verified by Oura data" badge + link. The credibility cherry on top.

The before/after should feel like a movie trailer, not a lab report. Right now it feels like a lab report.

---

## The Weakest Link Component

**`ParticipantStoryCard` reused in Brand View.**

It was designed for admins and it shows. Wrapping it won't fix the fundamental mismatch. Brand View needs its own story component — fewer data points, larger typography, quote-centric layout, no operational metadata (archetype, desperation gauge, severity scores). Build `BrandStoryCard` as a new component, not a wrapper. The PRD's instinct to "wrap" existing components is an engineering efficiency choice that will produce a mediocre design.

---

## Summary Scorecard

| Criterion | Score | Notes |
|-----------|-------|-------|
| Information hierarchy | 4/10 | Everything at equal volume. Hero content buried. |
| Visual density | 3/10 | Too much on Insights tab at n=10+. Cramped spacing. |
| Emotional resonance | 5/10 | Stories feel like data, not humans. Quote placement buried. |
| Before/after moment | 3/10 | Spreadsheet layout. No visual drama. No animation. |
| Progressive disclosure | 7/10 | Right instinct, but progress bar and n=0 state need work. |
| Widget preview | 4/10 | Will look like a wireframe without real product page context. |
| Typography & spacing | 4/10 | Monotonous 10px labels. Insufficient breathing room. |
| Laptop demo readiness | 5/10 | Horizontal scroll risky. Too much vertical scroll at n=10+. |
| **Overall** | **4.4/10** | Good architecture, weak visual execution. Needs a design pass. |

---

## What the PRD Gets Right

Credit where due:
- **Progressive disclosure model** is exactly correct. Showing different content at n=0, n=1, n=3, n=10 is smart.
- **4-tab structure** is clean and covers the right narrative arc (status → people → proof → action).
- **Category adaptation** via tier system is well-thought-out.
- **"Honest imperfection"** principle (showing neutral/negative results) is crucial for credibility.
- **Read-only constraint** is essential — no mode confusion.
- **Demo phase control** (Day 0/1/3/28 jumping) is a great sales enablement feature.

The bones are good. The skin needs surgery.
