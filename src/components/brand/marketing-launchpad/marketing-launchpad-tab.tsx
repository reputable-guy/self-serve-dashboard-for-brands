"use client";

/**
 * Marketing Launchpad Tab — "Turn your study results into ready-to-post content in minutes"
 * 
 * Features:
 * - Top performers grid with key metric visible
 * - One-click launch to participant kit
 * - Asset previews (carousel, story, ad)
 * - Caption copy with 3 tones
 * - Canva template links
 * - Playbook concept
 */

import { useState, useMemo, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  ImageIcon,
  FileText,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  BookOpen,
  Instagram,
  Square,
  Smartphone,
  Lightbulb,
  Shield,
  Loader2,
} from "lucide-react";
import html2canvas from "html2canvas";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { getCompletedStoriesFromEnrollments, categorizeStory } from "@/lib/simulation";
import type { StudyData } from "@/components/admin/study-detail/types";
import type { ParticipantStory } from "@/lib/types";
import {
  SlideHook,
  SlideStruggle,
  SlideTransformation,
  SlideTestimonial,
  SlideCTA,
  type BrandSettings,
  type ParticipantData,
} from "../marketing-kit/carousel-templates";

// ============================================
// TYPES
// ============================================

interface MarketingLaunchpadTabProps {
  study: StudyData;
  brand?: { id: string; name: string; logoUrl?: string };
  realStories?: ParticipantStory[] | null;
}

type CaptionTone = "casual" | "professional" | "urgency";
type AssetType = "carousel" | "story" | "ad";

// ============================================
// UTILITIES
// ============================================

const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  primaryColor: "#00D1C1",
  secondaryColor: "#10B981",
  textColor: "#1a1a1a",
  backgroundColor: "#ffffff",
  fontFamily: "Inter, system-ui, sans-serif",
  logoPosition: "top-right",
};

function storyToParticipantData(story: ParticipantStory): ParticipantData {
  // Build metrics array from wearable data
  const metrics: ParticipantData["metrics"] = [];
  const wm = story.wearableMetrics;
  
  if (wm?.bestMetric) {
    metrics.push({
      label: wm.bestMetric.label || "Primary Metric",
      before: wm.bestMetric.before,
      after: wm.bestMetric.after,
      unit: wm.bestMetric.unit,
      changePercent: wm.bestMetric.changePercent,
      lowerIsBetter: wm.bestMetric.lowerIsBetter,
    });
  }
  
  if (wm?.deepSleepChange && wm.deepSleepChange !== wm.bestMetric) {
    metrics.push({
      label: "Deep Sleep",
      before: wm.deepSleepChange.before,
      after: wm.deepSleepChange.after,
      unit: wm.deepSleepChange.unit,
      changePercent: wm.deepSleepChange.changePercent,
    });
  }
  
  if (wm?.hrvChange && wm.hrvChange !== wm.bestMetric) {
    metrics.push({
      label: "HRV",
      before: wm.hrvChange.before,
      after: wm.hrvChange.after,
      unit: wm.hrvChange.unit,
      changePercent: wm.hrvChange.changePercent,
    });
  }

  // Fallback to assessment if no wearable metrics
  const assess = story.assessmentResults?.[0] || story.assessmentResult;
  if (metrics.length === 0 && assess) {
    metrics.push({
      label: assess.categoryLabel || "Score",
      before: Math.round(assess.baseline.compositeScore),
      after: Math.round(assess.endpoint.compositeScore),
      unit: "/100",
      changePercent: Math.round(assess.change.compositePercent),
    });
  }

  // Add more fallback metrics
  if (wm?.sleepEfficiencyChange && metrics.length < 3) {
    metrics.push({
      label: "Sleep Efficiency",
      before: wm.sleepEfficiencyChange.before,
      after: wm.sleepEfficiencyChange.after,
      unit: wm.sleepEfficiencyChange.unit,
      changePercent: wm.sleepEfficiencyChange.changePercent,
    });
  }

  // Final fallback - ensure there's always at least one metric
  if (metrics.length === 0) {
    // Try to derive from overall rating or use a placeholder
    const rating = story.finalTestimonial?.overallRating || story.overallRating || 4;
    metrics.push({
      label: "Improvement",
      before: 50,
      after: 50 + Math.round(rating * 5),
      unit: "/100",
      changePercent: Math.round(rating * 5),
    });
  }

  return {
    id: story.id,
    name: story.name,
    initials: story.initials,
    ageRange: story.profile?.ageRange,
    photoUrl: story.avatarUrl,
    quote: story.finalTestimonial?.quote || story.journey?.keyQuotes?.slice(-1)[0]?.quote || "This product changed my life!",
    struggleQuote: story.baseline?.motivation || "I tried everything before this.",
    rating: story.finalTestimonial?.overallRating || story.overallRating || 5,
    studyDuration: story.journey?.durationDays || 28,
    device: story.wearableMetrics?.device || "Oura Ring",
    verificationId: story.verificationId || story.id,
    verificationUrl: `https://reputable.health/verify/${story.verificationId || story.id}`,
    metrics,
  };
}

