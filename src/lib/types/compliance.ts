/**
 * Compliance & Participant Monitoring Types
 *
 * Types for tracking participant engagement during the 28-day study.
 * The "lifelines" system allows participants to miss a configurable number of days
 * before being automatically withdrawn.
 *
 * Status thresholds:
 * - On Track: 5-7 lifelines remaining
 * - At Risk: 3-4 lifelines remaining
 * - Critical: 1-2 lifelines remaining
 * - Withdrawn: 0 lifelines (dropped from study)
 */

// ============================================
// COMPLIANCE STATUS
// ============================================

export type ComplianceStatus = 'on_track' | 'at_risk' | 'critical' | 'withdrawn';

// ============================================
// PARTICIPANT COMPLIANCE RECORD
// ============================================

export interface ParticipantCompliance {
  participantId: string;
  studyId: string;
  cohortId: string;
  displayName: string;
  initials: string;

  // Progress tracking
  /** Current day in the study (1-28) */
  studyDay: number;
  /** Total check-ins completed */
  totalCheckIns: number;
  /** Expected check-ins by this day */
  expectedCheckIns: number;

  // Lifelines system
  /** Total lifelines for this participant (from study config, default 7) */
  totalLifelines: number;
  /** Number of days missed (no check-in) */
  missedDays: number;
  /** Lifelines remaining (totalLifelines - missedDays) */
  lifelinesRemaining: number;

  // Activity tracking
  /** ISO timestamp of last check-in */
  lastCheckInAt?: string;
  /** Days since last check-in */
  daysSinceLastCheckIn: number;

  // Computed status
  status: ComplianceStatus;

  // Wearable connection (if applicable)
  wearableConnected: boolean;
  /** ISO timestamp of last wearable sync */
  lastWearableSyncAt?: string;

  // Cohort info for display
  cohortNumber: number;
}

// ============================================
// STUDY COMPLIANCE CONFIGURATION
// ============================================

export interface StudyComplianceConfig {
  /** Total lifelines per participant (default: 7) */
  totalLifelines: number;
  /** Lifelines at or below this = at_risk (default: 4) */
  atRiskThreshold: number;
  /** Lifelines at or below this = critical (default: 2) */
  criticalThreshold: number;
}

/** Default compliance configuration */
export const DEFAULT_COMPLIANCE_CONFIG: StudyComplianceConfig = {
  totalLifelines: 7,
  atRiskThreshold: 4,
  criticalThreshold: 2,
};

// ============================================
// STUDY COMPLIANCE STATISTICS
// ============================================

/** Cohort progress info for display */
export interface CohortProgress {
  cohortNumber: number;
  cohortId: string;
  participantCount: number;
  /** Earliest day among participants in this cohort */
  dayRangeStart: number;
  /** Latest day among participants in this cohort */
  dayRangeEnd: number;
  /** Expected completion date for this cohort */
  expectedCompletionDate: string;
  /** Percentage complete (dayRangeEnd / totalDays) */
  progressPercent: number;
}

export interface StudyComplianceStats {
  studyId: string;
  /** Current day of the study (1-28) - represents the oldest cohort's day */
  currentDay: number;
  /** Total study duration in days (typically 28) */
  totalDays: number;
  /** Study start date (ISO string) */
  startDate: string;
  /** Study end date (ISO string) */
  endDate: string;

  // Participant counts by status
  onTrackCount: number;
  atRiskCount: number;
  criticalCount: number;
  withdrawnCount: number;
  /** Total active participants (on_track + at_risk + critical) */
  totalActive: number;

  // Overall compliance metrics
  /** Percentage of expected check-ins completed (0-100) */
  compliancePercent: number;
  /** Target compliance percentage (typically 85%) */
  targetCompliancePercent: number;

  // Cohort progress breakdown
  /** Progress by cohort - shows where each cohort is in the study */
  cohortProgress?: CohortProgress[];

  // Trend data for chart
  dailyCompliance: Array<{
    day: number;
    percent: number;
    date: string;
  }>;
}

// ============================================
// COMPLIANCE HELPERS
// ============================================

/**
 * Compute compliance status from lifelines remaining
 */
export function computeComplianceStatus(
  lifelinesRemaining: number,
  config: StudyComplianceConfig = DEFAULT_COMPLIANCE_CONFIG
): ComplianceStatus {
  if (lifelinesRemaining <= 0) return 'withdrawn';
  if (lifelinesRemaining <= config.criticalThreshold) return 'critical';
  if (lifelinesRemaining <= config.atRiskThreshold) return 'at_risk';
  return 'on_track';
}

/**
 * Get display color for compliance status
 */
export function getComplianceStatusColor(status: ComplianceStatus): string {
  switch (status) {
    case 'on_track':
      return 'green';
    case 'at_risk':
      return 'amber';
    case 'critical':
      return 'red';
    case 'withdrawn':
      return 'gray';
  }
}

/**
 * Get display label for compliance status
 */
export function getComplianceStatusLabel(status: ComplianceStatus): string {
  switch (status) {
    case 'on_track':
      return 'On Track';
    case 'at_risk':
      return 'At Risk';
    case 'critical':
      return 'Critical';
    case 'withdrawn':
      return 'Withdrawn';
  }
}
