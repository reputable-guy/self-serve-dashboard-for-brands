"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VerificationPage } from "@/components/verification-page";
import { MOCK_TESTIMONIALS, MOCK_PARTICIPANT_STORIES, getStoriesForStudy, MockTestimonial } from "@/lib/mock-data";
import { ALL_LYFEFUEL_STORIES } from "@/lib/lyfefuel-demo-stories";
import { ALL_SENSATE_STORIES } from "@/lib/sensate-demo-stories";
import { SENSATE_REAL_STORIES } from "@/lib/sensate-real-data";
import { SAMPLE_STORIES_BY_CATEGORY } from "@/lib/sample-stories";
import type { StudyProtocol } from "@/lib/types";
import { ArrowLeft, CheckCircle2, Users, TrendingUp, ExternalLink } from "lucide-react";

// Study ID to verification ID mapping for demo purposes
const STUDY_VERIFICATION_MAP: Record<string, { verificationIds: string[], studyTitle: string, productName: string }> = {
  "study-1": {
    verificationIds: ["2025-087", "2025-092", "2025-103"], // Includes Lisa K. (Tier 2) to show assessment results
    studyTitle: "Better Sleep Study",
    productName: "SleepWell Premium",
  },
  "study-2": {
    verificationIds: ["2025-098"],
    studyTitle: "Recovery Enhancement Study",
    productName: "Recovery Plus",
  },
  "study-3": {
    verificationIds: ["2025-103"],
    studyTitle: "Deep Rest Study",
    productName: "Deep Rest Formula",
  },
  // Dedicated stress study to showcase Tier 2 assessment results
  "stress-study": {
    verificationIds: ["2025-103"],
    studyTitle: "Stress Management Study",
    productName: "Calm Focus Formula",
  },
  "demo": {
    verificationIds: ["2025-087", "2025-092", "2025-098", "2025-103"],
    studyTitle: "Sample Study",
    productName: "Demo Product",
  },
};

// Category to sample story mapping - direct links to sample stories by category
const CATEGORY_SAMPLE_ROUTES: Record<string, { category: string, studyTitle: string }> = {
  "sample-sleep": { category: "sleep", studyTitle: "Sleep Quality Study" },
  "sample-recovery": { category: "recovery", studyTitle: "Recovery Enhancement Study" },
  "sample-fitness": { category: "fitness", studyTitle: "Fitness Performance Study" },
  "sample-stress": { category: "stress", studyTitle: "Stress Management Study" },
  "sample-energy": { category: "energy", studyTitle: "Energy & Vitality Study" },
  "sample-focus": { category: "focus", studyTitle: "Focus & Concentration Study" },
  "sample-mood": { category: "mood", studyTitle: "Mood Enhancement Study" },
  "sample-anxiety": { category: "anxiety", studyTitle: "Anxiety Relief Study" },
  "sample-pain": { category: "pain", studyTitle: "Pain Management Study" },
  "sample-gut": { category: "gut", studyTitle: "Gut Health Study" },
  "sample-skin": { category: "skin", studyTitle: "Skin Health Study" },
  "sample-immunity": { category: "immunity", studyTitle: "Immune Support Study" },
  "sample-hair": { category: "hair", studyTitle: "Hair Health Study" },
  "sample-weight": { category: "weight", studyTitle: "Weight Management Study" },
};

