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
| P0-1 | **Placement Preview on Widget Tab** — Show widget in realistic page mockups DIRECTLY on Widget tab: PDP (default), Homepage, Landing Page, Blog Post, Email Signature. NO separate "demo page" required. | Core value prop; addresses checkout anxiety; no extra navigation |
| P0-2 | **PDP First, Not Checkout** — Default placement is Product Page with "Recommended" badge. Checkout is de-emphasized or removed. "Not checkout — start here!" messaging prominent. | Directly counters the #1 objection |
| P0-3 | **Unified Configuration** — ALL widget config in ONE section on Widget tab: style (card/strip/section), colors, display mode. No config scattered across multiple locations. | AT-3 failure mode: config was in 3 places |
| P0-4 | **Present Button on Widget Tab** — Single "Present" button in Widget tab header enters full-screen presentation mode. NO intermediary pages like /demo/widget-placements/. | AT-1 failure mode: Kyle had to navigate to sub-page |
| P0-5 | **Live Widget Rendering** — Display brand's actual configured widget (not static mockups) in each context | Must see THEIR widget, not a generic example |
| P0-6 | **Real-Time Preview Updates** — When widget config changes, preview updates instantly (<500ms) | Builds confidence; no refresh needed |
| P0-7 | **One-Click Embed Codes** — Copy button for placement-specific embed code, visible on Widget tab | Removes technical friction |
| P0-8 | **Presentation Mode** — Full-screen, dark background, no config UI; arrow keys navigate placements; Escape exits; responsive toggle (desktop/mobile) | Sales demo must be clean and professional |
| P0-9 | **Share Preview Link** — Generate shareable URL that opens directly to presentation mode, no login required | Enables async stakeholder review |
| P0-10 | **Responsive Preview Toggle** — Switch between desktop/mobile views | Brands need to verify mobile experience |

### P1 — Should Have

| ID | Requirement | Rationale |
|----|-------------|-----------|
| P1-1 | **Custom Background Color** — Let brands set background color to match their site | Better brand-match visualization |
| P1-2 | **Embed Code Variants** — Offer HTML, React, Vue, and Shopify Liquid snippets (complete, working examples) | Technical teams have preferences |
| P1-3 | **"This is NOT checkout" Callout** — Explicitly highlight non-checkout placements as the recommended starting point | Directly counters the main objection |

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

## Acceptance Tests (Journey-Based QA)

**These tests MUST pass before feature is considered complete.**
**Each test specifies: Persona → Starting State → Journey → Checkpoints → Failure Modes**

---

### AT-1: Sales Rep — Demo Flow from Widget Tab

**Persona:** Kyle (Sales Rep)
- Goal: Demo the widget to a prospect on a live call
- Constraint: Screen sharing, needs to look professional, no "backstage" views
- Context: Prospect asked "What does this look like on our site?"

**Starting State:**
- Kyle is on the **Widget tab** in the dashboard (the main widget configuration area)
- He is screen sharing with a prospect on Zoom
- This is the ONLY page Kyle should need to be on

**Journey:**
1. Kyle looks for a way to demo/present the widget
2. Kyle clicks the "Present" button
3. Kyle is now in full-screen presentation mode
4. Kyle shows the Product Page placement
5. Kyle navigates to Homepage placement
6. Kyle toggles to mobile view
7. Kyle shares a link for the prospect to review later

**Checkpoints:**
- [ ] Step 1: "Present" button is visible ON the Widget tab (NOT a sub-page)
- [ ] Step 1: Button is prominent — top-right, teal/primary color, can't miss it
- [ ] Step 2: ONE click enters presentation mode (no intermediary page)
- [ ] Step 2: Transition is instant (<500ms), no loading states
- [ ] Step 3: Full-screen, dark background, no sidebar/nav visible
- [ ] Step 3: NO "Widget Demo Page" intermediary visible at any point
- [ ] Step 4: PDP is shown FIRST (not checkout) — with "Recommended" badge
- [ ] Step 4: Mockup looks like a real e-commerce site, not a wireframe
- [ ] Step 5: Arrow keys navigate between placements smoothly
- [ ] Step 6: Up/Down arrows toggle device, shows realistic mobile mockup
- [ ] Step 7: Share button copies link that opens directly to presentation

