"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStudies } from "@/lib/studies-store";
import { MOCK_TESTIMONIALS, MOCK_PARTICIPANT_STORIES, ParticipantStory } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Check,
  Shield,
  Truck,
  RotateCcw,
  BadgeCheck,
  Heart,
  Minus,
  Plus,
  Watch,
  Moon,
  X,
  ChevronRight,
  Play,
  ExternalLink,
  Quote,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  Activity,
} from "lucide-react";

// Cycling hero widget that shows individual stories
function HeroWidget({ testimonials, onOpenModal }: {
  testimonials: typeof MOCK_TESTIMONIALS;
  onOpenModal: (index: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const current = testimonials[currentIndex];

  return (
    <button
      onClick={() => onOpenModal(currentIndex)}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-3 py-2 flex items-center gap-3 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 min-w-[280px] z-10"
    >
      <div className="h-10 w-10 rounded-full bg-[#00D1C1]/20 flex items-center justify-center flex-shrink-0 border-2 border-[#00D1C1]">
        <span className="text-sm font-bold text-[#00D1C1]">{current.initials}</span>
      </div>
      <div className={`flex-1 text-left transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{current.participant}</div>
        <div className="text-sm font-bold text-gray-900">
          Improved Sleep <span className="text-[#00D1C1]">{current.metrics[0]?.value || "+18%"}</span>
        </div>
      </div>
      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        <ChevronRight className="h-4 w-4 text-gray-600" />
      </div>
    </button>
  );
}

// Trustpilot-style badge (shows count + rating, links to full study results)
function TrustBadge({
  count,
  rating,
  onExpand,
  studyResultsUrl,
}: {
  count: number;
  rating: number;
  onExpand: () => void;
  studyResultsUrl?: string;
}) {
  return (
    <div className="space-y-2">
      <button
        onClick={onExpand}
        className="w-full p-4 rounded-xl bg-gradient-to-r from-[#00D1C1]/5 to-[#00D1C1]/10 border border-[#00D1C1]/20 hover:border-[#00D1C1]/40 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#00D1C1] flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">{count} Verified Results</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${star <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500">Featured results from top responders</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#00D1C1] text-sm font-medium group-hover:gap-2 transition-all">
            <span>See Stories</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </button>
      {/* FTC Disclosure Link */}
      <div className="text-center">
        <a
          href={studyResultsUrl || "#"}
          className="text-xs text-gray-400 hover:text-gray-600 underline"
        >
          See full study results →
        </a>
      </div>
    </div>
  );
}

// Journey progress visualization - shows the transformation over time
function JourneyTimeline({ ratings, villainVariable }: {
  ratings: ParticipantStory["journey"]["villainRatings"];
  villainVariable: string
}) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-500";
    if (rating >= 3) return "bg-yellow-500";
    return "bg-red-400";
  };

  const getRatingLabel = (rating: number) => {
    if (rating === 5) return "Much better";
    if (rating === 4) return "Better";
    if (rating === 3) return "Same";
    if (rating === 2) return "Worse";
    return "Much worse";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {ratings.map((r, idx) => (
          <div key={r.day} className="flex flex-col items-center flex-1">
            <div
              className={`h-3 w-3 rounded-full ${getRatingColor(r.rating)} ring-2 ring-white shadow-sm`}
              title={`Day ${r.day}: ${getRatingLabel(r.rating)}`}
            />
            <div className="text-[10px] text-gray-400 mt-1">Day {r.day}</div>
          </div>
        ))}
      </div>
      {/* Connecting line */}
      <div className="relative h-1 mx-2">
        <div className="absolute inset-0 bg-gray-200 rounded-full" />
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 rounded-full"
          style={{ width: "100%" }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Started struggling</span>
        <span className="text-green-600 font-medium">Transformed</span>
      </div>
    </div>
  );
}

// Expanded stories modal - redesigned with narrative structure
function StoriesModal({
  isOpen,
  onClose,
  testimonials,
  initialIndex,
  studyName,
}: {
  isOpen: boolean;
  onClose: () => void;
  testimonials: typeof MOCK_TESTIMONIALS;
  initialIndex: number;
  studyName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    setSelectedIndex(initialIndex);
  }, [initialIndex]);

  if (!isOpen) return null;

  const current = testimonials[selectedIndex];

  // Find matching rich story data
  const story = MOCK_PARTICIPANT_STORIES.find(
    s => s.name === current.participant || s.initials === current.initials
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-full max-h-[90vh]">
          {/* Left: Video/Photo + Participant Carousel */}
          <div className="w-80 flex-shrink-0 bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
            {/* Video/Avatar area */}
            <div className="flex-1 flex items-center justify-center relative p-6">
              {story?.avatarUrl ? (
                <img
                  src={story.avatarUrl}
                  alt={current.participant}
                  className="h-32 w-32 rounded-full object-cover ring-4 ring-[#00D1C1]/50"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-[#00D1C1]/30 flex items-center justify-center ring-4 ring-[#00D1C1]/50">
                  <span className="text-4xl font-bold text-white">{current.initials}</span>
                </div>
              )}
              {current.hasVideo && (
                <button className="absolute inset-0 flex items-center justify-center group">
                  <div className="h-14 w-14 rounded-full border-2 border-white/50 flex items-center justify-center group-hover:border-white group-hover:scale-110 transition-all bg-white/10 backdrop-blur">
                    <Play className="h-5 w-5 text-white ml-1" />
                  </div>
                </button>
              )}
            </div>

            {/* Participant info */}
            <div className="px-6 pb-4 text-white text-center">
              <h3 className="text-lg font-bold">{current.participant}</h3>
              <p className="text-sm text-white/70">{current.age} · {current.location}</p>
              {story && (
                <p className="text-xs text-[#00D1C1] mt-1">{story.profile.lifeStage}</p>
              )}
            </div>

            {/* Participant carousel */}
            <div className="bg-black/50 p-4">
              <div className="text-xs text-white/50 mb-3 text-center">More Stories</div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {testimonials.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedIndex(i)}
                    className={`h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all ${
                      i === selectedIndex
                        ? "bg-[#00D1C1] text-white scale-110 ring-2 ring-[#00D1C1] ring-offset-2 ring-offset-black"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {t.initials}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Story Content - Narrative Structure */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 space-y-6">

              {/* ===== SECTION 1: THE HOOK - Who they are & why they needed help ===== */}
              {story && (
                <div className="space-y-4">
                  {/* Relatable context badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm">
                      <Clock className="h-3.5 w-3.5" />
                      Struggling for {story.baseline.villainDuration}
                    </span>
                    {story.baseline.triedOther && story.baseline.triedOther !== "No" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm">
                        <Target className="h-3.5 w-3.5" />
                        Tried other solutions
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm">
                      <Watch className="h-3.5 w-3.5" />
                      {story.wearableMetrics.device}
                    </span>
                  </div>

                  {/* Why they joined - the relatable hook */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100">
                    <div className="flex items-start gap-3">
                      <Quote className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700 italic leading-relaxed">
                          &ldquo;{story.baseline.motivation}&rdquo;
                        </p>
                        <p className="text-xs text-purple-600 mt-2 font-medium">Why they joined the study</p>
                      </div>
                    </div>
                  </div>

                  {/* What they hoped to achieve */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-blue-600 font-medium mb-1">What they hoped to achieve:</p>
                        <p className="text-sm text-gray-700 italic">&ldquo;{story.baseline.hopedResults}&rdquo;</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== SECTION 2: THE JOURNEY - Progress over time ===== */}
              {story && story.journey.villainRatings.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Their {story.journey.durationDays}-Day Journey with {story.journey.villainVariable}
                  </h4>

                  <JourneyTimeline
                    ratings={story.journey.villainRatings}
                    villainVariable={story.journey.villainVariable}
                  />

                  {/* Key turning point quotes */}
                  {story.journey.keyQuotes.length > 0 && (
                    <div className="space-y-3">
                      {story.journey.keyQuotes.map((kq, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                          <div className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded flex-shrink-0">
                            Day {kq.day}
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 italic">&ldquo;{kq.quote}&rdquo;</p>
                            <p className="text-xs text-green-600 mt-1">{kq.context}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ===== SECTION 3: THE PROOF - Objective wearable data ===== */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Verified by Wearable Data
                </h4>

                {story ? (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Total Sleep */}
                    <div className="bg-white rounded-xl border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4 text-indigo-500" />
                          <span className="text-sm font-medium text-gray-600">Total Sleep</span>
                        </div>
                        <span className="text-lg font-bold text-[#00D1C1]">
                          +{story.wearableMetrics.sleepChange.changePercent}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{(story.wearableMetrics.sleepChange.before / 60).toFixed(1)}h</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="font-medium text-gray-700">{(story.wearableMetrics.sleepChange.after / 60).toFixed(1)}h</span>
                      </div>
                    </div>

                    {/* Deep Sleep */}
                    {story.wearableMetrics.deepSleepChange && (
                      <div className="bg-white rounded-xl border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-medium text-gray-600">Deep Sleep</span>
                          </div>
                          <span className="text-lg font-bold text-[#00D1C1]">
                            +{story.wearableMetrics.deepSleepChange.changePercent}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{story.wearableMetrics.deepSleepChange.before}min</span>
                          <ChevronRight className="h-3 w-3" />
                          <span className="font-medium text-gray-700">{story.wearableMetrics.deepSleepChange.after}min</span>
                        </div>
                      </div>
                    )}

                    {/* HRV */}
                    {story.wearableMetrics.hrvChange && (
                      <div className="bg-white rounded-xl border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium text-gray-600">HRV</span>
                          </div>
                          <span className="text-lg font-bold text-[#00D1C1]">
                            +{story.wearableMetrics.hrvChange.changePercent}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{story.wearableMetrics.hrvChange.before}ms</span>
                          <ChevronRight className="h-3 w-3" />
                          <span className="font-medium text-gray-700">{story.wearableMetrics.hrvChange.after}ms</span>
                        </div>
                      </div>
                    )}

                    {/* Resting HR */}
                    {story.wearableMetrics.restingHrChange && (
                      <div className="bg-white rounded-xl border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-600">Resting HR</span>
                          </div>
                          <span className="text-lg font-bold text-green-600">
                            {story.wearableMetrics.restingHrChange.changePercent}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{story.wearableMetrics.restingHrChange.before}bpm</span>
                          <ChevronRight className="h-3 w-3" />
                          <span className="font-medium text-gray-700">{story.wearableMetrics.restingHrChange.after}bpm</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Fallback to testimonial metrics if no story data */
                  <div className="grid grid-cols-3 gap-3">
                    {current.metrics.map((metric) => (
                      <div key={metric.label} className="bg-white rounded-xl border p-4 text-center">
                        <div className="text-xl font-bold text-[#00D1C1]">{metric.value}</div>
                        <div className="text-[10px] font-medium text-gray-500 uppercase">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ===== SECTION 4: THE OUTCOME - Final reflection + benefits ===== */}
              <div className="space-y-4">
                {/* Generated narrative / final story */}
                {story?.generatedNarrative && (
                  <div className="bg-gradient-to-r from-[#00D1C1]/5 to-green-50 rounded-xl p-5 border border-[#00D1C1]/20">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-[#00D1C1] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-[#00D1C1] font-medium mb-2">Their Story</p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {story.generatedNarrative}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* What they noticed - benefits */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">What They Noticed</h4>
                  <div className="flex flex-wrap gap-2">
                    {current.benefits.map((benefit) => (
                      <span key={benefit} className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm">
                        <Check className="h-3.5 w-3.5" />
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Overall rating */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${star <= Math.round(story?.overallRating || current.overallRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    Rated {(story?.overallRating || current.overallRating).toFixed(1)} out of 5
                  </span>
                </div>
              </div>

              {/* ===== FOOTER: Verification + Disclosure ===== */}
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#00D1C1]/10 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-[#00D1C1]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700">Verified by Reputable Health</p>
                      <p className="text-[10px] text-gray-400">Independent third-party verification</p>
                    </div>
                  </div>
                  <Link
                    href={`/verify/${current.verificationId}`}
                    className="flex items-center gap-1 text-sm text-[#00D1C1] hover:underline font-medium"
                  >
                    View Full Report <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* FTC Disclosure */}
                <div className="text-center pt-2 border-t border-dashed">
                  <p className="text-xs text-gray-400">
                    This is a top responder. Results vary by individual.{" "}
                    <a href="#" className="underline hover:text-gray-600">See full study results →</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simulated brand product page showing widget integration
export default function PreviewContextPage() {
  const params = useParams();
  const router = useRouter();
  const { getStudy } = useStudies();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<"challenge" | "standard">("challenge");
  const [activeSection, setActiveSection] = useState<"pdp" | "landing" | "results">("pdp");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);

  const study = getStudy(params.id as string);

  if (!study) {
    return (
      <div className="p-8 text-center">
        <p>Study not found</p>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  // Get featured testimonials for the widget
  const featuredTestimonials = MOCK_TESTIMONIALS.filter(t =>
    (study.featuredTestimonialIds || []).includes(String(t.id))
  );
  const displayTestimonials = featuredTestimonials.length > 0 ? featuredTestimonials : MOCK_TESTIMONIALS.slice(0, 4);

  // Compute aggregate stats
  const avgRating = displayTestimonials.reduce((acc, t) => acc + t.overallRating, 0) / displayTestimonials.length;
  const totalParticipants = 47; // Mock

  const openModal = (index: number) => {
    setModalInitialIndex(index);
    setIsModalOpen(true);
  };

  // Rebate amount from study or default - ensure numeric values
  const rebateAmount = Number(study.rebateAmount) || 50;
  const productPrice = Number(study.productPrice) || 99.99;
  const challengePrice = productPrice;
  const effectivePrice = productPrice - rebateAmount;

  return (
    <div className="min-h-screen bg-white">
      {/* Admin Header Bar */}
      <div className="sticky top-0 z-40 bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="h-6 w-px bg-white/20" />
          <span className="text-sm text-white/70">Preview: Widget in Context</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">Viewing as:</span>
          <div className="flex bg-white/10 rounded-lg p-1">
            {(["pdp", "landing", "results"] as const).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeSection === section ? "bg-white text-gray-900" : "text-white/70 hover:text-white"
                }`}
              >
                {section === "pdp" ? "Product Page" : section === "landing" ? "Landing Page" : "Results Page"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated Brand Header */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="font-bold text-xl">{study.productName.split(" ")[0]}</div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-900">Shop</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Science</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Reviews</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Account</Button>
            <Button variant="outline" size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart (0)
            </Button>
          </div>
        </div>
      </header>

      {/* Product Detail Page View */}
      {activeSection === "pdp" && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <span>Home</span> / <span>Sleep</span> / <span className="text-gray-900">{study.productName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center relative">
                {study.productImage ? (
                  <img src={study.productImage} alt={study.productName} className="max-h-[80%] object-contain" />
                ) : (
                  <div className="text-center text-gray-400">
                    <Moon className="h-24 w-24 mx-auto mb-4" />
                    <p>Product Image</p>
                  </div>
                )}

                {/* Hero Widget - cycles through individual stories */}
                <div className="absolute -inset-2 pointer-events-none">
                  <div className="absolute -bottom-2 -left-2 -right-2 h-24 bg-gradient-to-t from-yellow-100/80 to-transparent border-2 border-dashed border-yellow-400 rounded-b-2xl" />
                  <div className="absolute -bottom-6 left-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded">
                    HERO WIDGET
                  </div>
                </div>
                <div className="pointer-events-auto">
                  <HeroWidget testimonials={displayTestimonials} onOpenModal={openModal} />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Wellness Device</div>
                <h1 className="text-3xl font-bold mb-2">{study.productName}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${star <= Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium">{avgRating.toFixed(1)} (1,247 Reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600">{study.productDescription || "A premium wellness product designed to improve your sleep quality and help you wake up feeling refreshed."}</p>

              {/* Purchase Options - with Rebate Integration */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Purchase Option</div>

                {/* Challenge Option (with rebate) */}
                <button
                  onClick={() => setSelectedOption("challenge")}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all relative ${
                    selectedOption === "challenge"
                      ? "border-[#00D1C1] bg-[#00D1C1]/5 shadow-lg shadow-[#00D1C1]/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedOption === "challenge" ? "border-[#00D1C1] bg-[#00D1C1]" : "border-gray-300"
                    }`}>
                      {selectedOption === "challenge" && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Join {study.studyDays || 30}-Day Challenge</div>
                      <div className="text-sm text-gray-500">Track with your wearable & earn cash back</div>
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-[#00D1C1]/30">
                        <div className="h-4 w-4 rounded-full bg-[#00D1C1] flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-600">Verified by Reputable Health</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 line-through">${(productPrice + rebateAmount).toFixed(0)}</div>
                      <div className="text-xl font-bold text-gray-900">${challengePrice.toFixed(0)}</div>
                      <div className="mt-1 px-2 py-0.5 bg-[#00D1C1] text-white text-xs font-bold rounded">
                        ${rebateAmount} Rebate
                      </div>
                    </div>
                  </div>
                </button>

                {/* Standard Option */}
                <button
                  onClick={() => setSelectedOption("standard")}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                    selectedOption === "standard"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedOption === "standard" ? "border-gray-900 bg-gray-900" : "border-gray-300"
                    }`}>
                      {selectedOption === "standard" && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Standard Purchase</div>
                      <div className="text-sm text-gray-500">Device only</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">${productPrice.toFixed(0)}</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* CTA Button */}
              <Button className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white text-lg font-bold rounded-xl">
                {selectedOption === "challenge" ? (
                  <>
                    Join Challenge - ${challengePrice.toFixed(0)}
                    <span className="block text-xs font-normal opacity-80 mt-0.5">*Rebate issued upon completion</span>
                  </>
                ) : (
                  <>Add to Cart - ${productPrice.toFixed(0)}</>
                )}
              </Button>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RotateCcw className="h-4 w-4" />
                  <span>60-Day Returns</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>

          {/* Below the Fold: Trust Badge Section */}
          <div className="mt-16 pt-16 border-t">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Real Results from Real People</h2>
                <p className="text-gray-600">Not averages. Individual stories from verified participants.</p>
              </div>

              {/* Highlighted Trust Badge */}
              <div className="relative">
                <div className="absolute -inset-4 bg-yellow-100/50 border-2 border-dashed border-yellow-400 rounded-2xl" />
                <div className="absolute -top-3 left-4 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                  TRUST BADGE (EXPANDS TO STORIES)
                </div>
                <div className="relative">
                  <TrustBadge
                    count={totalParticipants}
                    rating={avgRating}
                    onExpand={() => openModal(0)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Landing Page View */}
      {activeSection === "landing" && (
        <div>
          {/* Hero Section */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 relative">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Finally, Sleep That Actually Works
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the {study.studyDays || 30}-day challenge. If it works for you, you keep your ${rebateAmount} rebate.
              </p>

              {/* Hero Widget Area */}
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-yellow-400/20 border-2 border-dashed border-yellow-400 rounded-2xl" />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full whitespace-nowrap">
                  CYCLING HERO WIDGET
                </div>
                <div className="relative bg-white rounded-full shadow-lg px-4 py-3 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#00D1C1]/20 flex items-center justify-center border-2 border-[#00D1C1]">
                    <span className="text-sm font-bold text-[#00D1C1]">{displayTestimonials[0].initials}</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-gray-400 uppercase">{displayTestimonials[0].participant}</div>
                    <div className="text-sm font-bold text-gray-900">
                      Improved Sleep <span className="text-[#00D1C1]">{displayTestimonials[0].metrics[0]?.value}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(0)}
                    className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                <Button size="lg" className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white">
                  Join Challenge - ${challengePrice.toFixed(0)}
                </Button>
                <button className="inline-flex items-center justify-center h-11 px-8 rounded-md border-2 border-white text-white font-medium hover:bg-white/10 transition-colors">
                  <Play className="h-4 w-4 mr-2" />
                  See Results
                </button>
              </div>
            </div>
          </div>

          {/* Social Proof Section */}
          <div className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Individual Stories, Not Averages</h2>
                <p className="text-gray-600">
                  We show you real people and their actual results. Some respond better than others.
                </p>
              </div>

              {/* Participant Cards */}
              <div className="relative pt-6">
                <div className="absolute -inset-4 top-0 bg-yellow-100/50 border-2 border-dashed border-yellow-400 rounded-2xl" />
                <div className="absolute top-0 left-4 -translate-y-1/2 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full z-10">
                  TOP RESPONDER STORY CARDS
                </div>
                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {displayTestimonials.map((t, i) => (
                    <button
                      key={t.id}
                      onClick={() => openModal(i)}
                      className="bg-white rounded-xl border p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-[#00D1C1]/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-[#00D1C1]">{t.initials}</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t.participant}</div>
                          <div className="text-xs text-gray-500">{t.age} · {t.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-3.5 w-3.5 ${star <= t.overallRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <div className="flex gap-2 mb-3">
                        {t.metrics.slice(0, 2).map((m) => (
                          <div key={m.label} className="flex-1 p-2 bg-[#00D1C1]/10 rounded text-center">
                            <div className="text-sm font-bold text-[#00D1C1]">{m.value}</div>
                            <div className="text-[9px] text-gray-500 uppercase">{m.label}</div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 italic">&ldquo;{t.story}&rdquo;</p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t">
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Watch className="h-3 w-3" />
                          {t.device}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
                          <BadgeCheck className="h-3 w-3" />
                          Verified
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {/* FTC Disclosure */}
                <div className="relative text-center mt-4">
                  <a href="#" className="text-xs text-gray-400 hover:text-gray-600 underline">
                    Featured results from top responders. See full study results →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Page View */}
      {activeSection === "results" && (
        <div className="py-12 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D1C1]/10 rounded-full text-[#00D1C1] text-sm font-medium mb-4">
                <Shield className="h-4 w-4" />
                Verified Individual Results
              </div>
              <h1 className="text-3xl font-bold mb-4">{study.productName} Results</h1>
              <p className="text-gray-600 max-w-xl mx-auto">
                These are individual stories from verified participants. Results vary - we show you real people, not inflated averages.
              </p>
            </div>

            {/* Trust Badge */}
            <div className="max-w-lg mx-auto mb-12">
              <TrustBadge
                count={totalParticipants}
                rating={avgRating}
                onExpand={() => openModal(0)}
              />
            </div>

            {/* All Stories */}
            <div className="space-y-4">
              {MOCK_TESTIMONIALS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => openModal(i)}
                  className="w-full bg-white rounded-xl border p-6 text-left hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-full bg-[#00D1C1]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-[#00D1C1]">{t.initials}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{t.participant}</h3>
                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Verified
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span>{t.age}</span>
                        <span>·</span>
                        <span>{t.location}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Watch className="h-3 w-3" /> {t.device}</span>
                      </div>
                      <div className="flex gap-3 mb-3">
                        {t.metrics.map((m) => (
                          <div key={m.label} className="px-3 py-1.5 bg-[#00D1C1]/10 rounded-lg">
                            <span className="font-bold text-[#00D1C1]">{m.value}</span>
                            <span className="text-xs text-gray-500 ml-1">{m.label}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 italic">&ldquo;{t.story}&rdquo;</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" className="bg-[#00D1C1] hover:bg-[#00B8A9]">
                Join the Challenge
              </Button>
              <p className="text-sm text-gray-500 mt-2">${rebateAmount} rebate upon completion</p>
            </div>
          </div>
        </div>
      )}

      {/* Stories Modal */}
      <StoriesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        testimonials={MOCK_TESTIMONIALS}
        initialIndex={modalInitialIndex}
        studyName={study.productName}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-400">
          <p>This is a preview of how your Reputable Health widgets would appear on your website.</p>
          <p className="mt-2">Yellow highlighted areas show widget placements. Click any widget to see the detailed modal.</p>
        </div>
      </footer>
    </div>
  );
}
