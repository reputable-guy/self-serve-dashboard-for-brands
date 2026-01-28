# Morning Brief — January 28, 2026

## What I Did Overnight

| Deliverable | Location | Lines |
|-------------|----------|-------|
| Email Nurturing PRD | `docs/PRD-email-nurturing.md` | 500+ |
| Competitor Analysis (Trustpilot/Yotpo) | `docs/competitor-analysis.md` | ~350 |
| Pricing & Positioning Research | `docs/pricing-positioning-research.md` | ~360 |
| Regulatory Claims Research | `docs/regulatory-claims-research.md` | ~350 |
| Ideal First Customers | `docs/ideal-first-customers.md` | ~300 |

---

## Key Insights

### 1. You're Creating a New Category
Neither Trustpilot nor Yotpo does what you do. They're review platforms; you're a **verification platform**. The positioning should be:

> "Verified Product Studies — between star ratings and clinical trials"

### 2. Citruslabs is Your Closest Competitor
- They charge $10K-55K per study
- They use **recruited strangers**, not existing customers
- Their entry point ($3K/mo self-service) is still 2-3x your target
- **Opportunity:** Undercut on price, differentiate on methodology (real customers + wearables)

### 3. Pricing Sweet Spot: $2,500-6,000 per study
- Platform fee ($1,500-5,000) + participant rebates ($30-50 × 50 = $1,500-2,500)
- This is 75% cheaper than Citruslabs
- Separating platform fee from rebates increases transparency

### 4. Language Matters (Regulatory)
- ❌ "Clinically proven" — requires extensive clinical evidence
- ✅ "Verified by customer study" — accurate, defensible
- ✅ "Customer-reported results" — FTC compliant
- Must show **typical results**, not just best cases (FTC 2023 update)

### 5. Three Targets Ready for Outreach
| Brand | Why Now | Decision Maker |
|-------|---------|----------------|
| MUD\WTR | Expanding to Costco/Target, needs efficacy data | Shane Heath (founder) |
| Beam | Sleep-focused "Dream" product, perfect for 28-day | Matt Lombardi (CEO) |
| Four Sigmatic | Claims "results in 7 days" with no studies | Tero Isokauppila (founder) |

---

## Recommendations (Ranked by Impact)

### 🔴 Do This Week

1. **Pick your first customer and reach out**
   - I'd start with Beam — their "Dream" sleep product is literally perfect for your platform
   - They're Series B, have budget, and Matt Lombardi is active on LinkedIn
   - Outreach angle: "Your Dream powder claims better sleep. We can prove it with Oura data."

2. **Lock in your positioning language**
   - Stop saying "clinical trial" (regulatory risk)
   - Use: "Verified Product Study" / "Customer validation study" / "Real customer, real data"
   - I've included template language in the regulatory doc

3. **Build the email system**
   - The PRD is ready — hand it to Claude Code
   - Email nurturing is table stakes; without it, completion rates tank

### 🟡 Do This Month

4. **Set up Resend + Inngest**
   - This unlocks the email PRD
   - ~1 week of work for a competent developer

5. **Build the participant mobile experience**
   - Right now you have a dashboard but no check-in mechanism
   - PWA is fastest path; React Native if you want wearable integrations

6. **Create the pitch deck**
   - Use insights from competitor/pricing research
   - Key slides: Problem, Your Solution, How It Works, Differentiation, Pricing, Traction

### 🟢 Do This Quarter

7. **Wearable integrations**
   - Oura has the best API
   - Whoop is harder (closed ecosystem)
   - Apple Health via PWA is possible

8. **Shopify integration**
   - Auto-invite post-purchase customers
   - This is your growth loop

---

## Open Questions (Need Your Input)

1. **Who's building this?**
   - Do you have a developer? Are you building it yourself?
   - This affects what I should focus on (specs vs code)

2. **First customer vs product readiness?**
   - Do you want to sell before the product is ready (validation)?
   - Or build more first (risk of building wrong thing)?

3. **Wearable priority?**
   - Is Oura your focus? Or should it work without wearables first?

4. **What's your timeline?**
   - First paying customer by when?
   - This affects prioritization

---

## What I'll Research Tonight (Unless You Redirect)

1. **Oura API deep dive** — What data can you get? How hard is the integration?
2. **Beam/MUD\WTR company research** — Detailed intel for outreach
3. **Shopify app architecture** — What would a "post-purchase study invite" look like?

Let me know if you want me to pivot to something else.

---

## Files Summary

```
docs/
├── MORNING-BRIEF-2026-01-28.md    ← You are here
├── PRD-email-nurturing.md          ← Ready for Claude Code
├── competitor-analysis.md          ← Trustpilot/Yotpo deep dive
├── pricing-positioning-research.md ← Pricing strategy + messaging
├── regulatory-claims-research.md   ← What you can/can't say
└── ideal-first-customers.md        ← 10 target brands + contacts
```

—Jarvis
