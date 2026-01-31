/**
 * Compliance Store - Manages participant compliance tracking during studies
 *
 * Tracks participant engagement through the "lifelines" system:
 * - Each participant starts with configurable lifelines (default: 7)
 * - Missing a day consumes one lifeline
 * - When lifelines reach 0, participant is withdrawn
 *
 * Status thresholds:
 * - On Track: 5-7 lifelines (green)
 * - At Risk: 3-4 lifelines (amber)
 * - Critical: 1-2 lifelines (red)
 * - Withdrawn: 0 lifelines (gray)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ParticipantCompliance,
  StudyComplianceStats,
  StudyComplianceConfig,
  ComplianceStatus,
  CohortProgress,
} from "@/lib/types";
import {
  DEFAULT_COMPLIANCE_CONFIG,
  computeComplianceStatus,
} from "@/lib/types/compliance";

// ============================================
// STORE TYPES
// ============================================

interface ComplianceStoreState {
  // Participant compliance (keyed by participantId)
  participants: Record<string, ParticipantCompliance>;
  // Study compliance configs (keyed by studyId)
  studyConfigs: Record<string, StudyComplianceConfig>;
  // Simulation state (current day override for demo)
  simulationDay: Record<string, number>;

  // Actions
  initializeStudy: (
    studyId: string,
    participants: Array<{ id: string; name: string; cohortId: string; cohortNumber: number }>,
    config?: Partial<StudyComplianceConfig>
  ) => void;
  updateConfig: (studyId: string, config: Partial<StudyComplianceConfig>) => void;
  getStudyStats: (studyId: string) => StudyComplianceStats | null;
  getParticipantsNeedingAttention: (studyId: string) => ParticipantCompliance[];

  // Simulation controls (demo only)
  advanceDay: (studyId: string) => void;
  simulateMiss: (participantId: string) => void;
  simulateCheckIn: (participantId: string) => void;
  resetStudy: (studyId: string) => void;

  // For demo: generate realistic mock data
  generateMockData: (studyId: string, currentDay: number, participantCount: number) => void;
}

// ============================================
// MOCK DATA HELPERS
// ============================================

const FIRST_NAMES = [
  "Sarah", "Mike", "Emily", "James", "Lisa", "David", "Anna", "Chris",
  "Rachel", "Kevin", "Jennifer", "Brian", "Michelle", "Steven", "Laura",
  "Daniel", "Amanda", "Mark", "Nicole", "Jason", "Stephanie", "Andrew",
  "Jessica", "Ryan", "Ashley", "Matt", "Heather", "Josh", "Megan", "Tyler",
];

const LAST_INITIALS = ["M", "T", "R", "K", "W", "H", "P", "L", "S", "C", "N", "B", "G", "D"];

/**
 * Generate realistic compliance data with patterns:
 * - Most participants stay on track (70%)
 * - Some drop on weekends (15%)
 * - A few are consistently at-risk (10%)
 * - Very few are critical (5%)
 */
