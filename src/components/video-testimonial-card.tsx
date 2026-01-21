"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MockTestimonial, ParticipantStory } from "@/lib/mock-data";
import { VerificationBadge } from "@/components/verification-page";
import { StoryCardActions } from "@/components/story-card-actions";
import {
  Star,
  Watch,
  BadgeCheck,
  Check,
  Video,
  Play,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  BookOpen,
  TrendingUp,
  Quote,
  User,
  Clock,
  Target,
} from "lucide-react";

interface VideoTestimonialCardProps {
  testimonial: MockTestimonial;
  studyId: string;
  isFeatured?: boolean;
  onToggleFeatured?: () => void;
  // Optional rich story data for expanded view
  story?: ParticipantStory;
}

// Journey progress component - shows villain trajectory as a visual timeline
function JourneyProgress({ ratings, villainVariable }: { ratings: ParticipantStory["journey"]["villainRatings"]; villainVariable: string }) {
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
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <TrendingUp className="h-4 w-4" />
        <span className="capitalize">{villainVariable} Journey</span>
      </div>
      <div className="flex items-center gap-1">
        {ratings.map((r, idx) => (
          <div key={r.day} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`h-2 w-full rounded-full ${getRatingColor(r.rating)} ${idx === 0 ? "rounded-l-full" : ""} ${idx === ratings.length - 1 ? "rounded-r-full" : ""}`}
              title={`Day ${r.day}: ${getRatingLabel(r.rating)}${r.note ? ` - ${r.note}` : ""}`}
            />
            <span className="text-[10px] text-muted-foreground">D{r.day}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{getRatingLabel(ratings[0]?.rating || 2)}</span>
        <span className="font-medium text-green-600">{getRatingLabel(ratings[ratings.length - 1]?.rating || 5)}</span>
      </div>
    </div>
  );
}

// Before/After metric comparison
function MetricComparison({ label, before, after, unit, changePercent }: {
  label: string;
  before: number;
  after: number;
  unit: string;
  changePercent: number;
}) {
  const isPositive = label.toLowerCase().includes("resting hr") ? changePercent < 0 : changePercent > 0;
  const displayChange = changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`;

  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{before}{unit}</span>
        <span className="text-muted-foreground">→</span>
        <span className="text-sm font-medium">{after}{unit}</span>
        <span className={`text-sm font-bold ${isPositive ? "text-green-600" : "text-red-500"}`}>
          {displayChange}
        </span>
      </div>
    </div>
  );
}

export function VideoTestimonialCard({ testimonial, studyId, isFeatured = false, onToggleFeatured, story }: VideoTestimonialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);

  const handleDownloadVideo = () => {
    // In production, this would trigger an actual download
    // For now, we'll just show an alert or open the video URL
    if (testimonial.videoUrl) {
      window.open(testimonial.videoUrl, "_blank");
    }
  };

  const handleDownloadDataCard = () => {
    // In production, this would generate and download a PNG/PDF data card
    // For now, we'll just show a placeholder action
    alert(`Downloading data card for ${testimonial.participant}...`);
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card className={`overflow-hidden transition-colors ${isFeatured ? "border-yellow-500/50 ring-1 ring-yellow-500/20" : "hover:border-[#00D1C1]/50"}`}>
        {/* Card Header with Verified Badge */}
        <div className="bg-gradient-to-r from-[#00D1C1]/10 to-transparent p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#00D1C1]/20 flex items-center justify-center">
                <span className="font-semibold text-[#00D1C1]">{testimonial.initials}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{testimonial.participant}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                    {testimonial.age} · {testimonial.location}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Watch className="h-3 w-3" />
                  <span>{testimonial.device}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Feature Star Toggle */}
              {onToggleFeatured && (
                <button
                  onClick={onToggleFeatured}
                  className={`p-1.5 rounded-full transition-colors ${
                    isFeatured
                      ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-yellow-500"
                  }`}
                  title={isFeatured ? "Remove from featured" : "Add to featured widgets"}
                >
                  <Star className={`h-4 w-4 ${isFeatured ? "fill-yellow-500" : ""}`} />
                </button>
              )}
              {/* Video Available Badge */}
              {testimonial.hasVideo && (
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-medium hover:bg-purple-500/20 transition-colors cursor-pointer">
                    <Video className="h-3.5 w-3.5" />
                    Video
                    {isExpanded ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                </CollapsibleTrigger>
              )}
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Expandable Video Section */}
          <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <div className="mb-4 space-y-3">
              {/* Video Player / Thumbnail */}
              <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                {isPlaying ? (
                  // In production, this would be an actual video element
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <video
                      src={testimonial.videoUrl}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      onEnded={() => setIsPlaying(false)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <>
                    {testimonial.videoThumbnail ? (
                      <img
                        src={testimonial.videoThumbnail}
                        alt={`${testimonial.participant} video thumbnail`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <Video className="h-12 w-12 text-gray-600" />
                      </div>
                    )}
                    {/* Play Button Overlay */}
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                    >
                      <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="h-7 w-7 text-gray-900 ml-1" />
                      </div>
                    </button>
                    {/* Duration Badge */}
                    {testimonial.videoDuration && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-medium">
                        {testimonial.videoDuration}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Download Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleDownloadVideo}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Video
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleDownloadDataCard}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download Data Card
                </Button>
              </div>
            </div>
          </CollapsibleContent>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.floor(testimonial.overallRating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{testimonial.overallRating}</span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2">
            {testimonial.metrics.map((metric) => (
              <div key={metric.label} className="p-2 rounded-lg bg-[#00D1C1]/10 text-center">
                <p className="text-lg font-bold text-[#00D1C1]">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="space-y-1">
            {testimonial.benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-sm">
                <Check className="h-3.5 w-3.5 text-green-500" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="p-3 rounded-lg bg-muted/50 border-l-2 border-[#00D1C1]">
            <p className="text-sm italic">&quot;{testimonial.story}&quot;</p>
          </div>

          {/* Expandable Full Story Section */}
          {story && (
            <Collapsible open={isStoryExpanded} onOpenChange={setIsStoryExpanded}>
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-[#00D1C1]/5 to-purple-500/5 border border-dashed border-[#00D1C1]/30 hover:border-[#00D1C1]/50 hover:bg-[#00D1C1]/10 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{isStoryExpanded ? "Hide Full Story" : "View Full Story"}</span>
                  {isStoryExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                <div className="mt-4 space-y-4 p-4 rounded-lg bg-muted/30 border">
                  {/* Profile Context */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <User className="h-4 w-4 text-[#00D1C1]" />
                      <span>Profile</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                        <span className="text-muted-foreground">Life Stage:</span>
                        <span className="font-medium">{story.profile.lifeStage}</span>
                      </div>
                      {story.baseline.villainDuration && (
                        <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">Dealing with issue:</span>
                          <span className="font-medium">{story.baseline.villainDuration}</span>
                        </div>
                      )}
                    </div>
                    {story.baseline.triedOther && story.baseline.triedOther !== "No" && (
                      <div className="text-sm p-2 rounded bg-amber-500/10 border border-amber-500/20">
                        <span className="text-amber-600 dark:text-amber-400">Previously tried: </span>
                        <span>{story.baseline.triedOther}</span>
                      </div>
                    )}
                  </div>

                  {/* Starting Motivation Quote */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Quote className="h-4 w-4 text-[#00D1C1]" />
                      <span>Why They Joined</span>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border-l-2 border-purple-500/50">
                      <p className="text-sm italic text-muted-foreground">&quot;{story.baseline.motivation}&quot;</p>
                    </div>
                  </div>

                  {/* Journey Progress */}
                  <JourneyProgress ratings={story.journey.villainRatings} villainVariable={story.journey.villainVariable} />

                  {/* Key Quotes from Journey */}
                  {story.journey.keyQuotes.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Target className="h-4 w-4 text-[#00D1C1]" />
                        <span>Key Moments</span>
                      </div>
                      <div className="space-y-2">
                        {story.journey.keyQuotes.map((kq, idx) => (
                          <div key={idx} className="p-2 rounded bg-muted/50 text-sm">
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-[#00D1C1]/20 text-[#00D1C1]">Day {kq.day}</span>
                              <p className="italic flex-1">&quot;{kq.quote}&quot;</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 ml-11">{kq.context}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detailed Wearable Metrics */}
                  {story.wearableMetrics && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Watch className="h-4 w-4 text-[#00D1C1]" />
                        <span>Verified Wearable Data ({story.wearableMetrics.device})</span>
                      </div>
                      <div className="space-y-1">
                        {story.wearableMetrics.sleepChange && (
                          <MetricComparison
                            label="Total Sleep"
                            before={Math.round(story.wearableMetrics.sleepChange.before / 60 * 10) / 10}
                            after={Math.round(story.wearableMetrics.sleepChange.after / 60 * 10) / 10}
                            unit="hrs"
                            changePercent={story.wearableMetrics.sleepChange.changePercent}
                          />
                        )}
                        {story.wearableMetrics.deepSleepChange && (
                          <MetricComparison
                            label="Deep Sleep"
                            before={story.wearableMetrics.deepSleepChange.before}
                            after={story.wearableMetrics.deepSleepChange.after}
                            unit="min"
                            changePercent={story.wearableMetrics.deepSleepChange.changePercent}
                          />
                        )}
                        {story.wearableMetrics.hrvChange && (
                          <MetricComparison
                            label="HRV"
                            before={story.wearableMetrics.hrvChange.before}
                            after={story.wearableMetrics.hrvChange.after}
                            unit="ms"
                            changePercent={story.wearableMetrics.hrvChange.changePercent}
                          />
                        )}
                        {story.wearableMetrics.restingHrChange && (
                          <MetricComparison
                            label="Resting HR"
                            before={story.wearableMetrics.restingHrChange.before}
                            after={story.wearableMetrics.restingHrChange.after}
                            unit="bpm"
                            changePercent={story.wearableMetrics.restingHrChange.changePercent}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Generated Narrative */}
                  {story.generatedNarrative && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <BookOpen className="h-4 w-4 text-[#00D1C1]" />
                        <span>Full Story</span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {story.generatedNarrative}
                      </p>
                    </div>
                  )}

                  {/* Study Duration Footer */}
                  <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                    <span>Study duration: {story.journey.durationDays} days</span>
                    <span>Completed: {story.completedAt ? new Date(story.completedAt).toLocaleDateString() : "N/A"}</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Verification Footer */}
          <div className="flex items-center justify-between pt-3 border-t">
            <Link href={`/verify/${testimonial.verificationId}`}>
              <VerificationBadge verificationId={testimonial.verificationId} />
            </Link>
            <StoryCardActions testimonial={testimonial} studyId={studyId} />
          </div>
        </CardContent>
      </Card>
    </Collapsible>
  );
}
