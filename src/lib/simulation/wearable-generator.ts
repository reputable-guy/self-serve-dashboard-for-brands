/**
 * Wearable Baseline Data Generator
 *
 * Generates realistic wearable device data for Tier 1-2 categories.
 * Data varies based on participant archetype (desperate = worse metrics, etc.)
 */

import type {
  ParticipantArchetype,
  WearableBaselineData,
  WearableBaselineMetric,
  WearableMetricStatus,
} from '../types';

// Categories that support wearable data (Tier 1-2)
const WEARABLE_CATEGORIES = ['sleep', 'stress', 'recovery', 'fitness'];

/**
 * Check if a category supports wearable baseline data
 */
export function categorySupportsWearables(category: string): boolean {
  return WEARABLE_CATEGORIES.includes(category);
}

/**
 * Random number in range [min, max]
 */
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Format hours as "Xh Ym"
 */
function formatSleepTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

/**
 * Get status bias based on archetype
 * Desperate/strugglers have worse metrics, optimists have better
 */
function getStatusBias(archetype: ParticipantArchetype): WearableMetricStatus {
  switch (archetype) {
    case 'desperate': return 'poor';
    case 'struggler': return 'below_avg';
    case 'optimist': return 'good';
    default: return 'normal';
  }
}

/**
 * Generate sleep-specific wearable metrics
 */
function generateSleepMetrics(statusBias: WearableMetricStatus): WearableBaselineMetric[] {
  const metrics: WearableBaselineMetric[] = [];

  // Sleep Score
  const sleepScore = statusBias === 'poor' ? randomInRange(45, 65) :
                     statusBias === 'below_avg' ? randomInRange(55, 72) :
                     statusBias === 'good' ? randomInRange(75, 88) :
                     randomInRange(62, 78);
  metrics.push({
    label: 'Sleep Score',
    value: sleepScore,
    unit: '/100',
    status: sleepScore < 55 ? 'poor' : sleepScore < 65 ? 'below_avg' : sleepScore < 75 ? 'normal' : sleepScore < 85 ? 'good' : 'excellent',
    iconName: 'moon',
  });

  // Total Sleep
  const sleepHours = statusBias === 'poor' ? 4.5 + Math.random() * 1.5 :
                     statusBias === 'below_avg' ? 5.5 + Math.random() * 1 :
                     statusBias === 'good' ? 7 + Math.random() * 1 :
                     5.75 + Math.random() * 1.5;
  const sleepStatus: WearableMetricStatus = sleepHours < 5.5 ? 'poor' : sleepHours < 6.5 ? 'below_avg' : sleepHours < 7.5 ? 'normal' : 'good';
  metrics.push({
    label: 'Total Sleep',
    value: formatSleepTime(sleepHours),
    status: sleepStatus,
    iconName: 'clock',
  });

  // Sleep Efficiency
  const efficiency = statusBias === 'poor' ? randomInRange(65, 78) :
                     statusBias === 'below_avg' ? randomInRange(72, 82) :
                     statusBias === 'good' ? randomInRange(85, 94) :
                     randomInRange(75, 88);
  metrics.push({
    label: 'Sleep Efficiency',
    value: `${efficiency}%`,
    status: efficiency < 75 ? 'poor' : efficiency < 82 ? 'below_avg' : efficiency < 88 ? 'normal' : 'good',
    iconName: 'gauge',
  });

  // Resting HR
  const restingHR = statusBias === 'poor' ? randomInRange(70, 82) :
                    statusBias === 'below_avg' ? randomInRange(65, 75) :
                    statusBias === 'good' ? randomInRange(52, 62) :
                    randomInRange(58, 72);
  metrics.push({
    label: 'Resting HR',
    value: restingHR,
    unit: 'bpm',
    status: restingHR > 75 ? 'poor' : restingHR > 68 ? 'below_avg' : restingHR > 60 ? 'normal' : 'good',
    iconName: 'heart',
  });

  // HRV
  const hrv = statusBias === 'poor' ? randomInRange(20, 35) :
              statusBias === 'below_avg' ? randomInRange(30, 45) :
              statusBias === 'good' ? randomInRange(55, 80) :
              randomInRange(35, 55);
  metrics.push({
    label: 'HRV',
    value: hrv,
    unit: 'ms',
    status: hrv < 30 ? 'poor' : hrv < 40 ? 'below_avg' : hrv < 55 ? 'normal' : 'good',
    iconName: 'activity',
  });

  // Deep Sleep
  const deepSleep = statusBias === 'poor' ? randomInRange(25, 50) :
                    statusBias === 'below_avg' ? randomInRange(40, 60) :
                    statusBias === 'good' ? randomInRange(70, 95) :
                    randomInRange(45, 70);
  metrics.push({
    label: 'Deep Sleep',
    value: `${deepSleep} min`,
    status: deepSleep < 45 ? 'poor' : deepSleep < 60 ? 'below_avg' : deepSleep < 80 ? 'normal' : 'good',
    iconName: 'zap',
  });

  return metrics;
}

