"use client";

/**
 * Quote Carousel
 *
 * Rotating carousel of notable participant quotes with archetype styling.
 */

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import type { ParticipantArchetype } from "@/lib/types";

interface Quote {
  quote: string;
  initials: string;
  context?: string;
  archetype?: ParticipantArchetype;
}

interface QuoteCarouselProps {
  quotes: Quote[];
  autoRotateMs?: number;
}

// Archetype color mapping
const ARCHETYPE_COLORS: Record<string, string> = {
  skeptic: "border-slate-300 bg-slate-50/50",
  desperate: "border-rose-200 bg-rose-50/30",
  power_user: "border-blue-200 bg-blue-50/30",
  struggler: "border-amber-200 bg-amber-50/30",
  optimist: "border-emerald-200 bg-emerald-50/30",
};

export function QuoteCarousel({ quotes, autoRotateMs = 6000 }: QuoteCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!quotes || quotes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % quotes.length);
    }, autoRotateMs);
    return () => clearInterval(interval);
  }, [quotes?.length, autoRotateMs]);

  if (!quotes || quotes.length === 0) return null;
  const quote = quotes[currentIndex];

  const borderColor = quote.archetype
    ? ARCHETYPE_COLORS[quote.archetype] || "border-slate-200 bg-slate-50/50"
    : "border-slate-200 bg-slate-50/50";

  return (
    <div className="relative">
      <div className={`flex items-start gap-3 p-4 rounded-lg border ${borderColor} transition-all duration-300`}>
        <Sparkles className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-700 italic leading-relaxed">&quot;{quote.quote}&quot;</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-medium text-slate-500">— {quote.initials}</span>
            {quote.context && (
              <span className="text-xs text-slate-400">• {quote.context}</span>
            )}
          </div>
        </div>
      </div>
      {quotes.length > 1 && (
        <div className="flex justify-center gap-1 mt-3">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? "w-4 bg-purple-400" : "w-1.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default QuoteCarousel;
