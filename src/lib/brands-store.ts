import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_BRANDS, Brand } from './roles';
import { validateBrandData, warnValidationErrors } from './store-validation';
import { mergeSeedData, createSafeRehydrationHandler, safeParseDateField, generateStoreId } from './store-utils';

interface BrandsStore {
  brands: Brand[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addBrand: (brand: Omit<Brand, 'id' | 'slug' | 'createdAt' | 'studyCount' | 'activeStudyCount'>) => Brand;
  updateBrand: (id: string, updates: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;
  getBrandById: (id: string) => Brand | undefined;
}

// Generate a slug from brand name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const useBrandsStore = create<BrandsStore>()(
  persist(
    (set, get) => ({
      // Initialize with mock brands
      brands: MOCK_BRANDS,
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      addBrand: (brandData) => {
        // Validate brand data
        const validation = validateBrandData(brandData);
        if (!validation.valid) {
          warnValidationErrors('addBrand', validation.errors);
        }

        const newBrand: Brand = {
          id: generateStoreId('brand'),
          name: brandData.name,
          slug: generateSlug(brandData.name),
          logoUrl: brandData.logoUrl,
          contactEmail: brandData.contactEmail,
          contactName: brandData.contactName,
          createdAt: new Date(),
          studyCount: 0,
          activeStudyCount: 0,
        };

        set((state) => ({
          brands: [...state.brands, newBrand],
        }));

        return newBrand;
      },

      updateBrand: (id, updates) => {
        // Validate that brand exists
        const existingBrand = get().brands.find(b => b.id === id);
        if (!existingBrand) {
          warnValidationErrors('updateBrand', [`Brand with id '${id}' not found`]);
          return;
        }

        // Validate update data if it contains key fields
        if (updates.name || updates.contactEmail || updates.contactName) {
          const validation = validateBrandData(updates);
          if (!validation.valid) {
            warnValidationErrors('updateBrand', validation.errors);
          }
        }

        set((state) => ({
          brands: state.brands.map((brand) =>
            brand.id === id ? { ...brand, ...updates } : brand
          ),
        }));
      },

      deleteBrand: (id) => {
        set((state) => ({
          brands: state.brands.filter((brand) => brand.id !== id),
        }));
      },

      getBrandById: (id) => {
        return get().brands.find((brand) => brand.id === id);
      },
    }),
    {
      name: 'reputable-brands',
      // Custom serialization to handle Date objects (don't persist hydration state)
      partialize: (state) => ({
        brands: state.brands.map((brand) => ({
          ...brand,
          createdAt: brand.createdAt instanceof Date
            ? brand.createdAt.toISOString()
            : brand.createdAt,
        })),
      }),
      onRehydrateStorage: () => createSafeRehydrationHandler('brands', (state) => {
        // Convert date strings back to Date objects (with safe parsing)
        state.brands = state.brands.map((brand) => ({
          ...brand,
          createdAt: safeParseDateField(brand.createdAt),
        }));

        // Merge in any new brands from MOCK_BRANDS that don't exist in persisted state
        state.brands = mergeSeedData(state.brands, MOCK_BRANDS, b => b.id);

        // Mark hydration as complete
        state.setHasHydrated(true);
      }),
    }
  )
);

/**
 * Hook to check if the store has been hydrated from localStorage.
 */
export const useBrandsHydrated = () => useBrandsStore((state) => state._hasHydrated);
