/**
 * Content Generator Utilities
 *
 * Extracts "best bits" and generates enhanced captions from participant stories.
 * Used by the Content Generator Drawer in the Results tab.
 */

import type { ParticipantStory } from "@/lib/types";

// ============================================
// TYPES
// ============================================

export interface BestBits {
  /** Hero metric display string (e.g., "+47% Deep Sleep (32 → 79 min)") */
  heroMetric: string | null;
  /** Best quote from journey or testimonial */
  keyQuote: string | null;
  /** The struggle/motivation from baseline */
  struggle: string | null;
  /** Full verification URL */
  verificationUrl: string;
}

export type CaptionTone = "casual" | "professional" | "urgency";

// ============================================
// HELPER FUNCTIONS
// ============================================

/** Format minutes into human-readable duration */
function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

/** Get the best wearable metric from a story */
function getBestMetric(story: ParticipantStory): {
  label: string;
  before: number;
  after: number;
  unit: string;
  changePercent: number;
  lowerIsBetter?: boolean;
} | null {
  const wm = story.wearableMetrics;

  if (wm?.bestMetric) {
    return {
      label: wm.bestMetric.label || "Primary Metric",
      before: wm.bestMetric.before,
      after: wm.bestMetric.after,
      unit: wm.bestMetric.unit,
      changePercent: wm.bestMetric.changePercent,
      lowerIsBetter: wm.bestMetric.lowerIsBetter,
    };
  }

  // HRV fallback (real data)
  if (wm?.hrvChange) {
    return {
      label: "HRV",
      before: wm.hrvChange.before,
      after: wm.hrvChange.after,
      unit: wm.hrvChange.unit,
      changePercent: wm.hrvChange.changePercent,
    };
  }

  // Assessment fallback
  const assess = story.assessmentResults?.[0] || story.assessmentResult;
  if (assess?.change?.compositePercent !== undefined) {
    return {
      label: assess.categoryLabel || "Score",
      before: Math.round(assess.baseline.compositeScore),
      after: Math.round(assess.endpoint.compositeScore),
      unit: "/100",
      changePercent: Math.round(assess.change.compositePercent),
    };
  }

  return null;
}

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Extract the "best bits" from a participant story for quick copying.
 */
export function extractBestBits(story: ParticipantStory): BestBits {
  const metric = getBestMetric(story);

  // Build hero metric string
  let heroMetric: string | null = null;
  if (metric) {
    const changeDisplay = metric.lowerIsBetter
      ? `↓${Math.abs(metric.changePercent)}%`
      : `+${Math.round(metric.changePercent)}%`;

    const beforeStr = metric.unit === "min" ? formatMinutes(metric.before) : `${metric.before}${metric.unit}`;
    const afterStr = metric.unit === "min" ? formatMinutes(metric.after) : `${metric.after}${metric.unit}`;

    heroMetric = `${changeDisplay} ${metric.label} (${beforeStr} → ${afterStr})`;
  }

  // Get key quote - prefer finalTestimonial, fall back to journey keyQuotes
  let keyQuote: string | null = null;
  if (story.finalTestimonial?.quote) {
    keyQuote = story.finalTestimonial.quote;
  } else if (story.journey?.keyQuotes?.length > 0) {
    // Get the best quote (usually the last one captures the transformation)
    const lastQuote = story.journey.keyQuotes.slice(-1)[0];
    keyQuote = lastQuote?.quote || null;
  }

  // Get struggle from baseline
  let struggle: string | null = null;
  if (story.baseline?.motivation) {
    struggle = story.baseline.motivation;
  } else if (story.baseline?.hopedResults) {
    struggle = story.baseline.hopedResults;
  }

  // Build verification URL
  const verificationId = story.verificationId || story.id;
  const verificationUrl = `https://reputable.health/verify/${verificationId}`;

  return {
    heroMetric,
    keyQuote,
    struggle,
    verificationUrl,
  };
}

/**
 * Generate an enhanced caption for social media posting.
 * Uses rich narrative data when available, falls back gracefully.
 */
