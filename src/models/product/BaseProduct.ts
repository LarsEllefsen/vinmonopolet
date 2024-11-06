import Category from "../Category";
import ProductImage from "../ProductImage";
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
import { Volume } from "../Volume";
import { IAvailability } from "../Availability";
import { PopulatedProduct } from "./PopulatedProduct";

class BaseProduct {
  /**
   * Unique ID for the product.
   */
  @IsNotEmpty()
  @IsString()
  code: string;
  /**
   * The product name
   */
  @IsString()
  @IsNotEmpty()
  name: string;
  /**
   * The url to the vinmonopol.no product page
   */
  @IsNotEmpty()
  @IsString()
  url: string;
  /**
   * The product price
   */
  @IsNotEmpty()
  @IsNumber()
  price: number;
  /**
   * The product price per liter
   */
  @IsNotEmpty()
  @IsNumber()
  pricePerLiter: number;
  /**
   * An array of product images
   */
  @IsDefined()
  @ValidateNested()
  @Type(() => ProductImage)
  images: ProductImage[];
  /**
   * The volume of the product.
   */
  @ValidateNested()
  @Type(() => Volume)
  volume: Volume;

  // Classification
  /**
   * The main category of the product (Øl, mjød, hvitvin etc..)
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Category)
  mainCategory: Category;
  /**
   * The sub category of the product (Porter & Stout, Rom, India Pale Ale etc..).
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => Category)
  mainSubCategory?: Category;
  /**
   * The country of origin.
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Category)
  mainCountry: Category;
  /**
   * The district the product is from. Might not always have values if no district is given.
   */
  @ValidateNested()
  @Type(() => Category)
  district?: Category;
  /**
   * The sub-district the product is from. Might not always have values if no sub-district is given.
   */
  @ValidateNested()
  @Type(() => Category)
  subDistrict?: Category;
  /**
   * The given product selection the product is available in (Bestillingsutvalget, Basisutvalget etc).
   */
  @IsNotEmpty()
  @IsString()
  productSelection: string;

  // Stock/store-related
  /**
   * information regarding the product availability either in stores or through mail.
   */
  productAvailability?: IAvailability;
  /**
   * A boolean representing if the product is currently buyable.
   */
  @IsBoolean()
  buyable;
  /**
   * The status of the product. Most commonly just "active".
   */
  status;

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
    availability: IAvailability | undefined,
    buyable: boolean,
    status: string
  ) {
    this.code = code;
    this.name = name;
    this.url = url;
    this.price = price;
    this.pricePerLiter = pricePerLiter;
    this.images = images;
    this.volume = volume;
    this.mainCategory = mainCategory;
    this.mainSubCategory = subCategory;
    this.mainCountry = country;
    this.district = district;
    this.subDistrict = subDistrict;
    this.productSelection = productSeelection;
    this.productAvailability = availability;
    this.buyable = buyable;
    this.status = status;
  }
  /**
   * Gets the populated version of the product.
   * @returns Promise<PopulatedProduct>
   */
  populate() {
    return new Promise<PopulatedProduct>((resolve, reject) => {
      // Lazy require here because of circular dependencies
      import("../../retrievers/getProduct")
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

export default BaseProduct;
