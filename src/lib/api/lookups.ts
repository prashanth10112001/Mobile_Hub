import { apiFetch } from "./client";
import {
  LookupBrand,
  LookupSpecDefinition,
  LookupStore,
  LookupData,
} from "@/types/mobile";

export async function getLookupData(): Promise<LookupData> {
  const [brands, specDefinitions, stores] = await Promise.all([
    apiFetch<LookupBrand[]>("/brands"),
    apiFetch<LookupSpecDefinition[]>("/spec-definitions"),
    apiFetch<LookupStore[]>("/stores"),
  ]);

  return { brands, specDefinitions, stores };
}
