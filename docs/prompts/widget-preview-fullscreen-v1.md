# Claude Code Prompt: Add Full Screen Button to Live Preview

## Context: Reputable

Reputable helps health/wellness brands prove product efficacy using real-world wearable data.

## Problem

The Widget tab has a "Present" button in the header, but:
1. It feels disconnected from the live preview
2. Users don't know what "Present" means without context
3. "Share" next to it looks like it shares the configuration, not the demo

The user's mental model: "I'm configuring a widget and seeing a preview. I want to see it bigger/in context."

## Solution

Add a "View Full Screen" or "Expand" button directly on the Live Preview panel that opens Presentation Mode.

**Changes needed:**

1. **Add button to Live Preview area** — A small button (icon + text or just icon) in the preview panel header or corner that says "Full Screen" or "Expand" or shows an expand icon

2. **When clicked** — Opens Presentation Mode (same behavior as current Present button)

3. **Consider the header buttons** — Either:
   - Keep Present/Share in header but make Present say "Demo Mode" or similar for clarity
   - OR move them both into the preview area
   - OR keep Present in header but add an expand button on the preview that does the same thing (redundant but clear)

## UX Principles

- Put actions where users expect them (expand button on the thing being expanded)
- Use clear labels ("Full Screen" > "Present")
- Don't make users guess what buttons do

## File to Modify

`src/components/brand/widget/brand-widget-tab.tsx` — The Live Preview section

## Deliverable

Add a clear way for users to go from the live preview to the full presentation mode. The connection between "preview" and "full screen demo" should be obvious.