**End State:**
- Kyle completed demo in <2 minutes
- Prospect received a shareable link
- Kyle never left the Widget tab to access presentation mode

**Failure Modes (test FAILS if ANY are true):**
- ❌ Kyle had to click "View Demo" or navigate to /demo/widget-placements/
- ❌ There was an intermediary page between Widget tab and presentation
- ❌ "Present" button was hidden in a dropdown or sub-section
- ❌ Checkout placement was shown before PDP
- ❌ Configuration UI was visible during presentation
- ❌ Kyle said "hold on, let me find the right page"

---

### AT-2: Brand Manager — Stakeholder Share Link

**Persona:** Amber (Brand Marketing Manager)
- Goal: Send a link to her VP so he can review the widget without a meeting
- Constraint: VP won't log in; link must work standalone
- Context: Amber needs VP approval before implementing widget

**Starting State:**
- Amber is on the Widget tab
- She has configured the widget with her brand colors
- She wants to share a preview with her VP

**Journey:**
1. Amber clicks "Present" to see full demo
2. Amber clicks "Share" to get a link
3. Amber sends link to VP via email
4. VP clicks link (not logged into Reputable)
5. VP sees the widget demo immediately

**Checkpoints:**
- [ ] Step 1: Present button is on Widget tab (no sub-page navigation)
- [ ] Step 2: Share button is visible IN presentation mode
- [ ] Step 2: Link is copied to clipboard with confirmation
- [ ] Step 3: Link is a simple URL (not requiring login token)
- [ ] Step 4: Link works without Reputable account
- [ ] Step 5: VP sees presentation mode directly (not a login page)
- [ ] Step 5: VP sees Amber's brand colors applied
- [ ] Step 5: VP can navigate placements and toggle device view

**End State:**
- VP reviewed widget without scheduling a meeting
- VP saw exactly what Kyle would show in a sales demo
- No login or account required

**Failure Modes:**
- ❌ Share link required recipient to log in
- ❌ Share link opened to dashboard instead of presentation
- ❌ Brand colors weren't applied in shared view
- ❌ VP had to figure out how to navigate (no instructions visible)

---

### AT-3: Brand Manager — Widget Configuration Clarity

**Persona:** Amber (Brand Marketing Manager)
- Goal: Configure the widget style and colors
- Constraint: Doesn't want to hunt through multiple pages
- Context: First time setting up the widget

**Starting State:**
- Amber is on the Widget tab
- She wants to configure colors, style (card/strip/section), and display mode

**Journey:**
1. Amber looks for widget configuration options
2. Amber finds all config in ONE section
3. Amber changes brand color
4. Amber sees preview update immediately
5. Amber switches widget style (card → strip)
6. Amber sees preview update with new style

**Checkpoints:**
- [ ] Step 1: Configuration is visible on Widget tab (not in Settings)
- [ ] Step 2: ALL config in ONE place: style, colors, display mode
- [ ] Step 2: No config scattered across "Widget Style" + "Widget Config" + "Preview" sections
- [ ] Step 3: Color picker is easy to use (presets + custom)
- [ ] Step 4: Preview updates LIVE (<500ms)
- [ ] Step 4: Preview shows widget in realistic page context (not isolated)
- [ ] Step 5: Style options are clear (visual thumbnails, not just text)
- [ ] Step 6: Preview reflects the style change immediately

**End State:**
- Amber configured the widget without confusion
- She knew where to find every setting
- She saw live previews of every change

**Failure Modes:**
- ❌ Config was in 3 different sections (style selector, config panel, preview page)
- ❌ Amber had to go to a different page to see the preview
- ❌ Changes required clicking "Apply" or "Save" to see effect
- ❌ Amber asked "wait, where do I change the color?"

---

### AT-4: First-Time User — Widget Tab Default State

**Persona:** New brand user (first login after study completion)
- Goal: See what the widget looks like and how to use it
- Constraint: Has never seen the Widget tab before
- Context: Just completed their first study, exploring features

**Starting State:**
- User clicks on Widget tab for the first time
- Has a completed study with participant data

**Journey:**
1. User lands on Widget tab
2. User sees widget preview (default configuration)
3. User understands what placements are available
4. User knows how to present/demo and get embed code

