# QA Checklist — Sensate Fix (2026-01-28)

## Study Under Test: study-sensate-real (Sensate Sleep & Stress Study)
## Date: 2026-01-28 17:10 EST
## Branch: ralph/brand-view-polish (commit 3a19563)

---

### Data Accuracy
- [x] **Avg improvement number:** Computed = +2% | Known ground truth (validate-data.ts) = +1.9% | MATCH ✅
- [x] **Participant count:** Displayed = 18 completed, 25 enrolled | Actual = 18/25 | MATCH ✅
- [x] **Featured participant:** Celestine | +53% HRV (57→87ms) | Best positive result ✅
- [x] **Cross-check participants:**
  - Celestine: 57→87ms +53% | Source: sensate-real-data.ts ID 4312 | Match ✅
  - Jed: 42→47ms +12% | Source: sensate-real-data.ts ID 4313 | Match ✅
  - Ed: 37→41ms +11% | Source: sensate-real-data.ts ID 4319 | Match ✅

### Interaction Testing
- [x] **Widget click:** Opens VerificationModal with FAQ + participant list ✅
- [x] **Verification link:** /verify/sensate-results loads (HTTP 200 confirmed in dev server logs) ✅
- [x] **Carousel arrows:** Navigate through 18 cards (1-3 of 18 → 2-4 etc) ✅
- [x] **FAQ accordion:** All 5 expand/collapse (tested via snapshot) ✅
- [x] **Copy buttons:** Not tested (clipboard requires user gesture) ⚠️
- [x] **"View as Brand" toggle:** Switches to brand view, "Admin" button returns to admin view ✅

### Visual Scan (Every Tab)
- [x] **Overview tab:** screenshot: browser/cea7df8c.png
  - Hero numbers: 25 enrolled, 0 active, 18 completed, +2% avg improvement ✅
  - Featured Result: Celestine +53% HRV, 5 stars, testimonial, Verified badge ✅
  - Path to Research: 18/30, Early Signal ✓, next milestone Strong Evidence ✅
- [x] **Insights tab:** screenshot: browser/2ce844d9.png
  - Cards show distinct people (Leah, Stewart, Julian) ✅
  - "In their own words" visible WITHOUT expanding ✅
  - Hero symptom "Sleep Quality" same for all (data limitation, not bug) ⚠️
  - "Who They Are" only shows age ranges (data limitation) ⚠️
- [x] **Results tab:** screenshot: browser/70c00356.png
  - Celestine featured first (+53%) ✅
  - All visible cards show positive results (Jed +12%, Duane +12%, Ed +11%, Cielo +8%, Gunnar +8%, Brendon +7%) ✅
  - Consistent green Completed badges ✅
  - Outcome Distribution: 83% positive, 11% neutral, 6% minimal change ✅
- [x] **Widget tab:** screenshot: browser/72951109.png + afb1275a (modal)
  - Product name "Sensate Sleep & Stress" (clean, no internal suffixes) ✅
  - Widget says "18 people verified this product" ✅
  - Modal opens with FAQ + participants ✅
  - Marketing Kit shows real data (18 verified, Leah spotlight) ✅

### Strategic Alignment
- [x] **Right study?** Fixing Sensate as instructed. Next: build demo study ✅
- [x] **Data supports display?** Real HRV data, real testimonials. Limited demographics (old platform) ⚠️ known
- [x] **Pankaj test:** Better than before. Correct numbers, best participants featured. Would still want demo study for full showcase.

### Known Remaining Issues
1. "Sleep Quality" shows for all cards (all participants in same study — data limitation)
2. "Who They Are" only age ranges (old platform didn't collect detailed demographics)
3. "full positioning intelligence available" copy could be clearer
4. Widget modal participants not sorted by best first (FIXED in this commit)
5. Marketing Kit spotlight uses Leah (first in array) — could use best participant instead

---

**QA COMPLETE. All critical bugs from Theban's review fixed and verified.**
