import { CategoryDTO, ImageDTO } from "../types";

export interface GetProductsSearchResultDTO {
  pagination: GetProductsPagination;
  products: BaseProductDTO[];
}

interface ProductsSearchResult {
  pagination: GetProductsPagination;
  products: BaseProductDTO[];
}

export interface GetProductsPagination {
  currentPage: number;
  pageSize: number;
  sort: string;
  totalPages: number;
  totalResults: number;
}

export interface BaseProductDTO {
  buyable: boolean;
  code: string;
  district?: CategoryDTO;
  expired: boolean;
  images: ImageDTO[];
  main_category?: CategoryDTO;
  main_country?: CategoryDTO;
  main_sub_category?: CategoryDTO;
  name: string;
  price?: Price;
  productAvailability: ProductAvailability;
  product_selection?: string;
  releaseMode: boolean;
  status: string;
  sub_District?: CategoryDTO;
  sustainable: boolean;
  url: string;
  volume?: VolumeDTO | Record<string, never>;
}

interface Price {
  formattedValue: string;
  readableValue: string;
  value: number;
}

interface DeliveryAvailability {
  availableForPurchase: boolean;
  infos: Array<{
    availability: string;
    location?: string;
    readableValue: string;
  }>;
  openStockLocator: boolean;
}

interface StoresAvailability {
  availableForPurchase: boolean;
  infoAvailabilityAllStores: string;
  infos: Array<{
    availability: string;
    readableValue: string;
  }>;
  openStockLocator: boolean;
}

interface ProductAvailability {
  deliveryAvailability: DeliveryAvailability;
  storesAvailability: StoresAvailability;
}

export interface VolumeDTO {
  formattedValue: string;
  readableValue: string;
  value: number;
}
