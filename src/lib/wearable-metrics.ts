/**
 * Wearable Metrics Definitions
 *
 * Defines available metrics by category for Tier 1 studies (wearables primary).
 * Used for primary metric selection in study configuration.
 */

export interface MetricDefinition {
  id: string;
  label: string;
  unit: string;
  description?: string;
  higherIsBetter: boolean;
}

/**
 * Available wearable metrics by category.
 * Only Tier 1 categories (Sleep, Recovery, Fitness) have primary wearable metrics.
 */
export const CATEGORY_WEARABLE_METRICS: Record<string, MetricDefinition[]> = {
  sleep: [
    {
      id: "deep_sleep_duration",
      label: "Deep Sleep Duration",
      unit: "minutes",
      description: "Time spent in deep/slow-wave sleep",
      higherIsBetter: true,
    },
    {
      id: "rem_sleep_duration",
      label: "REM Sleep Duration",
      unit: "minutes",
      description: "Time spent in REM (dream) sleep",
      higherIsBetter: true,
    },
    {
      id: "total_sleep_time",
      label: "Total Sleep Time",
      unit: "hours",
      description: "Total time asleep per night",
      higherIsBetter: true,
    },
    {
      id: "sleep_efficiency",
      label: "Sleep Efficiency",
      unit: "%",
      description: "Percentage of time in bed actually sleeping",
      higherIsBetter: true,
    },
    {
      id: "sleep_score",
      label: "Sleep Score",
      unit: "points",
      description: "Composite sleep quality score (0-100)",
      higherIsBetter: true,
    },
    {
      id: "sleep_latency",
      label: "Sleep Latency",
      unit: "minutes",
      description: "Time to fall asleep",
      higherIsBetter: false,
    },
  ],
  recovery: [
    {
      id: "hrv",
      label: "Heart Rate Variability",
      unit: "ms",
      description: "HRV measured during sleep (RMSSD)",
      higherIsBetter: true,
    },
    {
      id: "resting_hr",
      label: "Resting Heart Rate",
      unit: "bpm",
      description: "Lowest heart rate during sleep",
      higherIsBetter: false,
    },
    {
      id: "recovery_score",
      label: "Recovery Score",
      unit: "points",
      description: "Composite recovery readiness score (0-100)",
      higherIsBetter: true,
    },
    {
      id: "respiratory_rate",
      label: "Respiratory Rate",
      unit: "breaths/min",
      description: "Average breathing rate during sleep",
      higherIsBetter: false,
    },
  ],
  fitness: [
    {
      id: "vo2_max",
      label: "VO2 Max",
      unit: "mL/kg/min",
      description: "Estimated maximum oxygen uptake",
      higherIsBetter: true,
    },
    {
      id: "active_calories",
      label: "Active Calories",
      unit: "kcal",
      description: "Calories burned through activity",
      higherIsBetter: true,
    },
    {
      id: "steps",
      label: "Daily Steps",
      unit: "steps",
      description: "Total steps per day",
      higherIsBetter: true,
    },
    {
      id: "active_minutes",
      label: "Active Minutes",
      unit: "minutes",
      description: "Minutes of moderate to vigorous activity",
      higherIsBetter: true,
    },
    {
      id: "strain_score",
      label: "Strain Score",
      unit: "points",
      description: "Cardiovascular load score (0-21)",
      higherIsBetter: true,
    },
  ],
};

/**
 * Get metrics available for a category.
 * Returns empty array for non-Tier 1 categories.
 */
export function getMetricsForCategory(category: string): MetricDefinition[] {
  return CATEGORY_WEARABLE_METRICS[category] || [];
}

/**
 * Get a specific metric definition by ID and category.
 */
export function getMetricById(
  category: string,
  metricId: string
): MetricDefinition | undefined {
  const metrics = getMetricsForCategory(category);
  return metrics.find((m) => m.id === metricId);
}

/**
 * Check if a category supports wearable primary metrics (Tier 1).
 */
export function categoryHasWearableMetrics(category: string): boolean {
  return category in CATEGORY_WEARABLE_METRICS;
}

/**
 * Get the default primary metric for a category.
 * Used when no selection has been made and auto-select hasn't computed yet.
 */
export function getDefaultMetricForCategory(
  category: string
): MetricDefinition | undefined {
  const metrics = getMetricsForCategory(category);
  return metrics[0]; // First metric is the default
}
