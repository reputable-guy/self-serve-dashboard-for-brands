import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_BRANDS, Brand } from './roles';

interface BrandsStore {
  brands: Brand[];
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

// Generate a unique ID
function generateId(): string {
  return `brand-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useBrandsStore = create<BrandsStore>()(
  persist(
    (set, get) => ({
      // Initialize with mock brands
      brands: MOCK_BRANDS,

      addBrand: (brandData) => {
        const newBrand: Brand = {
          id: generateId(),
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
      // Custom serialization to handle Date objects
      partialize: (state) => ({
        brands: state.brands.map((brand) => ({
          ...brand,
          createdAt: brand.createdAt instanceof Date
            ? brand.createdAt.toISOString()
            : brand.createdAt,
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert date strings back to Date objects
          state.brands = state.brands.map((brand) => ({
            ...brand,
            createdAt: new Date(brand.createdAt),
          }));

          // Merge in any new brands from MOCK_BRANDS that don't exist in persisted state
          const existingIds = new Set(state.brands.map(b => b.id));
          const newBrands = MOCK_BRANDS.filter(b => !existingIds.has(b.id));
          if (newBrands.length > 0) {
            state.brands = [...newBrands, ...state.brands];
          }
        }
      },
    }
  )
);
