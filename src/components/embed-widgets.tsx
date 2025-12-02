"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  Star,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Shield,
  TrendingUp,
} from "lucide-react";
import { MockTestimonial } from "@/lib/mock-data";

// Reputable Health verification badge component
function ReputableBadge({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };
  const textSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <Shield className={`${sizes[size]} text-[#00D1C1] fill-[#00D1C1]/20`} />
        <Check className={`absolute inset-0 m-auto h-2 w-2 text-white`} />
      </div>
      <span className={`${textSizes[size]} font-medium text-[#00D1C1]`}>
        Verified by Reputable
      </span>
    </div>
  );
}

// Carousel Widget Preview
export function CarouselWidgetPreview({
  testimonials,
}: {
  testimonials: MockTestimonial[];
  studyId?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, testimonials.length]);

  const testimonial = testimonials[currentIndex];

  return (
    <div
      className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto border"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Header with Reputable branding */}
      <div className="flex items-center justify-between mb-4">
        <ReputableBadge size="md" />
        <a
          href="#"
          className="text-xs text-gray-500 hover:text-[#00D1C1] flex items-center gap-1"
        >
          View Study <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Testimonial Content */}
      <div className="space-y-4">
        {/* Participant Info */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-white font-semibold">
            {testimonial.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {testimonial.participant}
              </span>
              <BadgeCheck className="h-4 w-4 text-[#00D1C1]" />
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= Math.floor(testimonial.overallRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">
                {testimonial.overallRating}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex gap-2">
          {testimonial.metrics.slice(0, 3).map((metric) => (
            <div
              key={metric.label}
              className="flex-1 bg-[#00D1C1]/10 rounded-lg p-2 text-center"
            >
              <p className="text-lg font-bold text-[#00D1C1]">{metric.value}</p>
              <p className="text-[10px] text-gray-600">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-sm text-gray-700 italic leading-relaxed">
          &ldquo;{testimonial.story.slice(0, 150)}
          {testimonial.story.length > 150 ? "..." : ""}&rdquo;
        </blockquote>

        {/* Verification Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Link
            href={`/verify/${testimonial.verificationId}`}
            className="flex items-center gap-1 text-[10px] text-[#00D1C1] hover:underline"
          >
            <Shield className="h-3 w-3 text-[#00D1C1]" />
            <span>Verified #{testimonial.verificationId}</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </Link>
          <span className="text-[10px] text-gray-500">
            {testimonial.device}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() =>
            setCurrentIndex(
              (prev) => (prev - 1 + testimonials.length) % testimonials.length
            )
          }
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-400" />
        </button>
        <div className="flex gap-1.5">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex
                  ? "w-4 bg-[#00D1C1]"
                  : "w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() =>
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
          }
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}

// Data Card Widget Preview (Single Hero Testimonial)
export function DataCardWidgetPreview({
  testimonial,
}: {
  testimonial: MockTestimonial;
  studyId?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-sm mx-auto border">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-[#00D1C1] to-[#00A89D] p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">Verified Result</span>
          </div>
          <a href="#" className="text-white/80 hover:text-white">
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Hero Metric */}
        <div className="text-center">
          <p className="text-4xl font-bold text-[#00D1C1]">
            {testimonial.metrics[0].value}
          </p>
          <p className="text-sm text-gray-600">{testimonial.metrics[0].label}</p>
        </div>

        {/* Participant */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-white font-semibold text-sm">
            {testimonial.initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-gray-900">
                {testimonial.participant}
              </span>
              <BadgeCheck className="h-4 w-4 text-[#00D1C1]" />
            </div>
            <p className="text-xs text-gray-500">
              {testimonial.age} · {testimonial.location}
            </p>
          </div>
          <div className="flex items-center gap-0.5">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">{testimonial.overallRating}</span>
          </div>
        </div>

        {/* Quote snippet */}
        <p className="text-sm text-gray-600 italic">
          &ldquo;{testimonial.story.slice(0, 100)}...&rdquo;
        </p>

        {/* Verification */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <ReputableBadge size="sm" />
          <Link
            href={`/verify/${testimonial.verificationId}`}
            className="flex items-center gap-1 text-[10px] text-[#00D1C1] hover:underline"
          >
            <span>#{testimonial.verificationId}</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Wall Widget Preview (Grid of Cards)
export function WallWidgetPreview({
  testimonials,
}: {
  testimonials: MockTestimonial[];
  studyId?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <ReputableBadge size="md" />
        <a
          href="#"
          className="text-xs text-gray-500 hover:text-[#00D1C1] flex items-center gap-1"
        >
          View All Results <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {testimonials.slice(0, 4).map((t) => (
          <Link
            key={t.id}
            href={`/verify/${t.verificationId}`}
            className="bg-white rounded-lg p-3 shadow-sm border hover:border-[#00D1C1]/50 transition-colors cursor-pointer block"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-white text-xs font-semibold">
                {t.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {t.participant}
                  </span>
                  <BadgeCheck className="h-3 w-3 text-[#00D1C1] flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Key Metric */}
            <div className="bg-[#00D1C1]/10 rounded p-2 text-center mb-2">
              <p className="text-lg font-bold text-[#00D1C1]">
                {t.metrics[0].value}
              </p>
              <p className="text-[9px] text-gray-600">{t.metrics[0].label}</p>
            </div>

            {/* Rating & Verification */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-2.5 w-2.5 ${
                      star <= Math.floor(t.overallRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 text-[#00D1C1]">
                <Shield className="h-3 w-3" />
                <ExternalLink className="h-2.5 w-2.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          {testimonials.length} verified participants · Powered by Reputable Health
        </p>
      </div>
    </div>
  );
}

// Trust Badge Widget Preview
export function TrustBadgeWidgetPreview({
  testimonialCount,
  avgRating,
  topMetric,
}: {
  testimonialCount: number;
  avgRating: number;
  topMetric: { label: string; value: string };
  studyId?: string;
}) {
  return (
    <div className="inline-flex flex-col items-center gap-2">
      {/* Main Badge */}
      <a
        href="#"
        className="bg-white rounded-xl shadow-lg border-2 border-[#00D1C1]/20 hover:border-[#00D1C1] transition-colors p-4 flex items-center gap-4 cursor-pointer"
      >
        {/* Reputable Logo */}
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center">
          <div className="relative">
            <Shield className="h-8 w-8 text-white" />
            <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />
          </div>
        </div>

        {/* Stats */}
        <div className="text-left">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm font-semibold text-gray-900">
              Verified by Reputable
            </span>
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <BadgeCheck className="h-3.5 w-3.5 text-[#00D1C1]" />
              <span>{testimonialCount} verified</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span>{avgRating.toFixed(1)} avg</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              <span>{topMetric.value} {topMetric.label}</span>
            </div>
          </div>
        </div>
      </a>

      {/* Compact variant */}
      <div className="text-center">
        <p className="text-[10px] text-gray-400 mb-2">Compact version:</p>
        <a
          href="#"
          className="inline-flex items-center gap-2 bg-white rounded-full shadow border px-3 py-1.5 hover:border-[#00D1C1] transition-colors cursor-pointer"
        >
          <div className="h-5 w-5 rounded-full bg-[#00D1C1] flex items-center justify-center">
            <Shield className="h-3 w-3 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-700">
            {testimonialCount} Verified Results
          </span>
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-600">{avgRating.toFixed(1)}</span>
          </div>
        </a>
      </div>
    </div>
  );
}

// Embed Code Display Component
export function EmbedCodeDisplay({
  widgetType,
  studyId,
}: {
  widgetType: "carousel" | "data-card" | "wall" | "trust-badge";
  studyId: string;
}) {
  const [copied, setCopied] = useState(false);

  const embedCode = `<script src="https://embed.reputable.health/widget.js"></script>
<div
  data-reputable-widget="${widgetType}"
  data-study-id="${studyId}"
  data-theme="light"
></div>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Embed Code</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="h-7 text-xs"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy Code
            </>
          )}
        </Button>
      </div>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
        <code>{embedCode}</code>
      </pre>
    </div>
  );
}
