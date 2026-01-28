/**
 * Data Validation Script
 * Run with: npx tsx scripts/ralph/validate-data.ts
 * 
 * Outputs ground truth numbers for QA cross-checking.
 * Compare these against what the UI displays.
 */

// Quick inline calc since we can't easily import the module
function calcPercentChange(baseline: number, intervention: number): number {
  if (baseline === 0) return 0;
  return Math.round(((intervention - baseline) / baseline) * 100);
}

// Hardcoded from sensate-real-data.ts HRV values (source of truth)
const participants = [
  { name: "Leah", id: "1772", hrvBefore: 32, hrvAfter: 26, nps: 8 },
  { name: "Stewart", id: "1773", hrvBefore: 40, hrvAfter: 36, nps: 10 },
  { name: "Julian", id: "1774", hrvBefore: 79, hrvAfter: 78, nps: 6 },
  { name: "Taylor", id: "1775", hrvBefore: 30, hrvAfter: 34, nps: 3 },
  { name: "Tre", id: "1776", hrvBefore: 33, hrvAfter: 32, nps: 9 },
  { name: "Wanda", id: "1777", hrvBefore: 50, hrvAfter: 45, nps: 7 },
  { name: "Lenny", id: "1778", hrvBefore: 22, hrvAfter: 25, nps: 4 },
  { name: "Kate", id: "1779", hrvBefore: 31, hrvAfter: 36, nps: 9 },
  { name: "Joy", id: "1780", hrvBefore: 37, hrvAfter: 47, nps: 7 },
  { name: "Celestine", id: "1781", hrvBefore: 30, hrvAfter: 46, nps: 10 },
  { name: "Sarina", id: "1782", hrvBefore: 63, hrvAfter: 53, nps: 8 },
  { name: "Christina", id: "1783", hrvBefore: 66, hrvAfter: 56, nps: 8 },
  { name: "Lena", id: "1784", hrvBefore: 31, hrvAfter: 32, nps: 5 },
  { name: "Valentina", id: "1785", hrvBefore: 43, hrvAfter: 38, nps: 9 },
  { name: "Tessa", id: "1786", hrvBefore: 44, hrvAfter: 46, nps: 8 },
  { name: "Evelyn", id: "1787", hrvBefore: 33, hrvAfter: 35, nps: 8 },
  { name: "Nadia", id: "1788", hrvBefore: 23, hrvAfter: 23, nps: 9 },
  { name: "Monica", id: "1789", hrvBefore: 56, hrvAfter: 47, nps: 8 },
];

console.log("=== SENSATE REAL DATA — GROUND TRUTH ===\n");
console.log(`Total participants: ${participants.length}`);

// Calculate HRV changes
const hrvChanges = participants.map(p => ({
  ...p,
  hrvChangePercent: calcPercentChange(p.hrvBefore, p.hrvAfter),
  hrvChangeMsRaw: p.hrvAfter - p.hrvBefore,
}));

// Average HRV change
const avgHrvChange = hrvChanges.reduce((sum, p) => sum + p.hrvChangePercent, 0) / hrvChanges.length;
console.log(`\nAvg HRV change: ${avgHrvChange.toFixed(1)}%`);
console.log(`(This is what "Avg Improvement" should show)\n`);

// Sort by best HRV improvement (highest positive change)
const sorted = [...hrvChanges].sort((a, b) => b.hrvChangePercent - a.hrvChangePercent);

console.log("--- Sorted by BEST HRV improvement (should be featured first) ---");
sorted.forEach((p, i) => {
  const marker = p.hrvChangePercent > 0 ? "✅" : p.hrvChangePercent === 0 ? "➖" : "❌";
  console.log(`${i + 1}. ${p.name.padEnd(12)} HRV: ${p.hrvBefore}→${p.hrvAfter} ms (${p.hrvChangePercent > 0 ? "+" : ""}${p.hrvChangePercent}%) NPS: ${p.nps} ${marker}`);
});

console.log("\n--- Positive outcomes (should be highlighted) ---");
const positive = sorted.filter(p => p.hrvChangePercent > 0);
console.log(`${positive.length} of ${participants.length} showed HRV improvement`);
positive.forEach(p => console.log(`  ${p.name}: +${p.hrvChangePercent}%`));

console.log("\n--- Negative/neutral outcomes ---");
const nonPositive = sorted.filter(p => p.hrvChangePercent <= 0);
nonPositive.forEach(p => console.log(`  ${p.name}: ${p.hrvChangePercent}%`));

console.log("\n--- NPS Distribution ---");
const npsGroups = { promoter: 0, passive: 0, detractor: 0 };
participants.forEach(p => {
  if (p.nps >= 9) npsGroups.promoter++;
  else if (p.nps >= 7) npsGroups.passive++;
  else npsGroups.detractor++;
});
console.log(`Promoters (9-10): ${npsGroups.promoter}`);
console.log(`Passives (7-8): ${npsGroups.passive}`);
console.log(`Detractors (0-6): ${npsGroups.detractor}`);
console.log(`NPS Score: ${Math.round(((npsGroups.promoter - npsGroups.detractor) / participants.length) * 100)}`);

console.log("\n=== USE THESE NUMBERS TO CROSS-CHECK THE UI ===");
