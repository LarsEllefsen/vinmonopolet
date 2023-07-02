import Category from "./Category";
import FoodPairing from "./FoodPairing";
import ProductImage from "./ProductImage";

import productMap from "../datamaps/productMap";
import streamMap from "../datamaps/productStreamMap";
import camelcase from "../util/camelcase";
import RawMaterial from "./RawMaterial";
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { Volume } from "./Volume";

const defaultCategory = { code: null, name: null, url: null };
const defaultAvailability: IAvailability = {
  deliveryAvailability: { available: true, mainText: "" },
  storeAvailability: { available: true, mainText: "" },
};

const mapFromStreamObject = (prod, product) => {
  Object.keys(product).forEach((key) => {
    const [name, ...filters] = streamMap[key] || [];
    if (!name) {
      return;
    }

    let value = product[key];
    if (filters.length) {
      filters.forEach((filter) => {
        value = filter(value, product);
      });
    }

    prod[name] = value;
  });

  return prod;
};

interface IAvailability {
  deliveryAvailability: { available: boolean; mainText: string };
  storeAvailability: { available: boolean; mainText: string };
}

export class StreamProduct {
  code: string;
  name: string;

  constructor(prod) {
    this.code = prod.Varenummer;
    this.name = prod.Varenavn;
  }

