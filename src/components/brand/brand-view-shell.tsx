"use client";

import { useState, useCallback, useMemo } from "react";
import { BrandViewHeader } from "./brand-view-header";
import { BrandViewTabs } from "./brand-view-tabs";
import { BrandViewFooter } from "./brand-view-footer";
import { BrandOverviewTab } from "./overview/brand-overview-tab";
import { BrandInsightsTab } from "./insights/brand-insights-tab";
import { BrandResultsTab } from "./results/brand-results-tab";
import { BrandWidgetTab } from "./widget/brand-widget-tab";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw } from "lucide-react";
import type { BrandViewTab } from "./types";
import type { StudyData } from "@/components/admin/study-detail/types";
import type { ParticipantStory } from "@/lib/types";
import { createSeededRandom } from "@/lib/simulation/seeded-random";

// Real data imports
import { SENSATE_REAL_STORIES } from "@/lib/sensate-real-data";
import { LYFEFUEL_REAL_STORIES } from "@/lib/lyfefuel-real-data";

interface BrandViewShellProps {
  study: StudyData;
  brand?: { id: string; name: string; logoUrl?: string };
  onBackToAdmin: () => void;
  initialTab?: BrandViewTab;
}

// Studies with real participant data — Brand View uses real stories, not simulation
const REAL_DATA_STUDY_STORIES: Record<string, ParticipantStory[]> = {
  "study-sensate-real": SENSATE_REAL_STORIES,
  "study-lyfefuel-real": LYFEFUEL_REAL_STORIES,
};

export function BrandViewShell({
  study,
  brand,
  onBackToAdmin,
  initialTab = "brand-overview",
}: BrandViewShellProps) {
  const [activeTab, setActiveTab] = useState<BrandViewTab>(initialTab);

  // Check if this study has real data
  const realStories = REAL_DATA_STUDY_STORIES[study.id] || null;
  const isRealDataStudy = realStories !== null;

  // Select the raw enrollments array (stable reference) and derive counts via useMemo
  const allEnrollments = useEnrollmentStore((s) => s.enrollments);
  const addSimulatedEnrollment = useEnrollmentStore((s) => s.addSimulatedEnrollment);
  const resetEnrollments = useEnrollmentStore((s) => s.resetEnrollments);

  const studyEnrollments = useMemo(
    () => allEnrollments.filter((e) => e.studyId === study.id),
    [allEnrollments, study.id]
  );
  const participantCount = isRealDataStudy
    ? realStories.length
    : studyEnrollments.filter((e) => e.stage !== "clicked").length;
  const completedCount = isRealDataStudy
    ? realStories.length  // All real stories are completed participants
    : studyEnrollments.filter((e) => e.stage === "completed").length;
  const hasResults = completedCount > 0 || study.status === "completed";
  const hasEnrollments = isRealDataStudy || studyEnrollments.length > 0;

  // Demo data seeder (only for non-real-data studies)
  const enrollmentSlug = study.enrollmentConfig?.enrollmentSlug || study.id;
  const category = study.category || "sleep";

  const seedDemoData = useCallback(
    (size: "small" | "medium" | "full") => {
      // Reset first to avoid duplicates
      resetEnrollments();

      // Explicit stage distributions for each size
      type StageDist = { completed: number; active: number; signed_up: number; waiting: number };
      const distributions: Record<typeof size, StageDist> = {
        full:   { completed: 8,  active: 15, signed_up: 4, waiting: 3 },
        medium: { completed: 3,  active: 8,  signed_up: 2, waiting: 2 },
        small:  { completed: 1,  active: 3,  signed_up: 1, waiting: 0 },
      };

      const dist = distributions[size];

      // Temporarily override Math.random with a seeded PRNG so the same
      // study always produces identical simulated participants.
      const originalRandom = Math.random;
      Math.random = createSeededRandom(study.id);

      try {
        const stages: Array<[keyof StageDist, number]> = [
          ["completed", dist.completed],
          ["active", dist.active],
          ["signed_up", dist.signed_up],
          ["waiting", dist.waiting],
        ];

        for (const [stage, count] of stages) {
          for (let i = 0; i < count; i++) {
            addSimulatedEnrollment(study.id, enrollmentSlug, stage, category);
          }
        }
      } finally {
        // Always restore the original Math.random
        Math.random = originalRandom;
      }
    },
    [study.id, enrollmentSlug, category, addSimulatedEnrollment, resetEnrollments]
  );

  const handleTabChange = useCallback((tab: BrandViewTab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/30 flex flex-col">
      <BrandViewHeader
        studyName={study.name}
        brandName={brand?.name}
        brandLogoUrl={brand?.logoUrl}
        status={study.status}
        onBackToAdmin={onBackToAdmin}
      />

      <BrandViewTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasResults={hasResults}
        participantCount={participantCount}
      />

      {/* Admin-only: Demo Data Seeder (only for non-real-data studies) */}
      {!isRealDataStudy && !hasEnrollments && (
        <div className="max-w-6xl mx-auto w-full px-6 pt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  No enrollment data yet
                </p>
                <p className="text-xs text-amber-700">
                  Seed simulated participants to preview how this looks with data
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-amber-700 border-amber-300 hover:bg-amber-100"
                onClick={() => seedDemoData("small")}
              >
                5 participants
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-amber-700 border-amber-300 hover:bg-amber-100"
                onClick={() => seedDemoData("medium")}
              >
                15 participants
              </Button>
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => seedDemoData("full")}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                30 participants (full demo)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Real data study: show participant count */}
      {isRealDataStudy && (
        <div className="max-w-6xl mx-auto w-full px-6 pt-4">
          <p className="text-xs text-muted-foreground">
            Showing {participantCount} verified participants
            {completedCount > 0 && ` (${completedCount} completed)`}
            {" · "}Real data
          </p>
        </div>
      )}

      {/* Admin-only: Reset data when populated (demo studies only) */}
      {!isRealDataStudy && studyEnrollments.length > 0 && (
        <div className="max-w-6xl mx-auto w-full px-6 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {participantCount} simulated participants
              {completedCount > 0 && ` (${completedCount} completed)`}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-muted-foreground h-7"
                onClick={() => resetEnrollments()}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-muted-foreground h-7"
                onClick={() => seedDemoData("full")}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Reseed
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-6">
        {activeTab === "brand-overview" && (
          <BrandOverviewTab study={study} brand={brand} realStories={realStories} />
        )}
        {activeTab === "brand-insights" && (
          <BrandInsightsTab study={study} realStories={realStories} />
        )}
        {activeTab === "brand-results" && (
          <BrandResultsTab study={study} realStories={realStories} />
        )}
        {activeTab === "brand-widget" && (
          <BrandWidgetTab studyId={study.id} studyName={study.name} brandName={brand?.name} category={category} realStories={realStories} />
        )}
      </main>

      <BrandViewFooter />
    </div>
  );
}
