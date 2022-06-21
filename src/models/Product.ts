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
  //Core product info
  code = "";
  name = "";
  productType = "";
  url = "";
  price = 0;
  pricePerLiter = 0;
  images: ProductImage[] = [];
  volume = { value: 0, unit: "cl", formattedValue: "" };

  // Classification
  mainCategory: Category = defaultCategory;
  mainSubCategory: Category = defaultCategory;
  mainCountry: Category = defaultCategory;
  district: Category = defaultCategory;
  subDistrict: Category = defaultCategory;
  productSelection = "";

  // Stock/store-related
  availability: IAvailability = defaultAvailability;
  buyable = true;
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
  abv = 0;
  allergens = "";
  bioDynamic = false;
  color = "";
  eco = false;
  environmentalPackaging = false;
  expired = false;
  fairTrade = false;
  gluten = false;
  foodPairing: FoodPairing[] | null = null;
  kosher = false;
  storable = "";
  containerType = "";
  taste = "";
  aroma = "";

  // Ingredients
  rawMaterial: RawMaterial[] | null = null;
  sugar: string | number = 0;
  acid = 0;
  tannins = 0;

  // Tasting notes
  bitterness = 0;
  freshness = 0;
  fullness = 0;
  style = defaultCategory;

  // meta
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

  populate(): Promise<PopulatedProduct> {
    return Promise.resolve(this);
  }

  fromStream = (streamProduct) => {
    const prod = new PopulatedProduct({});
    return mapFromStreamObject(prod, streamProduct);
  };
}

export default BaseProduct;
