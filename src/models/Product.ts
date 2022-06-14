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
  rawMaterial: RawMaterial | null = null;
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

// function ProductA(product) {
//   // Core product info
//   this.code = product.code;
//   this.name = product.name;
//   this.productType =
//     (product.main_category && product.main_category.name) || null;
//   this.abv = null;
//   this.url = null;
//   this.price = null;
//   this.pricePerLiter = null;
//   this.images = null;
//   this.barcode = null;
//   this.containerSize = null;
//   this.containerType = null;
//   this.vintage = null;
//   this.cork = null;

//   // These tend to not be set
//   this.description = null;
//   this.summary = null;
//   this.method = null;

//   // Scales
//   this.tannins = null;
//   this.fullness = null;
//   this.sweetness = null;
//   this.freshness = null;
//   this.bitterness = null;

//   // Tasting notes/content
//   this.color = null;
//   this.aroma = null;
//   this.taste = null;
//   this.storable = null;
//   this.foodPairing = null;
//   this.rawMaterial = null;
//   this.sugar = null;
//   this.acid = null;

//   // Boolean flags
//   this.eco = null;
//   this.gluten = null;
//   this.kosher = null;
//   this.fairTrade = null;
//   this.bioDynamic = null;

//   // Producer/distributer/importer etc
//   this.mainProducer = null;
//   this.distributor = null;
//   this.distributorId = null;
//   this.wholesaler = null;

//   // Classification
//   this.categories = null;
//   this.storeCategory = null;
//   this.mainCategory = null;
//   this.mainSubCategory = null;
//   this.mainCountry = null;
//   this.district = null;
//   this.subDistrict = null;
//   this.productSelection = null;

//   // Meta
//   this.buyable = null;
//   this.deliveryTime = null;
//   this.nrOfUsage = null;
//   this.availableForPickup = null;
//   this.averageRating = null;

//   // Stock/store-related
//   this.stock = null;
//   this.status = null;
//   this.ageLimit = null;
//   this.expiredDate = null;
//   this.purchasable = null;
//   this.newProduct = null;

//   Object.keys(product).forEach((key) => {
//     const [name, valueFilter] = productMap[key] || [];
//     const fieldName = name || camelcase(key);
//     this[fieldName] = valueFilter ? valueFilter(product[key]) : product[key];
//   });
// }

// Product.fromStream = function (product) {
//   const prod = new Product({});
//   Object.keys(product).forEach((key) => {
//     const [name, ...filters] = streamMap[key] || [];
//     if (!name) {
//       return;
//     }

//     let value = product[key];
//     if (filters.length) {
//       filters.forEach((filter) => {
//         value = filter(value, product);
//       });
//     }

//     prod[name] = value;
//   });

//   return prod;
// };

// Product.prototype.isComplete = function () {
//   return typeof this.numberOfReviews !== "undefined";
// };

// Product.prototype.populate = function () {
//   if (this.isComplete()) {
//     return Promise.resolve(this);
//   }

//   // Lazy require here because of circular dependencies
//   const getProduct = require("../retrievers/getProduct");
//   return getProduct(this.code);
// };

// module.exports = Product;