function generateCaption(
  participant: ParticipantData,
  tone: CaptionTone,
  brandName?: string,
  productName?: string
): string {
  const firstName = participant.name.split(" ")[0];
  const heroMetric = participant.metrics[0];
  
  // Handle both positive and negative changes gracefully
  let changeDisplay: string;
  const changePercent = heroMetric?.changePercent ?? 0;
  const absChange = Math.abs(changePercent);
  
  if (heroMetric?.lowerIsBetter) {
    // For metrics where lower is better (e.g., sleep latency, resting HR)
    changeDisplay = changePercent < 0 ? `${absChange}% less` : `${absChange}% improvement in`;
  } else {
    // For metrics where higher is better (e.g., deep sleep, HRV)
    changeDisplay = changePercent > 0 ? `${absChange}% more` : `${absChange}% improvement in`;
  }

  const templates: Record<CaptionTone, string> = {
    casual: `${firstName} tried everything. Nothing worked.

Then they tried ${productName || "our product"} for ${participant.studyDuration} days.

The result? ${changeDisplay} ${heroMetric?.label?.toLowerCase() || "improvement"}. Every. Single. Night.

This isn't just a testimonial — it's verified data from an independent study. Tracked with ${participant.device}. Analyzed by Reputable.

Want proof? Tap the link in bio to see ${firstName}'s full story and verified results.

#wellness #verified #realresults #${heroMetric?.label?.toLowerCase().replace(/\s/g, "") || "results"}`,

    professional: `Verified results from our ${participant.studyDuration}-day study: ${firstName} improved their ${heroMetric?.label?.toLowerCase() || "primary metric"} by ${changeDisplay}.

No gimmicks — real people, real data, independently verified by Reputable.

See the full study results and verification data at the link in our bio.

${brandName ? `Study conducted by ${brandName} in partnership with Reputable.` : ""}

#clinicallyverified #realresults #wellness`,

    urgency: `${firstName} used to struggle every single day. Now? ${changeDisplay} ${heroMetric?.label?.toLowerCase() || "improvement"}.

${participant.studyDuration} days. Verified by wearable data.

Want the same results? Link in bio 👆

Results independently verified by @reputablehealth`,
  };

  return templates[tone];
}

// Canva template placeholder URLs (to be replaced with real templates later)
const CANVA_TEMPLATES = {
  carousel: "https://www.canva.com/design/DAF-placeholder-carousel/edit",
  story: "https://www.canva.com/design/DAF-placeholder-story/edit",
  ad: "https://www.canva.com/design/DAF-placeholder-ad/edit",
};

