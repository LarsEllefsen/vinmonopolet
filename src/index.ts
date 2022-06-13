// module.exports = {
//   // Models
//   Category: require("./models/Category"),
//   Facet: require("./models/Facet"),
//   FacetValue: require("./models/FacetValue"),
//   FoodPairing: require("./models/FoodPairing"),
//   Pagination: require("./models/Pagination"),
//   Product: require("./models/Product"),
//   ProductImage: require("./models/ProductImage"),
//   ProductStatus: require("./models/ProductStatus"),
//   RawMaterial: require("./models/RawMaterial"),
//   Store: require("./models/Store"),

//   // Searchers
//   getFacets: require("./retrievers/getFacets"),
//   getProducts: require("./retrievers/getProducts"),
//   getStores: require("./retrievers/getStores"),
//   searchProducts: require("./retrievers/searchProducts"),
//   getProduct: require("./retrievers/getProduct"),
//   getProductsById: require("./retrievers/getProductsById"),
//   getProductsByStore: require("./retrievers/getProductsByStore"),
//   getProductByBarcode: require("./retrievers/getProductByBarcode"),

//   // Stream interface
//   stream: require("./stream"),
// };

// export { default as Category } from "./models/Category";
// export { default as Facet } from "./models/Facet";
// export { default as FacetValue } from "./models/FacetValue";
// export { default as FoodPairing } from "./models/FoodPairing";
// export { default as Pagination } from "./models/Category";

// export { default as getProducts } from "./retrievers/getProducts";

import getProducts from "./retrievers/getProducts";
import getProduct from "./retrievers/getProduct";
import getFacets from "./retrievers/getFacets";
import getProductByBarcode from "./retrievers/getProductByBarcode";
import getProductsByStore from "./retrievers/getProductsByStore";
import getProductsByIds from "./retrievers/getProductsById";
import getStores from "./retrievers/getStores";
import searchProducts from "./retrievers/searchProducts";

import stream from "./stream";

export default {
  getProducts,
  getProduct,
  getFacets,
  getProductByBarcode,
  getProductsByStore,
  getProductsByIds,
  getStores,
  searchProducts,
  stream,
};
