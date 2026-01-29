# SE 3.0 + Ralph Process — Reputable

Based on the SE 3.0 paper (Hassan et al.) and Ralph (snarktank/ralph).
Core thesis: "Weak human + machine + better PROCESS > stronger human + machine + inferior process." — Kasparov

## The Three Layers

### Layer 1: Ralph Loop (Execution)
**Who:** Ralph (autonomous Claude Code instances)
**What:** Picks a story, implements it, runs automated checks, commits, persists learnings.
**Input:** `prd.json` with right-sized stories (one context window each)
**Output:** Code changes with passing quality gates
**Quality gates:** `tsc --noEmit`, `next lint`, `npm run build`
**Memory:** `progress.txt` (append-only), `CLAUDE.md` updates (patterns)

Ralph does NOT:
- Verify visual output (no browser)
- Make product decisions
- Judge UX quality
- Handle ambiguous requirements

### Layer 2: Self-Review (Orchestrator — Jarvis)
**Who:** Me (Jarvis), running in the main Clawdbot session
**What:** After Ralph completes stories, I open a browser and FILL OUT `QA-CHECKLIST.md`.

**THE CHECKLIST IS AN ARTIFACT, NOT A MENTAL EXERCISE.**
Copy `QA-CHECKLIST.md` → `qa/QA-<date>-<branch>.md`, fill in every field with actual values.
If any field is empty, QA is not done. If any field is FAIL, fix before presenting.

**MINDSET: ADVERSARIAL, NOT CONFIRMATORY.**
Don't look for things that work. Assume there are 5 problems you haven't found yet. Your job is to find them before Theban does. Ask: "What would Theban criticize?" — then go looking for exactly that.

**Data Accuracy (do this FIRST — before screenshots):**
1. Open the browser to each view
2. Write down every computed number (avg improvement, participant count, etc.)
3. Cross-reference against source data files or known ground truth
4. If ANY number doesn't match → stop, fix, re-verify

**Interaction Testing (click EVERYTHING):**
1. Widget click → modal opens?
2. Verification links → page loads?
3. Carousel → cards change?
4. FAQ accordion → expands?
5. Copy buttons → clipboard works?

**Visual Review (screenshot each tab):**
1. Take screenshots
2. Look at them as if you're Pankaj on a call with Amber
3. Are the RIGHT participants highlighted (best results, not worst)?
4. Is important content visible without extra clicks?

**Strategic Check:**
1. Am I building on the study I was told to build on?
2. Does the underlying data support what I'm displaying?

If issues found → fix directly or add stories to prd.json for next Ralph run.

**TIME-BOXING (Added Jan 28 — seeding rabbit hole):**
- Send a heartbeat/status update to Theban every **20 minutes** during autonomous work
- If stuck debugging a single issue for >20 min: step back, ask "is this the right investment?"
- If a story is taking >30 min total: flag it, consider splitting or deferring
- Status updates are brief: "Still on it — fixing X" or "Hit a snag with Y, trying Z approach"

Sub-agents (max 2) may be used here for:
- Targeted critique (with buyer persona, competitive refs, constraints)
- Research or analysis
- NOT for visual QA — I have a browser

**ITERATION 2 LESSON:** Writing "Browser QA ✅" without a filled-out artifact is lying to yourself. The artifact IS the proof.

### Layer 3: Synthesis & Presentation (To Theban)
**Who:** Me (Jarvis) → Theban
**What:** After stories are built AND self-reviewed, I present:

1. **What I built** — screenshots of each changed view
2. **What I caught and fixed** — proves I'm iterating, not just building
3. **Design decisions I made and why** — domain knowledge applied
4. **The one (or few) things I want your input on** — strategic, not implementation

Rules:
- Never present raw sub-agent output — synthesize first
- Never ask "what do you think?" without first saying what I think and why
- Separate "decisions I made" from "decisions I need your input on"
- Apply domain knowledge to recommendations (clean baselines, evidence ≠ reviews, curious DTC founder buyer, FrontRow reference, sleep-first)

### Theban's Role
- Express intent (goals, priorities, direction)
- Review decisions, not code
- Apply strategic judgment
- Provide domain correction only when I miss something
- NOT: QA, debugging, finding placeholder text, clicking broken links

## Workflow

```
Theban expresses intent
        ↓
Jarvis decomposes into prd.json stories
        ↓
   ┌─── Ralph Loop ───┐
   │ Pick story        │
   │ Implement         │
   │ Quality checks    │
   │ Commit            │
   │ Persist learnings │
   │ Next story        │
   └───────────────────┘
        ↓
Jarvis self-reviews (browser, real data, links)
        ↓
Jarvis fixes issues found
        ↓
(Optional) Sub-agent critique (2 max, targeted)
        ↓
Jarvis synthesizes & presents to Theban
        ↓
Theban reviews decisions → provides input
        ↓
Next cycle
```

## Sub-Agent Rules
- Max 2 per task
- Always include: buyer persona (curious DTC founder, 0-5 customers), company stage (early, pre-PMF), competitive references (FrontrowMD), constraints
- I synthesize and filter before presenting
- Sub-agents for: research, analysis, targeted critique
- NOT for: visual QA, product decisions, UX judgment

## Learning Accumulation
- `progress.txt` — cross-iteration patterns (Ralph reads this)
- `CLAUDE.md` (root) — project conventions and gotchas
- `memory/YYYY-MM-DD.md` — daily session notes (Jarvis reads this)
- `MEMORY.md` — curated long-term domain knowledge (Jarvis reads this)
- Retrospectives after major milestones

## Key Metrics (Am I Improving?)
- Bugs caught by self-review vs bugs caught by Theban
- Stories completed per cycle without founder correction
- Decisions presented with rationale vs questions asked without position
- Domain rules applied proactively vs reactively
