"use client";

/**
 * Studies Store
 *
 * Zustand store for managing studies.
 * Contains ONLY behavior logic - data is imported from seed-studies.ts
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Import Study type from centralized types (single source of truth)
import type { Study, LaunchChecklist } from './types';

// Import seed data from separate data file
import { SEED_STUDIES } from './data/seed-studies';

// Import validation utilities
import { validateStudyData, warnValidationErrors } from './store-validation';

// Import shared store utilities
import { mergeSeedData, createSafeRehydrationHandler } from './store-utils';

// Re-export Study type for backwards compatibility
export type { Study } from './types';

// Re-export seed data for testing/debugging
export { SEED_STUDIES } from './data/seed-studies';

interface StudiesStore {
  studies: Study[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addStudy: (study: Omit<Study, 'id' | 'createdAt' | 'updatedAt' | 'participants'>) => Study;
  updateStudy: (id: string, updates: Partial<Study>) => void;
  deleteStudy: (id: string) => void;
  getStudyById: (id: string) => Study | undefined;
  getStudy: (id: string) => Study | undefined; // Alias for legacy pages
  getStudiesByBrandId: (brandId: string) => Study[];
  /** Find a study by its enrollment slug (for brand-recruited studies) */
  getStudyByEnrollmentSlug: (slug: string) => Study | undefined;
  /** Publish study to catalogue as "Coming Soon" - visible but not yet recruiting */
  publishToCatalogue: (id: string) => void;
  /** Unpublish study from catalogue - reverts from "Coming Soon" back to draft */
  unpublishFromCatalogue: (id: string) => void;
  /** Start recruiting - opens first recruitment window */
  startRecruiting: (id: string) => void;
  launchStudy: (id: string) => void;
  updateLaunchChecklist: (id: string, updates: Partial<LaunchChecklist>) => void;
  initializeLaunchChecklist: (id: string) => void;
  /** Increment enrolled count for a brand-recruited study */
  incrementEnrolledCount: (id: string) => void;
  resetToSeedData: () => void;
}

