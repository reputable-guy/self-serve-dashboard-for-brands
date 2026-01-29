# PRD: Widget Demo Page

**Author:** Product Team  
**Status:** Draft  
**Last Updated:** 2025-01-29  
**Target Release:** Q1 2025

---

## Executive Summary

The Widget Demo Page enables brands to preview their Reputable widget across multiple real-world page placements—not just checkout. By showing widgets in context (PDP, homepage, landing pages, etc.) and providing one-click embed codes, we reduce friction in the widget adoption journey and address the #1 objection: "I don't want to mess with my checkout page."

---

## Problem Statement

### Current State
- Widget demos only show checkout page placement
- Brands hesitate to add widgets to checkout due to conversion concerns
- No way to preview widgets in alternative (often better) placements
- Brands must manually copy/modify embed code for different contexts
- Configuration changes require re-generating embed codes

### Why This Matters
Brand marketing teams evaluate Reputable with one burning question: **"Will this hurt my conversion rate?"**

Showing only checkout placement reinforces the very anxiety that blocks adoption. In reality, high-performing brands often place Reputable widgets on:
- Product detail pages (social proof before add-to-cart)
- Homepage hero sections (brand credibility)
- Dedicated "Our Science" or "Results" landing pages
- Blog posts about product efficacy
- Email signatures and newsletters

We're leaving value on the table by not demonstrating these placements.

### User Pain Points
1. **"I'm not touching my checkout page"** — Brands see checkout as sacred; even a perceived risk isn't worth it
2. **"Where else can I put this?"** — Lack of imagination about alternative placements
3. **"Will this match my brand?"** — Need to see widget styled in realistic contexts
4. **"How do I actually install this?"** — Technical barrier to getting embed code right

---

## User Stories

### Brand Marketing Manager (Primary)
> "As a marketing manager evaluating Reputable, I want to see how the widget looks on my product pages and homepage so I can confidently present this to my team without the checkout conversation."

### E-commerce Director
> "As an e-commerce director, I want to preview widgets on PDP vs. checkout so I can make a data-informed decision about placement without risking live traffic."

### Brand Designer
> "As a designer, I want to see the widget in realistic page contexts with my brand colors so I can ensure it won't clash with our design system."

### Developer / Technical Marketer
> "As the person who will implement this, I want copy-paste embed code that's specific to each placement so I don't have to figure out sizing and styling myself."

### Content Marketer
> "As a content marketer, I want to embed efficacy data in blog posts and landing pages to support our claims with verified customer results."

---

## Requirements

### P0 — Must Have for MVP

| ID | Requirement | Rationale |
|----|-------------|-----------|
| P0-1 | **Placement Preview Gallery** — Show widget in 5+ realistic page mockups: PDP, Homepage Hero, Landing Page, Blog Post, Email Signature | Core value prop; addresses checkout anxiety |
| P0-2 | **Live Widget Rendering** — Display brand's actual configured widget (not static mockups) in each context | Must see THEIR widget, not a generic example |
| P0-3 | **One-Click Embed Codes** — Provide placement-specific embed snippets with a copy button | Removes technical friction |
| P0-4 | **Real-Time Preview Updates** — When widget config changes (colors, style, size), all placements update instantly | Builds confidence; no refresh needed |
| P0-5 | **Responsive Preview Toggle** — Switch between desktop/tablet/mobile views for each placement | Brands need to verify mobile experience |
| P0-6 | **"View Full Demo" Links** — Each placement has a button to open a full-page, scrollable demo (not just cropped preview) | Stakeholders need realistic context; preview area alone isn't enough for internal buy-in |

### P1 — Should Have

| ID | Requirement | Rationale |
|----|-------------|-----------|
| P1-1 | **Custom Background Color** — Let brands set background color to match their site | Better brand-match visualization |
| P1-2 | **Embed Code Variants** — Offer HTML, React, Vue, and Shopify Liquid snippets (complete, working examples) | Technical teams have preferences |
| P1-3 | **Share Preview Link** — Generate shareable URL so brand can send to stakeholders | Speeds internal approval process |
| P1-4 | **"This is NOT checkout" Callout** — Explicitly highlight non-checkout placements as the recommended starting point | Directly counters the main objection |

