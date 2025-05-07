import { VolumeDTO } from "../getProducts/types";
import { CategoryDTO } from "../types";

export type PopulatedProductDTO = {
  ageLimit: number;
  allergens: string;
  bioDynamic: boolean;
  buyable: boolean;
  code: string;
  color: string;
  content?: {
    characteristics: characteristicsDTO[];
    ingredients: IngredientDTO[];
    isGoodFor: IsGoodForDTO[];
    storagePotential: {
      code: string;
      formattedValue: string;
    };
    traits: TraitDTO[];
  };
  description: string;
  distributor: string;
  distributorId: number;
  eco: boolean;
  environmentalPackaging: boolean;
  expired: boolean;
  fairTrade: boolean;
  gluten: boolean;
  images: {
    altText: string;
    format: string;
    imageType: string;
    url: string;
  }[];
  kosher: boolean;
  litrePrice: {
    formattedValue: string;
    readableValue: string;
    value: number;
  };
  main_category?: {
    code: string;
    name: string;
  };
  main_country?: {
    code: string;
    name: string;
    searchQuery: string;
    url: string;
  };
  main_producer?: {
    code: string;
    name: string;
    searchQuery: string;
    url: string;
  };
  main_sub_category?: {
    code: string;
    name: string;
  };
  district?: CategoryDTO;
  sub_District?: CategoryDTO;
  method: string;
  name: string;
  packageType: string;
  price?: {
    formattedValue: string;
    readableValue: string;
    value: number;
  };
  product_selection: string;
  regularTags: string[];
  releaseMode: boolean;
  similarProducts: boolean;
  smell: string;
  status: string;
  statusNotification: boolean;
  stickers: {
    description: string;
    group: any; // Replace 'any' with the appropriate type if known
    icon: string;
    sustainability: boolean;
    title: string;
  }[];
  summary: string;
  sustainabilityTags: string[];
  sustainable: boolean;
  tags: string[];
  taste: string;
  url: string;
  volume?: VolumeDTO | Record<string, never>;
  wholeSaler: string;
  year?: string;
};

export type TraitDTO = {
  formattedValue: string;
  name: string;
  readableValue: string;
};

export type characteristicsDTO = {
  name: string;
  readableValue: string;
};

export type IsGoodForDTO = {
  code: string;
  name: string;
};

export type IngredientDTO = {
  code: string;
  formattedValue: string;
  readableValue: string;
};
