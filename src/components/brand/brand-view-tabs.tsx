"use client";

import { Users, Sparkles, BarChart3, Code2 } from "lucide-react";
import type { BrandViewTab } from "./types";

interface BrandViewTabsProps {
  activeTab: BrandViewTab;
  onTabChange: (tab: BrandViewTab) => void;
  /** Whether results tab has data to show */
  hasResults?: boolean;
  /** Number of participants for badge display */
  participantCount?: number;
}

const TABS: Array<{
  id: BrandViewTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    id: "brand-overview",
    label: "Overview",
    icon: BarChart3,
    description: "Study status",
  },
  {
    id: "brand-insights",
    label: "Live Insights",
    icon: Sparkles,
    description: "Customer stories",
  },
  {
    id: "brand-results",
    label: "Results",
    icon: Users,
    description: "Before & after",
  },
  {
    id: "brand-widget",
    label: "Your Widget",
    icon: Code2,
    description: "For your site",
  },
];

export function BrandViewTabs({
  activeTab,
  onTabChange,
  hasResults = false,
  participantCount = 0,
}: BrandViewTabsProps) {
  return (
    <div className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <nav className="flex gap-0" aria-label="Brand view navigation">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            // Show subtle indicator on results tab when data exists
            const showDot = tab.id === "brand-results" && hasResults;
            // Show count badge on insights tab
            const showCount = tab.id === "brand-insights" && participantCount > 0;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium
                  transition-colors border-b-2 -mb-px
                  ${
                    isActive
                      ? "border-[#00D1C1] text-gray-900"
                      : "border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-200"
                  }
                `}
                aria-selected={isActive}
                role="tab"
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#00D1C1]" : ""}`} />
                {tab.label}
                
                {showDot && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
                {showCount && (
                  <span className="ml-1 text-xs bg-[#00D1C1]/10 text-[#00D1C1] rounded-full px-1.5 py-0.5 font-semibold">
                    {participantCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