/**
 * Generate stress-specific wearable metrics
 */
function generateStressMetrics(statusBias: WearableMetricStatus): WearableBaselineMetric[] {
  const metrics: WearableBaselineMetric[] = [];

  // HRV
  const hrv = statusBias === 'poor' ? randomInRange(18, 32) :
              statusBias === 'below_avg' ? randomInRange(28, 42) :
              statusBias === 'good' ? randomInRange(50, 75) :
              randomInRange(32, 52);
  metrics.push({
    label: 'HRV',
    value: hrv,
    unit: 'ms',
    status: hrv < 28 ? 'poor' : hrv < 38 ? 'below_avg' : hrv < 50 ? 'normal' : 'good',
    iconName: 'activity',
  });

  // Resting HR
  const restingHR = statusBias === 'poor' ? randomInRange(72, 85) :
                    statusBias === 'below_avg' ? randomInRange(68, 78) :
                    statusBias === 'good' ? randomInRange(55, 65) :
                    randomInRange(62, 75);
  metrics.push({
    label: 'Resting HR',
    value: restingHR,
    unit: 'bpm',
    status: restingHR > 78 ? 'poor' : restingHR > 70 ? 'below_avg' : restingHR > 62 ? 'normal' : 'good',
    iconName: 'heart',
  });

  // Recovery Score
  const recovery = statusBias === 'poor' ? randomInRange(35, 55) :
                   statusBias === 'below_avg' ? randomInRange(50, 68) :
                   statusBias === 'good' ? randomInRange(75, 90) :
                   randomInRange(55, 72);
  metrics.push({
    label: 'Recovery Score',
    value: recovery,
    unit: '/100',
    status: recovery < 50 ? 'poor' : recovery < 62 ? 'below_avg' : recovery < 75 ? 'normal' : 'good',
    iconName: 'gauge',
  });

  // Stress Events
  const stressEvents = statusBias === 'poor' ? randomInRange(10, 18) :
                       statusBias === 'below_avg' ? randomInRange(7, 12) :
                       statusBias === 'good' ? randomInRange(2, 5) :
                       randomInRange(5, 10);
  metrics.push({
    label: 'Stress Events',
    value: `${stressEvents}/day`,
    status: stressEvents > 12 ? 'poor' : stressEvents > 8 ? 'below_avg' : stressEvents > 5 ? 'normal' : 'good',
    iconName: 'zap',
  });

  return metrics;
}

/**
 * Generate recovery-specific wearable metrics
 */
function generateRecoveryMetrics(statusBias: WearableMetricStatus): WearableBaselineMetric[] {
  const metrics: WearableBaselineMetric[] = [];

  // Recovery Score
  const recovery = statusBias === 'poor' ? randomInRange(30, 50) :
                   statusBias === 'below_avg' ? randomInRange(45, 62) :
                   statusBias === 'good' ? randomInRange(72, 88) :
                   randomInRange(52, 70);
  metrics.push({
    label: 'Recovery Score',
    value: recovery,
    unit: '/100',
    status: recovery < 45 ? 'poor' : recovery < 58 ? 'below_avg' : recovery < 72 ? 'normal' : 'good',
    iconName: 'gauge',
  });

  // HRV
  const hrv = statusBias === 'poor' ? randomInRange(22, 38) :
              statusBias === 'below_avg' ? randomInRange(35, 50) :
              statusBias === 'good' ? randomInRange(58, 82) :
              randomInRange(40, 58);
  metrics.push({
    label: 'HRV',
    value: hrv,
    unit: 'ms',
    status: hrv < 35 ? 'poor' : hrv < 45 ? 'below_avg' : hrv < 60 ? 'normal' : 'good',
    iconName: 'activity',
  });

  // Resting HR
  const restingHR = statusBias === 'poor' ? randomInRange(68, 80) :
                    statusBias === 'below_avg' ? randomInRange(62, 72) :
                    statusBias === 'good' ? randomInRange(48, 58) :
                    randomInRange(55, 68);
  metrics.push({
    label: 'Resting HR',
    value: restingHR,
    unit: 'bpm',
    status: restingHR > 72 ? 'poor' : restingHR > 64 ? 'below_avg' : restingHR > 56 ? 'normal' : 'good',
    iconName: 'heart',
  });

  // Sleep Score
  const sleepScore = statusBias === 'poor' ? randomInRange(48, 62) :
                     statusBias === 'below_avg' ? randomInRange(58, 72) :
                     statusBias === 'good' ? randomInRange(78, 90) :
                     randomInRange(65, 78);
  metrics.push({
    label: 'Sleep Score',
    value: sleepScore,
    unit: '/100',
    status: sleepScore < 55 ? 'poor' : sleepScore < 68 ? 'below_avg' : sleepScore < 78 ? 'normal' : 'good',
    iconName: 'moon',
  });

  return metrics;
}

