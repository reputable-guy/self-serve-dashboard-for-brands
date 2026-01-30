# Claude Code Prompt: Widget Configuration UX Redesign

## Context: Reputable

Reputable helps health/wellness brands prove product efficacy using real-world wearable data (Oura, etc.).

- Customers: DTC brands (supplements, functional foods, skincare, wellness hardware)
- Value prop: Faster & cheaper than clinical trials, more credible than reviews
- Key differentiator: Real biometric data (REM, deep sleep, HRV) — not surveys or reviews
- Buyer: Curious DTC founder, not skeptical enterprise VP

## The Problem

The Widget tab (`src/components/brand/widget/brand-widget-tab.tsx`) was recently refactored to consolidate configuration and remove a live preview that showed checkout context (pricing, "Add to Cart" button) which scared brands.

However, the current state has new problems:

1. **No visual feedback while configuring** — Users change widget style, colors, display mode, and featured participants without seeing what the widget looks like. This doesn't make sense for a visual configuration experience.

2. **Overwhelming layout** — All config options are jammed one after another in a single card:
   - Widget Style (3 options)
   - Brand Color (6 presets + custom)
   - Display Mode (3 options)
   - Featured Participants (6+ items with checkboxes)
   
   This creates a wall of options that feels overwhelming.

3. **No progressive disclosure** — Everything is visible at once. Users can't focus on one aspect of configuration at a time.

## The Constraint

We CANNOT show the widget in a mock product page context with pricing/checkout elements. That was explicitly removed because it triggers "checkout anxiety" in brand prospects.

## Your Task

Think from first principles about how to solve this UX problem:

**Core question:** How do we let users see their widget as they configure it, without showing it in a checkout-like context?

Consider:
- What is the minimum context needed to preview a widget? (Just the widget itself? A neutral background?)
- How can we organize the configuration options to reduce overwhelm? (Accordion? Tabs? Stepped wizard?)
- What's the relationship between "configuring" and "seeing the result"? (Side-by-side? Inline? Collapsible sections with live preview?)
- How do other widget/embed configurators solve this? (Stripe, Intercom, Typeform, etc.)

## Requirements

1. **Show the widget preview** as users configure — but NOT in a product page mockup with pricing
2. **Reduce visual overwhelm** — organize options into collapsible/accordion sections or similar
3. **Keep all existing functionality** — Present button, Share link, Embed Code, Marketing Kit, FAQ, Install Steps
4. **Make it scannable** — user should understand the structure at a glance

## Deliverable

1. First, describe your proposed solution in 2-3 paragraphs (thinking out loud)
2. Then implement the changes to `src/components/brand/widget/brand-widget-tab.tsx`

Focus on the Widget Setup section. Don't touch Marketing Kit, FAQ, or Install Steps unless necessary for the new layout.
