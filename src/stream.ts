import csvUrls from "./csvUrls";
import csv from "csv-parser";
import fetch from "node-fetch";
import through from "through2";
import Store from "./models/Store";
import { StreamProduct } from "./models/Product";
import { Transform } from "stream";

async function getCsvStream(
  url: string,
  transformer
): Promise<NodeJS.ReadableStream> {
  const { body } = await fetch(url);

  
  return body.pipe(csv({ separator: ";" })).pipe(transformer);
}

const getProducts = () => {
  const transformProduct = new Transform({
    objectMode: true,
    transform(chunk, enc, cb) {
      const product = new StreamProduct(chunk);
      this.push(product);
      cb();
    }
  })
  return getCsvStream(csvUrls.products, transformProduct);
};

const getStores = () => {
  const transformStore = new Transform({
    objectMode: true,
    transform(chunk, enc, cb) {
      const store = new Store(chunk);
      this.push(store);
      cb();
    }
  })

  return getCsvStream(csvUrls.stores, transformStore);
};

export default { getProducts, getStores };
