# Brand Executive Critique: Brand View PRD

**Persona:** VP Marketing at a DTC sleep supplement brand. $5M revenue. We spend ~$1.2M/year on Meta ads. We have 4,200+ reviews on our Shopify store (4.3 stars). We've been pitched every review/UGC/social-proof tool on earth. I'm watching this demo with my arms crossed.

**Overall verdict:** This PRD is built by engineers who are excited about progressive disclosure and component architecture. It is NOT built by someone who has sat across from a skeptical brand exec and watched their eyes glaze over. There are at minimum 7 serious problems.

---

## Problem #1: Where's the Money Shot?

**The single most important thing is missing from the first screen.**

I sit down for a demo. You show me the Overview tab: enrolled count, active count, completed count, avg improvement percentage. Four boxes.

So what?

I have 4,200 reviews. I *know* my product works. I don't need you to tell me 47 people tried it. What I need to see **in the first 5 seconds** is something I *cannot get anywhere else*. That means:

- **Oura/Whoop verified data** — this is your entire differentiator and it's buried
- **A before/after comparison with device data** — THE thing that makes this not just another review platform
- **How this looks on my product page** — the end deliverable, the thing I'm paying for

Instead, you're showing me enrollment counts? I can get enrollment counts from a Google Form. The Overview tab as designed is a project management dashboard for *your* sales team, not a value prop for *me*.

**Fix:** The first screen should hit me with a single verified before/after story (the best one) + the widget as it would appear on MY product page. Lead with the output, not the process.

---

## Problem #2: "Meh, I Already Have Reviews" Risk is SKY HIGH

This PRD never once addresses the elephant in the room: **Why is this better than my existing reviews?**

I'm paying for Yotpo/Stamped/Judge.me. I have thousands of text reviews. Some have photos. My conversion rate on the PDP is 3.2%. Now you're telling me to also run a 28-day study with 47 people?

The PRD mentions "objective + subjective = credibility" in the appendix as a design principle, but the actual *screens* don't hammer this home. The wearable data is treated as one metric among many. It should be **the hero of every single screen.**

Where's the explicit comparison? Where's the moment in the demo where you show me:
- "Here's what a typical review looks like" (text, no verification, could be fake)
- "Here's what a Reputable result looks like" (wearable-verified, 28-day longitudinal, third-party confirmed)

That side-by-side is the "shut up and take my money" moment. **It's not in this PRD.**

**Fix:** Add an explicit "Why This Is Different" moment — either as a component on the Overview tab or as a callout on the Results tab. Show a fake Amazon/Shopify review next to a Reputable verified result. Make the contrast visceral.

---

## Problem #3: Progressive Disclosure is for YOUR Demo, Not MY Experience

The progressive disclosure model (n=0 → n=1 → n=3 → n=10 → complete) is clever engineering. It's also **completely wrong** for a sales demo.

When I sit down for a 10-minute demo, I don't want to watch a study grow from zero. I want to see the *finished product*. Show me what I'm buying. The n=0 "waiting state" with its little placeholder text — "The first participant story will appear here" — is DEATH in a demo. It's showing me an empty restaurant.

Yes, I understand the sales rep will use the Demo Phase Selector to jump to Day 28. But the PRD still structures the *experience* around progressive disclosure. The Live Insights tab is literally designed around it. Four different states. That's four chances for the brand exec to think "this feels incomplete."

When I log in during a live study and see "5/10 toward full analytics" — I don't feel excited. I feel like I paid for something that isn't done yet. That progress bar is telling me "you don't have enough data" which is the *opposite* of what I want to hear.

**Fix:** The demo should START at Day 28 with full results, then optionally walk backward to show the journey. The live study view should emphasize what IS there, not what's missing. Kill the "X/10 toward full analytics" progress bar — it's a confidence killer.

---

## Problem #4: No ROI, No Conversion Data, No Business Case

I'm a brand exec. My job is revenue. This entire PRD is about *study results* (sleep scores, participant stories, NPS). Not a single screen answers my actual questions:

- **What's the conversion lift?** If I put this widget on my PDP, how much more will I sell?
- **What did other brands see?** Case studies, benchmarks, comparable results?
- **What's the cost per verified result?** How much am I paying per participant, per data point?
- **How does this perform vs. my existing social proof?** A/B test data?

The Widget tab shows me embed code and a verification link. Cool. But it doesn't tell me what *happens* when I embed it. Where's the "brands using Reputable see an average X% lift in conversion" stat? Where's the "this widget has been viewed Y times across our network" social proof?

You're asking me to pay (presumably $10K+) for a study, and your deliverable pitch is... an embed code? I can get embed codes from Trustpilot for free.

**Fix:** The Widget tab (or a dedicated "Impact" tab) needs conversion/business metrics. Even if they're estimates or benchmarks from other brands. "Verified claims convert 2.3x better than unverified reviews" — something, ANYTHING that connects this to revenue.

---

## Problem #5: The Widget Looks Like Every Other Trust Badge

Looking at the widget mockup:

```
✓ Verified by Reputable
28-Day Study • 47 ppl
+23% Sleep Score
View Full Study →
```

