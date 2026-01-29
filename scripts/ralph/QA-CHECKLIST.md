# QA Checklist — Fill Before Presenting to Theban

## Process Rules (Updated Jan 28 — Theban's demo feedback)
1. **Click every link.** If there's a "Verified Results" link, navigate to it. 404 = fail.
2. **Check for repeated content.** Scroll through 5+ participant cards — are quotes unique? Names diverse?
3. **Test from buyer POV.** Read every label aloud. Would a DTC founder understand without context?
4. **Validate metrics against reality.** Does the metric correspond to an actual wearable API output?
5. **Give heartbeats.** If QA takes >5 min, send a status update.

**This is an artifact, not a process document.**
Every item must have a PASS/FAIL with evidence (screenshot path or specific value).
If any item is FAIL, fix it before presenting. If you can't fix it, list it as a known issue WITH the specific wrong value.

**DO NOT WRITE "✅" WITHOUT EVIDENCE.**

## Study Under Test: _______________
## Date: _______________
## Branch: _______________

---

### Data Accuracy (MOST IMPORTANT)
- [ ] **Avg improvement number:** Computed = ___ | Known ground truth = ___ | MATCH? ___
- [ ] **Participant count:** Displayed = ___ | Actual = ___ | MATCH? ___
- [ ] **Featured participant:** Name = ___ | Their actual result = ___ | Is this a GOOD result? ___
- [ ] **Metrics are REAL wearable outputs?** Listed metrics = ___ | Do these exist in Vital/Oura API? ___ (No composite "Sleep Score" — use REM, deep sleep, latency, efficiency, HRV)
- [ ] **All displayed metrics:** Cross-check at least 3 participants against source data
  - Participant 1: ___ | Source: ___ | Match? ___
  - Participant 2: ___ | Source: ___ | Match? ___
  - Participant 3: ___ | Source: ___ | Match? ___

### Content Diversity (Added Jan 28 — duplicate quote problem)
- [ ] **Quote uniqueness:** Read quotes on 5+ participant cards. Are they ALL distinct? ___ | Any repeats? ___
- [ ] **Name diversity:** Scan participant names. Any duplicates or implausible patterns? ___
- [ ] **"Why they're trying" diversity:** Are motivations varied across participants? ___

### Interaction Testing
- [ ] **Widget click:** Does clicking open the modal? Result: ___
- [ ] **Verification link:** Click the link. Does a page LOAD (not 404)? URL: ___ | HTTP status: ___
- [ ] **All internal links:** Click EVERY link on every tab. List any that don't resolve:
  - Link 1: ___ | Resolves? ___
  - Link 2: ___ | Resolves? ___
- [ ] **Carousel arrows:** Do they navigate? Cards change? ___
- [ ] **FAQ accordion:** Do all 5 expand/collapse? ___
- [ ] **Copy buttons:** Does embed code copy to clipboard? ___
- [ ] **"View as Brand" toggle:** Does switching back to Admin work? ___
- [ ] **Vestigial buttons:** Any buttons that do nothing when clicked? List: ___

### Visual Scan (Every Tab)
- [ ] **Overview tab screenshot:** path: ___
  - Hero numbers look right? ___
  - Featured Result shows best participant? ___
  - Path to Research milestone correct? ___
- [ ] **Insights tab screenshot:** path: ___
  - Cards show distinct people? ___
  - No placeholder/hardcoded data? ___
  - "In their own words" visible without extra click? ___
- [ ] **Results tab screenshot:** path: ___
  - Participants sorted by best results first? ___
  - Badge colors consistent? ___
  - Before/after numbers match source data? ___
- [ ] **Widget tab screenshot:** path: ___
  - Product name clean (no internal names)? ___
  - Widget functional? ___
  - Marketing Kit uses real data? ___

### Strategic Alignment
- [ ] **Am I building on the right study?** Which study was I told to build on? ___
- [ ] **Does the data support what I'm showing?** (If old platform data is limited, am I hiding gaps or pretending they don't exist?) ___
- [ ] **Pankaj test:** Would Pankaj demo this on a customer call right now without warning? ___

### Known Issues (list anything you couldn't fix)
1. ___
2. ___
3. ___

---

**RULE: If this checklist is not filled out, DO NOT present to Theban.**
