import { VINMONOPOLET_PRODUCT_URL } from "../../constants";
import { GET } from "../../util/GET";
import { PopulatedProduct } from "../../models/product/PopulatedProduct";
import { fromDTOToPopulatedProduct } from "../../models/product/mapper";
import { PopulatedProductDTO } from "./types";

async function getProduct(code: string): Promise<PopulatedProduct> {
  const product = await GET<PopulatedProductDTO>(
    VINMONOPOLET_PRODUCT_URL + code,
    new URLSearchParams({ fields: "FULL" })
  );
  if (product !== null) {
    return fromDTOToPopulatedProduct(product);
  }
  throw new Error("Unable to get product with id " + code);
}

export default getProduct;