### P2 — Nice to Have

| ID | Requirement | Rationale |
|----|-------------|-----------|
| P2-1 | **Email HTML Export** — Generate email-safe HTML for newsletter embedding | Content marketers will love this |
| P2-2 | **Competitor Comparison** — Show how competitor brands use social proof widgets | "If Ritual does it, we should too" |

### Deferred / Out of Scope (V2+)

| Item | Why Deferred |
|------|--------------|
| **A/B Testing Framework** | Too heavy for early stage; brands can A/B test placement themselves using our different options |
| **Performance Data / Case Studies** | We need 6-12 months of customer data first; will add when we have real benchmarks |
| **AI Placement Recommendations** | Nice idea but low priority vs. core demo functionality |

---

## UI/UX Specifications

### Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  Widget Demo                                            [Publish]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────┐   ┌─────────────────────────────────────┐ │
│  │  PLACEMENT TABS     │   │                                     │ │
│  │  ─────────────────  │   │                                     │ │
│  │  ● Product Page     │   │      [ LIVE PREVIEW AREA ]          │ │
│  │  ○ Homepage Hero    │   │                                     │ │
│  │  ○ Landing Page     │   │      Shows realistic mockup         │ │
│  │  ○ Blog Post        │   │      with brand's actual widget     │ │
│  │  ○ Email Signature  │   │                                     │ │
│  │                     │   │      ┌─────────────────────┐        │ │
│  │  ─────────────────  │   │      │  [WIDGET RENDERS    │        │ │
│  │  Device:            │   │      │   HERE WITH REAL    │        │ │
│  │  [Desktop][Mobile]  │   │      │   BRAND CONFIG]     │        │ │
│  │                     │   │      └─────────────────────┘        │ │
│  │                     │   │                                     │ │
│  └─────────────────────┘   └─────────────────────────────────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  Embed Code for Product Page                         [Copy 📋] ││
│  │  ───────────────────────────────────────────────────────────── ││
│  │  <div id="reputable-widget" data-placement="pdp">              ││
│  │    <script src="https://widget.reputable.health/v1/embed.js"   ││
│  │      data-brand-id="YOUR_BRAND_ID"                             ││
│  │      data-placement="pdp" async></script>                      ││
│  │  </div>                                                        ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  💡 Tip: Product pages see 12% higher add-to-cart with verified    │
│     efficacy data. Start here before testing checkout.             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Placement Mockup Descriptions

#### 1. Product Detail Page (PDP)
- **Mockup:** Clean e-commerce product page layout
- **Widget Position:** Below product description, above reviews
- **Context Elements:** Product image, title, price, "Add to Cart" button, star rating
- **Widget Size:** Medium (400px wide)
- **Why It Works:** Social proof at the consideration moment, before commitment

#### 2. Homepage Hero
- **Mockup:** Hero banner with headline, CTA button
- **Widget Position:** Below hero text, above fold on desktop
- **Context Elements:** Brand logo, navigation, hero image/video placeholder
- **Widget Size:** Large (600px wide) or compact badge
- **Why It Works:** Immediate credibility signal; "We have the data to back our claims"

#### 3. Dedicated Landing Page
- **Mockup:** Long-form landing page with multiple sections
- **Widget Position:** Featured in "The Science" or "Real Results" section
- **Context Elements:** Headlines, body copy, testimonials, CTA sections
- **Widget Size:** Full-width or large
- **Why It Works:** Deep-dive content for high-intent visitors; SEO value

#### 4. Blog/Content Post
- **Mockup:** Article layout with featured image, body text
- **Widget Position:** Inline within content, between paragraphs
- **Context Elements:** Article title, author byline, body text, sidebar
- **Widget Size:** Small-medium (embedded style)
- **Why It Works:** Content marketing support; backs up efficacy claims in articles

#### 5. Email Signature / Newsletter
- **Mockup:** Email template with signature block
- **Widget Position:** In email signature or as newsletter section
- **Context Elements:** Email header, body text, signature with name/title
- **Widget Size:** Compact badge or mini-widget
- **Why It Works:** Passive credibility in every customer touchpoint

### Interaction Details

