import request from "../util/request";
import { PopulatedProduct } from "../models/Product";

import mockData from "../mockData/mockPopulatedProduct.json";

function getProduct(code: string): Promise<PopulatedProduct> {
  const query = { fields: "FULL" };
  return request
    .get(`/products/${code}`, { query })
    .then((product) => new PopulatedProduct(product));
}

export default getProduct;