// This page displays the verification landing page for a specific testimonial or study
export default function VerifyPage() {
  const params = useParams();
  const id = params.id as string;

  // Check if this is a category sample route (e.g., sample-sleep, sample-stress)
  const categorySampleRoute = CATEGORY_SAMPLE_ROUTES[id];
  if (categorySampleRoute) {
    const sampleStory = SAMPLE_STORIES_BY_CATEGORY[categorySampleRoute.category];

    if (sampleStory) {
      // Create a mock testimonial from the sample story
      const mockTestimonial: MockTestimonial = {
        id: 1,
        participant: sampleStory.story.name,
        initials: sampleStory.story.initials,
        age: parseInt(sampleStory.story.profile.ageRange.split("-")[0]) + 2,
        location: "Sample City, ST",
        completedDay: sampleStory.story.journey.durationDays,
        overallRating: sampleStory.story.overallRating,
        story: sampleStory.story.testimonialResponses?.[1]?.response ||
               `This ${sampleStory.categoryLabel.toLowerCase()} product made a real difference for my ${sampleStory.villainVariable}.`,
        metrics: sampleStory.story.tier === 1 && sampleStory.story.wearableMetrics
          ? [
              { label: "Deep Sleep", value: `+${sampleStory.story.wearableMetrics.deepSleepChange?.changePercent || 20}%`, positive: true },
              { label: "HRV", value: `+${sampleStory.story.wearableMetrics.hrvChange?.changePercent || 15}%`, positive: true },
            ]
          : [
              { label: sampleStory.categoryLabel, value: `+${sampleStory.story.assessmentResult?.change.compositePercent || 50}%`, positive: true },
            ],
        benefits: ["Improved " + sampleStory.villainVariable, "Better overall wellbeing"],
        verified: true,
        verificationId: sampleStory.story.verificationId,
        device: sampleStory.story.wearableMetrics?.device || "Assessment Only",
      };

      return (
        <VerificationPage
          testimonial={mockTestimonial}
          studyTitle={categorySampleRoute.studyTitle}
          productName={`${sampleStory.categoryLabel} Sample Product`}
          studyDuration={sampleStory.story.journey.durationDays}
          studyId={id}
          story={sampleStory.story}
        />
      );
    }
  }

  // Check if this is a study ID
  const studyMapping = STUDY_VERIFICATION_MAP[id];

  if (studyMapping) {
    // Show study overview with all testimonials
    const testimonials = studyMapping.verificationIds
      .map(vId => MOCK_TESTIMONIALS.find(t => t.verificationId === vId))
      .filter(Boolean);

    if (testimonials.length === 0) {
      return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h1 className="text-xl font-semibold mb-2">No Verified Results Yet</h1>
            <p className="text-muted-foreground mb-6">
              This study doesn&apos;t have any verified participant results yet.
              Check back soon!
            </p>
            <Button asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      );
    }

    // Show study-level verification overview
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Header */}
        <div className="border-b bg-background">
          <div className="container max-w-5xl mx-auto px-6 py-4">
            <Link
              href="/admin"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Study Overview */}
        <div className="container max-w-5xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm mb-4">
              <CheckCircle2 className="h-4 w-4" />
              Verified Study Results
            </div>
            <h1 className="text-3xl font-bold mb-2">{studyMapping.studyTitle}</h1>
            <p className="text-lg text-muted-foreground">
              {studyMapping.productName} • {testimonials.length} Verified Participants
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="h-8 w-8 text-[#00D1C1] mx-auto mb-2" />
                <div className="text-2xl font-bold">{testimonials.length}</div>
                <div className="text-sm text-muted-foreground">Verified Participants</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">+21%</div>
                <div className="text-sm text-muted-foreground">Avg. Improvement</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">28</div>
                <div className="text-sm text-muted-foreground">Days Tracked</div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonials List */}
          <h2 className="text-xl font-semibold mb-4">Verified Participant Stories</h2>
          <div className="space-y-4">
            {testimonials.map((testimonial) => {
              // Find the story to check if it has assessment data
              const participantStory = MOCK_PARTICIPANT_STORIES.find(
                (s) => s.verificationId === testimonial!.verificationId ||
                       s.name === testimonial!.participant ||
                       s.initials === testimonial!.initials
              );
              const hasAssessment = participantStory?.tier && participantStory.tier >= 2;

              return (
                <Card key={testimonial!.verificationId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-[#00D1C1]/10 flex items-center justify-center text-[#00D1C1] font-semibold">
                          {testimonial!.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{testimonial!.participant}</span>
                            <span className="text-sm text-muted-foreground">
                              {testimonial!.age}, {testimonial!.location}
                            </span>
                            {hasAssessment && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                                + Assessment
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {testimonial!.story}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-2">
                            {testimonial!.metrics.slice(0, 3).map((metric, i) => (
                              <span key={i} className="text-sm text-green-600 font-medium">
                                {metric.label}: {metric.value}
                              </span>
                            ))}
                            {hasAssessment && participantStory?.assessmentResult && (
                              <span className="text-sm text-purple-600 font-medium">
                                {participantStory.assessmentResult.categoryLabel}: +{participantStory.assessmentResult.change.compositePercent}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link href={`/verify/${testimonial!.verificationId}`}>
                        <Button variant="outline" size="sm">
                          View Story
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Check if this is a sample story verification ID (sample-xxx-001 format)
  const sampleMatch = id.match(/^sample-([a-z]+)-(\d+)$/);
  if (sampleMatch) {
    const category = sampleMatch[1];
    const participantNum = parseInt(sampleMatch[2]);
    const sampleStory = SAMPLE_STORIES_BY_CATEGORY[category];

    // Participant variations for unique stories
    const participantVariations = [
      { name: "Sarah M.", initials: "SM", age: 34, location: "Austin, TX", testimonial: "I was skeptical at first, but the data doesn't lie. The improvements were noticeable within the first week." },
      { name: "Michael R.", initials: "MR", age: 42, location: "Denver, CO", testimonial: "Really impressed with the results. Would definitely recommend to anyone looking to improve their wellness routine." },
      { name: "Jennifer L.", initials: "JL", age: 29, location: "Seattle, WA", testimonial: "This product exceeded my expectations. The wearable tracking really helped me see the objective improvements." },
      { name: "David K.", initials: "DK", age: 38, location: "Portland, OR", testimonial: "The difference was noticeable within the first week. By the end of the study, the improvements were substantial." },
    ];

    // Metric variations for each participant
    const metricVariations = [
      { deepSleep: 23, hrv: 18, composite: 45 },
      { deepSleep: 18, hrv: 12, composite: 38 },
      { deepSleep: 31, hrv: 22, composite: 52 },
      { deepSleep: 27, hrv: 16, composite: 48 },
    ];

    if (sampleStory) {
      const varIndex = Math.min(participantNum - 1, participantVariations.length - 1);
      const participant = participantVariations[varIndex];
      const metrics = metricVariations[varIndex];

      // Create a mock testimonial from the sample story with participant variations
      const mockTestimonial: MockTestimonial = {
        id: participantNum,
        participant: participant.name,
        initials: participant.initials,
        age: participant.age,
        location: participant.location,
        completedDay: sampleStory.story.journey.durationDays,
        overallRating: varIndex === 1 ? 4 : 5,
        story: participant.testimonial,
        metrics: sampleStory.story.tier === 1
          ? [
              { label: "Deep Sleep", value: `+${metrics.deepSleep}%`, positive: true },
              { label: "HRV", value: `+${metrics.hrv}%`, positive: true },
            ]
          : [
              { label: sampleStory.categoryLabel, value: `+${metrics.composite}%`, positive: true },
            ],
        benefits: ["Improved " + sampleStory.villainVariable, "Better overall wellbeing"],
        verified: true,
        verificationId: `SAMPLE-${category.toUpperCase()}-${String(participantNum).padStart(3, '0')}`,
        device: sampleStory.story.wearableMetrics?.device || "Assessment Only",
      };

      return (
        <VerificationPage
          testimonial={mockTestimonial}
          studyTitle={`${sampleStory.categoryLabel} Study`}
          productName={`${sampleStory.categoryLabel} Sample Product`}
          studyDuration={sampleStory.story.journey.durationDays}
          studyId={`sample-${category}`}
          story={{
            ...sampleStory.story,
            name: participant.name,
            initials: participant.initials,
            verificationId: mockTestimonial.verificationId,
          }}
        />
      );
    }
  }

  // Check if this is a LYFEfuel verification ID (LYFE-ENERGY-001, LYFE-SATIETY-002, LYFE-GUT-001, etc.)
  const lyfefuelMatch = id.match(/^LYFE-([A-Z]+)-(\d+)$/);
  if (lyfefuelMatch) {
    // Find the story with this verification ID
    const lyfefuelStory = ALL_LYFEFUEL_STORIES.find(s => s.verificationId === id);

    if (lyfefuelStory) {
      // Determine the study name based on the category
      const categoryMap: Record<string, { studyTitle: string; productName: string }> = {
        "ENERGY": { studyTitle: "Natural Energy Study", productName: "LYFEfuel Daily Essentials Shake" },
        "SATIETY": { studyTitle: "Satiety & Satisfaction Study", productName: "LYFEfuel Daily Essentials Shake" },
        "GUT": { studyTitle: "Digestive Wellness Study", productName: "LYFEfuel Daily Essentials Shake" },
      };
      const category = lyfefuelMatch[1];
      const studyInfo = categoryMap[category] || { studyTitle: "LYFEfuel Study", productName: "LYFEfuel Daily Essentials Shake" };

      // Create a mock testimonial from the story
      const mockTestimonial: MockTestimonial = {
        id: parseInt(lyfefuelMatch[2]),
        participant: lyfefuelStory.name,
        initials: lyfefuelStory.initials,
        age: parseInt(lyfefuelStory.profile.ageRange.split("-")[0]) + 2,
        location: "Sample City, ST",
        completedDay: lyfefuelStory.journey.durationDays,
        overallRating: lyfefuelStory.overallRating,
        story: lyfefuelStory.journey.keyQuotes[lyfefuelStory.journey.keyQuotes.length - 1]?.quote ||
               `This product made a real difference for my ${lyfefuelStory.journey.villainVariable}.`,
        metrics: lyfefuelStory.assessmentResult
          ? [{ label: lyfefuelStory.assessmentResult.categoryLabel, value: `+${lyfefuelStory.assessmentResult.change.compositePercent}%`, positive: true }]
          : [],
        benefits: ["Improved " + lyfefuelStory.journey.villainVariable, "Better overall wellbeing"],
        verified: true,
        verificationId: lyfefuelStory.verificationId,
        // Tier 4 studies don't have wearables, so set device to "None" to indicate assessment-only
        device: lyfefuelStory.tier === 4 ? "None" : (lyfefuelStory.wearableMetrics?.device || "Assessment Only"),
      };

      return (
        <VerificationPage
          testimonial={mockTestimonial}
          studyTitle={studyInfo.studyTitle}
          productName={studyInfo.productName}
          studyDuration={lyfefuelStory.journey.durationDays}
          studyId={`lyfefuel-${category.toLowerCase()}`}
          story={lyfefuelStory}
          hasWearable={lyfefuelStory.tier <= 2} // Only Tier 1-2 have wearables as primary/co-primary
        />
      );
    }
  }

  // Check if this is a REAL Sensate verification ID (SENSATE-REAL-xxx format)
  const sensateRealMatch = id.match(/^SENSATE-REAL-(\d+)$/);
  if (sensateRealMatch) {
    // Find the story with this verification ID
    const realStory = SENSATE_REAL_STORIES.find(s => s.verificationId === id);

    if (realStory) {
      // Real Sensate study info with protocol
      const realStudyInfo = {
        studyTitle: "Sensate Sleep & Stress Study (Real Data)",
        productName: "Sensate Vagus Nerve Device",
        productDescription: "The 10-Minute Vagus Nerve Device Shown to Cut Stress by 48% and Boost Sleep. Sensate uses gentle sound vibrations to quickly calm your nervous system.",
        productImage: "/images/sensate-device.png",
      };

      const realProtocol: StudyProtocol = {
        baselineDays: 30,
        interventionDays: 28,
        wearableTypes: ["Oura Ring"],
        dailyInstructions: "Use Sensate for 10 minutes during your bedtime routine",
        compensationNote: "Participants received the same rebate regardless of their feedback or results",
      };

      // Parse age from ageRange (e.g., "36-45" -> 38)
      const ageRange = realStory.profile.ageRange;
      let age = 35;
      if (ageRange.includes("-")) {
        const parts = ageRange.split("-");
        age = Math.floor((parseInt(parts[0]) + parseInt(parts[1])) / 2);
      } else if (ageRange.includes("+")) {
        age = parseInt(ageRange.replace("+", "")) + 2;
      }

      // Create a mock testimonial from the real story
      const mockTestimonial: MockTestimonial = {
        id: parseInt(sensateRealMatch[1]),
        participant: realStory.name,
        initials: realStory.initials,
        age: age,
        location: realStory.profile.location || "USA",
        completedDay: realStory.journey.durationDays,
        overallRating: realStory.finalTestimonial?.overallRating || realStory.overallRating || 4,
        story: realStory.finalTestimonial?.quote ||
               realStory.journey.keyQuotes[realStory.journey.keyQuotes.length - 1]?.quote ||
               `This product made a real difference for my ${realStory.journey.villainVariable}.`,
        metrics: realStory.wearableMetrics
          ? [
              realStory.wearableMetrics.hrvChange && {
                label: "HRV",
                value: `${realStory.wearableMetrics.hrvChange.changePercent > 0 ? "+" : ""}${realStory.wearableMetrics.hrvChange.changePercent}%`,
                positive: realStory.wearableMetrics.hrvChange.changePercent > 0,
              },
              realStory.wearableMetrics.deepSleepChange && {
                label: "Deep Sleep",
                value: `${realStory.wearableMetrics.deepSleepChange.changePercent > 0 ? "+" : ""}${realStory.wearableMetrics.deepSleepChange.changePercent}%`,
                positive: realStory.wearableMetrics.deepSleepChange.changePercent > 0,
              },
            ].filter(Boolean) as { label: string; value: string; positive: boolean }[]
          : [],
        benefits: realStory.finalTestimonial?.reportedBenefits || ["Improved sleep", "Better stress management"],
        verified: true,
        verificationId: realStory.verificationId || id,
        device: realStory.wearableMetrics?.device || "Oura Ring",
      };

      return (
        <VerificationPage
          testimonial={mockTestimonial}
          studyTitle={realStudyInfo.studyTitle}
          productName={realStudyInfo.productName}
          studyDuration={realStory.journey.durationDays}
          studyId="study-sensate-real"
          story={realStory}
          hasWearable={true}
          productDescription={realStudyInfo.productDescription}
          productImage={realStudyInfo.productImage}
          protocol={realProtocol}
        />
      );
    }
  }

  // Check if this is a Sensate DEMO verification ID (SENSATE-STRESS-001, SENSATE-SLEEP-002, SENSATE-ANXIETY-003, etc.)
  const sensateMatch = id.match(/^SENSATE-([A-Z]+)-(\d+)$/);
  if (sensateMatch) {
    // Find the story with this verification ID
    const sensateStory = ALL_SENSATE_STORIES.find(s => s.verificationId === id);

    if (sensateStory) {
      // Determine the study name based on the category
      const categoryMap: Record<string, { studyTitle: string; productName: string }> = {
        "STRESS": { studyTitle: "Sensate Stress Relief Study", productName: "Sensate Vagus Nerve Device" },
        "SLEEP": { studyTitle: "Sensate Sleep Quality Study", productName: "Sensate Vagus Nerve Device" },
        "ANXIETY": { studyTitle: "Sensate Anxiety & Focus Study", productName: "Sensate Vagus Nerve Device" },
      };
      const category = sensateMatch[1];
      const studyInfo = categoryMap[category] || { studyTitle: "Sensate Study", productName: "Sensate Vagus Nerve Device" };

      // Create a mock testimonial from the story
      const mockTestimonial: MockTestimonial = {
        id: parseInt(sensateMatch[2]),
        participant: sensateStory.name,
        initials: sensateStory.initials,
        age: parseInt(sensateStory.profile.ageRange.split("-")[0]) + 2,
        location: "Sample City, ST",
        completedDay: sensateStory.journey.durationDays,
        overallRating: sensateStory.overallRating,
        story: sensateStory.journey.keyQuotes[sensateStory.journey.keyQuotes.length - 1]?.quote ||
               `This product made a real difference for my ${sensateStory.journey.villainVariable}.`,
        metrics: sensateStory.assessmentResult
          ? [{ label: sensateStory.assessmentResult.categoryLabel, value: `${sensateStory.assessmentResult.headline.includes('reduced') ? '' : '+'}${sensateStory.assessmentResult.change.compositePercent}%`, positive: true }]
          : [],
        benefits: ["Improved " + sensateStory.journey.villainVariable, "Better overall wellbeing"],
        verified: true,
        verificationId: sensateStory.verificationId,
        device: sensateStory.wearableMetrics?.device || "N/A",
      };

      return (
        <VerificationPage
          testimonial={mockTestimonial}
          studyTitle={studyInfo.studyTitle}
          productName={studyInfo.productName}
          studyDuration={sensateStory.journey.durationDays}
          studyId={`sensate-${category.toLowerCase()}`}
          story={sensateStory}
          hasWearable={sensateStory.tier <= 2} // Sensate studies are Tier 2 with wearables
        />
      );
    }
  }

  // Original behavior: look up by verification ID
  const verificationId = id;
  const testimonial = MOCK_TESTIMONIALS.find(
    (t) => t.verificationId === verificationId
  );

  // Also find matching rich story data
  const story = testimonial
    ? MOCK_PARTICIPANT_STORIES.find(
        (s) => s.verificationId === verificationId ||
               s.name === testimonial.participant ||
               s.initials === testimonial.initials
      ) || getStoriesForStudy("sleep quality", "SleepWell Premium", 28).find(
        (s) => s.name === testimonial.participant ||
               s.initials === testimonial.initials
      )
    : undefined;

  if (!testimonial) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h1 className="text-xl font-semibold mb-2">Verification Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find a verified result with ID #{verificationId}.
            This verification may have expired or the ID may be incorrect.
          </p>
          <div className="space-y-2">
            <Button asChild>
              <Link href="/verify/samples">
                Browse Sample Stories
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Mock study data - in production this would come from the API
  const studyData = {
    studyTitle: "Better Sleep Study",
    productName: "SleepWell Premium",
    studyDuration: 28,
    studyId: "study-001",
  };

  return (
    <VerificationPage
      testimonial={testimonial}
      studyTitle={studyData.studyTitle}
      productName={studyData.productName}
      studyDuration={studyData.studyDuration}
      studyId={studyData.studyId}
      story={story}
    />
  );
}
