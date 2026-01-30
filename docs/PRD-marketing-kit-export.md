# PRD: Marketing Kit Export

*Product Requirements Document — Marketing Kit Export & Customization*
*Created: 2025-01-29*

---

## Table of Contents

1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [User Stories](#3-user-stories)
4. [Requirements](#4-requirements)
5. [Export Format Specifications](#5-export-format-specifications)
6. [UI Flow](#6-ui-flow)
7. [Technical Considerations](#7-technical-considerations)
8. [Success Metrics](#8-success-metrics)
9. [Open Questions](#9-open-questions)
10. [Appendix](#10-appendix)

---

## 1. Overview

### What We're Building

A **Marketing Kit Export** system that lets brands transform verified participant stories into ready-to-use marketing assets. One click to generate Instagram carousels, email snippets, ad creative, and embeddable content—all with the brand's colors, logo, and messaging.

### Why Now

The Marketing Kit tab currently shows "Export and customization coming soon"—it's the #1 feature request from active customers. Every brand is currently:
1. Screenshotting participant cards from our dashboard
2. Manually recreating them in Canva/Figma
3. Copying metrics by hand into email templates
4. Losing the "Verified by Reputable" trust signal in the process

This is 1.5-2 hours per participant story. For a 20-person study, that's 30-40 hours of design work that should take 10 minutes.

### The Win

Brand marketing person logs in, selects 5 top performers, clicks "Export Instagram Carousel," customizes brand colors once, downloads a zip of 5 carousel sets. Total time: under 5 minutes. That's the bar.

### Key Constraint

Every exported asset must maintain verifiability. The "Verified by Reputable" badge links to a public verification page. Without this, we're just Canva. With this, we're proof infrastructure.

---

## 2. Problem Statement

### Current State

Brands complete studies and receive verified participant stories with:
- Participant quotes and testimonials
- Before/after wearable metrics (sleep, HRV, recovery, etc.)
- Assessment score changes
- Photos and demographic context

**But they can't use any of it efficiently.**

The dashboard displays this data beautifully. The export path is: screenshot → Canva → manual recreation → lose verification → publish. This is broken.

### Customer Voice (From 3 Recent Calls)

> "I have 15 amazing participant stories sitting in my dashboard. My social media manager needs Instagram carousels by Friday. Right now I'm literally screenshotting and cropping in Canva."
> — Brand Marketing Director, Supplement Company

> "We spent $8,000 on this study. The data is incredible. But I can't get it into our email campaigns without manually copying every stat. Can't you just give me HTML I can paste?"
> — E-commerce Manager, Sleep Brand

> "For paid ads, I need the verified badge visible. When I screenshot and crop, it looks janky. I need this to look professional AND verified."
> — Growth Lead, Fitness Brand

### Jobs To Be Done

| Job | Current Solution | Pain Level |
|-----|------------------|------------|
| Create Instagram content from study results | Screenshot → Canva → manual design | 🔴 High (3-5 hrs/participant) |
| Add participant stories to email campaigns | Copy/paste text, lose formatting | 🔴 High (loses metrics, ugly) |
| Generate paid ad creative with verified stats | Screenshot → crop → hope it looks good | 🟡 Medium (verification unclear) |
| Embed stories on product pages | Use widget only (limited customization) | 🟡 Medium (want more control) |
| Create PDF case studies | Manual in Google Docs | 🔴 High (no template, tedious) |

---

## 3. User Stories

### Brand Marketing Manager (Primary User)

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| MK-01 | As a marketing manager, I want to export a participant story as an Instagram carousel, so I can post it directly without design work | Download zip with 3-5 slide images (1080x1080), ready to upload |
| MK-02 | As a marketing manager, I want to set my brand colors once and have them apply to all exports, so I maintain visual consistency | Brand settings persist; all exports use saved palette |
| MK-03 | As a marketing manager, I want to choose which metrics to emphasize, so I can highlight what matters for my campaign | Metric selector in export flow; chosen metrics appear prominently |
| MK-04 | As a marketing manager, I want to batch export multiple participants, so I can build a month of content in one session | Select multiple participants → export all as zip |
| MK-05 | As a marketing manager, I want email-ready HTML snippets, so I can paste directly into Klaviyo/Mailchimp | Copy button gives clean HTML; works in major ESPs |
| MK-06 | As a marketing manager, I want the "Verified by Reputable" badge visible and clickable, so I maintain credibility | Badge appears on all assets; links to verification page |

### Social Media Manager

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| MK-07 | As a social media manager, I want Instagram Story format (1080x1920), so I have vertical content ready | Story export option produces correct dimensions |
| MK-08 | As a social media manager, I want to preview before downloading, so I can adjust before committing | Live preview updates as I change settings |
| MK-09 | As a social media manager, I want multiple layout options, so not every post looks identical | 3-4 template variations per format |

### Growth/Ads Manager

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| MK-10 | As an ads manager, I want ad-sized image exports (1080x1080, 1200x628), so I can use them in Meta/Google ads | Export includes common ad dimensions |
| MK-11 | As an ads manager, I want to include/exclude specific elements (photo, quote, metrics), so I can A/B test creative | Toggles for each content element |
| MK-12 | As an ads manager, I want high-resolution exports, so they don't look pixelated in ads | Minimum 2x resolution option |

### Content Manager

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| MK-13 | As a content manager, I want PDF one-pagers for each participant, so I can share with PR/partners | PDF export with full story, metrics, verification |
| MK-14 | As a content manager, I want embed codes for my website, so I can add stories beyond the widget | Embed code generates iframe or JS snippet |
| MK-15 | As a content manager, I want to download all assets for a participant at once, so I have everything in one folder | "Download All" option creates organized zip |

---

## 4. Requirements

### P0 — Must Have (MVP)

| ID | Requirement | Rationale |
|----|-------------|-----------|
| P0-01 | **Instagram Carousel Export (1080x1350 default, 1080x1080 option)** | 4:5 vertical takes 30% more screen real estate; 1:1 available as fallback |
| P0-02 | **Brand Color Customization** | Primary + secondary colors apply to all templates |
| P0-03 | **Logo Upload & Placement** | Logo appears on all exports; corner selection |
| P0-04 | **Single Participant Export** | Select one participant → export one asset set |
| P0-05 | **Verification Badge on All Assets** | Non-negotiable; this is our differentiation |
| P0-06 | **Live Preview** | See changes before downloading |
| P0-07 | **PNG/JPG Download** | Standard image formats for all visual exports |

### P1 — Should Have (V1.1)

| ID | Requirement | Rationale |
|----|-------------|-----------|
| P1-01 | **Instagram Story / TikTok / Reels Export (1080x1920)** | 9:16 vertical for Stories, Reels, and TikTok (same dimensions, note safe zones differ) |
| P1-02 | **Email HTML Snippet** | Frequently requested; high time savings. *Note: Must include Outlook VML fallbacks for border-radius; test in Litmus before release* |
| P1-03 | **Batch Export (Multiple Participants)** | Export 5-20 participants at once |
| P1-04 | **Font Selection + Weight** | 4-6 web-safe fonts with weight options (Regular, Medium, Semibold, Bold) |
| P1-05 | **Metric Selection** | Choose which 2-3 metrics to feature |
| P1-06 | **Template Variations** | 3 layout options per format |
| P1-07 | **Social Media Card (1200x628)** | Meta/Twitter link preview size |

### P2 — Nice to Have (V1.2+)

| ID | Requirement | Rationale |
|----|-------------|-----------|
| P2-01 | **PDF One-Pager** | PR/partner sharing |
| P2-02 | **Web Embed Code** | Beyond widget—standalone story embeds |
| P2-03 | **Video Export (MP4)** | Animated versions of carousel |
| P2-04 | **Brand Kit Presets** | Save multiple brand configurations |
| P2-05 | **Direct Instagram/Meta Publishing** | Connect account → post directly |
| P2-06 | **AI Caption Generation** | Generate post copy based on participant story |
| P2-07 | **Custom Template Upload** | Brands upload their own Figma/Canva templates |

---

## 5. Export Format Specifications

### 5.1 Instagram Carousel (P0)

**Dimensions:** 1080 x 1350 pixels (4:5 aspect ratio) — *default; 30% more screen real estate*
**Alternative:** 1080 x 1080 pixels (1:1 aspect ratio) — *toggle available for brands who prefer square*
**Format:** PNG (transparent support) or JPG (smaller file size)
**Resolution:** 2x for retina (exports at 2160x2700 or 2160x2160, displays at native)

**Slide Structure (3-5 slides):**

```
┌─────────────────────────────────────────┐
│ SLIDE 1: THE HOOK                        │
│                                          │
│  [Hero Metric in Large Type]             │
│  "+47 minutes more deep sleep"           │
│                                          │
│  [Participant Photo - Circle Crop]       │
│  "Sarah, 34"                             │
│                                          │
│  [Verified Badge - Bottom Corner]        │
│  [Brand Logo - Opposite Corner]          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SLIDE 2: THE STRUGGLE                    │
│                                          │
│  "I tried everything—melatonin,          │
│   sleep apps, even prescription          │
│   meds. Nothing worked."                 │
│                                          │
│  [Baseline Metrics - Subtle]             │
│  Deep Sleep: 32 min | HRV: 24ms          │
│                                          │
│  [Verified Badge] [Brand Logo]           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SLIDE 3: THE TRANSFORMATION              │
│                                          │
│  BEFORE → AFTER                          │
│                                          │
│  Deep Sleep    32 min → 79 min  ↑147%   │
│  HRV           24ms → 41ms      ↑71%    │
│  Sleep Score   62 → 84          ↑35%    │
│                                          │
│  [Verified Badge] [Brand Logo]           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SLIDE 4: THE TESTIMONIAL                 │
│                                          │
│  "I wake up feeling like a               │
│   different person. This is              │
│   the first thing that's                 │
│   actually worked."                      │
│                                          │
│  — Sarah, verified participant           │
│  [28-day study, Oura Ring tracked]       │
│                                          │
│  [Verified Badge] [Brand Logo]           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SLIDE 5: THE CTA (Optional)              │
│                                          │
│  See Sarah's full story                  │
│  [QR Code → Verification Page]           │
│                                          │
│  [Brand Logo - Centered]                 │
│  [Product Name/Website]                  │
│                                          │
│  Verified by Reputable                   │
└─────────────────────────────────────────┘
```

**Customization Options:**
- Background color (brand primary)
- Text color (auto-contrast or manual)
- Accent color (brand secondary)
- Logo position (top-left, top-right, bottom-left, bottom-right)
- Badge position (opposite corner from logo)
- Metric selection (choose 2-4 to feature)
- Include/exclude participant photo
- Include/exclude CTA slide

### 5.2 Instagram Story (P1)

**Dimensions:** 1080 x 1920 pixels (9:16 aspect ratio)
**Format:** PNG or JPG
**Resolution:** 2x for retina

**Single-Story Layout:**
```
┌─────────────────────────────────────────┐
│                                          │
│  [Brand Logo - Top]                      │
│                                          │
│  ─────────────────────────────           │
│                                          │
│  [Participant Photo - Large Circle]      │
│                                          │
│  "Sarah, 34"                             │
│                                          │
│  ─────────────────────────────           │
│                                          │
│  [Hero Quote - Large Type]               │
│  "I wake up feeling like                 │
│   a different person."                   │
│                                          │
│  ─────────────────────────────           │
│                                          │
│  RESULTS AFTER 28 DAYS                   │
│                                          │
│  Deep Sleep     +47 min  ↑147%          │
│  HRV            +17ms    ↑71%           │
│  Sleep Score    +22 pts  ↑35%           │
│                                          │
│  ─────────────────────────────           │
│                                          │
│  [Verified by Reputable Badge]           │
│  Tap to verify →                         │
│                                          │
└─────────────────────────────────────────┘
```

### 5.3 Email HTML Snippet (P1)

**Output:** Clean HTML + inline CSS (ESP-compatible)
**Tested on:** Klaviyo, Mailchimp, HubSpot, Sendgrid

**Structure:**
```html
<!-- Reputable Verified Story: Sarah -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
  <tr>
    <td style="background-color: #F8F9FA; border-radius: 12px; padding: 32px;">
      
      <!-- Header with Photo -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="80" style="vertical-align: top;">
            <img src="[PARTICIPANT_PHOTO_URL]" width="64" height="64" 
                 style="border-radius: 50%; display: block;" alt="Sarah">
          </td>
          <td style="padding-left: 16px; vertical-align: middle;">
            <p style="margin: 0; font-size: 18px; font-weight: 600; color: #1A1A1A;">Sarah, 34</p>
            <p style="margin: 4px 0 0; font-size: 14px; color: #6B7280;">28-day verified study</p>
          </td>
        </tr>
      </table>
      
      <!-- Quote -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
        <tr>
          <td>
            <p style="margin: 0; font-size: 20px; font-style: italic; color: #374151; line-height: 1.5;">
              "I wake up feeling like a different person. This is the first thing that's actually worked."
            </p>
          </td>
        </tr>
      </table>
      
      <!-- Metrics -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
        <tr>
          <td style="background-color: #FFFFFF; border-radius: 8px; padding: 20px;">
            <p style="margin: 0 0 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6B7280;">Results after 28 days</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                  <span style="color: #374151;">Deep Sleep</span>
                </td>
                <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; text-align: right;">
                  <span style="color: #059669; font-weight: 600;">+47 min (↑147%)</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                  <span style="color: #374151;">HRV</span>
                </td>
                <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; text-align: right;">
                  <span style="color: #059669; font-weight: 600;">+17ms (↑71%)</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">
                  <span style="color: #374151;">Sleep Score</span>
                </td>
                <td style="padding: 8px 0; text-align: right;">
                  <span style="color: #059669; font-weight: 600;">+22 pts (↑35%)</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <!-- Verification Badge -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
        <tr>
          <td style="text-align: center;">
            <a href="[VERIFICATION_URL]" style="display: inline-block; padding: 8px 16px; background-color: #10B981; color: #FFFFFF; font-size: 12px; font-weight: 600; text-decoration: none; border-radius: 4px;">
              ✓ Verified by Reputable
            </a>
          </td>
        </tr>
      </table>
      
    </td>
  </tr>
</table>
<!-- End Reputable Verified Story -->
```

**Customization:**
- Background color
- Accent color (badge, positive metrics)
- Font family (from safe list)
- Include/exclude photo
- Metric selection

**⚠️ Email Client Compatibility Notes:**
- `border-radius` on images renders as square in Outlook 2007-2019 (uses Word rendering engine). Add VML fallback conditionals for rounded elements.
- The checkmark emoji (✓) may render inconsistently; consider HTML entity (`&#10003;`) with font fallback or hosted image icon.
- Test in Litmus or Email on Acid before release.
- Dark mode support (`@media (prefers-color-scheme: dark)`) is a future enhancement, not V1.

### 5.4 Social Media Card (P1)

**Dimensions:** 1200 x 628 pixels (1.91:1 — Meta/Twitter/LinkedIn optimized)
**Format:** PNG or JPG
**Use case:** Link preview images, paid ads

**Layout:**
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  [Brand Logo]                        [Verified Badge]            │
│                                                                   │
│  ┌──────────────┐                                                 │
│  │              │    "I wake up feeling like                     │
│  │  [Participant│     a different person."                       │
│  │    Photo]    │                                                 │
│  │              │    Deep Sleep  +47 min ↑147%                   │
│  │              │    HRV         +17ms  ↑71%                     │
│  └──────────────┘                                                 │
│                                                                   │
│                      Sarah, 34 — 28-day verified study           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 5.5 PDF One-Pager (P2)

**Dimensions:** Letter (8.5 x 11 in) or A4
**Format:** PDF
**Use case:** PR kits, partner sharing, investor materials

**Content:**
- Full participant story (longer form)
- All tracked metrics with graphs
- Study methodology summary
- Verification QR code
- Brand contact info

---

## 6. UI Flow

### 6.1 Entry Points

**From Marketing Kit Tab:**
```
Marketing Kit Tab
├── [Export All] button (batch flow)
├── Participant Grid
│   └── Each card has [Export] button (single flow)
└── Brand Settings section
    └── [Customize Brand Kit] button (settings flow)
```

**From Participant Detail View (Results Tab):**
```
Participant Card (expanded)
└── [Export Story] button → Opens export modal
```

### 6.2 Export Flow (Single Participant)

```
┌─────────────────────────────────────────────────────────────────────┐
│                     EXPORT: Sarah's Story                           │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │                     [LIVE PREVIEW]                          │   │
│  │                                                              │   │
│  │     Updates in real-time as settings change                  │   │
│  │                                                              │   │
│  │                                                              │   │
│  │         ← [Prev Slide]     [Next Slide] →                   │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  FORMAT                          BRAND                              │
│  ┌─────────────────────────┐    ┌─────────────────────────┐        │
│  │ ○ Instagram Carousel    │    │ Primary    [■■■■] #4F46E5│        │
│  │ ○ Instagram Story       │    │ Secondary  [■■■■] #10B981│        │
│  │ ○ Social Card           │    │ Text       [■■■■] #1F2937│        │
│  │ ○ Email Snippet         │    │ Background [■■■■] #F9FAFB│        │
│  │ ○ PDF One-Pager         │    │                          │        │
│  └─────────────────────────┘    │ Logo: [logo.png] [Change]│        │
│                                  │ Position: [Top Right ▼] │        │
│  CONTENT                         └─────────────────────────┘        │
│  ┌─────────────────────────┐                                        │
│  │ ☑ Include Photo         │    TEMPLATE                            │
│  │ ☑ Include Quote         │    ┌─────────────────────────┐        │
│  │ ☑ Include Metrics       │    │ [Layout A] [Layout B]   │        │
│  │ ☐ Include CTA Slide     │    │ [Layout C]              │        │
│  │                          │    └─────────────────────────┘        │
│  │ Metrics to feature:      │                                        │
│  │ ☑ Deep Sleep (+47 min)   │    FONT                                │
│  │ ☑ HRV (+17ms)            │    ┌─────────────────────────┐        │
│  │ ☑ Sleep Score (+22)      │    │ [Inter          ▼]     │        │
│  │ ☐ REM Sleep (+12 min)    │    └─────────────────────────┘        │
│  └─────────────────────────┘                                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │    [Cancel]                    [Copy HTML] [Download PNG]   │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.3 Batch Export Flow

```
Step 1: Select Participants
┌─────────────────────────────────────────────────────────────────────┐
│  SELECT PARTICIPANTS TO EXPORT                                      │
│                                                                     │
│  [☑ Select All (15)]                    Selected: 5 of 15          │
│                                                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ ☑       │ │ ☑       │ │ ☐       │ │ ☑       │ │ ☐       │      │
│  │ Sarah   │ │ Mike    │ │ Lisa    │ │ Tom     │ │ Amy     │      │
│  │ +47min  │ │ +38min  │ │ +22min  │ │ +51min  │ │ +19min  │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                                                                     │
│                              [Continue →]                           │
└─────────────────────────────────────────────────────────────────────┘

Step 2: Configure Export (same as single, but applies to all)

Step 3: Preview & Confirm
┌─────────────────────────────────────────────────────────────────────┐
│  READY TO EXPORT                                                    │
│                                                                     │
│  5 participants × Instagram Carousel (5 slides each)                │
│  = 25 images total                                                  │
│                                                                     │
│  Estimated file size: ~12 MB                                        │
│  Format: ZIP archive with folders per participant                   │
│                                                                     │
│  [← Back]                               [Download ZIP]              │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.4 Brand Settings (Persistent)

```
┌─────────────────────────────────────────────────────────────────────┐
│  BRAND KIT SETTINGS                                                 │
│                                                                     │
│  These settings will be used as defaults for all exports.           │
│  You can override them during individual exports.                   │
│                                                                     │
│  COLORS                                                             │
│  ─────────────────────────────────────────────                      │
│  Primary Color      [■■■■■■■] #4F46E5    ← Used for accents        │
│  Secondary Color    [■■■■■■■] #10B981    ← Used for positive stats  │
│  Text Color         [■■■■■■■] #1F2937    ← Main text               │
│  Background Color   [■■■■■■■] #F9FAFB    ← Card backgrounds        │
│                                                                     │
│  LOGO                                                               │
│  ─────────────────────────────────────────────                      │
│  ┌──────────────┐                                                   │
│  │  [Your Logo] │   [Upload New]  [Remove]                         │
│  └──────────────┘                                                   │
│  Default Position: [Top Right ▼]                                    │
│                                                                     │
│  TYPOGRAPHY                                                         │
│  ─────────────────────────────────────────────                      │
│  Font Family: [Inter ▼]                                             │
│               Options: Inter, Roboto, Open Sans, Lato,              │
│                        Poppins, Montserrat                          │
│                                                                     │
│  ─────────────────────────────────────────────                      │
│  [Save Brand Kit]                                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Technical Considerations

### 7.1 Image Generation Approach

**Option A: Server-Side Rendering (Recommended)**
- Use Puppeteer/Playwright to render HTML templates to images
- Pros: Consistent rendering, supports all CSS, handles fonts reliably
- Cons: Requires server resources, slight latency
- Implementation: Queue system for batch exports

**Option B: Client-Side Canvas**
- Use html2canvas or dom-to-image
- Pros: No server load, instant preview
- Cons: Font loading issues, CSS limitations, inconsistent across browsers
- Implementation: Generate in browser, upload to CDN

**Option C: Hybrid (Recommended for V1)**
- Client-side for live preview (html2canvas with limitations accepted)
- Server-side for final export (Puppeteer for production quality)
- Best of both: instant feedback + reliable output

### 7.2 Template System

```typescript
// Template structure
interface ExportTemplate {
  id: string;
  name: string;
  format: 'carousel' | 'story' | 'card' | 'email' | 'pdf';
  dimensions: { width: number; height: number };
  slides?: number; // For carousels
  
  // Template accepts these variables
  variables: {
    participant: ParticipantData;
    brand: BrandSettings;
    metrics: SelectedMetrics[];
    options: ExportOptions;
  };
  
  // Render function
  render: (variables) => string; // Returns HTML
}

// Example: Carousel Slide 1 template
const carouselSlide1: ExportTemplate = {
  id: 'carousel-hook-v1',
  name: 'The Hook',
  format: 'carousel',
  dimensions: { width: 1080, height: 1080 },
  render: ({ participant, brand, metrics }) => `
    <div class="slide" style="
      width: 1080px;
      height: 1080px;
      background: ${brand.backgroundColor};
      font-family: ${brand.fontFamily};
    ">
      <div class="hero-metric" style="color: ${brand.primaryColor};">
        +${metrics[0].change} ${metrics[0].unit}
      </div>
      <div class="metric-label">${metrics[0].label}</div>
      <img class="participant-photo" src="${participant.photoUrl}" />
      <div class="participant-name">${participant.name}, ${participant.age}</div>
      <img class="brand-logo" src="${brand.logoUrl}" />
      <img class="verified-badge" src="/assets/verified-badge.svg" />
    </div>
  `
};
```

### 7.3 Export Pipeline

```
User clicks "Export"
        ↓
    [Validate]
    - Required fields present?
    - Brand kit configured?
    - Metrics available?
        ↓
    [Generate Preview] (client-side)
    - html2canvas for instant preview
    - Lower quality acceptable
        ↓
    [User confirms]
        ↓
    [Queue Export Job] (server-side)
    - Send template + data to export service
    - Puppeteer renders each image at 2x
    - Images uploaded to temp S3 bucket
        ↓
    [Package & Deliver]
    - Single: Direct download link
    - Batch: ZIP archive
    - Signed URL, expires in 24h
        ↓
    [Track Usage]
    - Log export event
    - Increment participant export count
```

### 7.4 Data Requirements

**From Participant:**
- `id`, `name`, `age` (or age range)
- `photoUrl` (optional, fallback to initials)
- `quote` (testimonial text)
- `struggle` (what they tried before)
- `metrics[]` — array of { label, baseline, final, change, percentChange, unit }
- `studyDuration` (e.g., "28 days")
- `wearableType` (e.g., "Oura Ring")
- `verificationUrl` — public page URL

**From Brand Settings:**
- `primaryColor`, `secondaryColor`, `textColor`, `backgroundColor`
- `logoUrl`
- `logoPosition`
- `fontFamily`

### 7.5 Performance Considerations

| Scenario | Target | Approach |
|----------|--------|----------|
| Preview load | <500ms | Client-side rendering, cached templates |
| Single export | <3s | Server-side Puppeteer, pre-warmed containers |
| Batch export (20 participants) | <30s | Parallel rendering, progress indicator |
| File download | Immediate | Pre-signed S3 URLs |

### 7.6 Infrastructure

**New Services:**
- `export-worker` — Node.js service with Puppeteer for image generation
- Could run as AWS Lambda with Chromium layer for cost efficiency

**Storage:**
- Temp exports: S3 bucket with 24h lifecycle policy
- Brand logos: Permanent storage (existing media bucket)
- Templates: Versioned in codebase (not user-editable in V1)

**Dependencies:**
- Puppeteer or Playwright
- Sharp (image optimization)
- Archiver (ZIP creation)
- @react-pdf/renderer (for PDF generation, P2)

---

## 8. Success Metrics

### Primary Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Export Adoption** | 80% of active brands export within 7 days of study completion | Track `export_completed` events per brand |
| **Time to First Export** | <5 minutes from first click | Measure flow completion time |
| **Exports per Brand** | Average 10+ exports per completed study | Count exports per study |
| **Repeat Usage** | 60% of brands export from 2+ studies | Track unique brands with multiple study exports |

### Secondary Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Format Distribution** | Track which formats are most used | Breakdown by format type |
| **Batch vs Single** | Track adoption of batch export | Percentage using batch flow |
| **Customization Usage** | % who customize vs use defaults | Track settings changes |
| **Verification Click-through** | 10%+ of badge clicks go to verification page | Track referrals from exported assets |

### Qualitative

- **Customer Feedback:** "This saves me hours" sentiment in support/calls
- **NPS Impact:** Survey brands before/after feature launch
- **Competitive Win Rate:** Track if export capability is cited in won deals

### Anti-Metrics (What We Don't Want)

| Anti-Metric | Threshold | Response |
|-------------|-----------|----------|
| Export failures | <1% | Alert + fix |
| Support tickets about exports | <5 per month | Improve UX or docs |
| Brands removing verification badge | Monitor closely | Badge must stay; if frequent, investigate why |

---

## Acceptance Tests (Journey-Based QA)

**These tests MUST pass before feature is considered complete.**
**Each test specifies: Persona → Starting State → Journey → Checkpoints → Failure Modes**

---

### AT-1: Social Media Manager — Single Participant Export

**Persona:** Jessica (Social Media Manager)
- Goal: Export one participant story as Instagram carousel
- Constraint: Needs it done in <5 minutes, no design skills required
- Context: Has 15 participant stories, needs content for this week's posts

**Starting State:**
- Jessica is logged into the dashboard
- She navigates to the Marketing Kit tab
- She sees participant stories from a completed study

**Journey:**
1. Jessica scans participants to find a compelling story
2. Jessica clicks to export that participant
3. Jessica selects "Instagram Carousel" format
4. Jessica sees a live preview of the carousel
5. Jessica adjusts brand colors (or accepts defaults)
6. Jessica downloads the export

**Checkpoints:**
- [ ] Step 1: Participants are scannable (cards show key metrics, not just names)
- [ ] Step 1: Best performers are visually highlighted or sortable
- [ ] Step 2: "Export" button is ON the participant card (not hidden in detail view)
- [ ] Step 2: ONE click opens export modal (no intermediary "configure" page)
- [ ] Step 3: Format options are visual (thumbnails, not a dropdown list)
- [ ] Step 4: Preview shows ACTUAL carousel slides, not wireframes
- [ ] Step 4: Preview updates LIVE as settings change (<500ms)
- [ ] Step 5: Brand colors are pre-filled if previously configured
- [ ] Step 5: Color picker is intuitive (not hex-code-only)
- [ ] Step 6: Download starts immediately (no "we'll email you" delay)
- [ ] Step 6: Files are properly named (participant-name-slide-1.png, not uuid.png)

**End State:**
- Jessica has 5 PNG files ready to upload to Instagram
- Total time from Marketing Kit tab to downloaded files: <5 minutes
- She didn't need help or documentation

**Failure Modes (test FAILS if ANY are true):**
- ❌ Jessica had to click into participant detail page to find "Export"
- ❌ Jessica had to navigate to a separate "Exports" section
- ❌ Export button led to a configuration page before showing preview
- ❌ Preview looked like a dashboard screenshot, not Instagram content
- ❌ Preview didn't match final downloaded files
- ❌ Download required waiting for email delivery
- ❌ Jessica said "I'd still rebuild this in Canva"

---

### AT-2: Social Media Manager — Visual Quality

**Persona:** Jessica (Social Media Manager)
- Goal: Determine if exports are post-ready or need Canva touch-ups
- Constraint: Her brand has a premium aesthetic; can't post amateur content
- Context: Comparing Reputable export to what she'd create manually

**Starting State:**
- Jessica has downloaded an Instagram carousel export
- She opens the files in her image viewer

**Journey:**
1. Jessica reviews Slide 1 (Hook)
2. Jessica reviews Slide 3 (Transformation/Results)
3. Jessica compares to her brand's existing Instagram aesthetic
4. Jessica decides: post as-is, or rebuild in Canva?

**Checkpoints:**
- [ ] Step 1: Hero metric is LARGE and attention-grabbing (not small text)
- [ ] Step 1: Participant photo/avatar is prominent and humanizing
- [ ] Step 1: Layout has visual hierarchy (not everything same size)
- [ ] Step 2: Before→After metrics have visual drama (progress bars, big numbers, color coding)
- [ ] Step 2: Improvement percentages are prominent and celebratory
- [ ] Step 3: Export aesthetic matches premium DTC brand standards
- [ ] Step 3: Colors, typography, spacing feel intentional (not template-y)
- [ ] Step 4: Jessica's answer is "I'd post this as-is"

**Failure Modes:**
- ❌ Slides look like a spreadsheet with colors
- ❌ All text is same size (no hierarchy)
- ❌ Metrics are displayed as plain text tables
- ❌ Jessica says "This looks like a template everyone uses"
- ❌ Jessica says "I'd need to fix this in Canva first"

---

### AT-3: Marketing Manager — Brand Customization Flow

**Persona:** Amber (Brand Marketing Manager)  
- Goal: Set up brand kit so all exports match her brand
- Constraint: Needs VP approval; exports must look "on-brand"
- Context: First time using export feature; hasn't configured brand yet

**Starting State:**
- Amber is on the Marketing Kit tab
- Brand colors/logo have NOT been configured yet
- She wants to export but needs to set up branding first

**Journey:**
1. Amber clicks to export a participant
2. Amber sees brand customization options
3. Amber uploads her logo
4. Amber sets brand colors (primary, secondary)
5. Amber sees preview update with her branding
6. Amber saves brand settings for future exports

**Checkpoints:**
- [ ] Step 1: Export flow naturally leads to brand setup (not a dead end)
- [ ] Step 2: Brand options are IN the export modal (not a separate settings page)
- [ ] Step 2: Clear indication that settings will be saved for future
- [ ] Step 3: Logo upload accepts common formats (PNG, JPG, SVG)
- [ ] Step 3: Logo preview shows how it will appear on exports
- [ ] Step 4: Color picker has presets AND custom hex input
- [ ] Step 4: "Use brand colors from logo" auto-extraction would be nice (P1)
- [ ] Step 5: Preview updates IMMEDIATELY (<500ms) as colors change
- [ ] Step 5: Amber can see logo placement on actual slides
- [ ] Step 6: "Save as default" is prominent and obvious
- [ ] Step 6: Confirmation that settings are saved

**Failure Modes:**
- ❌ Amber had to go to Settings to configure brand before exporting
- ❌ Brand customization was on a different page than export preview
- ❌ Changes didn't preview in real-time (had to click "Apply")
- ❌ Amber wasn't sure if settings were saved for next time
- ❌ Logo looked wrong (wrong size, bad placement, cropped weird)

---

### AT-4: Marketing Manager — Batch Export Flow

**Persona:** Amber (Brand Marketing Manager)
- Goal: Export 5 participant stories for a content calendar
- Constraint: Needs all 5 with consistent branding, quickly
- Context: Planning a week of social content

**Starting State:**
- Amber is on Marketing Kit tab
- Brand settings are already configured
- Study has 15 completed participants

**Journey:**
1. Amber selects multiple participants (5)
2. Amber initiates batch export
3. Amber confirms format and settings apply to all
4. Amber sees progress/confirmation
5. Amber downloads ZIP with all exports

**Checkpoints:**
- [ ] Step 1: Multi-select is obvious (checkboxes visible, not hidden)
- [ ] Step 1: "Select best performers" shortcut or sort available
- [ ] Step 1: Clear count of selected participants shown
- [ ] Step 2: "Export Selected (5)" button is prominent
- [ ] Step 2: ONE click to start batch (not per-participant)
- [ ] Step 3: Preview shows sample of how all will look (not each one)
- [ ] Step 3: Brand settings from previous exports are pre-applied
- [ ] Step 4: Progress indicator for batch processing
- [ ] Step 4: Reasonable time (<30 seconds for 5 participants)
- [ ] Step 5: ZIP is organized (folders per participant)
- [ ] Step 5: File names are human-readable

**Failure Modes:**
- ❌ Amber had to export each participant individually
- ❌ Had to re-configure brand settings for each export
- ❌ Batch export took >1 minute
- ❌ ZIP was flat (100 files, not organized)
- ❌ Files were named with UUIDs instead of participant names

---

### AT-5: Sales Rep — Showing Export to Prospect

**Persona:** Kyle (Sales Rep)
- Goal: Show a prospect what their exports would look like
- Constraint: On a live demo call; needs to look impressive quickly
- Context: Prospect asked "What can I actually DO with the participant data?"

**Starting State:**
- Kyle is on a demo call, screen sharing
- He's in the dashboard with a demo study
- Prospect wants to see export capabilities

**Journey:**
1. Kyle navigates to Marketing Kit tab
2. Kyle clicks on a participant to show export options
3. Kyle shows the export preview with carousel slides
4. Kyle demonstrates brand customization
5. Kyle shows the "Verified by Reputable" badge

**Checkpoints:**
- [ ] Step 1: Marketing Kit tab is easy to find (main navigation)
- [ ] Step 2: Export preview opens quickly (<1 second)
- [ ] Step 2: No loading spinners or "generating preview" delays
- [ ] Step 3: Preview looks impressive on screen share (not cramped modal)
- [ ] Step 3: Carousel slides are visible without scrolling
- [ ] Step 4: Color changes are instant and visually dramatic
- [ ] Step 4: Kyle can say "See? Your brand colors, everywhere"
- [ ] Step 5: Verification badge is prominently visible
- [ ] Step 5: Kyle can explain "This links to the verification page"

**Failure Modes:**
- ❌ Kyle had to wait for preview to generate (awkward silence)
- ❌ Modal was too small to see clearly on screen share
- ❌ Prospect couldn't see the carousel slides without Kyle scrolling
- ❌ Color changes were slow or required clicking "Apply"
- ❌ Verification badge was hidden or required explanation to find

---

### AT-6: Verification Badge — Non-Negotiable Requirements

**Persona:** N/A (Product requirement)
- Goal: Ensure verification is never lost in export process
- Constraint: This is our differentiation; cannot be optional
- Context: Every exported asset must link back to verification

**Starting State:**
- Any export flow, any format

**Journey:**
1. User exports any asset type
2. Exported asset is reviewed

**Checkpoints:**
- [ ] "Verified by Reputable" badge appears on EVERY slide/asset
- [ ] Badge is consistently positioned (same corner on all slides)
- [ ] Badge is legible at actual post size (not tiny)
- [ ] Badge contains or links to verification URL
- [ ] For images: QR code on CTA slide links to verification page
- [ ] For email HTML: Badge is a clickable link
- [ ] Badge cannot be removed or hidden by user settings
- [ ] Badge style is consistent with Reputable brand

**Failure Modes:**
- ❌ Any slide missing the verification badge
- ❌ Badge is so small it's unreadable
- ❌ Badge link goes to wrong page or is broken
- ❌ User found a way to export without badge
- ❌ QR code doesn't scan properly

---

### AT-7: Data Constraints — Works Without Real Data

**Persona:** N/A (Technical requirement)
- Goal: Feature works on demo studies for sales/testing
- Constraint: Cannot require Sensate Real Data study
- Context: Sales demos, internal testing, new brand onboarding

**Starting State:**
- User is viewing a DEMO study (simulated participants)

**Journey:**
1. User navigates to Marketing Kit for demo study
2. User attempts to export a participant

**Checkpoints:**
- [ ] Demo participants appear in Marketing Kit tab
- [ ] Export button is enabled (not grayed out)
- [ ] Export produces actual images (not error messages)
- [ ] Images contain demo data that looks realistic
- [ ] Verification badge links to demo verification page

**Failure Modes:**
- ❌ "Export not available for demo studies" message
- ❌ Export button disabled with no explanation
- ❌ Export produces error or empty files
- ❌ Demo exports look obviously fake (lorem ipsum, etc.)

---

### AT-8: Competitive Bar — Better Than Canva

**Persona:** Jessica (Social Media Manager)
- Goal: Determine if Reputable export beats her current workflow
- Constraint: Currently spends 1.5-2 hours per participant in Canva
- Context: Evaluating whether to switch workflows

**Starting State:**
- Jessica has exported a carousel from Reputable
- Jessica has a carousel she made in Canva for comparison

**Journey:**
1. Jessica compares visual quality
2. Jessica compares time spent
3. Jessica compares final result credibility (verification)
4. Jessica decides which she'd use going forward

**Checkpoints:**
- [ ] Visual quality: Reputable export is equal or better than Canva
- [ ] Time: Reputable took <5 min vs Canva's 1.5-2 hours
- [ ] Credibility: Reputable has verification badge; Canva doesn't
- [ ] Flexibility: Reputable has enough customization for her needs
- [ ] Verdict: Jessica chooses Reputable over Canva

**Failure Modes:**
- ❌ Jessica says "The Canva version looks better"
- ❌ Jessica says "I'd still need to touch this up in Canva"
- ❌ Jessica says "The templates are too limiting"
- ❌ Export time exceeded 5 minutes
- ❌ Customization options were confusing or insufficient

---

## 9. Open Questions

### Product Questions

| Question | Options | Recommendation |
|----------|---------|----------------|
| Should brands be able to edit quote text? | Yes (trust them) / No (preserve integrity) | **No** — we're "verified"; editing breaks trust. They can request edits via support if participant approves. |
| Allow export without verification badge? | Yes (with warning) / No (hard requirement) | **No for V1** — badge is our differentiation. Revisit if brands push back hard. |
| Include participant last name? | Yes / No / Brand choice | **Brand choice** — default to first name + initial |
| Metric display: absolute or relative? | "+47 min" vs "↑147%" | **Both** — show absolute with percentage in parentheses |

### Technical Questions

| Question | Impact | Decision Needed By |
|----------|--------|-------------------|
| Puppeteer in Lambda vs dedicated EC2? | Cost vs latency | Before implementation |
| Font licensing for web-safe fonts? | Legal | Before implementation |
| How long to retain export files? | Storage cost | Before launch |
| Rate limiting for batch exports? | Prevent abuse | Before launch |

### Future Considerations

- **White-label exports:** Some brands may want no Reputable branding at all (enterprise tier?)
- **Video exports:** Animated carousels are increasingly popular
- **Direct posting:** Instagram API integration for posting without download

---

## 10. Appendix

### A. Competitive Analysis

| Competitor | Export Capability | Verification | Our Advantage |
|------------|-------------------|--------------|---------------|
| **Yotpo** | Review export, basic formatting | None | We verify with objective data |
| **Loox** | Photo review export | None | We have wearable metrics |
| **Stamped.io** | Widget only | None | We export to all formats |
| **Generic UGC tools** | Various | None | Verification is our moat |

### B. Font Options

| Font | License | Character | Best For |
|------|---------|-----------|----------|
| Inter | OFL | Modern, clean | Tech/DTC brands |
| Roboto | Apache 2.0 | Neutral, readable | Universal |
| Open Sans | Apache 2.0 | Friendly, approachable | Health/wellness |
| Lato | OFL | Warm, professional | Premium brands |
| Poppins | OFL | Geometric, bold | Lifestyle brands |
| Montserrat | OFL | Urban, contemporary | Fashion/beauty |

### C. Sample Export File Structure

```
sarah-story-export/
├── instagram-carousel/
│   ├── slide-1-hook.png
│   ├── slide-2-struggle.png
│   ├── slide-3-results.png
│   ├── slide-4-testimonial.png
│   └── slide-5-cta.png
├── instagram-story/
│   └── sarah-story-1080x1920.png
├── social-card/
│   └── sarah-card-1200x628.png
├── email/
│   └── sarah-email-snippet.html
└── metadata.json
```

### D. Verification Badge Specifications

**Badge Appearance:**
- Green checkmark + "Verified by Reputable" text
- Minimum size: 80px wide (never smaller)
- Always clickable → links to verification page
- Cannot be edited or removed by brand

**Verification Page Content:**
- Participant name (first + initial)
- Study details (duration, methodology)
- Wearable/assessment source
- Full metric data with timestamps
- Study sponsor (brand) disclosure
- "This story is verified" confirmation

### E. Email HTML Testing Matrix

| ESP | Tested | Notes |
|-----|--------|-------|
| Klaviyo | ✓ | Works perfectly |
| Mailchimp | ✓ | Works, test dark mode |
| HubSpot | ✓ | Works |
| Sendgrid | ✓ | Works |
| Campaign Monitor | - | To test |
| Constant Contact | - | To test |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2025-01-29 | Claude | Initial draft |

---

*End of PRD*
