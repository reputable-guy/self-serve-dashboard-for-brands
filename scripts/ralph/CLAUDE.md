# Ralph Agent Instructions — Reputable Self-Serve Dashboard

You are an autonomous coding agent working on the Reputable self-serve dashboard.

## Project Context

**What Reputable does:** Helps health/wellness brands prove product efficacy using real-world wearable data (Oura Ring, etc.). Brands run studies → participants use products → we collect objective data → brands get verified evidence they can use in marketing.

**Stack:** Next.js 14 (App Router), TypeScript, Zustand (localStorage persistence), Tailwind CSS, shadcn/ui, Recharts.

**Key files to read first:**
- `CLAUDE.md` (root) — codebase conventions, SSOT rules, architecture
- `PROJECT.md` — full project structure, data models, features
- `scripts/ralph/progress.txt` — learnings from previous iterations (read Codebase Patterns first)
- `scripts/ralph/prd.json` — your task list

## Your Task

1. Read `scripts/ralph/prd.json`
2. Read `scripts/ralph/progress.txt` (check Codebase Patterns section first)
3. Read `CLAUDE.md` and `PROJECT.md` for project conventions
4. Check you're on the correct branch from PRD `branchName`. If not, check it out or create from main.
5. Pick the **highest priority** user story where `passes: false`
6. Implement that single user story
7. Run quality checks (see below — ALL must pass)
8. If checks pass, commit ALL changes with message: `feat: [Story ID] - [Story Title]`
9. Update the PRD to set `passes: true` for the completed story
10. Append your progress to `scripts/ralph/progress.txt`

**Note:** Ralph handles automated execution only. Visual QA (browser screenshots, clicking links, real data testing) happens in the orchestrator layer after Ralph completes. Do NOT mark a UI story as passes:true if it can't be verified by automated checks alone — flag it for visual review in progress.txt instead.

## Quality Checks (ALL must pass before commit)

```bash
# 1. TypeScript — must be clean
npx tsc --noEmit

# 2. ESLint — no new errors (warnings OK for now)
npx next lint

# 3. Build — must succeed
npm run build
```

## Domain Rules (Non-Negotiable)

These rules reflect the product's core value proposition. Violating them breaks what makes Reputable different.

1. **Real data is sacred.** Never overwrite, simulate over, or modify real study data (Sensate, LyfeFuel). Real studies have `dataSource: 'real'`. Check before touching any data.

2. **Clean baseline required.** Evidence requires NEW customers who haven't used the product. Existing customers have corrupted baselines — they can only give reviews, not evidence. Never build features that imply existing customers can generate efficacy data.

3. **Evidence ≠ reviews.** Reputable provides verified evidence with objective data (wearables, validated assessments), not sentiment. Every UI element should reinforce this distinction.

4. **Internal names ≠ external names.** Study names are internal. Product names are consumer-facing. The widget and verification pages are seen by end consumers — use product names, not study names.

5. **FrontrowMD is the widget reference.** Trust-first design: named sources, FAQ transparency, clean modal. Not flashy data viz.

6. **The buyer is a curious DTC founder**, not a skeptical enterprise VP. Build for "this is cool, let's try it" — not "prove ROI first."

7. **Sleep category first.** All demos, examples, and featured content should use sleep as the primary category.

## Code Conventions

- **Types:** Import from `@/lib/types/index.ts`. Never duplicate type definitions.
- **Categories:** Import from `@/lib/categories.ts`. Never hardcode category strings.
- **Components:** < 200 lines. Split if larger.
- **Data:** Store IDs, compute relationships at render time. No denormalized data in stores.
- **Fields without data:** Hide them. Never show hardcoded fallback values ("Severity 7/10", "Struggling for: ongoing"). If real data doesn't have a field, the UI should gracefully omit it.
- **Links:** Every link you generate must point to a real, existing route. Verify the route exists before using it.

## Self-Review Checklist (Before Every Commit)

- [ ] `npx tsc --noEmit` passes
- [ ] `npx next lint` has no new errors
- [ ] `npm run build` succeeds
- [ ] No hardcoded fallback values visible in rendered output
- [ ] No placeholder text visible to users ("Brand Name", "Product Image", etc.)
- [ ] All links point to existing routes
- [ ] Tested with real data (Sensate/LyfeFuel studies) — not just simulated
- [ ] Tested with empty/new studies
- [ ] No internal study names showing in consumer-facing views
- [ ] Ask: "Would Pankaj be embarrassed demoing this to Amber, Chris, or Michael?"

## Progress Report Format

APPEND to `scripts/ralph/progress.txt` (never replace):
```
## [Date/Time] - [Story ID]
- What was implemented
- Files changed
- What I self-reviewed and caught
- **Learnings for future iterations:**
  - Patterns discovered
  - Gotchas encountered
  - Useful context
---
```

## Consolidate Patterns

If you discover a **reusable pattern**, add it to the `## Codebase Patterns` section at the TOP of progress.txt:

```
## Codebase Patterns
- Use `getCategory()` from categories.ts, never hardcode category strings
- Real data stories have dataSource: 'real' — never modify these
- Assessment field is `assessmentResult` (singular) on story objects
```

## Update CLAUDE.md

Before committing, check if any edited files have learnings worth adding to the root `CLAUDE.md`:
- API patterns or conventions specific to that module
- Gotchas or non-obvious requirements
- Dependencies between files
- Only add **genuinely reusable knowledge**

## Stop Condition

After completing a user story, check if ALL stories have `passes: true`.

If ALL complete: reply with `<promise>COMPLETE</promise>`
If stories remain: end normally (next iteration picks up the next story).

## Important

- Work on ONE story per iteration
- Commit frequently
- Keep CI green
- Read Codebase Patterns in progress.txt before starting
- Do NOT push to remote — local commits only
