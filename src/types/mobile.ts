export interface Specification {
  specDefinitionId: number;
  specValue: string;
}

export interface StoreAvailability {
  storeId: number;
  price: number;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER";
  productUrl: string;
}

export interface Variant {
  ramGb: number;
  storageGb: number;
  availability: StoreAvailability[];
}

export interface MobileImage {
  imageUrl: string;
  imageType: "FRONT" | "BACK" | "SIDE";
  isPrimary: boolean;
  displayOrder: number;
}

export interface MobilePayload {
  brandId: number;
  mobileName: string;
  slug: string;
  launchDate: string;
  status: "Available" | "Coming Soon" | "Rumored";
  specifications: Specification[];
  variants: Variant[];
  images: MobileImage[];
}

export interface LookupBrand {
  id: number;
  name: string;
}

export interface LookupSpecDefinition {
  id: number;
  categoryName: string;
  name: string;
}

export interface LookupStore {
  id: number;
  name: string;
}

export interface LookupData {
  brands: LookupBrand[];
  specDefinitions: LookupSpecDefinition[];
  stores: LookupStore[];
}
