# Claude Code Prompt: Add Floating Badge Widget + Fix Present Mode

## Context: Reputable

Reputable helps health/wellness brands prove product efficacy using real-world wearable data (Oura, etc.).

- Customers: DTC brands (supplements, functional foods, skincare, wellness hardware)
- Value prop: Faster & cheaper than clinical trials, more credible than reviews
- Key differentiator: Real biometric data (REM, deep sleep, HRV) — not surveys or reviews
- Buyer: Curious DTC founder, not skeptical enterprise VP

## Current State

The Widget tab has been improved with:
- Side-by-side layout (config left, live preview right)
- Accordion sections for Widget Style, Appearance, Display Mode, Featured Participants
- Live preview that updates in real-time

Current widget styles: Trust Strip, Trust Card, Trust Section

## Task 1: Add Floating Badge Widget Style

Add a 4th widget style option: **Floating Badge** (FrontRowMD-inspired)

The component already exists at `src/components/widgets/compact-badge-widget.tsx` as `FloatingBadgeWidget`.

This widget:
- Floats in bottom-left corner of the page (fixed position)
- Has stacked participant avatars
- Shows headline text
- Has dismiss (X) button
- Has "Verified by Reputable · Learn more →" footer

**Changes needed:**
1. Add "Floating Badge" to the widget style options in `brand-widget-tab.tsx`
2. Update the live preview to show the FloatingBadgeWidget when selected
3. Add it to the WIDGET_STYLES array in `trust-widgets.tsx` (or wherever styles are defined)

## Task 2: Fix Present Mode Display Mode Sync

**Bug:** When user changes the Display Mode (Outcome Highlight / Satisfaction Score / People Tested) in the Widget tab, the Present mode tabs don't reflect this change.

**Expected:** The widget shown in Present mode should use the same display mode selected in configuration.

**Investigation needed:**
1. Check how Present mode (`src/components/demo/presentation-mode.tsx`) gets its widget configuration
2. Ensure the `mode` setting is passed through correctly
3. The widget text should match what's configured (e.g., if "Satisfaction Score" is selected, it should show "83% of verified participants would recommend this product")

## Files to Check/Modify

- `src/components/brand/widget/brand-widget-tab.tsx` — Add Floating Badge option
- `src/components/widgets/trust-widgets.tsx` — WIDGET_STYLES array
- `src/components/widgets/compact-badge-widget.tsx` — Already exists, import it
- `src/components/demo/presentation-mode.tsx` — Fix display mode sync
- `src/app/demo/widget-placements/[studyId]/page.tsx` — May need to pass mode

## Deliverable

1. Add Floating Badge as a 4th widget style option
2. Show FloatingBadgeWidget in the live preview when selected
3. Fix Present mode to use the configured display mode
4. Verify by testing that changing Display Mode updates both live preview AND Present mode

Keep the accordion structure and side-by-side layout. Just add the new option and fix the sync issue.
