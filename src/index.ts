import Facet from "./models/Facet";
import FacetValue from "./models/FacetValue";
import * as FacetCategory from "./models/FacetCategories";
import FoodPairing from "./models/FoodPairing";
import Pagination from "./models/Pagination";
import BaseProduct, { PopulatedProduct, StreamProduct } from "./models/Product";
import ProductImage from "./models/ProductImage";
import ProductStatus from "./models/ProductStatus";
import RawMaterial from "./models/RawMaterial";
import PopulatedStore, { BaseStore } from "./models/Store";

import getProducts, { getProductCount } from "./retrievers/getProducts";
import getProduct from "./retrievers/getProduct";
import getFacets from "./retrievers/getFacets";
import getProductByBarcode from "./retrievers/getProductByBarcode";
import getProductsByStore from "./retrievers/getProductsByStore";
import getProductsByIds from "./retrievers/getProductsById";
import getAllStores, { searchStores } from "./retrievers/getStores";
import searchProducts from "./retrievers/searchProducts";
import getStore from "./retrievers/getStore";

import stream from "./stream";

export default {
  Facet,
  FacetValue,
  FacetCategory,
  FoodPairing,
  Pagination,
  BaseProduct,
  StreamProduct,
  PopulatedProduct,
  ProductImage,
  ProductStatus,
  RawMaterial,
  PopulatedStore,
  BaseStore,

  getProducts,
  getProductCount,
  getProduct,
  getFacets,
  getProductByBarcode,
  getProductsByStore,
  getProductsByIds,
  getAllStores,
  getStore,
  searchStores,
  searchProducts,
  stream,
};
