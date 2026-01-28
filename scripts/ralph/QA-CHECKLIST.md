# QA Checklist — Fill Before Presenting to Theban

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
- [ ] **All displayed metrics:** Cross-check at least 3 participants against source data
  - Participant 1: ___ | Source: ___ | Match? ___
  - Participant 2: ___ | Source: ___ | Match? ___
  - Participant 3: ___ | Source: ___ | Match? ___

### Interaction Testing
- [ ] **Widget click:** Does clicking open the modal? Result: ___
- [ ] **Verification link:** Click it. Does it load? URL: ___ | HTTP status: ___
- [ ] **Carousel arrows:** Do they navigate? Cards change? ___
- [ ] **FAQ accordion:** Do all 5 expand/collapse? ___
- [ ] **Copy buttons:** Does embed code copy to clipboard? ___
- [ ] **"View as Brand" toggle:** Does switching back to Admin work? ___

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