function generateRealisticParticipants(
  studyId: string,
  currentDay: number,
  participantCount: number,
  config: StudyComplianceConfig
): ParticipantCompliance[] {
  const participants: ParticipantCompliance[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - currentDay + 1);

  for (let i = 0; i < participantCount; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastInitial = LAST_INITIALS[i % LAST_INITIALS.length];
    const cohortNumber = Math.floor(i / 10) + 1; // ~10 per cohort
    const cohortId = `${studyId}-cohort-${cohortNumber}`;

    // Determine participant "archetype" for realistic patterns
    const random = Math.random();
    let missedDays: number;
    let pattern: "perfect" | "occasional" | "weekend" | "struggling" | "critical";

    if (random < 0.4) {
      // 40%: Perfect compliance
      pattern = "perfect";
      missedDays = 0;
    } else if (random < 0.7) {
      // 30%: Occasional miss (1-2 days)
      pattern = "occasional";
      missedDays = Math.min(currentDay - 1, Math.floor(Math.random() * 2) + 1);
    } else if (random < 0.85) {
      // 15%: Weekend dropper (2-3 misses)
      pattern = "weekend";
      missedDays = Math.min(currentDay - 1, Math.floor(Math.random() * 2) + 2);
    } else if (random < 0.95) {
      // 10%: Struggling (3-5 misses)
      pattern = "struggling";
      missedDays = Math.min(currentDay - 1, Math.floor(Math.random() * 3) + 3);
    } else {
      // 5%: Critical (5-6 misses)
      pattern = "critical";
      missedDays = Math.min(currentDay - 1, Math.floor(Math.random() * 2) + 5);
    }

    // Calculate participant's study day based on cohort FIRST
    // Earlier cohorts (lower number) are further along in the study
    // Each cohort starts ~7 days apart in a rolling recruitment model
    const cohortDayOffset = (cohortNumber - 1) * 7;
    const participantStudyDay = Math.max(1, currentDay - cohortDayOffset);

    // Adjust missed days based on participant's actual study day
    const adjustedMissedDays = Math.min(missedDays, participantStudyDay - 1);

    const lifelinesRemaining = Math.max(0, config.totalLifelines - adjustedMissedDays);
    const status = computeComplianceStatus(lifelinesRemaining, config);

    // Calculate days since last check-in based on pattern
    let daysSinceLastCheckIn: number;
    if (status === "withdrawn") {
      daysSinceLastCheckIn = Math.floor(Math.random() * 5) + 7; // Long time ago
    } else if (status === "critical") {
      daysSinceLastCheckIn = Math.floor(Math.random() * 3) + 4; // 4-6 days
    } else if (status === "at_risk") {
      daysSinceLastCheckIn = Math.floor(Math.random() * 2) + 2; // 2-3 days
    } else {
      daysSinceLastCheckIn = Math.floor(Math.random() * 2); // 0-1 days
    }

    const lastCheckInDate = new Date();
    lastCheckInDate.setDate(lastCheckInDate.getDate() - daysSinceLastCheckIn);

    participants.push({
      participantId: `${studyId}-p${i}`,
      studyId,
      cohortId,
      cohortNumber,
      displayName: `${firstName} ${lastInitial}.`,
      initials: `${firstName[0]}${lastInitial}`,
      studyDay: participantStudyDay,
      totalCheckIns: participantStudyDay - adjustedMissedDays,
      expectedCheckIns: participantStudyDay,
      totalLifelines: config.totalLifelines,
      missedDays: adjustedMissedDays,
      lifelinesRemaining,
      lastCheckInAt: daysSinceLastCheckIn === 0 ? new Date().toISOString() : lastCheckInDate.toISOString(),
      daysSinceLastCheckIn,
      status,
      wearableConnected: Math.random() > 0.1, // 90% have wearable
      lastWearableSyncAt: Math.random() > 0.2 ? new Date().toISOString() : undefined,
    });
  }

  return participants;
}

/**
 * Generate realistic compliance trend data
 * - Starts high (~98%), gradually declines
 * - Weekend dips
 * - Stabilizes around 85-90%
 */
