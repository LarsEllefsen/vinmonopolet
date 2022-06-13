import csv from "csv-parser";
import csvUrls from "./csvUrls";
import Product from "./models/Product";
import Store from "./models/Store";

import fetch from "node-fetch";

import { Transform } from "stream";

const csvOptions = { separator: ";" };

async function getCsvStream(url, transformer): Promise<NodeJS.ReadableStream> {
  const response = await fetch(url);
  const stream = response.body;
  return stream?.pipe(csv(csvOptions)).pipe(transformer);
}

const transformStore = new Transform({
  objectMode: true, // set this one to true
  transform(chunk, encoding, callback) {
    this.push(new Store(chunk));
    callback();
  },
});

const transformProduct = new Transform({
  transform(chunk, encoding, callback) {
    this.push(Product.fromStream(chunk));
    callback();
  },
});

const getProducts = () => {
  return getCsvStream(csvUrls.products, transformProduct);
};

const getStores = () => {
  return getCsvStream(csvUrls.stores, transformStore);
};

export default { getProducts, getStores };
