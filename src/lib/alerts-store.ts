/**
 * Alerts Store - Computes and manages admin alerts
 *
 * Alerts are computed from:
 * - Cohort store (shipping delays)
 * - Compliance store (dropout risk)
 * - Recruitment state (stalled studies)
 *
 * Alert behavior:
 * - Alerts can be acknowledged (dismissed) by admins
 * - Alerts auto-clear when the underlying condition is resolved
 * - Acknowledged alerts won't re-trigger for the same condition
 * - If condition recurs after resolution, alert reappears
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AdminAlert,
  AlertType,
  PlatformHealth,
} from "@/lib/types";
import {
  computeComplianceHealth,
  computeShippingHealth,
} from "@/lib/types/alerts";

// ============================================
// STORE TYPES
// ============================================

interface AlertsStoreState {
  // Acknowledged alert IDs (persisted)
  acknowledgedAlerts: Record<string, string>; // alertId -> acknowledgedAt timestamp

  // Actions
  acknowledgeAlert: (alertId: string) => void;
  clearAcknowledgement: (alertId: string) => void;
  isAlertAcknowledged: (alertId: string) => boolean;

  // Reset for testing
  resetAcknowledgements: () => void;
}

// ============================================
// ALERT GENERATION HELPERS
// ============================================

function generateAlertId(type: AlertType, studyId: string): string {
  return `${type}-${studyId}`;
}

/**
 * Generate mock alerts for demonstration purposes.
 * In production, this would compute alerts from actual store data.
 */
export function generateMockAlerts(): AdminAlert[] {
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: generateAlertId("shipping_overdue", "study-sleep"),
      type: "shipping_overdue",
      severity: "high",
      studyId: "study-sleep",
      studyName: "Sleep Study",
      brandName: "Calm Co.",
      title: "Shipping Overdue",
      description: "Cohort 2: 15 participants awaiting tracking codes (52h overdue)",
      triggeredAt: twoDaysAgo,
      actions: [
        { label: "Contact Brand", href: "#", primary: false },
        { label: "View Study", href: "/admin/studies/study-sleep?tab=fulfillment", primary: true },
      ],
    },
    {
      id: generateAlertId("high_dropout_risk", "study-energy"),
      type: "high_dropout_risk",
      severity: "high",
      studyId: "study-energy",
      studyName: "Energy Boost",
      brandName: "VitaMax",
      title: "High Dropout Risk",
      description: "4 participants critical (1-2 lifelines remaining)",
      triggeredAt: yesterday,
      actions: [
        { label: "View Compliance", href: "/admin/studies/study-energy?tab=compliance", primary: true },
      ],
    },
    {
      id: generateAlertId("low_waitlist", "study-focus"),
      type: "low_waitlist",
      severity: "medium",
      studyId: "study-focus",
      studyName: "Focus Formula",
      brandName: "MindLab",
      title: "Low Waitlist",
      description: "Ready to open window, but only 8 on waitlist (expect ~3 enrollments)",
      triggeredAt: now,
      actions: [
        { label: "View Study", href: "/admin/studies/study-focus?tab=fulfillment", primary: true },
      ],
    },
  ];
}

/**
 * Generate mock platform health metrics.
 * In production, this would aggregate data from all studies.
 */
export function generateMockPlatformHealth(): PlatformHealth {
  const avgCompliancePercent = 91;
  const avgShipTimeDays = 1.8;

  return {
    activeStudies: 12,
    participantsInProgress: 347,
    avgCompliancePercent,
    avgShipTimeDays,
    complianceHealth: computeComplianceHealth(avgCompliancePercent),
    shippingHealth: computeShippingHealth(avgShipTimeDays),
  };
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useAlertsStore = create<AlertsStoreState>()(
  persist(
    (set, get) => ({
      acknowledgedAlerts: {},

      acknowledgeAlert: (alertId) => {
        set((state) => ({
          acknowledgedAlerts: {
            ...state.acknowledgedAlerts,
            [alertId]: new Date().toISOString(),
          },
        }));
      },

      clearAcknowledgement: (alertId) => {
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [alertId]: removed, ...rest } = state.acknowledgedAlerts;
          return { acknowledgedAlerts: rest };
        });
      },

      isAlertAcknowledged: (alertId) => {
        return !!get().acknowledgedAlerts[alertId];
      },

      resetAcknowledgements: () => {
        set({ acknowledgedAlerts: {} });
      },
    }),
    {
      name: "alerts-storage",
    }
  )
);

/**
 * Hook to get active (non-acknowledged) alerts
 */
export function useActiveAlerts() {
  const { acknowledgedAlerts } = useAlertsStore();
  const allAlerts = generateMockAlerts();

  return allAlerts.filter((alert) => !acknowledgedAlerts[alert.id]);
}

/**
 * Hook to get platform health metrics
 */
export function usePlatformHealth() {
  return generateMockPlatformHealth();
}
