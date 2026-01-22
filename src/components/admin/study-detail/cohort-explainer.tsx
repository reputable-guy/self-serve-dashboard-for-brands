"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Users, Clock, Package, RotateCcw, HelpCircle } from "lucide-react";

const STORAGE_KEY = "cohort-explainer-collapsed";

interface CohortExplainerProps {
  /** If true, start expanded (for new users) */
  defaultExpanded?: boolean;
}

/**
 * Collapsible visual explainer for the cohort-based recruitment model.
 * Shows how waitlist → window → cohort → ship → repeat works.
 * Remembers user preference in localStorage.
 */
export function CohortExplainer({ defaultExpanded = true }: CohortExplainerProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsExpanded(stored !== "true");
    }
    setHasLoaded(true);
  }, []);

  // Save collapsed state to localStorage
  const toggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    localStorage.setItem(STORAGE_KEY, (!newExpanded).toString());
  };

  // Don't render until we've checked localStorage (prevents hydration mismatch)
  if (!hasLoaded) {
    return null;
  }

  return (
    <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/30">
      <CardHeader className="pb-2 cursor-pointer" onClick={toggleExpanded}>
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
            How Cohort-Based Recruitment Works
          </span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-4">
          {/* Visual Flow Diagram */}
          <div className="flex items-center justify-between gap-2 py-4 px-2 overflow-x-auto">
            <FlowStep
              icon={<Users className="h-5 w-5" />}
              label="Waitlist Builds"
              description="Users discover & join"
              color="bg-purple-100 text-purple-700 border-purple-200"
            />
            <FlowArrow />
            <FlowStep
              icon={<Clock className="h-5 w-5" />}
              label="24-Hour Window"
              description="Open enrollment period"
              color="bg-[#00D1C1]/20 text-[#00D1C1] border-[#00D1C1]/30"
            />
            <FlowArrow />
            <FlowStep
              icon={<Package className="h-5 w-5" />}
              label="Ship to Cohort"
              description="Batch fulfillment"
              color="bg-amber-100 text-amber-700 border-amber-200"
            />
            <FlowArrow />
            <FlowStep
              icon={<RotateCcw className="h-5 w-5" />}
              label="Repeat"
              description="Until target reached"
              color="bg-green-100 text-green-700 border-green-200"
            />
          </div>

          {/* Step-by-step explanation */}
          <div className="grid gap-2 text-sm">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-medium">1</span>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Waitlist builds</strong> - Participants discover your study in the catalogue and join the waitlist.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00D1C1]/20 text-[#00D1C1] text-xs flex items-center justify-center font-medium">2</span>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Open a window</strong> - Start a 24-hour recruitment window. Waitlist members can enroll.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-medium">3</span>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Form a cohort</strong> - Enrolled participants become a batch. Ship products and enter tracking codes.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs flex items-center justify-center font-medium">4</span>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Repeat</strong> - Once all tracking codes are entered, open another window until you reach your target.
              </p>
            </div>
          </div>

          {/* Why cohorts */}
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="text-muted-foreground">
              <strong className="text-foreground">Why cohorts?</strong> Batching shipments is more efficient and gives you control over your fulfillment pace. You decide when to open each window.
            </p>
          </div>

          {/* Collapse button */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="text-muted-foreground text-xs"
            >
              Got it, hide this
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function FlowStep({
  icon,
  label,
  description,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-1 p-3 rounded-lg border ${color} min-w-[100px]`}>
      {icon}
      <span className="font-medium text-xs whitespace-nowrap">{label}</span>
      <span className="text-[10px] opacity-70 whitespace-nowrap">{description}</span>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex-shrink-0 text-muted-foreground">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </div>
  );
}
