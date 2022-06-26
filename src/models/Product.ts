import Category from "./Category";
import FoodPairing from "./FoodPairing";
import ProductImage from "./ProductImage";

import productMap from "../datamaps/productMap";
import streamMap from "../datamaps/productStreamMap";
import camelcase from "../util/camelcase";
import RawMaterial from "./RawMaterial";

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
  code = "";
  /**
   * The product name
   */
  name = "";
  /**
   * The product type (Øl, Mjød, Hvitvin etc)
   */
  productType = "";
  /**
   * The url to the vinmonopol.no product page
   */
  url = "";
  /**
   * The product price
   */
  price = 0;
  /**
   * The product price per liter
   */
  pricePerLiter = 0;
  /**
   * An array of product images
   */
  images: ProductImage[] = [];
  /**
   * The volume of the product.
   */
  volume = { value: 0, unit: "cl", formattedValue: "" };

  // Classification
  /**
   * The main category of the product (Øl, mjød, hvitvin etc..)
   */
  mainCategory: Category = defaultCategory;
  /**
   * The sub category of the product (Porter & Stout, Rom, India Pale Ale etc..).
   */
  mainSubCategory: Category = defaultCategory;
  /**
   * The country of origin.
   */
  mainCountry: Category = defaultCategory;
  /**
   * The district the product is from. Might not always have values if no district is given.
   */
  district: Category = defaultCategory;
  /**
   * The sub-district the product is from. Might not always have values if no sub-district is given.
   */
  subDistrict: Category = defaultCategory;
  /**
   * The given product selection the product is available in (Bestillingsutvalget, Basisutvalget etc).
   */
  productSelection = "";

  // Stock/store-related
  /**
   * information regarding the product availability either in stores or through mail.
   */
  availability: IAvailability = defaultAvailability;
  /**
   * A boolean representing if the product is currently buyable.
   */
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
  abv = 0;
  /**
   * If any, the allergens of the product.
   */
  allergens = "";
  /**
   * a bool representing if the product is bioDynamic.
   */
  bioDynamic = false;
  /**
   * A string representation of the products color.
   */
  color = "";
  /**
   * A bool representing if the product is eco
   */
  eco = false;
  /**
   * A bool representing if the product has environmental packaging.
   */
  environmentalPackaging = false;
  /**
   * A bool representing if the product is expired.
   */
  expired = false;
  /**
   * A bool representing if the product is fairtrade.
   */
  fairTrade = false;
  /**
   * A bool representing if the product contains gluten.
   */
  gluten = false;
  /**
   * A set of Foodpairing objects. Describes what food the product pairs well with.
   */
  foodPairing: FoodPairing[] | null = null;
  /**
   *  A bool representing if the product is kosher.
   */
  kosher = false;
  /**
   *  A string representation of whether the product can be aged further.
   */
  storable = "";
  /**
   *  A string representation of the container type and material.
   */
  containerType = "";
  /**
   *  A string representation of the products taste.
   */
  taste = "";
  /**
   *  A string representation of the products aroma.
   */
  aroma = "";

  // Ingredients
  /**
   *  An array of RawMaterial objects.
   */
  rawMaterial: RawMaterial[] | null = null;
  /**
   *  A string or number representing the amount of sugar per litre in the product.
   */
  sugar: string | number = 0;
  /**
   * The acidity of the product in percentage.
   */
  acid = 0;
  /**
   * The amounts of tannins in percentage
   */
  tannins = 0;

  // Tasting notes
  /**
   * The bitterness of the product in percentage.
   */
  bitterness = 0;
  /**
   * The freshness of the product in percentage.
   */
  freshness = 0;
  /**
   * The fullness of the product in percentage.
   */
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
