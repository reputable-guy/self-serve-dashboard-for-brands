/**
 * Alert Types for Admin Dashboard
 *
 * Alerts help admins prioritize which studies need attention.
 * Alerts can be acknowledged (dismissed) or auto-clear when resolved.
 */

// ============================================
// ALERT SEVERITY & TYPES
// ============================================

export type AlertSeverity = "high" | "medium" | "low";

export type AlertType =
  | "shipping_overdue"       // No tracking codes 48h+ after window close
  | "high_dropout_risk"      // 3+ participants at critical level
  | "stalled_recruitment"    // Window closed 72h+ with no action
  | "low_waitlist"           // Expected enrollments < 10 at ready_to_open
  | "compliance_declining";  // Week-over-week compliance drop > 10%

// ============================================
// ADMIN ALERT
// ============================================

export interface AlertAction {
  label: string;
  href: string;
  primary?: boolean;
}

export interface AdminAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  studyId: string;
  studyName: string;
  brandName: string;

  // Alert content
  title: string;
  description: string;

  // Timestamps
  triggeredAt: string;      // ISO timestamp when alert was first triggered
  acknowledgedAt?: string;  // ISO timestamp when admin acknowledged/dismissed

  // Actions
  actions: AlertAction[];
}

// ============================================
// PLATFORM HEALTH METRICS
// ============================================

export type HealthIndicator = "good" | "warning" | "poor";

export interface PlatformHealth {
  /** Number of active studies (recruiting or active) */
  activeStudies: number;
  /** Total participants currently in active studies */
  participantsInProgress: number;
  /** Average compliance percentage across all active studies */
  avgCompliancePercent: number;
  /** Average days from cohort ready to all tracking entered */
  avgShipTimeDays: number;

  // Health indicators
  complianceHealth: HealthIndicator;
  shippingHealth: HealthIndicator;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get severity color for display
 */
export function getAlertSeverityColor(severity: AlertSeverity): string {
  switch (severity) {
    case "high":
      return "red";
    case "medium":
      return "amber";
    case "low":
      return "blue";
  }
}

/**
 * Get health indicator color
 */
export function getHealthIndicatorColor(health: HealthIndicator): string {
  switch (health) {
    case "good":
      return "green";
    case "warning":
      return "amber";
    case "poor":
      return "red";
  }
}

/**
 * Determine compliance health from percentage
 */
export function computeComplianceHealth(percent: number): HealthIndicator {
  if (percent >= 85) return "good";
  if (percent >= 75) return "warning";
  return "poor";
}

/**
 * Determine shipping health from average ship time
 */
export function computeShippingHealth(avgDays: number): HealthIndicator {
  if (avgDays <= 2) return "good";
  if (avgDays <= 4) return "warning";
  return "poor";
}
