# Assessment Changelog

This file tracks changes to the Reputable Assessment Library. Each assessment has a version number that is locked to studies when they are created.

**Important**: Once a study uses an assessment version, that version is immutable for that study. Changes to assessments only affect NEW studies.

---

## Version 1.0 (2025-01-15)

**Initial Release** - All 14 assessments established with validated questions.

### Assessments Included:

| Assessment | Short Name | Tier | Questions | Check-in Days |
|------------|------------|------|-----------|---------------|
| Sleep | RSA | 1 | 4 | Days 1, 30 |
| Recovery | RRA | 1 | 4 | Days 1, 30 |
| Fitness | RFA | 1 | 5 | Days 1, 30 |
| Stress | RSS | 2 | 8 | Days 1, 7, 14, 21, 28 |
| Energy | REA | 3 | 5 | Days 1, 7, 14, 21, 28 |
| Focus | RFC | 3 | 6 | Days 1, 7, 14, 21, 28 |
| Mood | RMA | 3 | 7 | Days 1, 7, 14, 21, 28 |
| Anxiety | RAA | 3 | 6 | Days 1, 7, 14, 21, 28 |
| Pain | RPA | 3 | 5 | Days 1, 7, 14, 21, 28 |
| Skin | RSK | 4 | 5 | Days 1, 14, 28 |
| Gut | RGA | 4 | 6 | Days 1, 7, 14, 21, 28 |
| Immunity | RIA | 4 | 5 | Days 1, 14, 28 |
| Hair | RHA | 4 | 5 | Days 1, 14, 28 |
| Weight | RWA | 4 | 5 | Days 1, 7, 14, 21, 28 |

### Question Scales Used:
- **5-point scale (1-5)**: Most subjective questions (sleep quality, energy, focus)
- **10-point scale (1-10)**: Pain intensity
- **11-point scale (0-10)**: NRS-style pain scales
- **Frequency scales**: "Never/Rarely/Sometimes/Often/Always" patterns
- **Numeric entry**: Weight, days sick

---

## How to Add a New Version

When the clinical team needs to modify an assessment:

1. **DO NOT modify existing questions in-place** if any study has used that version
2. Instead, create a new version (e.g., `1.1` or `2.0`)
3. Update the assessment's `version` and `versionDate` in `assessments.ts`
4. Update the corresponding `assessmentVersion` in `CATEGORY_CONFIGS`
5. Document the change below

### Version Numbering Convention:
- **Minor version (1.0 -> 1.1)**: Question wording clarification, no scale change
- **Major version (1.0 -> 2.0)**: Scale change, questions added/removed

---

## Template for Future Changes

```markdown
## Version X.Y (YYYY-MM-DD)

**Summary**: Brief description of what changed

### Changes:
- [Assessment Name]: Description of change
  - Before: "Old question text / old scale"
  - After: "New question text / new scale"

### Studies Affected:
- Only NEW studies will use this version
- Existing studies continue using their locked version

### Rationale:
Why this change was needed (e.g., clinical feedback, participant confusion)
```

---

## Questions?

Contact the clinical research team for questions about assessment methodology or version updates.
