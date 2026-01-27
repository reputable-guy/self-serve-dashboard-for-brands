"use client";

/**
 * Enrollment Store
 *
 * Zustand store for tracking participant enrollments in brand-recruited studies.
 * Tracks the enrollment funnel from initial click through completion.
 *
 * NOTE: Simulation logic has been extracted to src/lib/simulation/
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BaselineData, ParticipantArchetype } from './types';
import {
  generateBaselineData,
  selectArchetype,
  FIRST_NAMES,
  LAST_NAMES,
} from './simulation';

// Enrollment status follows the participant journey
export type EnrollmentStage =
  | 'clicked'      // Clicked enrollment link
  | 'signed_up'    // Created account / signed up
  | 'waiting'      // In waiting period (baseline collection)
  | 'started'      // Received product, starting intervention
  | 'active'       // Currently in study
  | 'completed'    // Finished study
  | 'dropped';     // Dropped out before completion

// Nurture email types sent automatically by the system
export type NurtureType =
  | 'welcome'           // Day 0: Welcome email with instructions
  | 'day3_reminder'     // Day 3: Reminder to complete check-ins
  | 'day7_checkin'      // Day 7: Week 1 check-in encouragement
  | 'day14_milestone'   // Day 14: Halfway milestone
  | 'day21_final_push'  // Day 21: Final week motivation
  | 'at_risk_outreach'; // Triggered when participant goes inactive

export interface NurtureEvent {
  type: NurtureType;
  sentAt: string;
  opened?: boolean;
  clicked?: boolean;
}

// Health status derived from compliance data
export type HealthStatus = 'on_track' | 'needs_attention' | 'at_risk';

export interface Enrollment {
  id: string;
  studyId: string;
  enrollmentSlug: string;
  // Participant info (collected at sign-up)
  email?: string;
  name?: string;
  // Journey tracking
  stage: EnrollmentStage;
  // Timestamps
  clickedAt: string;
  signedUpAt?: string;
  waitingStartedAt?: string;
  studyStartedAt?: string;
  completedAt?: string;
  droppedAt?: string;
  // Order/purchase info (for brand-recruited model)
  orderConfirmation?: string;
  purchaseDate?: string;
  // Compliance tracking
  checkInsCompleted?: number;
  lastCheckInAt?: string;
  complianceScore?: number;
  // Automated nurture tracking
  nurtures?: NurtureEvent[];
  // Baseline data collected in first week (for early insights)
  baselineData?: BaselineData;
}

interface EnrollmentStore {
  enrollments: Enrollment[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Core enrollment actions
  trackClick: (studyId: string, enrollmentSlug: string) => Enrollment;
  signUp: (enrollmentId: string, data: { email: string; name: string; orderConfirmation?: string }) => void;
  updateStage: (enrollmentId: string, stage: EnrollmentStage) => void;

  // Query methods
  getEnrollmentById: (id: string) => Enrollment | undefined;
  getEnrollmentsByStudy: (studyId: string) => Enrollment[];
  getEnrollmentsBySlug: (slug: string) => Enrollment[];
  getEnrollmentStats: (studyId: string) => {
    clicked: number;
    signedUp: number;
    waiting: number;
    active: number;
    completed: number;
    dropped: number;
  };

  // For testing/simulation
  resetEnrollments: () => void;
  addSimulatedEnrollment: (studyId: string, enrollmentSlug: string, stage: EnrollmentStage, category?: string) => void;
  simulateBatch: (studyId: string, enrollmentSlug: string, count: number, category?: string) => void;

  // Baseline data methods (for Early Insights)
  getEnrollmentsWithBaseline: (studyId: string) => Enrollment[];
  updateBaselineData: (enrollmentId: string, data: BaselineData) => void;
  simulateBaselineBatch: (studyId: string, enrollmentSlug: string, count: number, category?: string) => void;

  // Archetype-based simulation (for voyeuristic insights)
  addSimulatedEnrollmentWithArchetype: (
    studyId: string,
    enrollmentSlug: string,
    archetype: ParticipantArchetype,
    category?: string
  ) => void;
}

function generateEnrollmentId(): string {
  return `enroll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Generate a random participant name
 */
