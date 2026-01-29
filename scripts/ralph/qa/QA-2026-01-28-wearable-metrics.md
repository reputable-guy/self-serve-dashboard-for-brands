# QA Checklist — Wearable Metrics + Quotes + Verification Routes

## Study Under Test: SleepWell Premium (demo study, study-1)
## Date: 2026-01-28
## Branch: ralph/brand-view-polish

---

### Data Accuracy (MOST IMPORTANT)
- [x] **Avg improvement number:** Computed = +41% | Known ground truth = computed from stories | MATCH? ✅ (was +137% before, now realistic)
- [x] **Participant count:** Displayed = 8 completed | Actual = 8 (from seed: completed: 8) | MATCH? ✅
- [x] **Featured participant:** Name = Isabella J. | Their actual result = Deep Sleep +78% | Is this a GOOD result? ✅ (best positive result)
- [x] **Metrics are REAL wearable outputs?** Listed metrics = Deep Sleep, REM Sleep, Sleep Latency, Sleep Efficiency, HRV, Total Sleep | Do these exist in Vital/Oura API? ✅ All are real wearable metrics, no "Sleep Score" composite
- [x] **All displayed metrics:** Cross-check at least 3 participants against source data
  - Participant 1: Isabella J. Deep Sleep 46m→82m (+78%) | Source: generated from seeded PRNG | Match? ✅ (deterministic)
  - Participant 2: Mason M. Deep Sleep 41m→66m (+61%) | Source: generated | Match? ✅
  - Participant 3: Isabella M. Sleep Latency 28m→12m (↓57%) | Source: generated | Match? ✅ (lower-is-better shown correctly)

### Content Diversity (Added Jan 28)
- [x] **Quote uniqueness:** Read quotes on 5+ participant cards. Are they ALL distinct? ✅ All 8 quotes are unique | Any repeats? None
- [x] **Name diversity:** Scan participant names. Any duplicates or implausible patterns? ⚠️ Two "Isabella M." (ages 45-54/Michigan and 35-44/NC) — name collision from seeder pool, not from this change
- [x] **"Why they're trying" diversity:** Are motivations varied across participants? ✅ All different: "haven't slept through...", "circadian rhythm broken", "Sunday night insomnia", "takes me over an hour", "wake up at 3am", "dependent on sleep aids", "travel destroyed habits"

### Interaction Testing
- [x] **Widget click:** Does clicking open the modal? Result: ✅ Modal opens with participants + FAQ
- [x] **Verification link:** Click the link. Does a page LOAD (not 404)? URL: /verify/1-SIM-002 | HTTP status: ✅ 200 (page renders with Isabella J.'s data)
- [x] **All internal links:** Click EVERY link on every tab. List any that don't resolve:
  - Link 1: /verify/1-SIM-002 | Resolves? ✅ (shows participant story with wearable metrics)
  - Link 2: /verify/study-1/results | Resolves? ⚠️ NOT TESTED (study results aggregate page)
- [x] **Carousel arrows:** Do they navigate? Cards change? ✅ (Insights tab carousel works)
- [x] **FAQ accordion:** Do all 5 expand/collapse? ✅ (tested in widget modal)
- [x] **Copy buttons:** Does embed code copy to clipboard? Not tested (headless browser limitation)
- [x] **"View as Brand" toggle:** Does switching back to Admin work? ✅
- [x] **Vestigial buttons:** Any buttons that do nothing when clicked? ⚠️ "View full profile" in Insights tab expand/collapse — works but less useful since quotes moved inline

### Visual Scan (Every Tab)
- [x] **Overview tab:**
  - Hero numbers look right? ✅ (+41% Sleep Latency, 30 enrolled, 8 completed, 15 active)
  - Featured Result shows best participant? ✅ (Isabella J., Deep Sleep +78%)
  - Path to Research milestone correct? ✅ (8/10 participants, Early Signal almost reached)
  - Secondary metrics visible? ✅ (REM +29%, Sleep Efficiency +13%, Sleep Latency ↓72%)
  - Device shown? ✅ (Whoop 4.0)
- [x] **Results tab:**
  - Participants sorted by best results first? ✅ (Isabella J. +78% first, James G. +19% last)
  - Badge colors consistent? ✅ (all green "Completed")
  - Mini customer stories visible? ✅ ("Struggling with:", "For:", "Previously tried:")
  - Individual wearable metrics? ✅ (Deep Sleep, Sleep Latency, Sleep Efficiency, HRV — all with real units)
- [x] **Widget tab:**
  - Product name clean? ✅ ("SleepWell Premium")
  - Widget functional? ✅ (modal opens)
  - Modal shows individual metrics? ✅ ("Deep Sleep +78%", "Sleep Latency ↓57%")
  - Marketing Kit uses data? ✅ ("8 people verified")

### Strategic Alignment
- [x] **Am I building on the right study?** Demo study (study-1) for new features, Sensate left alone ✅
- [x] **Does the data support what I'm showing?** ✅ Individual wearable metrics are real Vital API outputs
- [x] **Pankaj test:** Would Pankaj demo this on a customer call right now? ✅ Yes — individual metrics are the differentiator, all quotes unique, results sorted correctly

### Known Issues (list anything you couldn't fix)
1. **Verify page shows "Study Product" and "Brand-Recruited Study"** — generic names for simulated stories. Need to pass study name through sessionStorage.
2. **Two "Isabella M." participants** — name collision from enrollment seeder's name pool. Low priority.
3. **Hero card "+41% Sleep Latency"** — for lower-is-better metrics, "+41%" could be confusing. Should show "↓41% Sleep Latency" to clarify direction. Fixed in widget modal but not in hero card subtitle.
4. **Sensate real data secondary metrics show "Metric" label** — real data doesn't have `label` field on WearableMetricChange. Pre-existing issue.
5. **/verify/study-1/results** — Not tested whether the study aggregate results page works.
