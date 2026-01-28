/**
 * Seeded PRNG utility for deterministic simulation.
 *
 * Uses mulberry32 — a fast, high-quality 32-bit PRNG —
 * seeded from a string hash so the same study ID always
 * produces the same sequence of "random" numbers.
 */

/** Simple string → 32-bit integer hash (djb2 variant). */
function hashString(str: string): number {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193); // FNV prime
  }
  return hash >>> 0; // ensure unsigned
}

/** Mulberry32 PRNG — returns a () => number in [0, 1). */
function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Create a deterministic random number generator seeded from a string.
 *
 * ```ts
 * const rng = createSeededRandom("study-123");
 * rng(); // always the same first value for "study-123"
 * ```
 */
export function createSeededRandom(seed: string): () => number {
  return mulberry32(hashString(seed));
}
