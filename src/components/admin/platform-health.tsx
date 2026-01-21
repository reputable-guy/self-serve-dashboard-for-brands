"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, Users, Activity, Truck, CheckCircle2 } from "lucide-react";
import type { PlatformHealth as PlatformHealthType, HealthIndicator } from "@/lib/types";

interface PlatformHealthProps {
  health: PlatformHealthType;
}

/**
 * Platform health metrics section showing key operational KPIs.
 */
export function PlatformHealth({ health }: PlatformHealthProps) {
  // Get health indicator styling
  const getHealthIndicator = (indicator: HealthIndicator) => {
    switch (indicator) {
      case "good":
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
          label: "Good",
          color: "text-green-600",
        };
      case "warning":
        return {
          icon: <Activity className="h-4 w-4 text-amber-500" />,
          label: "Warning",
          color: "text-amber-600",
        };
      case "poor":
        return {
          icon: <Activity className="h-4 w-4 text-red-500" />,
          label: "Poor",
          color: "text-red-600",
        };
    }
  };

  const complianceHealth = getHealthIndicator(health.complianceHealth);
  const shippingHealth = getHealthIndicator(health.shippingHealth);

  const metrics = [
    {
      label: "Active Studies",
      value: health.activeStudies,
      subtext: "Recruiting or in progress",
      icon: <FlaskConical className="h-4 w-4 text-muted-foreground" />,
    },
    {
      label: "Participants In Progress",
      value: health.participantsInProgress,
      subtext: "Across all active studies",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      label: "Avg Compliance",
      value: `${health.avgCompliancePercent}%`,
      subtext: complianceHealth.label,
      icon: complianceHealth.icon,
      valueColor: complianceHealth.color,
    },
    {
      label: "Avg Ship Time",
      value: `${health.avgShipTimeDays} days`,
      subtext: shippingHealth.label,
      icon: shippingHealth.icon,
      valueColor: shippingHealth.color,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Activity className="h-5 w-5 text-muted-foreground" />
          Platform Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-muted/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">
                  {metric.label}
                </span>
                {metric.icon}
              </div>
              <div
                className={`text-2xl font-bold ${
                  metric.valueColor || "text-foreground"
                }`}
              >
                {metric.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {metric.subtext}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
