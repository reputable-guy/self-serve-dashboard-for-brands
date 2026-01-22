"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FlaskConical,
  X,
  BarChart3,
  Settings,
  Star,
  Package,
  Activity,
} from "lucide-react";
import { useBrandsStore } from "@/lib/brands-store";
import { useStudiesStore } from "@/lib/studies-store";
import { CATEGORY_CONFIGS } from "@/lib/assessments";
import { StudyDetailsFullPreview } from "@/components/study-details-full-preview";
import { StudyPreview } from "@/components/study-preview";
import {
  OverviewTab,
  ResultsTab,
  ConfigTab,
  FulfillmentTab,
  ComplianceTab,
  TabIndicator,
  MOCK_STUDIES,
  getStatusColor,
  getTierColor,
} from "@/components/admin/study-detail";
import type { TabId } from "@/components/admin/study-detail";

// ============================================
// PREVIEW MODAL COMPONENT
// ============================================

function PreviewModal({
  study,
  onClose,
}: {
  study: (typeof MOCK_STUDIES)["study-1"];
  onClose: () => void;
}) {
  const [activePreview, setActivePreview] = useState<"card" | "details">(
    "card"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-xl shadow-2xl w-full max-w-[440px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div>
            <h3 className="font-semibold">App Preview</h3>
            <p className="text-sm text-muted-foreground">
              How participants see this study
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Toggle */}
        <div className="p-4 flex-shrink-0">
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <button
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activePreview === "card"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActivePreview("card")}
            >
              Catalog Card
            </button>
            <button
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activePreview === "details"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActivePreview("details")}
            >
              Full Details
            </button>
          </div>
        </div>

        {/* Preview Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex justify-center">
            {activePreview === "card" ? (
              <StudyPreview
                productName={study.name}
                productImage={study.productImage}
                category={study.categoryLabel}
                rebateAmount={String(study.rebateAmount)}
                durationDays="28"
                totalSpots={String(study.targetParticipants)}
                requiredDevice={study.hasWearables ? "oura" : "any"}
                studyTitle={`${study.name} Study`}
                hookQuestion={`Can ${study.name} improve your ${study.categoryLabel.toLowerCase()}?`}
              />
            ) : (
              <StudyDetailsFullPreview
                productName={study.name}
                productImage={study.productImage}
                productDescription={study.productDescription}
                category={study.categoryLabel}
                rebateAmount={study.rebateAmount}
                durationDays={28}
                totalSpots={study.targetParticipants}
                requiredDevice={study.hasWearables ? "required" : "optional"}
                whatYoullDiscover={study.whatYoullDiscover}
                dailyRoutine={study.dailyRoutine}
                howItWorks={study.howItWorks}
                tier={study.tier}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function AdminStudyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showPreview, setShowPreview] = useState(false);

  // First try the store, then fall back to legacy MOCK_STUDIES
  const storeStudy = useStudiesStore((state) => state.getStudyById(id));
  const legacyStudy = MOCK_STUDIES[id];

  // Convert store study to the format expected by this page
  const study = storeStudy
    ? {
        ...storeStudy,
        startDate: storeStudy.startDate ? new Date(storeStudy.startDate).toISOString().split('T')[0] : "",
        endDate: storeStudy.endDate ? new Date(storeStudy.endDate).toISOString().split('T')[0] : "",
        avgImprovement: Math.floor(Math.random() * 20) + 15, // Generate random for new studies
        completionRate: storeStudy.status === 'completed' ? 100 : Math.floor(Math.random() * 20) + 75,
      }
    : legacyStudy;

  const brand = useBrandsStore((state) =>
    study ? state.getBrandById(study.brandId) : undefined
  );

  const categoryConfig = study
    ? CATEGORY_CONFIGS.find((c) => c.value === study.category)
    : undefined;

  if (!study) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">Study not found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            The study you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/admin/studies")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Studies
          </Button>
        </div>
      </div>
    );
  }

  // Tab order follows workflow: Overview → Fulfillment → Compliance → Results → Config
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      id: "fulfillment",
      label: "Fulfillment",
      icon: <Package className="h-4 w-4" />,
    },
    {
      id: "compliance",
      label: "Compliance",
      icon: <Activity className="h-4 w-4" />,
    },
    { id: "results", label: "Results", icon: <Star className="h-4 w-4" /> },
    {
      id: "config",
      label: "Configuration",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/admin/studies"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Studies
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-lg bg-[#00D1C1]/10 flex items-center justify-center">
            <FlaskConical className="h-7 w-7 text-[#00D1C1]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{study.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(study.status)}>
                {study.status}
              </Badge>
              <Badge className={getTierColor(study.tier)}>Tier {study.tier}</Badge>
              {categoryConfig && (
                <Badge variant="outline">{categoryConfig.label}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#00D1C1] text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
              <TabIndicator
                tab={tab.id}
                studyId={study.id}
                studyStatus={study.status}
                currentDay={(study as { currentDay?: number }).currentDay}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab
          study={study}
          brand={brand}
          onOpenPreview={() => setShowPreview(true)}
        />
      )}
      {activeTab === "fulfillment" && (
        <FulfillmentTab
          studyId={study.id}
          studyName={study.name}
          targetParticipants={study.targetParticipants}
          isDemo={study.isDemo !== false}
        />
      )}
      {activeTab === "compliance" && <ComplianceTab study={study} isDemo={study.isDemo !== false} />}
      {activeTab === "results" && <ResultsTab study={study} />}
      {activeTab === "config" && (
        <ConfigTab study={study} categoryConfig={categoryConfig} />
      )}

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal study={study} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