  /**
   * Gets the populated version of the product.
   * @returns Promise<PopulatedProduct>
   */
  populate() {
    return new Promise<PopulatedProduct>((resolve, reject) => {
      // Lazy require here because of circular dependencies
      import("../retrievers/getProduct")
        .then((getProduct) => {
          const populatedProduct = getProduct.default(this.code);
          resolve(populatedProduct);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}

class BaseProduct {
  /**
   * Unique ID for the product.
   */
  @IsNotEmpty()
  @IsString()
  code = "";
  /**
   * The product name
   */
  @IsString()
  @IsNotEmpty()
  name = "";
  /**
   * The product type (Øl, Mjød, Hvitvin etc)
   */
  @IsNotEmpty()
  @IsString()
  productType = "";
  /**
   * The url to the vinmonopol.no product page
   */
  @IsNotEmpty()
  @IsString()
  url = "";
  /**
   * The product price
   */
  @IsNotEmpty()
  @IsNumber()
  price = 0;
  /**
   * The product price per liter
   */
  @IsNotEmpty()
  @IsNumber()
  pricePerLiter = 0;
  /**
   * An array of product images
   */
  @IsDefined()
  @ValidateNested()
  @Type(() => ProductImage)
  images: ProductImage[] = [];
  /**
   * The volume of the product.
   */
  @ValidateNested()
  @Type(() => Volume)
  volume: Volume = new Volume(0, "", "");

  // Classification
  /**
   * The main category of the product (Øl, mjød, hvitvin etc..)
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Category)
  mainCategory: Category = defaultCategory;
  /**
   * The sub category of the product (Porter & Stout, Rom, India Pale Ale etc..).
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => Category)
  mainSubCategory: Category = defaultCategory;
  /**
   * The country of origin.
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Category)
  mainCountry: Category = defaultCategory;
  /**
   * The district the product is from. Might not always have values if no district is given.
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Category)
  district?: Category = defaultCategory;
  /**
   * The sub-district the product is from. Might not always have values if no sub-district is given.
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Category)
  subDistrict?: Category = defaultCategory;
  /**
   * The given product selection the product is available in (Bestillingsutvalget, Basisutvalget etc).
   */
  @IsNotEmpty()
  @IsString()
  productSelection = "";

  // Stock/store-related
  /**
   * information regarding the product availability either in stores or through mail.
   */
  availability: IAvailability = defaultAvailability;
  /**
   * A boolean representing if the product is currently buyable.
   */
  @IsBoolean()
  buyable = true;
  /**
   * The status of the product. Most commonly just "active".
   */
  status = "";

  constructor(product) {
    this.productType =
      (product.main_category && product.main_category.name) || "";
    Object.keys(product).forEach((key) => {
      const [name, valueFilter] = productMap[key] || [];
      const fieldName = name || camelcase(key);
      this[fieldName] = valueFilter ? valueFilter(product[key]) : product[key];
    });
  }
  /**
   * Gets the populated version of the product.
   * @returns Promise<PopulatedProduct>
   */
  populate() {
    return new Promise<PopulatedProduct>((resolve, reject) => {
      // Lazy require here because of circular dependencies
      import("../retrievers/getProduct")
        .then((getProduct) => {
          const populatedProduct = getProduct.default(this.code);
          resolve(populatedProduct);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  static fromStream = (streamProduct) => {
    const prod = new BaseProduct({});
    return mapFromStreamObject(prod, streamProduct);
  };
}

export class PopulatedProduct extends BaseProduct {
  // Detailed product info
  /**
   * The abv (alcohol by volume) of the product.
   */
  @IsNotEmpty()
  @IsNumber()
  abv = 0;
  /**
   * If any, the allergens of the product.
   */
  @IsString()
  @IsOptional()
  allergens = "";
  /**
   * a bool representing if the product is bioDynamic.
   */
  @IsBoolean()
  bioDynamic = false;
  /**
   * A string representation of the products color.
   */
  @IsString()
  color = "";
  /**
   * A bool representing if the product is eco
   */
  @IsBoolean()
  eco = false;
  /**
   * A bool representing if the product has environmental packaging.
   */
  @IsBoolean()
  environmentalPackaging = false;
  /**
   * A bool representing if the product is expired.
   */
  @IsBoolean()
  expired = false;
  /**
   * A bool representing if the product is fairtrade.
   */
  @IsBoolean()
  fairTrade = false;
  /**
   * A bool representing if the product contains gluten.
   */
  @IsBoolean()
  gluten = false;
  /**
   * A set of Foodpairing objects. Describes what food the product pairs well with.
   */
  foodPairing: FoodPairing[] | null = null;
  /**
   *  A bool representing if the product is kosher.
   */
  @IsBoolean()
  kosher = false;
  /**
   *  A string representation of whether the product can be aged further.
   */
  @IsOptional()
  @IsString()
  storable = "";
  /**
   *  A string representation of the container type and material.
   */
  @IsOptional()
  @IsString()
  containerType = "";
  /**
   *  A string representation of the products taste.
   */
  @IsOptional()
  @IsString()
  taste = "";
  /**
   *  A string representation of the products aroma.
   */
  @IsOptional()
  @IsString()
  aroma = "";

  // Ingredients
  /**
   *  An array of RawMaterial objects.
   */
  rawMaterial: RawMaterial[] | null = null;
  /**
   *  A string or number representing the amount of sugar per litre in the product.
   */
  @IsOptional()
  @IsNumber()
  sugar: string | number = 0;
  /**
   * The acidity of the product in percentage.
   */
  @IsOptional()
  @IsNumber()
  acid = 0;
  /**
   * The amounts of tannins in percentage
   */
  @IsOptional()
  @IsNumber()
  tannins = 0;

  // Tasting notes
  /**
   * The bitterness of the product in percentage.
   */
  @IsOptional()
  @IsNumber()
  bitterness = 0;
  /**
   * The freshness of the product in percentage.
   */
  @IsOptional()
  @IsNumber()
  freshness = 0;
  /**
   * The fullness of the product in percentage.
   */
  @IsOptional()
  @IsNumber()
  fullness = 0;
  style = defaultCategory;

  // meta
  /**
   * The minimum age limit in order to buy this product.
   */
  ageLimit = 18;

  // These tend to not be set
  description = "";
  summary = "";
  method = "";

  // Producer/distributer/importer etc
  distributor = "";
  distributorId = 0;
  wholesaler = "";
  vintage: number | null = null;

  constructor(product) {
    super(product);
    Object.keys(product).forEach((key) => {
      const [name, valueFilter] = productMap[key] || [];
      const fieldName = name || camelcase(key);
      this[fieldName] = valueFilter ? valueFilter(product[key]) : product[key];
    });
  }
  /**
   * Gets the populated version of the product.
   * @returns Promise<PopulatedProduct>
   */
  populate(): Promise<PopulatedProduct> {
    return Promise.resolve(this);
  }

  fromStream = (streamProduct) => {
    const prod = new PopulatedProduct({});
    return mapFromStreamObject(prod, streamProduct);
  };
}

export default BaseProduct;
