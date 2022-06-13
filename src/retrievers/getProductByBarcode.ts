import request from "../util/request";
import { PopulatedProduct } from "../models/Product";

function getProductByBarcode(barcode): Promise<PopulatedProduct> {
  const query = { fields: "FULL" };
  return request
    .get(`/products/barCodeSearch/${barcode}`, { query })
    .then((product) => new PopulatedProduct(product));
}

export default getProductByBarcode;