function generateId(): string {
  return `study-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useStudiesStore = create<StudiesStore>()(
  persist(
    (set, get) => ({
      studies: SEED_STUDIES,
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      addStudy: (studyData) => {
        // Validate study data
        const validation = validateStudyData(studyData);
        if (!validation.valid) {
          warnValidationErrors('addStudy', validation.errors);
        }

        const now = new Date().toISOString();
        const newStudy: Study = {
          ...studyData,
          id: generateId(),
          isDemo: false, // User-created studies are NOT demos - show real data (or empty state)
          participants: 0,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          studies: [...state.studies, newStudy],
        }));

        return newStudy;
      },

      updateStudy: (id, updates) => {
        // Validate that study exists
        const existingStudy = get().studies.find(s => s.id === id);
        if (!existingStudy) {
          warnValidationErrors('updateStudy', [`Study with id '${id}' not found`]);
          return;
        }

        // Validate update data if it contains key fields
        if (updates.name || updates.brandId || updates.category ||
            updates.targetParticipants !== undefined || updates.rebateAmount !== undefined) {
          const validation = validateStudyData(updates);
          if (!validation.valid) {
            warnValidationErrors('updateStudy', validation.errors);
          }
        }

        set((state) => ({
          studies: state.studies.map((study) =>
            study.id === id
              ? { ...study, ...updates, updatedAt: new Date().toISOString() }
              : study
          ),
        }));
      },

      deleteStudy: (id) => {
        set((state) => ({
          studies: state.studies.filter((study) => study.id !== id),
        }));
      },

      getStudyById: (id) => {
        return get().studies.find((study) => study.id === id);
      },

      // Alias for legacy pages
      getStudy: (id) => {
        return get().studies.find((study) => study.id === id);
      },

      getStudiesByBrandId: (brandId) => {
        return get().studies.filter((study) => study.brandId === brandId);
      },

      getStudyByEnrollmentSlug: (slug) => {
        return get().studies.find(
          (study) => study.enrollmentConfig?.enrollmentSlug === slug
        );
      },

      publishToCatalogue: (id) => {
        set((state) => ({
          studies: state.studies.map((study) =>
            study.id === id && study.status === 'draft'
              ? {
                  ...study,
                  status: 'coming_soon' as const,
                  updatedAt: new Date().toISOString(),
                }
              : study
          ),
        }));
      },

      unpublishFromCatalogue: (id) => {
        set((state) => ({
          studies: state.studies.map((study) =>
            study.id === id && study.status === 'coming_soon'
              ? {
                  ...study,
                  status: 'draft' as const,
                  updatedAt: new Date().toISOString(),
                }
              : study
          ),
        }));
      },

      startRecruiting: (id) => {
        set((state) => ({
          studies: state.studies.map((study) =>
            study.id === id && (study.status === 'coming_soon' || study.status === 'draft')
              ? {
                  ...study,
                  status: 'recruiting' as const,
                  updatedAt: new Date().toISOString(),
                }
              : study
          ),
        }));
      },

      launchStudy: (id) => {
        const now = new Date();
        const endDate = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);
        set((state) => ({
          studies: state.studies.map((study) =>
            study.id === id
              ? {
                  ...study,
                  status: 'active' as const,
                  startDate: now.toISOString(),
                  endDate: endDate.toISOString(),
                  updatedAt: now.toISOString(),
                  launchChecklist: {
                    ...study.launchChecklist,
                    settingsComplete: true,
                    previewReviewed: study.launchChecklist?.previewReviewed ?? true,
                    inventoryConfirmed: study.launchChecklist?.inventoryConfirmed ?? true,
                    goLiveAt: now.toISOString(),
                  },
                }
              : study
          ),
        }));
      },

      updateLaunchChecklist: (id, updates) => {
        set((state) => ({
          studies: state.studies.map((study) =>
            study.id === id
              ? {
                  ...study,
                  launchChecklist: {
                    settingsComplete: true,
                    previewReviewed: false,
                    inventoryConfirmed: false,
                    ...study.launchChecklist,
                    ...updates,
                  },
                  updatedAt: new Date().toISOString(),
                }
              : study
          ),
        }));
      },

      initializeLaunchChecklist: (id) => {
        set((state) => ({
          studies: state.studies.map((study) =>
            study.id === id && !study.launchChecklist
              ? {
                  ...study,
                  launchChecklist: {
                    settingsComplete: true,
                    previewReviewed: false,
                    inventoryConfirmed: false,
                  },
                  updatedAt: new Date().toISOString(),
                }
              : study
          ),
        }));
      },

      incrementEnrolledCount: (id) => {
        set((state) => ({
          studies: state.studies.map((study) => {
            if (study.id !== id || !study.enrollmentConfig) return study;
            return {
              ...study,
              enrollmentConfig: {
                ...study.enrollmentConfig,
                enrolledCount: (study.enrollmentConfig.enrolledCount || 0) + 1,
              },
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      resetToSeedData: () => {
        set({ studies: SEED_STUDIES });
      },
    }),
    {
      name: 'reputable-studies',
      // Don't persist the hydration state
      partialize: (state) => ({
        studies: state.studies,
      }),
      onRehydrateStorage: () => createSafeRehydrationHandler('studies', (state) => {
        // Merge in any new studies from SEED_STUDIES that don't exist in persisted state
        state.studies = mergeSeedData(state.studies, SEED_STUDIES, s => s.id);
        // Sync avgImprovement from SEED_STUDIES for real data studies (ground truth)
        // This ensures seed file updates propagate to persisted data
        state.studies = state.studies.map(study => {
          const seedStudy = SEED_STUDIES.find(s => s.id === study.id);
          if (seedStudy && !seedStudy.isDemo && seedStudy.avgImprovement !== undefined) {
            return { ...study, avgImprovement: seedStudy.avgImprovement };
          }
          return study;
        });
        // Mark hydration as complete
        state.setHasHydrated(true);
      }),
    }
  )
);

// Alias for backward compatibility with legacy pages
export const useStudies = useStudiesStore;

/**
 * Hook to check if the store has been hydrated from localStorage.
 * Use this to prevent hydration mismatches when rendering data that may differ
 * between server (seed data) and client (persisted data).
 */
export const useStudiesHydrated = () => useStudiesStore((state) => state._hasHydrated);