1. **Tab Selection**
   - Clicking a placement tab updates preview + embed code instantly
   - Visual indicator shows which placement is selected
   - Badge on tabs could show "Recommended" for PDP

2. **Device Toggle**
   - Desktop/Tablet/Mobile buttons above or within preview
   - Preview area resizes to show responsive behavior
   - Embed code stays the same (responsive by default)

3. **Copy Embed Code**
   - Single "Copy" button with success toast
   - Code is syntax-highlighted for readability
   - Include placement-specific data attribute for analytics

4. **Real-Time Config Sync**
   - If user has widget config panel open (or edits elsewhere), preview updates without refresh
   - Consider split-screen option: config on left, demo on right

---

## Technical Considerations

### Architecture
- Demo page fetches brand's widget config from existing API
- Renders actual widget component (not static images) in each mockup
- Mockup containers are React components with configurable "slot" for widget
- Embed code generated dynamically based on placement + brand ID

### Widget Rendering
- Use existing widget SDK for preview (same code as production)
- Widget receives `placement` prop to adjust sizing/behavior
- Preview mode flag to prevent analytics tracking during demos

### Embed Code Generation
```javascript
// Example structure per placement
const embedConfigs = {
  pdp: {
    width: 'auto',
    maxWidth: '400px',
    dataAttributes: { placement: 'pdp' }
  },
  homepage: {
    width: '100%',
    maxWidth: '600px',
    dataAttributes: { placement: 'homepage' }
  },
  // ...
};
```

### Platform-Specific Snippets (P1)
- **Shopify Liquid:** Theme section snippet
- **React:** Component import with props
- **Vue:** Component registration
- **WordPress:** Shortcode or block

### Performance
- Lazy-load mockup images for non-selected tabs
- Widget renders only when tab is active
- Debounce config changes to prevent excessive re-renders

### Analytics
- Track which placements brands view most
- Track which embed codes are copied
- Track preview → publish conversion by placement

---

## Success Metrics

### Primary KPIs

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Widget installation rate | TBD% | +20% relative | Brands who copy embed code → brands who go live |
| Non-checkout placements | ~10% of installs | 50% of first installs | Placement distribution in production widgets |
| Time to first embed | TBD days | -30% relative | Days from signup to first widget live |

### Secondary KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Demo page engagement | 3+ placements viewed per session | Analytics events |
| Embed code copy rate | 60%+ of demo page visitors | Click tracking |
| Share link usage | 20%+ of enterprise brands | Share URL generation |
| Mobile preview usage | 40%+ toggle to mobile | Toggle events |

### Qualitative Signals
- Reduction in "checkout anxiety" mentions in sales calls
- Brands proactively asking about PDP/homepage placement
- Faster stakeholder approval (share link enables async review)

---

## Rollout Plan

### Phase 1: MVP (2 weeks)
- 5 placement mockups with live widget
- Desktop/mobile toggle
- Copy-paste embed codes (HTML only)
- Basic analytics tracking

### Phase 2: Enhancement (2 weeks)
- Placement performance callouts
- Platform-specific snippets (Shopify, React)
- Share preview link
- Custom background color

### Phase 3: Optimization (ongoing)
- A/B test guidance
- Upload custom screenshot
- AI placement recommendations
- Email HTML export

---

## Open Questions

1. **Should we default to PDP instead of checkout?** — Might reframe the entire onboarding flow
2. **Do we need industry-specific mockups?** — Supplement store mockup vs. skincare mockup
3. **How do we handle brands with multiple products?** — Show widget for "default" product or let them pick?
4. **Email widget limitations** — Can we technically render interactive widgets in email, or static image only?

---

## Appendix: Competitor Research

### How brands currently add social proof widgets
- **Shopify App Store** — One-click install, auto-placement on PDP
- **Manual HTML** — Copy/paste into theme files (technical)
- **Tag Manager** — GTM for non-technical marketers
- **Page Builders** — Drag-and-drop in Shogun, PageFly, etc.

### Placement patterns from other social proof tools
- **Okendo/Yotpo:** Reviews on PDP, homepage carousel, dedicated reviews page
- **Fomo/Proof:** Notification popups (bottom corner) on all pages
- **TrustPilot:** Badges in footer, hero, and email signatures

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-01-29 | Product Team | Initial draft |
