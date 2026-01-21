"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, X, ChevronRight } from "lucide-react";
import type { AdminAlert } from "@/lib/types";
import { useAlertsStore } from "@/lib/alerts-store";
import Link from "next/link";

interface AttentionAlertsProps {
  alerts: AdminAlert[];
}

/**
 * "Needs Attention" section for admin dashboard.
 * Shows prioritized alerts that require admin action.
 * Alerts can be acknowledged (dismissed) by clicking X.
 */
export function AttentionAlerts({ alerts }: AttentionAlertsProps) {
  const { acknowledgeAlert } = useAlertsStore();

  if (alerts.length === 0) {
    return null;
  }

  // Get severity badge styling
  const getSeverityBadge = (severity: AdminAlert["severity"]) => {
    switch (severity) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            Low
          </Badge>
        );
    }
  };

  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-red-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Needs Attention
          </div>
          <span className="text-sm font-normal text-red-600">
            {alerts.length} {alerts.length === 1 ? "item" : "items"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white rounded-lg border p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Header row */}
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span className="font-medium">{alert.title}</span>
                  {getSeverityBadge(alert.severity)}
                </div>

                {/* Study info */}
                <div className="text-sm text-muted-foreground mb-2">
                  {alert.studyName} - {alert.brandName}
                </div>

                {/* Description */}
                <div className="text-sm mb-3">{alert.description}</div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {alert.actions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <Button
                        variant={action.primary ? "default" : "outline"}
                        size="sm"
                        className={action.primary ? "gap-1" : ""}
                      >
                        {action.label}
                        {action.primary && (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Dismiss button */}
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => acknowledgeAlert(alert.id)}
                title="Acknowledge alert"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
