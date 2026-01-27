/**
 * Wearable Metric Card
 *
 * Displays a single wearable metric with icon, value, and status.
 */

import {
  Moon,
  Heart,
  Activity,
  Clock,
  Zap,
  Gauge,
} from "lucide-react";
import type { WearableBaselineMetric, WearableMetricStatus } from "@/lib/types";

// Icon mapping for wearable metrics
const METRIC_ICONS = {
  moon: Moon,
  heart: Heart,
  activity: Activity,
  clock: Clock,
  zap: Zap,
  gauge: Gauge,
} as const;

// Status badge styles
const STATUS_STYLES: Record<WearableMetricStatus, {
  bg: string;
  text: string;
  border: string;
}> = {
  poor: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  below_avg: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  normal: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
  good: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  excellent: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
};

const STATUS_LABELS: Record<WearableMetricStatus, string> = {
  poor: 'Poor',
  below_avg: 'Below avg',
  normal: 'Normal',
  good: 'Good',
  excellent: 'Excellent',
};

interface WearableMetricCardProps {
  metric: WearableBaselineMetric;
}

export function WearableMetricCard({ metric }: WearableMetricCardProps) {
  const IconComponent = metric.iconName ? METRIC_ICONS[metric.iconName] : Activity;
  const statusStyle = STATUS_STYLES[metric.status];
  const iconColor = metric.status === 'poor' ? 'text-rose-500' :
                    metric.status === 'below_avg' ? 'text-amber-500' :
                    metric.status === 'good' ? 'text-emerald-500' :
                    metric.status === 'excellent' ? 'text-blue-500' :
                    'text-slate-500';

  return (
    <div className="flex flex-col items-center text-center p-2 rounded-lg bg-white/60 border border-slate-100">
      <IconComponent className={`w-3.5 h-3.5 ${iconColor} mb-1`} />
      <div className="text-sm font-bold text-slate-800 leading-tight">
        {metric.value}
        {metric.unit && (
          <span className="text-[10px] font-normal text-slate-400">
            {metric.unit}
          </span>
        )}
      </div>
      <div className="text-[9px] text-slate-500 font-medium mt-0.5 mb-1">
        {metric.label}
      </div>
      <span className={`text-[8px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
        {STATUS_LABELS[metric.status]}
      </span>
    </div>
  );
}

export default WearableMetricCard;