export function generateEnhancedCaption(
  story: ParticipantStory,
  tone: CaptionTone,
  brandName?: string,
  productName?: string
): string {
  const firstName = story.name.split(" ")[0];
  const metric = getBestMetric(story);
  const verificationId = story.verificationId || story.id;

  // Check if we have rich narrative data
  const hasRichData = !!(
    story.baseline?.motivation ||
    story.baseline?.triedOther ||
    story.journey?.keyQuotes?.length
  );

  // Build change display
  let changeDisplay = "improved significantly";
  if (metric) {
    const absChange = Math.abs(metric.changePercent);
    if (metric.lowerIsBetter) {
      changeDisplay = `${absChange}% reduction in ${metric.label.toLowerCase()}`;
    } else {
      changeDisplay = `${absChange}% improvement in ${metric.label.toLowerCase()}`;
    }
  }

  const studyDuration = story.journey?.durationDays || 28;
  const device = story.wearableMetrics?.device || "wearable device";
  const product = productName || brandName || "the product";

  // Rich caption templates (when we have narrative data)
  if (hasRichData && tone === "casual") {
    const struggle = story.baseline?.motivation || "";
    const triedBefore = story.baseline?.triedOther;
    const keyQuote = story.journey?.keyQuotes?.slice(-1)[0]?.quote || story.finalTestimonial?.quote;

    // Build caption with struggle as a quote, not grammatically transformed
    let caption = "";

    if (struggle) {
      // Capitalize first letter of struggle for quote
      const cleanStruggle = struggle.charAt(0).toUpperCase() + struggle.slice(1);
      caption += `"${cleanStruggle}"\n\n`;
      caption += `That was ${firstName}'s reality.`;
    } else {
      caption += `${firstName} was struggling.`;
    }

    if (triedBefore && triedBefore !== "Yes, various options") {
      caption += ` ${triedBefore} — nothing worked.`;
    }

    caption += `\n\nThen came ${product}. ${studyDuration} days later?\n\n${changeDisplay}.`;

    if (keyQuote) {
      const shortQuote = keyQuote.length > 100 ? keyQuote.slice(0, 100) + "..." : keyQuote;
      caption += `\n\n"${shortQuote}"`;
    }

    caption += `\n\nThis isn't a testimonial. It's verified data from an independent study tracked with ${device}.`;
    caption += `\n\nSee ${firstName}'s full verified results: reputable.health/verify/${verificationId}`;

    return caption;
  }

  // Standard templates (when data is thin or for other tones)
  const templates: Record<CaptionTone, string> = {
    casual: `${firstName} tried everything. Nothing worked.

Then ${firstName} tried ${product} for ${studyDuration} days.

The result? ${changeDisplay}. Every. Single. Day.

This isn't just a testimonial — it's verified data from an independent study. Tracked with ${device}. Analyzed by Reputable.

Want proof? See ${firstName}'s full story and verified results.

reputable.health/verify/${verificationId}

#wellness #verified #realresults`,

    professional: `Verified results from our ${studyDuration}-day study: ${firstName} achieved ${changeDisplay}.

Study protocol:
• ${studyDuration}-day independent study
• Tracked with ${device}
• Data verified by Reputable

No gimmicks — real people, real data, independently verified.

See the full study results and verification data:
reputable.health/verify/${verificationId}
${brandName ? `\nStudy conducted by ${brandName} in partnership with Reputable.` : ""}
#clinicallyverified #realresults #wellness`,

    urgency: `"I finally found something that works."

${firstName} achieved ${changeDisplay} in just ${studyDuration} days using ${product}.

Not a testimonial. Verified data. ${device} tracked. Independently analyzed.

See the proof: reputable.health/verify/${verificationId}

Want the same results? Link in bio.`,
  };

  return templates[tone];
}

/**
 * Generate a text playbook for posting strategy.
 */
export function generatePlaybookText(
  story: ParticipantStory,
  brandName?: string,
  productName?: string
): string {
  const metric = getBestMetric(story);
  const verificationId = story.verificationId || story.id;
  const studyDuration = story.journey?.durationDays || 28;
  const device = story.wearableMetrics?.device || "wearable device";

  let changeDisplay = "Significant improvement";
  if (metric) {
    changeDisplay = metric.lowerIsBetter
      ? `-${Math.abs(metric.changePercent)}% ${metric.label}`
      : `+${metric.changePercent}% ${metric.label}`;
  }

  return `
================================================================================
CONTENT PLAYBOOK FOR ${story.name.toUpperCase()}
${brandName || "Your Brand"}${productName ? ` — ${productName}` : ""}
================================================================================

PARTICIPANT OVERVIEW
--------------------
Name: ${story.name}
Key Result: ${changeDisplay}
Study Duration: ${studyDuration} days
Tracked With: ${device}
Verification: reputable.health/verify/${verificationId}

================================================================================
BEST BITS (Copy-Ready)
================================================================================

HERO METRIC:
${metric ? `${metric.lowerIsBetter ? "↓" : "+"}${Math.abs(metric.changePercent)}% ${metric.label}` : "N/A"}

KEY QUOTE:
"${story.finalTestimonial?.quote || story.journey?.keyQuotes?.slice(-1)[0]?.quote || "This product changed my life."}"

THE STRUGGLE:
"${story.baseline?.motivation || story.baseline?.hopedResults || "N/A"}"

VERIFICATION LINK:
reputable.health/verify/${verificationId}

================================================================================
CAPTION COPY (3 Versions)
================================================================================

--- CASUAL ---
${generateEnhancedCaption(story, "casual", brandName, productName)}

--- PROFESSIONAL ---
${generateEnhancedCaption(story, "professional", brandName, productName)}

--- URGENCY ---
${generateEnhancedCaption(story, "urgency", brandName, productName)}

================================================================================
POSTING STRATEGY
================================================================================

DAY 1: Instagram Feed Post
• Post during your peak engagement time (check Insights)
• Use the Casual caption
• Include 3-5 relevant hashtags
• Add "Link in bio" CTA

DAY 2: Instagram Stories
• Repost the feed content
• Add link sticker to product page
• Use poll: "Would you try this?"
• Tag @reputablehealth

DAY 3-4: Repurpose Content
• Create a Reel with before/after stats
• Share in relevant Facebook groups
• Post to LinkedIn with Professional caption

DAY 5+: Paid Amplification
• Boost top-performing organic post
• Create Meta ad with Urgency caption
• Target lookalike audiences

================================================================================
PRO TIPS
================================================================================

• The verification badge is your differentiator — make it prominent
• Real data > Claims. Lead with the numbers.
• "Verified by Reputable" builds trust instantly
• One participant story = 3-5 pieces of content minimum
• Respond to comments with the verification link

================================================================================
Generated by Reputable Content Generator
================================================================================
`.trim();
}
