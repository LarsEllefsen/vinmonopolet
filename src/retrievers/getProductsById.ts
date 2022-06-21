import promiseMap from "promise-map-limit";
import { PopulatedProduct } from "../models/Product";
import getProduct from "./getProduct";

const getProductsByIds = (
  ids: string[],
  limit?: number
): Promise<Array<PopulatedProduct>> => {
  return promiseMap(ids, limit || 5, getProduct);
};

export default getProductsByIds;
