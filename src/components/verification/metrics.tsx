"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

/**
 * Card displaying a single metric with before/after comparison
 */
export function MetricCard({
  label,
  before,
  after,
  change,
  icon: Icon,
}: {
  label: string;
  before: string;
  after: string;
  change: string;
  icon: React.ElementType;
}) {
  const isPositive = change.startsWith("+") || change.startsWith("-") && label === "Resting HR";
  const isNegativeGood = label === "Resting HR" && change.startsWith("-");
  const showPositive = isPositive || isNegativeGood;

  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Before</div>
          <div className="text-sm font-medium">{before}</div>
        </div>
        <div className="flex items-center gap-1">
          {showPositive ? (
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span className={`font-bold ${showPositive ? "text-green-600" : "text-red-500"}`}>
            {change}
          </span>
        </div>
        <div className="space-y-1 text-right">
          <div className="text-xs text-muted-foreground">After</div>
          <div className="text-sm font-medium text-green-600">{after}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Card displaying assessment results with baseline/endpoint scores
 */
export function AssessmentResultCard({
  assessmentName,
  baselineScore,
  endpointScore,
  changePercent,
  headline,
  isPrimary = true,
}: {
  assessmentName: string;
  baselineScore: number;
  endpointScore: number;
  changePercent: number;
  headline: string;
  isPrimary?: boolean;
}) {
  const improved = endpointScore > baselineScore;

  return (
    <div className={`space-y-4 ${isPrimary ? "" : "opacity-90"}`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{assessmentName}</h4>
          <p className="text-sm text-muted-foreground">Validated Assessment</p>
        </div>
        {isPrimary && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
            PRIMARY MEASURE
          </span>
        )}
      </div>

      <div className="flex items-center gap-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-muted-foreground">{baselineScore.toFixed(0)}</div>
          <div className="text-xs text-muted-foreground">Baseline</div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            improved ? "bg-green-100" : "bg-red-100"
          }`}>
            {improved ? (
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            ) : (
              <ArrowDownRight className="h-5 w-5 text-red-500" />
            )}
            <span className={`font-bold text-lg ${improved ? "text-green-600" : "text-red-500"}`}>
              {changePercent > 0 ? "+" : ""}{changePercent.toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="text-center">
          <div className={`text-3xl font-bold ${improved ? "text-green-600" : "text-red-500"}`}>
            {endpointScore.toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground">Endpoint</div>
        </div>
      </div>

      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div className="h-full flex">
          <div
            className="h-full bg-gray-300 transition-all"
            style={{ width: `${baselineScore}%` }}
          />
          <div
            className={`h-full ${improved ? "bg-green-500" : "bg-red-400"} transition-all`}
            style={{ width: `${Math.abs(endpointScore - baselineScore)}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-center font-medium text-muted-foreground">
        {headline}
      </p>
    </div>
  );
}