function generateComplianceTrend(currentDay: number): Array<{ day: number; percent: number; date: string }> {
  const trend: Array<{ day: number; percent: number; date: string }> = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - currentDay + 1);

  for (let day = 1; day <= currentDay; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day - 1);

    // Base decline: starts at 98%, drops to ~88% by day 14, then stabilizes
    let basePercent = 98 - (day * 0.7);
    if (day > 14) {
      basePercent = 88 - ((day - 14) * 0.2); // Slower decline after week 2
    }

    // Weekend dip (Saturday=6, Sunday=0)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      basePercent -= 3; // 3% drop on weekends
    }

    // Add some noise
    const noise = (Math.random() - 0.5) * 4; // ±2%

    const percent = Math.max(75, Math.min(100, basePercent + noise));

    trend.push({
      day,
      percent: Math.round(percent * 10) / 10,
      date: date.toISOString().split("T")[0],
    });
  }

  return trend;
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useComplianceStore = create<ComplianceStoreState>()(
  persist(
    (set, get) => ({
      participants: {},
      studyConfigs: {},
      simulationDay: {},

      initializeStudy: (studyId, participantsList, config) => {
        const fullConfig: StudyComplianceConfig = {
          ...DEFAULT_COMPLIANCE_CONFIG,
          ...config,
        };

        const participants: Record<string, ParticipantCompliance> = {};
        participantsList.forEach((p, index) => {
          participants[p.id] = {
            participantId: p.id,
            studyId,
            cohortId: p.cohortId,
            cohortNumber: p.cohortNumber,
            displayName: p.name,
            initials: p.name.split(" ").map((n) => n[0]).join("").toUpperCase(),
            studyDay: 1,
            totalCheckIns: 0,
            expectedCheckIns: 0,
            totalLifelines: fullConfig.totalLifelines,
            missedDays: 0,
            lifelinesRemaining: fullConfig.totalLifelines,
            lastCheckInAt: undefined,
            daysSinceLastCheckIn: 0,
            status: "on_track",
            wearableConnected: true,
          };
        });

        set((state) => ({
          participants: { ...state.participants, ...participants },
          studyConfigs: { ...state.studyConfigs, [studyId]: fullConfig },
          simulationDay: { ...state.simulationDay, [studyId]: 1 },
        }));
      },

      updateConfig: (studyId, config) => {
        set((state) => {
          const current = state.studyConfigs[studyId] || DEFAULT_COMPLIANCE_CONFIG;
          return {
            studyConfigs: {
              ...state.studyConfigs,
              [studyId]: { ...current, ...config },
            },
          };
        });
      },

      getStudyStats: (studyId) => {
        const state = get();
        const studyParticipants = Object.values(state.participants).filter(
          (p) => p.studyId === studyId
        );

        if (studyParticipants.length === 0) return null;

        const currentDay = state.simulationDay[studyId] || 1;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - currentDay + 1);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 28);

        const onTrackCount = studyParticipants.filter((p) => p.status === "on_track").length;
        const atRiskCount = studyParticipants.filter((p) => p.status === "at_risk").length;
        const criticalCount = studyParticipants.filter((p) => p.status === "critical").length;
        const withdrawnCount = studyParticipants.filter((p) => p.status === "withdrawn").length;
        const totalActive = onTrackCount + atRiskCount + criticalCount;

        // Calculate overall compliance percentage
        const totalExpected = studyParticipants.reduce((sum, p) => sum + p.expectedCheckIns, 0);
        const totalCompleted = studyParticipants.reduce((sum, p) => sum + p.totalCheckIns, 0);
        const compliancePercent = totalExpected > 0
          ? Math.round((totalCompleted / totalExpected) * 100)
          : 100;

        // Calculate cohort progress
        const cohortMap = new Map<number, ParticipantCompliance[]>();
        studyParticipants.forEach((p) => {
          const existing = cohortMap.get(p.cohortNumber) || [];
          existing.push(p);
          cohortMap.set(p.cohortNumber, existing);
        });

        const cohortProgress: CohortProgress[] = Array.from(cohortMap.entries())
          .map(([cohortNumber, participants]) => {
            const days = participants.map((p) => p.studyDay);
            const dayRangeStart = Math.min(...days);
            const dayRangeEnd = Math.max(...days);

            // Calculate expected completion date based on cohort's start
            // Cohort starts (28 - dayRangeEnd) days from now in terms of their journey
            const daysUntilCompletion = 28 - dayRangeEnd;
            const completionDate = new Date();
            completionDate.setDate(completionDate.getDate() + daysUntilCompletion);

            return {
              cohortNumber,
              cohortId: `${studyId}-cohort-${cohortNumber}`,
              participantCount: participants.length,
              dayRangeStart,
              dayRangeEnd,
              expectedCompletionDate: completionDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              progressPercent: Math.round((dayRangeEnd / 28) * 100),
            };
          })
          .sort((a, b) => a.cohortNumber - b.cohortNumber);

        return {
          studyId,
          currentDay,
          totalDays: 28,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          onTrackCount,
          atRiskCount,
          criticalCount,
          withdrawnCount,
          totalActive,
          compliancePercent,
          targetCompliancePercent: 85,
          cohortProgress,
          dailyCompliance: generateComplianceTrend(currentDay),
        };
      },

      getParticipantsNeedingAttention: (studyId) => {
        const state = get();
        return Object.values(state.participants)
          .filter(
            (p) => p.studyId === studyId && (p.status === "at_risk" || p.status === "critical")
          )
          .sort((a, b) => {
            // Sort by severity (critical first), then by days since check-in
            if (a.status === "critical" && b.status !== "critical") return -1;
            if (b.status === "critical" && a.status !== "critical") return 1;
            return b.daysSinceLastCheckIn - a.daysSinceLastCheckIn;
          });
      },

      advanceDay: (studyId) => {
        set((state) => {
          const currentDay = state.simulationDay[studyId] || 1;
          const newDay = Math.min(28, currentDay + 1);
          const config = state.studyConfigs[studyId] || DEFAULT_COMPLIANCE_CONFIG;

          // Update all participants for this study
          const updatedParticipants = { ...state.participants };
          Object.values(updatedParticipants)
            .filter((p) => p.studyId === studyId)
            .forEach((p) => {
              // Simulate some participants missing the day (realistic pattern)
              const willMiss = Math.random() < 0.12; // ~12% miss each day
              const newMissedDays = willMiss ? p.missedDays + 1 : p.missedDays;
              const newLifelines = Math.max(0, config.totalLifelines - newMissedDays);
              const newDaysSince = willMiss ? p.daysSinceLastCheckIn + 1 : 0;

              updatedParticipants[p.participantId] = {
                ...p,
                studyDay: newDay,
                expectedCheckIns: newDay,
                totalCheckIns: newDay - newMissedDays,
                missedDays: newMissedDays,
                lifelinesRemaining: newLifelines,
                daysSinceLastCheckIn: newDaysSince,
                lastCheckInAt: willMiss ? p.lastCheckInAt : new Date().toISOString(),
                status: computeComplianceStatus(newLifelines, config),
              };
            });

          return {
            simulationDay: { ...state.simulationDay, [studyId]: newDay },
            participants: updatedParticipants,
          };
        });
      },

      simulateMiss: (participantId) => {
        set((state) => {
          const p = state.participants[participantId];
          if (!p || p.status === "withdrawn") return state;

          const config = state.studyConfigs[p.studyId] || DEFAULT_COMPLIANCE_CONFIG;
          const newMissedDays = p.missedDays + 1;
          const newLifelines = Math.max(0, config.totalLifelines - newMissedDays);

          return {
            participants: {
              ...state.participants,
              [participantId]: {
                ...p,
                missedDays: newMissedDays,
                lifelinesRemaining: newLifelines,
                daysSinceLastCheckIn: p.daysSinceLastCheckIn + 1,
                status: computeComplianceStatus(newLifelines, config),
              },
            },
          };
        });
      },

      simulateCheckIn: (participantId) => {
        set((state) => {
          const p = state.participants[participantId];
          if (!p || p.status === "withdrawn") return state;

          return {
            participants: {
              ...state.participants,
              [participantId]: {
                ...p,
                totalCheckIns: p.totalCheckIns + 1,
                daysSinceLastCheckIn: 0,
                lastCheckInAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      resetStudy: (studyId) => {
        set((state) => {
          const config = state.studyConfigs[studyId] || DEFAULT_COMPLIANCE_CONFIG;
          const updatedParticipants = { ...state.participants };

          Object.values(updatedParticipants)
            .filter((p) => p.studyId === studyId)
            .forEach((p) => {
              updatedParticipants[p.participantId] = {
                ...p,
                studyDay: 1,
                totalCheckIns: 0,
                expectedCheckIns: 0,
                missedDays: 0,
                lifelinesRemaining: config.totalLifelines,
                daysSinceLastCheckIn: 0,
                lastCheckInAt: undefined,
                status: "on_track",
              };
            });

          return {
            simulationDay: { ...state.simulationDay, [studyId]: 1 },
            participants: updatedParticipants,
          };
        });
      },

      generateMockData: (studyId, currentDay, participantCount) => {
        const config = get().studyConfigs[studyId] || DEFAULT_COMPLIANCE_CONFIG;
        const mockParticipants = generateRealisticParticipants(
          studyId,
          currentDay,
          participantCount,
          config
        );

        const participantsRecord: Record<string, ParticipantCompliance> = {};
        mockParticipants.forEach((p) => {
          participantsRecord[p.participantId] = p;
        });

        set((state) => ({
          participants: { ...state.participants, ...participantsRecord },
          studyConfigs: { ...state.studyConfigs, [studyId]: config },
          simulationDay: { ...state.simulationDay, [studyId]: currentDay },
        }));
      },
    }),
    {
      name: "compliance-storage",
    }
  )
);
