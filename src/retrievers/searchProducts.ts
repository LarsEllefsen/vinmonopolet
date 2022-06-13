import getProducts from "./getProducts";

const searchProducts = (query, opts) =>
  getProducts(Object.assign({ query }, opts));

export default searchProducts;