**Checkpoints:**
- [ ] Step 1: Widget tab loads quickly (<1 second)
- [ ] Step 2: Widget preview is visible immediately (not hidden behind tabs)
- [ ] Step 2: Preview shows PDP placement by default (NOT checkout)
- [ ] Step 2: "Not checkout — start here!" message is prominent
- [ ] Step 3: Placement options (PDP, Homepage, etc.) are visible
- [ ] Step 3: PDP has "Recommended" badge
- [ ] Step 4: "Present" button is obvious (for demos)
- [ ] Step 4: "Get Embed Code" is obvious (for implementation)

**End State:**
- User understands the widget feature in <30 seconds
- User knows checkout isn't the only option
- User knows how to demo and implement

**Failure Modes:**
- ❌ Checkout was shown first/default (reinforces anxiety)
- ❌ Widget preview was hidden behind a "Preview" tab
- ❌ User didn't notice alternative placements exist
- ❌ "Present" or "Embed Code" buttons were buried

---

### AT-5: Technical — Embed Code Flow

**Persona:** Developer or Technical Marketer
- Goal: Get embed code for PDP placement
- Constraint: Needs code that works, not documentation to read
- Context: Ready to implement the widget

**Starting State:**
- User is on Widget tab
- Widget is configured with brand colors
- User wants embed code for Product Page placement

**Journey:**
1. User selects PDP placement
2. User clicks to get embed code
3. User copies the code
4. User sees confirmation

**Checkpoints:**
- [ ] Step 1: Placement selection is clear (tabs or buttons)
- [ ] Step 2: "Copy Embed Code" button is visible for selected placement
- [ ] Step 2: Code is displayed in a readable format (syntax highlighted)
- [ ] Step 3: Copy button works with one click
- [ ] Step 3: Code includes placement-specific attributes (data-placement="pdp")
- [ ] Step 4: Success feedback ("Copied!" toast or button change)
- [ ] Code is correct and would work if pasted into a real page

**End State:**
- User has working embed code in clipboard
- Code is specific to PDP placement
- No need to read documentation

**Failure Modes:**
- ❌ Had to navigate to separate page to get embed code
- ❌ Embed code was generic (not placement-specific)
- ❌ Code was wrong or had syntax errors
- ❌ Copy button didn't work or had no feedback

---

### AT-6: Presentation Mode — Visual Quality

**Persona:** Kyle (Sales Rep) and Amber (Brand Manager)
- Goal: Presentation mode looks professional for external audiences
- Constraint: Will be screen-shared or sent to VPs/prospects
- Context: This is our "showroom"

**Starting State:**
- User has entered presentation mode

**Journey:**
1. Review the overall visual appearance
2. Check each placement mockup
3. Verify widget renders correctly
4. Test navigation and controls

**Checkpoints:**
- [ ] Full-screen dark background (no white dashboard chrome bleeding through)
- [ ] Mockups look like real e-commerce sites (not wireframes or gray boxes)
- [ ] Product images, star ratings, prices look realistic
- [ ] Widget renders with actual data (participant counts, NPS, etc.)
- [ ] Navigation arrows are visible but not distracting
- [ ] Keyboard hints are present at bottom (but subtle)
- [ ] "Verified by Reputable" badge is visible on widgets
- [ ] Mobile view is properly sized and realistic

**Failure Modes:**
- ❌ Dashboard UI visible behind/around the presentation
- ❌ Mockups look like placeholder wireframes
- ❌ Widget shows "loading" or error states
- ❌ Professional designer would say "this looks unfinished"

---

### AT-7: Data Constraints

**Persona:** N/A (Technical requirement)
- Goal: Feature works without production data
- Constraint: Sales demos use demo studies
- Context: Cannot require Sensate Real Data study

**Starting State:**
- User has a DEMO study (not real participant data)

**Journey:**
1. User goes to Widget tab
2. User tries to preview/present

**Checkpoints:**
- [ ] Widget tab works with demo studies
- [ ] Preview shows realistic demo data
- [ ] Presentation mode works fully
- [ ] No errors about "insufficient data"

**Failure Modes:**
- ❌ "Widget requires real participant data" error
- ❌ Empty or broken preview with demo studies
- ❌ Feature only works with Sensate Real Data study

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
