// import { apiFetch } from "./client";
// import {
//   LookupBrand,
//   LookupSpecDefinition,
//   LookupStore,
//   LookupData,
// } from "@/types/mobile";

// export async function getLookupData(): Promise<LookupData> {
//   const [brands, specDefinitions, stores] = await Promise.all([
//     apiFetch<LookupBrand[]>("/brands"),
//     apiFetch<LookupSpecDefinition[]>("/spec-definitions"),
//     apiFetch<LookupStore[]>("/stores"),
//   ]);

//   return { brands, specDefinitions, stores };
// }

import { apiFetch } from "./client";
import {
  LookupBrand,
  LookupSpecDefinition,
  LookupStore,
  LookupData,
} from "@/types/mobile";

// Raw DTO shapes returned by Spring Boot
interface RawBrand {
  brandId?: number;
  id?: number;
  brandName?: string;
  name?: string;
}

interface RawSpecDefinition {
  specDefinitionId: number;
  category?: {
    categoryId: number;
    categoryName: string;
  };
  specName: string;
}

interface RawStore {
  storeId: number;
  storeName: string;
}

export async function getLookupData(): Promise<LookupData> {
  const [rawBrands, rawSpecs, rawStores] = await Promise.all([
    apiFetch<RawBrand[]>("/brands"),
    apiFetch<RawSpecDefinition[]>("/spec-definitions"),
    apiFetch<RawStore[]>("/stores"),
  ]);

  // Map Spring Boot DTO fields to frontend lookup interfaces
  const brands: LookupBrand[] = rawBrands.map((b) => ({
    id: b.brandId ?? b.id ?? 0,
    name: b.brandName ?? b.name ?? "",
  }));

  const specDefinitions: LookupSpecDefinition[] = rawSpecs.map((s) => ({
    id: s.specDefinitionId,
    categoryName: s.category?.categoryName || "General",
    name: s.specName,
  }));

  const stores: LookupStore[] = rawStores.map((s) => ({
    id: s.storeId,
    name: s.storeName,
  }));

  return { brands, specDefinitions, stores };
}
