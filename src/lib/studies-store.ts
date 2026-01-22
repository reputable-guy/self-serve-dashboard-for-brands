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
  /** Publish study to catalogue as "Coming Soon" - visible but not yet recruiting */
  publishToCatalogue: (id: string) => void;
  /** Start recruiting - opens first recruitment window */
  startRecruiting: (id: string) => void;
  launchStudy: (id: string) => void;
  updateLaunchChecklist: (id: string, updates: Partial<LaunchChecklist>) => void;
  initializeLaunchChecklist: (id: string) => void;
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
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Merge in any new studies from SEED_STUDIES that don't exist in persisted state
          const existingIds = new Set(state.studies.map(s => s.id));
          const newStudies = SEED_STUDIES.filter(s => !existingIds.has(s.id));
          if (newStudies.length > 0) {
            state.studies = [...newStudies, ...state.studies];
          }
          // Mark hydration as complete
          state.setHasHydrated(true);
        }
      },
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
