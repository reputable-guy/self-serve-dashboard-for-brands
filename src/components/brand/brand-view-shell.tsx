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
import { Sparkles, RotateCcw, ChevronDown } from "lucide-react";
import type { BrandViewTab } from "./types";
import type { StudyData } from "@/components/admin/study-detail/types";

interface BrandViewShellProps {
  study: StudyData;
  brand?: { id: string; name: string; logoUrl?: string };
  onBackToAdmin: () => void;
  initialTab?: BrandViewTab;
}

export function BrandViewShell({
  study,
  brand,
  onBackToAdmin,
  initialTab = "brand-overview",
}: BrandViewShellProps) {
  const [activeTab, setActiveTab] = useState<BrandViewTab>(initialTab);

  // Select the raw enrollments array (stable reference) and derive counts via useMemo
  const allEnrollments = useEnrollmentStore((s) => s.enrollments);
  const simulateBatch = useEnrollmentStore((s) => s.simulateBatch);
  const simulateBaselineBatch = useEnrollmentStore((s) => s.simulateBaselineBatch);
  const resetEnrollments = useEnrollmentStore((s) => s.resetEnrollments);

  const studyEnrollments = useMemo(
    () => allEnrollments.filter((e) => e.studyId === study.id),
    [allEnrollments, study.id]
  );
  const participantCount = useMemo(
    () => studyEnrollments.filter((e) => e.stage !== "clicked").length,
    [studyEnrollments]
  );
  const completedCount = useMemo(
    () => studyEnrollments.filter((e) => e.stage === "completed").length,
    [studyEnrollments]
  );
  const hasResults = completedCount > 0 || study.status === "completed";
  const hasEnrollments = studyEnrollments.length > 0;

  // Demo data seeder
  const enrollmentSlug = study.enrollmentConfig?.enrollmentSlug || study.id;
  const category = study.category || study.categoryKey || "sleep";

  const seedDemoData = useCallback(
    (size: "small" | "medium" | "full") => {
      // Reset first to avoid duplicates
      resetEnrollments();

      const counts = { small: 5, medium: 15, full: 30 };
      const count = counts[size];

      // Use simulateBaselineBatch for most (these get baseline data)
      // and simulateBatch for the rest (random stages)
      const baselineCount = Math.floor(count * 0.7);
      const batchCount = count - baselineCount;

      simulateBaselineBatch(study.id, enrollmentSlug, baselineCount, category);
      simulateBatch(study.id, enrollmentSlug, batchCount, category);
    },
    [study.id, enrollmentSlug, category, simulateBatch, simulateBaselineBatch, resetEnrollments]
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

      {/* Admin-only: Demo Data Seeder */}
      {!hasEnrollments && (
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

      {/* Admin-only: Reset data when populated */}
      {hasEnrollments && (
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
          <BrandOverviewTab study={study} brand={brand} />
        )}
        {activeTab === "brand-insights" && (
          <BrandInsightsTab study={study} />
        )}
        {activeTab === "brand-results" && (
          <BrandResultsTab study={study} />
        )}
        {activeTab === "brand-widget" && (
          <BrandWidgetTab studyId={study.id} studyName={study.name} />
        )}
      </main>

      <BrandViewFooter />
    </div>
  );
}