/**
 * Generate fitness-specific wearable metrics
 */
function generateFitnessMetrics(statusBias: WearableMetricStatus): WearableBaselineMetric[] {
  const metrics: WearableBaselineMetric[] = [];

  // Daily Steps
  const steps = statusBias === 'poor' ? randomInRange(2500, 5000) :
                statusBias === 'below_avg' ? randomInRange(4500, 7000) :
                statusBias === 'good' ? randomInRange(9000, 14000) :
                randomInRange(6000, 9500);
  metrics.push({
    label: 'Daily Steps',
    value: steps.toLocaleString(),
    status: steps < 5000 ? 'poor' : steps < 7000 ? 'below_avg' : steps < 10000 ? 'normal' : 'good',
    iconName: 'activity',
  });

  // Active Minutes
  const activeMin = statusBias === 'poor' ? randomInRange(15, 35) :
                    statusBias === 'below_avg' ? randomInRange(30, 50) :
                    statusBias === 'good' ? randomInRange(60, 95) :
                    randomInRange(40, 65);
  metrics.push({
    label: 'Active Minutes',
    value: activeMin,
    unit: '/day',
    status: activeMin < 30 ? 'poor' : activeMin < 45 ? 'below_avg' : activeMin < 60 ? 'normal' : 'good',
    iconName: 'zap',
  });

  // HRV
  const hrv = statusBias === 'poor' ? randomInRange(28, 42) :
              statusBias === 'below_avg' ? randomInRange(38, 52) :
              statusBias === 'good' ? randomInRange(58, 85) :
              randomInRange(45, 62);
  metrics.push({
    label: 'HRV',
    value: hrv,
    unit: 'ms',
    status: hrv < 35 ? 'poor' : hrv < 48 ? 'below_avg' : hrv < 62 ? 'normal' : 'good',
    iconName: 'activity',
  });

  // Resting HR
  const restingHR = statusBias === 'poor' ? randomInRange(72, 82) :
                    statusBias === 'below_avg' ? randomInRange(65, 75) :
                    statusBias === 'good' ? randomInRange(50, 60) :
                    randomInRange(58, 70);
  metrics.push({
    label: 'Resting HR',
    value: restingHR,
    unit: 'bpm',
    status: restingHR > 75 ? 'poor' : restingHR > 68 ? 'below_avg' : restingHR > 58 ? 'normal' : 'good',
    iconName: 'heart',
  });

  return metrics;
}

/**
 * Generate wearable baseline data for Tier 1-2 categories.
 * Returns undefined for categories that don't support wearables.
 */
export function generateWearableBaselineData(
  category: string,
  archetype: ParticipantArchetype
): WearableBaselineData | undefined {
  if (!categorySupportsWearables(category)) {
    return undefined;
  }

  const statusBias = getStatusBias(archetype);
  let metrics: WearableBaselineMetric[];

  switch (category) {
    case 'sleep':
      metrics = generateSleepMetrics(statusBias);
      break;
    case 'stress':
      metrics = generateStressMetrics(statusBias);
      break;
    case 'recovery':
      metrics = generateRecoveryMetrics(statusBias);
      break;
    case 'fitness':
      metrics = generateFitnessMetrics(statusBias);
      break;
    default:
      return undefined;
  }

  return {
    category: category as 'sleep' | 'stress' | 'recovery' | 'fitness',
    avgPeriod: '7-day average',
    metrics,
  };
}
