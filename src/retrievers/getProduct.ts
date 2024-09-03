import { PopulatedProduct } from "../models/Product";
import { getDocument } from "../util/getDocument";
import { VINMONOPOLET_PRODUCT_URL } from "../constants";
import { getDataPropsFromDocument } from "../util/getDataPropsFromDocument";

async function getProduct(code: string): Promise<PopulatedProduct> {
  const document = await getDocument(VINMONOPOLET_PRODUCT_URL + code);
  const dataProps = getDataPropsFromDocument(document);
  if (dataProps !== null) {
    return new PopulatedProduct(dataProps.product);
  }
  throw new Error("Unable to get product with id " + code);
}

export default getProduct;
