export interface DataProps {
  product: Product;
}

interface Product {
  ageLimit: number;
  allergens: string;
  bioDynamic: boolean;
  buyable: boolean;
  code: string;
  color: string;
  content: Content;
  cork: string;
  description: string;
  distributor: string;
  distributorId: number;
  district: District;
  eco: boolean;
  environmentalPackaging: boolean;
  expired: boolean;
  fairTrade: boolean;
  gluten: boolean;
  images: Image[];
  kosher: boolean;
  litrePrice: Price;
  main_category: Category;
  main_country: Country;
  main_producer: Producer;
  main_sub_category: Category;
  name: string;
  packageType: string;
  price: Price;
  product_selection: string;
  releaseMode: boolean;
  similarProducts: boolean;
  smell: string;
  status: string;
  statusNotification: boolean;
  summary: string;
  sustainable: boolean;
  taste: string;
  url: string;
  volume: Volume;
  wholeSaler: string;
}

interface Content {
  characteristics: Characteristic[];
  ingredients: Ingredient[];
  isGoodFor: GoodFor[];
  storagePotential: StoragePotential;
  traits: Trait[];
}

interface Characteristic {
  name: string;
  readableValue: string;
  value: string;
}

interface Ingredient {
  code: string;
  formattedValue: string;
  readableValue: string;
}

interface GoodFor {
  code: string;
  name: string;
}

interface StoragePotential {
  code: string;
  formattedValue: string;
}

interface Trait {
  formattedValue: string;
  name: string;
  readableValue: string;
}

interface District {
  code: string;
  name: string;
  searchQuery: string;
  url: string;
}

interface Image {
  altText: string;
  format: string;
  imageType: string;
  url: string;
}

interface Price {
  formattedValue: string;
  readableValue: string;
  value: number;
}

interface Category {
  code: string;
  name: string;
}

interface Country {
  code: string;
  name: string;
  searchQuery: string;
  url: string;
}

interface Producer {
  code: string;
  name: string;
  searchQuery: string;
  url: string;
}

interface Volume {
  formattedValue: string;
  readableValue: string;
  value: number;
}

interface ProductResponse {
  product: Product;
}
