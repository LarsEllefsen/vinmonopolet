import promiseMap from "promise-map-limit";
import getProduct from "./getProduct";
import { PopulatedProduct } from "../models/product/PopulatedProduct";

const getProductsByIds = (
  ids: string[],
  limit?: number
): Promise<Array<PopulatedProduct>> => {
  return promiseMap(ids, limit || 5, getProduct);
};

export default getProductsByIds;
