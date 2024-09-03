export interface GetProductsSearchResultDTO {
  productSearchResult: ProductsSearchResult;
}

interface ProductsSearchResult {
  pagination: GetProductsPagination;
  products: Product[];
}

export interface GetProductsPagination {
  currentPage: number;
  pageSize: number;
  sort: string;
  totalPages: number;
  totalResults: number;
}

interface Product {
  buyable: boolean;
  code: string;
  district: Record<string, unknown>;
  expired: boolean;
  images: Image[];
  main_category: Category;
  main_country: Category;
  main_sub_category: Category;
  name: string;
  price: Price;
  productAvailability: ProductAvailability;
  product_selection: string;
  releaseMode: boolean;
  status: string;
  sub_District: Record<string, unknown>;
  sustainable: boolean;
  url: string;
  volume: Volume;
}

interface Image {
  format: string;
  imageType: string;
  url: string;
}

interface Category {
  name: string;
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

interface Volume {
  formattedValue: string;
  readableValue: string;
  value: number;
}