function generateParticipantName(): { firstName: string; lastName: string; fullName: string; email: string } {
  const firstName = pickRandom(FIRST_NAMES);
  const lastName = pickRandom(LAST_NAMES);
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
  };
}

/**
 * Generate nurture events based on days in study
 */
function generateNurtureEvents(studyStartDate: Date, daysInStudy: number, complianceScore: number): NurtureEvent[] {
  const nurtures: NurtureEvent[] = [];

  nurtures.push({
    type: 'welcome',
    sentAt: studyStartDate.toISOString(),
    opened: Math.random() > 0.1,
    clicked: Math.random() > 0.3,
  });

  if (daysInStudy >= 3) {
    nurtures.push({
      type: 'day3_reminder',
      sentAt: new Date(studyStartDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      opened: Math.random() > 0.2,
      clicked: Math.random() > 0.5,
    });
  }

  if (daysInStudy >= 7) {
    nurtures.push({
      type: 'day7_checkin',
      sentAt: new Date(studyStartDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      opened: Math.random() > 0.3,
      clicked: Math.random() > 0.6,
    });
  }

  if (daysInStudy >= 14) {
    nurtures.push({
      type: 'day14_milestone',
      sentAt: new Date(studyStartDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      opened: Math.random() > 0.3,
      clicked: Math.random() > 0.6,
    });
  }

  // Add at-risk outreach if compliance is low
  if (complianceScore < 50 && Math.random() > 0.5) {
    nurtures.push({
      type: 'at_risk_outreach',
      sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      opened: Math.random() > 0.4,
      clicked: Math.random() > 0.7,
    });
  }

  return nurtures;
}

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set, get) => ({
      enrollments: [],
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      trackClick: (studyId: string, enrollmentSlug: string) => {
        const enrollment: Enrollment = {
          id: generateEnrollmentId(),
          studyId,
          enrollmentSlug,
          stage: 'clicked',
          clickedAt: new Date().toISOString(),
        };

        set((state) => ({
          enrollments: [...state.enrollments, enrollment],
        }));

        return enrollment;
      },

      signUp: (enrollmentId: string, data: { email: string; name: string; orderConfirmation?: string }) => {
        set((state) => ({
          enrollments: state.enrollments.map((e) =>
            e.id === enrollmentId
              ? {
                  ...e,
                  email: data.email,
                  name: data.name,
                  orderConfirmation: data.orderConfirmation,
                  stage: 'signed_up' as const,
                  signedUpAt: new Date().toISOString(),
                }
              : e
          ),
        }));
      },

      updateStage: (enrollmentId: string, stage: EnrollmentStage) => {
        const now = new Date().toISOString();
        set((state) => ({
          enrollments: state.enrollments.map((e) => {
            if (e.id !== enrollmentId) return e;

            const updates: Partial<Enrollment> = { stage };

            switch (stage) {
              case 'waiting':
                updates.waitingStartedAt = now;
                break;
              case 'started':
              case 'active':
                updates.studyStartedAt = now;
                break;
              case 'completed':
                updates.completedAt = now;
                break;
              case 'dropped':
                updates.droppedAt = now;
                break;
            }

            return { ...e, ...updates };
          }),
        }));
      },

      getEnrollmentById: (id: string) => {
        return get().enrollments.find((e) => e.id === id);
      },

      getEnrollmentsByStudy: (studyId: string) => {
        return get().enrollments.filter((e) => e.studyId === studyId);
      },

      getEnrollmentsBySlug: (slug: string) => {
        return get().enrollments.filter((e) => e.enrollmentSlug === slug);
      },

      getEnrollmentStats: (studyId: string) => {
        const enrollments = get().enrollments.filter((e) => e.studyId === studyId);
        return {
          clicked: enrollments.filter((e) => e.stage === 'clicked').length,
          signedUp: enrollments.filter((e) => e.stage === 'signed_up').length,
          waiting: enrollments.filter((e) => e.stage === 'waiting').length,
          active: enrollments.filter((e) => e.stage === 'active' || e.stage === 'started').length,
          completed: enrollments.filter((e) => e.stage === 'completed').length,
          dropped: enrollments.filter((e) => e.stage === 'dropped').length,
        };
      },

      resetEnrollments: () => {
        set({ enrollments: [] });
      },

      addSimulatedEnrollment: (studyId: string, enrollmentSlug: string, stage: EnrollmentStage, category?: string) => {
        const { firstName, fullName, email } = generateParticipantName();

        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 25) + 1;
        const clickedAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
        const clickedDate = new Date(clickedAt);

        let checkInsCompleted = 0;
        let lastCheckInAt: string | undefined;
        let complianceScore = 0;
        let nurtures: NurtureEvent[] = [];

        if (stage === 'active' || stage === 'started') {
          const studyStartDate = new Date(clickedDate.getTime() + 3 * 24 * 60 * 60 * 1000);
          const daysInStudy = Math.floor((now.getTime() - studyStartDate.getTime()) / (1000 * 60 * 60 * 24));

          const complianceLevel = Math.random();
          if (complianceLevel > 0.7) {
            checkInsCompleted = Math.min(daysInStudy, Math.floor(daysInStudy * (0.9 + Math.random() * 0.1)));
            lastCheckInAt = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000).toISOString();
            complianceScore = 85 + Math.floor(Math.random() * 15);
          } else if (complianceLevel > 0.3) {
            checkInsCompleted = Math.floor(daysInStudy * (0.6 + Math.random() * 0.25));
            lastCheckInAt = new Date(now.getTime() - (1 + Math.random() * 3) * 24 * 60 * 60 * 1000).toISOString();
            complianceScore = 60 + Math.floor(Math.random() * 25);
          } else {
            checkInsCompleted = Math.floor(daysInStudy * (0.2 + Math.random() * 0.3));
            lastCheckInAt = new Date(now.getTime() - (4 + Math.random() * 5) * 24 * 60 * 60 * 1000).toISOString();
            complianceScore = 20 + Math.floor(Math.random() * 30);
          }

          nurtures = generateNurtureEvents(studyStartDate, daysInStudy, complianceScore);
        } else if (stage === 'completed') {
          checkInsCompleted = 28;
          complianceScore = 85 + Math.floor(Math.random() * 15);
          lastCheckInAt = new Date(clickedDate.getTime() + 31 * 24 * 60 * 60 * 1000).toISOString();
          const studyStartDate = new Date(clickedDate.getTime() + 3 * 24 * 60 * 60 * 1000);
          nurtures = [
            { type: 'welcome', sentAt: studyStartDate.toISOString(), opened: true, clicked: true },
            { type: 'day3_reminder', sentAt: new Date(studyStartDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), opened: true },
            { type: 'day7_checkin', sentAt: new Date(studyStartDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), opened: true },
            { type: 'day14_milestone', sentAt: new Date(studyStartDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), opened: true },
            { type: 'day21_final_push', sentAt: new Date(studyStartDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(), opened: true },
          ];
        } else if (stage === 'signed_up' || stage === 'waiting') {
          nurtures = [{
            type: 'welcome',
            sentAt: new Date(clickedDate.getTime() + 5 * 60 * 1000).toISOString(),
            opened: Math.random() > 0.2,
          }];
        }

        // Generate baseline data using the SINGLE SOURCE OF TRUTH
        let baselineData: BaselineData | undefined;
        if (['active', 'started', 'completed'].includes(stage)) {
          baselineData = generateBaselineData({ category, firstName });
        }

        const enrollment: Enrollment = {
          id: generateEnrollmentId(),
          studyId,
          enrollmentSlug,
          email,
          name: fullName,
          stage,
          clickedAt,
          signedUpAt: stage !== 'clicked' ? new Date(clickedDate.getTime() + 5 * 60 * 1000).toISOString() : undefined,
          waitingStartedAt: ['waiting', 'started', 'active', 'completed'].includes(stage) ? new Date(clickedDate.getTime() + 10 * 60 * 1000).toISOString() : undefined,
          studyStartedAt: ['started', 'active', 'completed'].includes(stage) ? new Date(clickedDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          completedAt: stage === 'completed' ? new Date(clickedDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          orderConfirmation: stage !== 'clicked' ? `ORD-${Math.random().toString(36).substr(2, 8).toUpperCase()}` : undefined,
          checkInsCompleted: checkInsCompleted || undefined,
          lastCheckInAt,
          complianceScore: complianceScore || undefined,
          nurtures: nurtures.length > 0 ? nurtures : undefined,
          baselineData,
        };

        set((state) => ({
          enrollments: [...state.enrollments, enrollment],
        }));
      },

      simulateBatch: (studyId: string, enrollmentSlug: string, count: number, category?: string) => {
        const { addSimulatedEnrollment } = get();

        for (let i = 0; i < count; i++) {
          const rand = Math.random();
          let stage: EnrollmentStage;
          if (rand < 0.3) stage = 'signed_up';
          else if (rand < 0.5) stage = 'waiting';
          else if (rand < 0.8) stage = 'active';
          else stage = 'completed';

          addSimulatedEnrollment(studyId, enrollmentSlug, stage, category);
        }
      },

      getEnrollmentsWithBaseline: (studyId: string) => {
        return get().enrollments.filter(
          (e) => e.studyId === studyId && e.baselineData?.completedAt
        );
      },

      updateBaselineData: (enrollmentId: string, data: BaselineData) => {
        set((state) => ({
          enrollments: state.enrollments.map((e) =>
            e.id === enrollmentId
              ? { ...e, baselineData: { ...e.baselineData, ...data } }
              : e
          ),
        }));
      },

      simulateBaselineBatch: (studyId: string, enrollmentSlug: string, count: number, category?: string) => {
        const { addSimulatedEnrollment } = get();
        for (let i = 0; i < count; i++) {
          addSimulatedEnrollment(studyId, enrollmentSlug, 'active', category);
        }
      },

      addSimulatedEnrollmentWithArchetype: (
        studyId: string,
        enrollmentSlug: string,
        archetype: ParticipantArchetype,
        category?: string
      ) => {
        const { firstName, fullName, email } = generateParticipantName();

        const now = new Date();
        // Recent enrollment (0-3 hours ago for live feed feel)
        const hoursAgo = Math.floor(Math.random() * 4);
        const clickedAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();

        // Generate baseline data using the SINGLE SOURCE OF TRUTH
        // with the specified archetype
        const baselineData = generateBaselineData({
          category,
          archetype,
          firstName,
        });

        const enrollment: Enrollment = {
          id: generateEnrollmentId(),
          studyId,
          enrollmentSlug,
          email,
          name: fullName,
          stage: 'active',
          clickedAt,
          signedUpAt: clickedAt,
          waitingStartedAt: clickedAt,
          studyStartedAt: clickedAt,
          baselineData,
        };

        set((state) => ({
          enrollments: [...state.enrollments, enrollment],
        }));
      },
    }),
    {
      name: 'reputable-enrollments',
      partialize: (state) => ({
        enrollments: state.enrollments,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

/**
 * Hook to check if the store has been hydrated from localStorage.
 */
export const useEnrollmentHydrated = () => useEnrollmentStore((state) => state._hasHydrated);