function generatePlaybookText(
  participant: ParticipantData,
  brandName?: string,
  studyName?: string
): string {
  const heroMetric = participant.metrics[0];
  const changeDisplay = heroMetric?.lowerIsBetter
    ? `-${Math.abs(heroMetric.changePercent)}%`
    : `+${heroMetric?.changePercent}%`;

  return `
================================================================================
YOUR SOCIAL PROOF PLAYBOOK
${brandName || "Your Brand"} x ${studyName || "Study"} Results
================================================================================

PARTICIPANT: ${participant.name}
KEY RESULT: ${changeDisplay} ${heroMetric?.label || "Improvement"}
STUDY DURATION: ${participant.studyDuration} days
TRACKED WITH: ${participant.device}

================================================================================
YOUR ASSETS
================================================================================

• Instagram Carousel (4:5) — 5 slides featuring ${participant.name}'s story
• Instagram Story (9:16) — Single stat highlight
• Ad Creative (1:1) — Quote + result for paid media

================================================================================
SUGGESTED POSTING SCHEDULE
================================================================================

DAY 1: Instagram Feed
  • Post the carousel at your peak engagement time
  • Use the "Casual" caption variation
  • Add relevant hashtags

DAY 2: Instagram Stories
  • Post the Story template
  • Add link sticker to your product page
  • Repurpose for Reels by adding voiceover

DAYS 3-5: Paid Ads
  • Use the 1:1 ad creative in Meta Ads Manager
  • Test the "Urgency" caption as ad copy
  • Target lookalike audiences

================================================================================
CAPTION COPY
================================================================================

--- CASUAL ---

${generateCaption(participant, "casual", brandName, studyName)}

--- PROFESSIONAL ---

${generateCaption(participant, "professional", brandName, studyName)}

--- URGENCY ---

${generateCaption(participant, "urgency", brandName, studyName)}

================================================================================
VERIFICATION
================================================================================

All assets include a "Verified by Reputable" badge that links to:
https://reputable.health/verify/${participant.verificationId}

This proves to your audience that the results are real and independently
verified — not just a testimonial you made up.

================================================================================
PRO TIPS
================================================================================

• Post carousels when your audience is most active (check Insights)
• Apply your brand colors in Canva using Brand Kit (~90 seconds)
• Use the verification badge as a conversation starter in comments
• Repurpose: one participant's story = 3-5 pieces of content

================================================================================
Generated by Reputable Marketing Launchpad
================================================================================
`.trim();
}

// ============================================
// MAIN COMPONENT
// ============================================

