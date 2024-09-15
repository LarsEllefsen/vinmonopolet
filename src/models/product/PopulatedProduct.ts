import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import BaseProduct from "./BaseProduct";
import FoodPairing from "../FoodPairing";
import RawMaterial from "../RawMaterial";
import ProductImage from "../ProductImage";
import { Volume } from "../Volume";
import Category from "../Category";
import { IAvailability } from "../Availability";

export class PopulatedProduct extends BaseProduct {
  // Detailed product info
  /**
   * The abv (alcohol by volume) of the product.
   */
  @IsNotEmpty()
  @IsNumber()
  abv: number;
  /**
   * If any, the allergens of the product.
   */
  @IsString()
  @IsOptional()
  allergens?: string;
  /**
   * a bool representing if the product is bioDynamic.
   */
  @IsBoolean()
  bioDynamic: boolean;
  /**
   * A string representation of the products color.
   */
  @IsString()
  color: string;
  /**
   * A bool representing if the product is eco
   */
  @IsBoolean()
  eco: boolean;
  /**
   * A bool representing if the product has environmental packaging.
   */
  @IsBoolean()
  environmentalPackaging: boolean;
  /**
   * A bool representing if the product is expired.
   */
  @IsBoolean()
  expired: boolean;
  /**
   * A bool representing if the product is fairtrade.
   */
  @IsBoolean()
  fairTrade: boolean;
  /**
   * A bool representing if the product contains gluten.
   */
  @IsBoolean()
  gluten: boolean;
  /**
   * A set of Foodpairing objects. Describes what food the product pairs well with.
   */
  foodPairing: FoodPairing[];
  /**
   *  A bool representing if the product is kosher.
   */
  @IsBoolean()
  kosher: boolean;
  /**
   *  A string representation of whether the product can be aged further.
   */
  @IsOptional()
  @IsString()
  storable?: string;
  /**
   *  A string representation of the container type and material.
   */
  @IsOptional()
  @IsString()
  containerType?: string;
  /**
   *  A string representation of the products taste.
   */
  @IsOptional()
  @IsString()
  taste?: string;
  /**
   *  A string representation of the products aroma.
   */
  @IsOptional()
  @IsString()
  aroma?: string;

  // Ingredients
  /**
   *  An array of RawMaterial objects.
   */
  rawMaterial: RawMaterial[];
  /**
   *  A string or number representing the amount of sugar per litre in the product.
   */
  @IsOptional()
  @IsNumber()
  sugar?: number;
  /**
   * The acidity of the product in percentage.
   */
  @IsOptional()
  @IsNumber()
  acid?: number;
  /**
   * The amounts of tannins in percentage
   */
  @IsOptional()
  @IsNumber()
  tannins?: number;

  // Tasting notes
  /**
   * The bitterness of the product in percentage.
   */
  @IsOptional()
  @IsNumber()
  bitterness?: number;
  /**
   * The freshness of the product in percentage.
   */
  @IsOptional()
  @IsNumber()
  freshness?: number;
  /**
   * The fullness of the product in percentage.
   */
  @IsOptional()
  @IsNumber()
  fullness?: number;

  style?: { code: string; description: string; name: string };

  // meta
  /**
   * The minimum age limit in order to buy this product.
   */
  ageLimit: number;

  // These tend to not be set
  description?: string;
  summary?: string;
  method?: string;

  // Producer/distributer/importer etc
  distributor?: string;
  distributorId?: string;
  wholesaler?: string;
  vintage?: number;

  constructor(
    code: string,
    name: string,
    url: string,
    price: number,
    pricePerLiter: number,
    images: ProductImage[],
    volume: Volume,
    mainCategory: Category,
    subCategory: Category | undefined,
    country: Category,
    district: Category | undefined,
    subDistrict: Category | undefined,
    productSeelection: string,
    buyable: boolean,
    status: string,
    abv: number,
    allergens: string | undefined,
    bioDynamic: boolean,
    color: string,
    eco: boolean,
    environmentalPackaging: boolean,
    expired: boolean,
    fairTrade: boolean,
    gluten: boolean,
    foodPairing: FoodPairing[],
    kosher: boolean,
    storable: string | undefined,
    containerType: string | undefined,
    taste: string | undefined,
    aroma: string | undefined,
    rawMaterial: RawMaterial[],
    sugar: number | undefined,
    acid: number | undefined,
    tannins: number | undefined,
    bitterness: number | undefined,
    freshness: number | undefined,
    fullness: number | undefined,
    ageLimit: number,
    description: string | undefined,
    summary: string | undefined,
    method: string | undefined,
    distributor: string | undefined,
    distributorId: string | undefined,
    wholesaler: string | undefined,
    vintage: number | undefined
  ) {
    super(
      code,
      name,
      url,
      price,
      pricePerLiter,
      images,
      volume,
      mainCategory,
      subCategory,
      country,
      district,
      subDistrict,
      productSeelection,
      undefined,
      buyable,
      status
    );

    this.abv = abv;
    this.allergens = allergens;
    this.bioDynamic = bioDynamic;
    this.color = color;
    this.eco = eco;
    this.environmentalPackaging = environmentalPackaging;
    this.expired = expired;
    this.fairTrade = fairTrade;
    this.gluten = gluten;
    this.foodPairing = foodPairing;
    this.kosher = kosher;
    this.storable = storable;
    this.containerType = containerType;
    this.taste = taste;
    this.aroma = aroma;
    this.rawMaterial = rawMaterial;
    this.sugar = sugar;
    this.acid = acid;
    this.tannins = tannins;
    this.bitterness = bitterness;
    this.freshness = freshness;
    this.fullness = fullness;
    this.ageLimit = ageLimit;
    this.description = description;
    this.summary = summary;
    this.method = method;
    this.distributor = distributor;
    this.distributorId = distributorId;
    this.wholesaler = wholesaler;
    this.vintage = vintage;
  }
}

export default PopulatedProduct;
