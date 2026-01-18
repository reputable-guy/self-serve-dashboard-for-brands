"use client";

import { TrendingUp, Quote } from "lucide-react";

/**
 * Timeline event for participant journey visualization
 */
export function TimelineEvent({
  date,
  title,
  description,
  icon: Icon,
  isLast = false,
}: {
  date: string;
  title: string;
  description: string;
  icon: React.ElementType;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 rounded-full bg-[#00D1C1]/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-[#00D1C1]" />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-border my-2" />}
      </div>
      <div className="flex-1 pb-6">
        <p className="text-xs text-muted-foreground">{date}</p>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

/**
 * Testimonial responses section showing participant feedback
 * Accepts both { question, answer } and { day, question, response } formats
 */
export function TestimonialResponsesSection({
  responses,
}: {
  responses: Array<{ question: string; answer?: string; response?: string; day?: number }>;
}) {
  return (
    <div className="space-y-4">
      {responses.map((response, idx) => (
        <div key={idx} className="p-4 bg-purple-50/50 rounded-lg border border-purple-100">
          <div className="flex items-start gap-2">
            <Quote className="h-4 w-4 text-purple-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">{response.question}</p>
              <p className="text-sm italic text-purple-900">&ldquo;{response.answer || response.response}&rdquo;</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper functions for villain journey
function getRatingLabel(rating: number): string {
  if (rating >= 4) return "Much Better";
  if (rating === 3) return "Somewhat Better";
  if (rating === 2) return "About the Same";
  return "Worse";
}

function getRatingColor(rating: number): string {
  if (rating >= 4) return "bg-green-500";
  if (rating === 3) return "bg-yellow-400";
  if (rating === 2) return "bg-orange-400";
  return "bg-red-500";
}

/**
 * Villain journey progress visualization showing improvement over time
 */
export function VillainJourneyProgress({
  ratings,
  villainVariable,
}: {
  ratings: Array<{ day: number; rating: number; note?: string }>;
  villainVariable: string;
}) {
  if (!ratings || ratings.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <TrendingUp className="h-4 w-4 text-[#00D1C1]" />
        <span className="capitalize">{villainVariable} Progress</span>
      </div>
      <div className="space-y-3">
        {ratings.map((r) => (
          <div key={r.day} className="flex items-center gap-4">
            <div className="w-16 text-sm text-muted-foreground">Day {r.day}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getRatingColor(r.rating)} transition-all`}
                    style={{ width: `${(r.rating / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${r.rating >= 4 ? "text-green-600" : r.rating >= 3 ? "text-yellow-600" : "text-red-500"}`}>
                  {getRatingLabel(r.rating)}
                </span>
              </div>
              {r.note && (
                <p className="text-xs text-muted-foreground mt-1 italic">&ldquo;{r.note}&rdquo;</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