This is a rectangle with text in it. It looks like a Norton Security badge from 2009. Why would a customer on my product page care about "Verified by Reputable"? They don't know what Reputable is. This has zero brand equity.

What WOULD make me want this on my site:
- A mini before/after visualization (tiny chart showing improvement curve)
- Real participant photos or avatars
- A compelling stat presented beautifully, not in a badge
- Interactive element — hover to see more, click to explore the study
- Something that looks like it belongs on a premium DTC site, not an SSL certificate

The PRD says "Premium Feel: Clean whitespace, subtle gradients, confident typography." But the widget mockup is a box with four lines of text. Where's the premium?

**Fix:** The widget needs to be visually stunning and *interactive*. Show a mini data visualization. Make it something I'd be proud to have on my site, not something that looks like compliance checkbox.

---

## Problem #6: I Can't Use Any of This in Ads

My #1 marketing spend is Meta ads. I spend $100K/month on them. The biggest value of verified clinical-style data isn't a website widget — it's **ad creative.**

Imagine: "Clinically verified: 23% better sleep in 28 days. Measured by Oura Ring. [See the study]"

That's a Facebook ad that DESTROYS my competitors. That's worth $50K to me.

But this PRD has **zero** support for:
- Exportable assets (images, cards, social-ready graphics)
- Ad-friendly claim language ("In a 28-day study of 47 participants...")
- Downloadable before/after cards for social
- Shareable results link with OG meta tags for social previews
- A "Marketing Kit" or "Assets" tab

You built a website widget when you should have built a marketing arsenal.

**Fix:** Add a "Marketing Assets" tab or section. Let me download social cards, ad copy suggestions, press-ready study summaries. THIS is what I'd screenshot and send to my CMO — not a dashboard.

---

## Problem #7: What's the Participant Experience? Who ARE These People?

I'm putting my brand reputation on this. Who are these 47 participants? How were they recruited? Are they my actual customers or randos from a panel?

The PRD mentions `fulfillmentModel: "recruited" | "rebate"` buried in a TypeScript interface. But the Brand View never explains this to me. I have questions:

- Are these my existing customers? New customers? Recruited from where?
- What's the enrollment process? Do they feel like guinea pigs?
- What if someone has a bad experience? Is that a PR risk?
- Can competitors see this study?
- Who owns the data?

None of this is addressed in the Brand View. There's no FAQ, no methodology explanation, no "How It Works" primer. The PRD assumes I already understand and trust the process. I don't.

**Fix:** Add a "Methodology" or "How This Works" section — even a collapsible one — that explains recruitment, data collection, privacy, and data ownership. This addresses the skepticism that EVERY brand exec will have.

---

## Two Smaller Issues

### 8. The "Powered by Reputable" Footer is Wrong
At $5M revenue, I care about brand control. "Powered by Reputable" in a footer is fine. "Powered by Reputable" on a widget on MY product page? That's you getting free advertising on my real estate. If I'm paying you $10K+, the widget should be white-labeled or at minimum the branding should be subtle. The PRD doesn't address white-labeling at all.

### 9. No Competitive Context
I'm in the sleep supplement space. There are 400 competitors. Does Reputable work with any of them? Can I see how my product compares to the category average? That would be incredibly valuable — and incredibly dangerous if my competitors are using this too. The PRD doesn't address competitive concerns at all.

---

## What Would Make Me Screenshot and Send to My CMO?

1. **A before/after card with Oura data** — "Look, we can put VERIFIED sleep data on our product page. No one else has this."
2. **A conversion lift stat** — "Brands using this see X% more sales. We need this."
3. **A social ad mockup** — "We could run this as a Facebook ad. Game changer."
4. **A comparison: our reviews vs. verified results** — "This makes our reviews look weak. We need to level up."

Currently, **none of these four things exist in the PRD.** The thing most likely to get screenshotted is the before/after card on the Results tab — but it's the third tab, behind two tabs of setup/process information. It should be FIRST.

---

## Summary: 5 Things to Fix Before I'd Buy

| # | Problem | Severity | Fix |
|---|---------|----------|-----|
| 1 | First screen shows process, not value | **Critical** | Lead with best before/after result + widget preview |
| 2 | No differentiation from existing reviews | **Critical** | Add explicit comparison: reviews vs. verified results |
| 3 | No ROI / conversion / business metrics | **Critical** | Add business impact data, even estimates |
| 4 | No ad/marketing asset support | **High** | Add exportable assets, ad copy, social cards |
| 5 | Widget is visually boring | **High** | Make it interactive, visual, premium-feeling |
| 6 | Progressive disclosure feels incomplete | **Medium** | Demo should start with the end state |
| 7 | No methodology / trust explanation | **Medium** | Add "How It Works" for skeptical execs |

**Bottom line:** This PRD is a beautifully engineered internal tool that would impress a product manager. But it would lose me in the first 60 seconds of a demo because it leads with YOUR process instead of MY outcome. Flip the entire flow: start with results, then show the journey, then give me the tools to use it. And for the love of god, help me use this in my Facebook ads.