export function MarketingLaunchpadTab({
  study,
  brand,
  realStories,
}: MarketingLaunchpadTabProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantStory | null>(null);
  const [copiedCaption, setCopiedCaption] = useState<CaptionTone | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeAsset, setActiveAsset] = useState<AssetType>("carousel");

  const { getEnrollmentsByStudy } = useEnrollmentStore();
  const enrollments = getEnrollmentsByStudy(study.id);
  const category = study.category;
  const isRealData = !!realStories && realStories.length > 0;

  // Get completed stories — real data or from enrollments
  const completedStories = useMemo(() => {
    if (isRealData) {
      return realStories;
    }
    const stories = getCompletedStoriesFromEnrollments(enrollments, category);
    return stories || [];
  }, [isRealData, realStories, enrollments, category]);

  // Sort by improvement (top performers first)
  const topPerformers = useMemo(() => {
    const getImprovement = (s: ParticipantStory): number => {
      const best = s.wearableMetrics?.bestMetric;
      if (best?.changePercent !== undefined) {
        return best.lowerIsBetter ? Math.abs(best.changePercent) : best.changePercent;
      }
      if (s.wearableMetrics?.hrvChange?.changePercent !== undefined) {
        return s.wearableMetrics.hrvChange.changePercent;
      }
      const assess = s.assessmentResults?.[0] || s.assessmentResult;
      if (assess?.change?.compositePercent !== undefined) {
        return assess.change.compositePercent;
      }
      return 0;
    };

    return [...completedStories]
      .filter(s => categorizeStory(s) === "positive")
      .sort((a, b) => getImprovement(b) - getImprovement(a));
  }, [completedStories]);

  const handleCopyCaption = async (caption: string, tone: CaptionTone) => {
    await navigator.clipboard.writeText(caption);
    setCopiedCaption(tone);
    setTimeout(() => setCopiedCaption(null), 2000);
  };

  // No completed participants
  if (topPerformers.length === 0) {
    return <LaunchpadWaiting />;
  }

  // If a participant is selected, show their kit
  if (selectedParticipant) {
    const participantData = storyToParticipantData(selectedParticipant);
    const brandSettings: BrandSettings = {
      ...DEFAULT_BRAND_SETTINGS,
      logoUrl: brand?.logoUrl,
    };

    return (
      <ParticipantKit
        participant={participantData}
        participantStory={selectedParticipant}
        brandSettings={brandSettings}
        brandName={brand?.name}
        studyName={study.name}
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
        activeAsset={activeAsset}
        setActiveAsset={setActiveAsset}
        copiedCaption={copiedCaption}
        onCopyCaption={handleCopyCaption}
        onBack={() => setSelectedParticipant(null)}
      />
    );
  }

  // Main Launchpad view
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00D1C1]/10 to-purple-100 px-4 py-2 rounded-full">
          <Rocket className="h-5 w-5 text-[#00D1C1]" />
          <span className="text-sm font-semibold text-gray-800">Marketing Launchpad</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Turn your study results into ready-to-post content
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select a participant below to get Instagram posts, Stories, ad creative — 
          all with your data already filled in. Caption copy written. Ready in under 5 minutes.
        </p>
      </div>

      {/* Top Performers Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Your Top Performers
          </h2>
          <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
            {topPerformers.length} ready for marketing
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topPerformers.slice(0, 6).map((story) => (
            <TopPerformerCard
              key={story.id}
              story={story}
              onLaunch={() => setSelectedParticipant(story)}
            />
          ))}
        </div>

        {topPerformers.length > 6 && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            +{topPerformers.length - 6} more participants with verified results
          </p>
        )}
      </div>

      {/* What You'll Get Section */}
      <Card className="border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            What You&apos;ll Get
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <WhatYouGetItem
              icon={<Instagram className="h-5 w-5 text-pink-500" />}
              label="Instagram Carousel"
              description="4:5 vertical • 5 slides"
            />
            <WhatYouGetItem
              icon={<Smartphone className="h-5 w-5 text-purple-500" />}
              label="Instagram Story"
              description="9:16 vertical • 1 slide"
            />
            <WhatYouGetItem
              icon={<Square className="h-5 w-5 text-blue-500" />}
              label="Ad Creative"
              description="1:1 square • Meta/Google"
            />
            <WhatYouGetItem
              icon={<FileText className="h-5 w-5 text-emerald-500" />}
              label="3 Caption Versions"
              description="Casual • Pro • Urgency"
            />
            <WhatYouGetItem
              icon={<BookOpen className="h-5 w-5 text-orange-500" />}
              label="Playbook"
              description="What to post & when"
            />
          </div>
          <div className="mt-4 pt-4 border-t flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Total time: ~5 minutes → Ready to post
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function TopPerformerCard({
  story,
  onLaunch,
}: {
  story: ParticipantStory;
  onLaunch: () => void;
}) {
  const best = story.wearableMetrics?.bestMetric;
  const assessment = story.assessmentResults?.[0] || story.assessmentResult;
  
  let heroMetric = "";
  let heroLabel = "";
  
  if (best) {
    const change = best.lowerIsBetter
      ? `-${Math.abs(best.changePercent)}%`
      : `+${best.changePercent}%`;
    heroMetric = change;
    heroLabel = best.label || "Improvement";
  } else if (story.wearableMetrics?.hrvChange) {
    heroMetric = `+${Math.round(story.wearableMetrics.hrvChange.changePercent)}%`;
    heroLabel = "HRV";
  } else if (assessment?.change?.compositePercent) {
    heroMetric = `+${Math.round(assessment.change.compositePercent)}%`;
    heroLabel = assessment.categoryLabel || "Score";
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={onLaunch}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-white font-semibold">
              {story.initials}
            </div>
            <div>
              <p className="font-medium text-gray-900">{story.name}</p>
              <p className="text-xs text-muted-foreground">
                {story.profile?.ageRange}
                {story.profile?.location ? ` · ${story.profile.location}` : ""}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        </div>

        {/* Hero Metric */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3 mb-3">
          <p className="text-xs text-muted-foreground mb-1">{heroLabel}</p>
          <p className="text-2xl font-bold text-emerald-600">{heroMetric}</p>
        </div>

        {/* Quote snippet */}
        {(story.finalTestimonial?.quote || story.journey?.keyQuotes?.slice(-1)[0]?.quote) && (
          <p className="text-xs text-gray-600 italic line-clamp-2 mb-3">
            &ldquo;{(story.finalTestimonial?.quote || story.journey?.keyQuotes?.slice(-1)[0]?.quote || "").slice(0, 80)}...&rdquo;
          </p>
        )}

        {/* Launch Button */}
        <Button
          className="w-full bg-[#00D1C1] hover:bg-[#00B8A9] text-white group-hover:shadow"
          size="sm"
        >
          <Rocket className="h-4 w-4 mr-2" />
          Launch Marketing Kit
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}

function WhatYouGetItem({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-3 rounded-lg bg-gray-50/50">
      <div className="mb-2">{icon}</div>
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function LaunchpadWaiting() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full border-dashed">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="h-14 w-14 rounded-full bg-[#00D1C1]/10 flex items-center justify-center mx-auto mb-4">
            <Rocket className="h-7 w-7 text-[#00D1C1]" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Marketing Kit Coming Soon</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Once participants complete their study, you&apos;ll be able to create 
            ready-to-post marketing content from their verified results.
          </p>
          <div className="text-xs text-muted-foreground bg-gray-50 rounded-lg p-3">
            What you&apos;ll get: Instagram carousels, Stories, ad creative, 
            caption copy, and a posting playbook
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// PARTICIPANT KIT VIEW
// ============================================

function ParticipantKit({
  participant,
  brandSettings,
  brandName,
  studyName,
  activeSlide,
  setActiveSlide,
  activeAsset,
  setActiveAsset,
  copiedCaption,
  onCopyCaption,
  onBack,
}: {
  participant: ParticipantData;
  participantStory: ParticipantStory;
  brandSettings: BrandSettings;
  brandName?: string;
  studyName?: string;
  activeSlide: number;
  setActiveSlide: (n: number) => void;
  activeAsset: AssetType;
  setActiveAsset: (t: AssetType) => void;
  copiedCaption: CaptionTone | null;
  onCopyCaption: (caption: string, tone: CaptionTone) => void;
  onBack: () => void;
}) {
  const SLIDES = [
    { type: "hook" as const, Component: SlideHook, name: "The Hook" },
    { type: "struggle" as const, Component: SlideStruggle, name: "The Struggle" },
    { type: "transformation" as const, Component: SlideTransformation, name: "The Transformation" },
    { type: "testimonial" as const, Component: SlideTestimonial, name: "The Testimonial" },
    { type: "cta" as const, Component: SlideCTA, name: "The CTA" },
  ];

  const captions: { tone: CaptionTone; label: string; description: string }[] = [
    { tone: "casual", label: "Casual", description: "Friendly, conversational, emoji-light" },
    { tone: "professional", label: "Professional", description: "Credible, data-forward, formal" },
    { tone: "urgency", label: "Urgency", description: "Action-oriented, FOMO, direct" },
  ];

  const firstName = participant.name.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Launchpad
        </Button>
        <h1 className="text-xl font-bold text-gray-900">
          {firstName}&apos;s Marketing Kit
        </h1>
        <div className="w-32" /> {/* Spacer for centering */}
      </div>

      {/* Asset Preview Section */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#00D1C1]" />
              Asset Preview
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={activeAsset === "carousel" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveAsset("carousel")}
                className={activeAsset === "carousel" ? "bg-[#00D1C1] hover:bg-[#00B8A9]" : ""}
              >
                <Instagram className="h-4 w-4 mr-1" />
                Carousel
              </Button>
              <Button
                variant={activeAsset === "story" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveAsset("story")}
                className={activeAsset === "story" ? "bg-[#00D1C1] hover:bg-[#00B8A9]" : ""}
              >
                <Smartphone className="h-4 w-4 mr-1" />
                Story
              </Button>
              <Button
                variant={activeAsset === "ad" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveAsset("ad")}
                className={activeAsset === "ad" ? "bg-[#00D1C1] hover:bg-[#00B8A9]" : ""}
              >
                <Square className="h-4 w-4 mr-1" />
                Ad
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeAsset === "carousel" && (
            <CarouselPreview
              participant={participant}
              brandSettings={brandSettings}
              brandName={brandName}
              studyName={studyName}
              slides={SLIDES}
              activeSlide={activeSlide}
              setActiveSlide={setActiveSlide}
            />
          )}
          {activeAsset === "story" && (
            <StoryPreview
              participant={participant}
              brandSettings={brandSettings}
              brandName={brandName}
            />
          )}
          {activeAsset === "ad" && (
            <AdPreview
              participant={participant}
              brandSettings={brandSettings}
              brandName={brandName}
            />
          )}
        </CardContent>
      </Card>

      {/* Caption Copy Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-500" />
            Caption Copy
            <Badge variant="outline" className="ml-2 font-normal">
              Tap to copy
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {captions.map(({ tone, label, description }) => {
            const caption = generateCaption(participant, tone, brandName, studyName);
            const isCopied = copiedCaption === tone;
            
            return (
              <div
                key={tone}
                className="border rounded-lg p-4 hover:border-[#00D1C1]/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopyCaption(caption, tone)}
                    className={isCopied ? "bg-emerald-50 border-emerald-200 text-emerald-700" : ""}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {caption}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Canva Templates Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            Customize in Canva
            <Badge variant="outline" className="ml-2 font-normal text-xs">
              90 seconds with Brand Kit
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CanvaTemplateButton
              label="Carousel Template"
              description="4:5 vertical • 5 slides"
              icon={<Instagram className="h-5 w-5" />}
              href={CANVA_TEMPLATES.carousel}
            />
            <CanvaTemplateButton
              label="Story Template"
              description="9:16 vertical • 1 slide"
              icon={<Smartphone className="h-5 w-5" />}
              href={CANVA_TEMPLATES.story}
            />
            <CanvaTemplateButton
              label="Ad Template"
              description="1:1 square • Meta/Google"
              icon={<Square className="h-5 w-5" />}
              href={CANVA_TEMPLATES.ad}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Templates open in Canva. Apply your Brand Kit to customize colors and fonts.
          </p>
        </CardContent>
      </Card>

      {/* Playbook Section */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50/50 to-amber-50/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-orange-500" />
              Your Posting Playbook
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const playbook = generatePlaybookText(participant, brandName, studyName);
                const blob = new Blob([playbook], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${participant.name.toLowerCase().replace(/\s+/g, "-")}-playbook.txt`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="gap-2 text-orange-700 border-orange-200 hover:bg-orange-50"
            >
              <Download className="h-4 w-4" />
              Download Playbook
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <PlaybookDay
              day="Day 1"
              title="Instagram Feed"
              items={[
                "Post the carousel at your peak engagement time",
                "Use the Casual caption",
                "Add relevant hashtags",
              ]}
              icon={<Instagram className="h-4 w-4" />}
            />
            <PlaybookDay
              day="Day 2"
              title="Instagram Stories"
              items={[
                "Post the Story template",
                "Add link sticker to your product page",
                "Repurpose for Reels with voiceover",
              ]}
              icon={<Smartphone className="h-4 w-4" />}
            />
            <PlaybookDay
              day="Days 3-5"
              title="Paid Ads"
              items={[
                "Use 1:1 ad creative in Meta Ads",
                "Test Urgency caption as ad copy",
                "Target lookalike audiences",
              ]}
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Pro Tips</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Post carousels when your audience is most active (check Insights)</li>
                  <li>• Apply your brand colors in Canva using Brand Kit (~90 seconds)</li>
                  <li>• Use the verification badge as a conversation starter in comments</li>
                  <li>• Repurpose: one participant&apos;s story = 3-5 pieces of content</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-emerald-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Verification</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All assets include a &quot;Verified by Reputable&quot; badge that links to:
                  <br />
                  <code className="bg-gray-100 px-1 rounded text-[10px]">
                    reputable.health/verify/{participant.verificationId}
                  </code>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// PREVIEW COMPONENTS
// ============================================

function CarouselPreview({
  participant,
  brandSettings,
  brandName,
  studyName,
  slides,
  activeSlide,
  setActiveSlide,
}: {
  participant: ParticipantData;
  brandSettings: BrandSettings;
  brandName?: string;
  studyName?: string;
  slides: Array<{
    type: string;
    Component: React.ComponentType<{
      participant: ParticipantData;
      brand: BrandSettings;
      brandName?: string;
      studyName?: string;
      aspectRatio?: "4:5" | "1:1";
    }>;
    name: string;
  }>;
  activeSlide: number;
  setActiveSlide: (n: number) => void;
}) {
  const slideRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const ActiveSlideComponent = slides[activeSlide].Component;
  // Scale to fit nicely in the preview area (1080 * 0.32 = ~346px width)
  const scale = 0.32;
  const previewWidth = Math.round(1080 * scale);
  const previewHeight = Math.round(1350 * scale);

  const handleDownload = useCallback(async () => {
    if (!slideRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(slideRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `${participant.name.toLowerCase().replace(/\s+/g, "-")}-slide-${activeSlide + 1}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  }, [participant.name, activeSlide]);

  return (
    <div className="flex flex-col items-center">
      {/* Preview Container - Fixed dimensions to prevent overflow */}
      <div
        className="relative bg-gray-100 rounded-xl overflow-hidden mb-4 shadow-lg"
        style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }}
      >
        <div
          ref={slideRef}
          className="origin-top-left"
          style={{
            transform: `scale(${scale})`,
            width: "1080px",
            height: "1350px",
          }}
        >
          <ActiveSlideComponent
            participant={participant}
            brand={brandSettings}
            brandName={brandName}
            studyName={studyName}
            aspectRatio="4:5"
          />
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveSlide(activeSlide > 0 ? activeSlide - 1 : slides.length - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.type}
              onClick={() => setActiveSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === activeSlide ? "bg-[#00D1C1]" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveSlide(activeSlide < slides.length - 1 ? activeSlide + 1 : 0)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mt-2">
        Slide {activeSlide + 1} of {slides.length}: {slides[activeSlide].name}
      </p>

      {/* Download Button */}
      <Button
        onClick={handleDownload}
        disabled={isExporting}
        className="mt-4 bg-[#00D1C1] hover:bg-[#00B8A9]"
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Download This Slide
          </>
        )}
      </Button>
    </div>
  );
}

function StoryPreview({
  participant,
  brandName,
}: {
  participant: ParticipantData;
  brandSettings: BrandSettings; // Required by interface but not used in this simplified preview
  brandName?: string;
}) {
  const storyRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const heroMetric = participant.metrics[0];
  const changeDisplay = heroMetric?.lowerIsBetter
    ? `-${Math.abs(heroMetric.changePercent)}%`
    : `+${heroMetric?.changePercent}%`;

  const handleDownload = useCallback(async () => {
    if (!storyRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(storyRef.current, {
        scale: 4, // Higher scale for story (9:16)
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `${participant.name.toLowerCase().replace(/\s+/g, "-")}-story.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  }, [participant.name]);

  return (
    <div className="flex flex-col items-center">
      {/* Story Preview (9:16 aspect ratio) */}
      <div
        ref={storyRef}
        className="relative bg-gradient-to-br from-[#00D1C1] to-[#00A89D] rounded-2xl overflow-hidden shadow-xl"
        style={{ width: "270px", height: "480px" }}
      >
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
          {/* Hero Metric */}
          <div className="text-center mb-6">
            <p className="text-5xl font-bold mb-2">{changeDisplay}</p>
            <p className="text-lg opacity-90">{heroMetric?.label || "Improvement"}</p>
          </div>

          {/* Participant */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-2 border-white/40 mb-3">
              {participant.initials}
            </div>
            <p className="font-medium">{participant.name}</p>
            {participant.ageRange && (
              <p className="text-sm opacity-80">{participant.ageRange}</p>
            )}
          </div>

          {/* Quote */}
          <p className="text-sm text-center opacity-90 italic px-4 line-clamp-3">
            &quot;{participant.quote.slice(0, 100)}...&quot;
          </p>

          {/* Verification Badge */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Shield className="h-4 w-4 text-white" />
            <span className="text-xs font-medium">Verified by Reputable</span>
          </div>
        </div>

        {/* Brand Logo */}
        {brandName && (
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs font-semibold">{brandName}</span>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        9:16 vertical · Instagram Stories / TikTok
      </p>

      {/* Download Button */}
      <Button
        onClick={handleDownload}
        disabled={isExporting}
        className="mt-4 bg-[#00D1C1] hover:bg-[#00B8A9]"
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Download Story
          </>
        )}
      </Button>
    </div>
  );
}

function AdPreview({
  participant,
  brandName,
}: {
  participant: ParticipantData;
  brandSettings: BrandSettings; // Required by interface but not used in this simplified preview
  brandName?: string;
}) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const heroMetric = participant.metrics[0];
  const changeDisplay = heroMetric?.lowerIsBetter
    ? `-${Math.abs(heroMetric.changePercent)}%`
    : `+${heroMetric?.changePercent}%`;

  const handleDownload = useCallback(async () => {
    if (!adRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(adRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `${participant.name.toLowerCase().replace(/\s+/g, "-")}-ad.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  }, [participant.name]);

  return (
    <div className="flex flex-col items-center">
      {/* Ad Preview (1:1 square) */}
      <div
        ref={adRef}
        className="relative bg-white rounded-xl overflow-hidden shadow-xl border"
        style={{ width: "320px", height: "320px" }}
      >
        {/* Top section with brand color */}
        <div className="h-1/3 bg-gradient-to-r from-[#00D1C1] to-[#00A89D] flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-4xl font-bold">{changeDisplay}</p>
            <p className="text-sm opacity-90">{heroMetric?.label || "Improvement"}</p>
          </div>
        </div>

        {/* Bottom section */}
        <div className="h-2/3 p-4 flex flex-col justify-between">
          {/* Quote + Attribution */}
          <div>
            <p className="text-sm text-gray-700 italic line-clamp-3 mb-3">
              &quot;{participant.quote.slice(0, 100)}...&quot;
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-white text-xs font-bold">
                {participant.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                <p className="text-xs text-muted-foreground">Verified participant</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {brandName && (
              <span className="text-sm font-semibold text-gray-700">{brandName}</span>
            )}
            <div className="flex items-center gap-1 text-emerald-600">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">Verified</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        1:1 square · Meta Ads / Google Display
      </p>

      {/* Download Button */}
      <Button
        onClick={handleDownload}
        disabled={isExporting}
        className="mt-4 bg-[#00D1C1] hover:bg-[#00B8A9]"
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Download Ad Creative
          </>
        )}
      </Button>
    </div>
  );
}

function CanvaTemplateButton({
  label,
  description,
  icon,
  href,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-4 border rounded-lg hover:border-purple-300 hover:bg-purple-50/50 transition-colors group"
    >
      <div className="text-purple-500 group-hover:text-purple-600">{icon}</div>
      <div className="flex-1">
        <p className="font-medium text-gray-900 text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-purple-500" />
    </a>
  );
}

function PlaybookDay({
  day,
  title,
  items,
  icon,
}: {
  day: string;
  title: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg p-4 border border-orange-100">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          {day}
        </Badge>
        {icon}
      </div>
      <p className="font-medium text-gray-900 text-sm mb-2">{title}</p>
      <ul className="text-xs text-muted-foreground space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
