"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, AlertOctagon, XCircle } from "lucide-react";
import type { StudyComplianceStats, StudyComplianceConfig } from "@/lib/types";
import { DEFAULT_COMPLIANCE_CONFIG } from "@/lib/types/compliance";

interface ComplianceStatsCardsProps {
  stats: StudyComplianceStats;
  config?: StudyComplianceConfig;
}

/**
 * Four status cards showing participant distribution:
 * - On Track (green): 5-7 lifelines
 * - At Risk (amber): 3-4 lifelines
 * - Critical (red): 1-2 lifelines
 * - Withdrawn (gray): 0 lifelines
 */
export function ComplianceStatsCards({ stats, config = DEFAULT_COMPLIANCE_CONFIG }: ComplianceStatsCardsProps) {
  const cards = [
    {
      label: "On Track",
      count: stats.onTrackCount,
      description: `${config.atRiskThreshold + 1}-${config.totalLifelines} lifelines`,
      icon: CheckCircle2,
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      iconColor: "text-green-500",
    },
    {
      label: "At Risk",
      count: stats.atRiskCount,
      description: `${config.criticalThreshold + 1}-${config.atRiskThreshold} lifelines`,
      icon: AlertTriangle,
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      iconColor: "text-amber-500",
    },
    {
      label: "Critical",
      count: stats.criticalCount,
      description: `1-${config.criticalThreshold} lifelines`,
      icon: AlertOctagon,
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      iconColor: "text-red-500",
    },
    {
      label: "Withdrawn",
      count: stats.withdrawnCount,
      description: "0 lifelines",
      icon: XCircle,
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      iconColor: "text-gray-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label} className={card.bgColor}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              <span className={`text-sm font-medium ${card.textColor}`}>
                {card.label}
              </span>
            </div>
            <div className="text-3xl font-bold">{card.count}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {card.description}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
