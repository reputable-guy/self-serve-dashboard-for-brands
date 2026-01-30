# Feature Orchestration Process

*How Jarvis + Claude Code collaborate on new features*

---

## Foundational Context (ALWAYS Include)

### What Is Reputable?

**Reputable helps health/wellness brands prove product efficacy using real-world wearable data.**

- **Customers:** DTC brands — supplements, functional foods, skincare with actives, wellness hardware
- **NOT:** Clinics, hospitals, B2B enterprise, reputation management
- **Value prop:** Faster & cheaper than clinical trials, more credible than reviews, compliant with Amazon/FTC
- **Mechanism:** Real wearable data (Oura, etc.) from brand's own customers over 28-90 day studies
- **Buyer persona:** Curious DTC founder who thinks "this is cool, let's try it" — not skeptical enterprise VP
- **Key differentiator:** Actual biometric data (REM, deep sleep, HRV, latency) — not surveys, not reviews

### What Makes This Different From Competitors

- **vs Clinical trials:** 10x faster, 10x cheaper, uses real customers not strangers
- **vs Reviews/Testimonials:** Verified with wearable data, not just words
- **vs Citruslabs:** Uses brand's own customers (authentic), not recruited strangers

---

## Orchestration Workflow

### Roles

**Jarvis (Me):**
- Strategic layer — understands ecosystem, personas, business context
- Research — web research, competitor analysis, problem space exploration
- Persona deployment — knows which user type to apply when
- Quality assurance — acceptance testing through persona lenses
- Memory — carries forward learnings, decisions, architectural context
- Synthesis — filters sub-agent output, doesn't dump raw

**Claude Code (via CLI):**
- Execution layer — PRD writing, implementation
- Coding-tuned prompts and agentic loop
- File manipulation, git, terminal work

### The Process

#### Phase 1: Research & Prompt Formulation

1. **Theban** provides high-level feature request
2. **Jarvis** does strategic research:
   - Web research on problem space (competitors, best practices, industry patterns)
   - Codebase exploration (what exists, what this connects to)
   - Identify relevant personas for this feature
   - Understand edge cases from domain knowledge
3. **Jarvis** crafts a context-rich prompt for Claude Code including:
   - [ ] Foundational context (what Reputable is — copy from above)
   - [ ] Specific feature request
   - [ ] Relevant personas and their needs
   - [ ] Technical context (existing code, architecture)
   - [ ] Constraints (what NOT to do)
   - [ ] Reference examples (competitors, inspiration)

#### Phase 2: PRD Creation

4. **Claude Code** writes PRD with:
   - User stories
   - Requirements (P0/P1/P2)
   - Acceptance tests with JOURNEY structure (see below)
   - Technical specs
5. **Jarvis** critiques PRD using relevant personas:
   - Does this solve their actual problem?
   - What friction points would they hit?
   - What's missing from their perspective?
6. **Iterate** until PRD is solid
7. **Theban** as final judge — approves or redirects

#### Phase 3: Implementation

8. **Claude Code** implements based on approved PRD
9. **Jarvis** does acceptance testing:
   - Browser-based QA (actually load and click)
   - Persona-based journey testing
   - Cross-reference against PRD acceptance criteria
10. **Iterate** on implementation until all acceptance tests pass

#### Phase 4: Learning

11. **Jarvis** documents lessons learned:
    - What worked well?
    - What almost went wrong?
    - What would we do differently?
    - Update MEMORY.md, this file, or relevant docs

---

## Acceptance Test Structure

Acceptance tests MUST include the full journey, not just the destination:

```
AT-X: [Test Name] ([Persona])
Starting State: Where is the user when the test begins?
Journey:
1. First action they take
2. Second action...
3. ...
Checkpoints:
- [ ] Specific thing that should be true at step 1
- [ ] Specific thing that should be true at step 2
- [ ] ...
End State: What's the final outcome?
Failure Modes:
- What could go wrong at each step?
```

---

## Persona Library

### Brand Personas

**Kyle (Sales Rep at Reputable)**
- Needs to demo the product to prospects
- Cares about: polish, speed, "wow factor"
- Pain: anything that makes him look unprepared

**Amber (DTC Brand Founder)**
- Evaluating whether to run a study
- Cares about: ROI, ease of use, what her customers will see
- Pain: complexity, hidden costs, brand risk

**Marcus (Brand Marketing Manager)**
- Will use the results in marketing
- Cares about: compelling evidence, shareable assets, compliance
- Pain: weak data, boring presentation, legal risk

### End Consumer Personas

**Sarah (Health-Conscious Shopper)**
- Sees the widget on a product page
- Cares about: trust, real results, people like her
- Pain: fake-looking testimonials, no substance

### Research Personas

**Dr. Chen (Scientific Advisor)**
- Reviews methodology
- Cares about: rigor, reproducibility, honest representation
- Pain: overclaiming, cherry-picking, misleading stats

---

## Anti-Patterns (Don't Do These)

1. **Don't conflate Reputable with reputation management** — it's efficacy evidence
2. **Don't build for clinics/hospitals** — customers are DTC brands
3. **Don't hide the wearable data** — it's the differentiator
4. **Don't test destination without journey** — full user flow matters
5. **Don't assume field names** — check actual data shapes
6. **Don't use hardcoded fallbacks that make real data look fake**
7. **Don't overwrite real customer data with simulation**

---

## Claude Code Prompt Template

When invoking Claude Code for PRD or implementation, include:

```
## Context: Reputable

Reputable helps health/wellness brands prove product efficacy using real-world wearable data (Oura, etc.).

- Customers: DTC brands (supplements, functional foods, skincare, wellness hardware)
- Value prop: Faster & cheaper than clinical trials, more credible than reviews
- Key differentiator: Real biometric data (REM, deep sleep, HRV) — not surveys or reviews
- Buyer: Curious DTC founder, not skeptical enterprise VP

## Feature Request

[Specific request here]

## Relevant Personas

[Which personas care about this and why]

## Technical Context

[What exists, what this connects to, constraints]

## Deliverable

[PRD / Implementation / etc.]

## Acceptance Criteria

[What "done" looks like — journey-based]
```

---

## Lessons Learned (Updated After Each Feature)

### 2026-01-29: Widget Tab UX Refactor

**What worked:**
- Focused prompts to Claude Code (specific tasks, not rewrites)
- Persona critique (Kyle lens) caught issues first pass missed
- Iteration loop — first pass rarely perfect, plan for v2

**What to improve:**
- **Listen for "still"** — When Theban says "you still have X showing," he means REMOVE it, not soften it
- **PTY mode required** — Claude Code CLI needs `pty: true` for output capture
- **Longer timeouts** — 300s timeout, 120000ms yield for complex tasks

**Technical pattern:**
```bash
exec command="/Users/clawdbot/.npm-global/bin/claude -p --dangerously-skip-permissions 'prompt'" pty=true timeout=300 yieldMs=120000
```

---

*Last updated: 2026-01-29*
