import csvUrls from "./csvUrls";
import got from "got";
import csv from "csv-parser";
import through from "through2";
import Store from "./models/Store";
import { StreamProduct } from "./models/Product";

function getCsvStream(url: string, transformer): NodeJS.ReadableStream {
  const readStream = got.stream(url);
  return readStream
    .pipe(csv({ separator: ";" }))
    .pipe(through.obj(transformer));
}

const transformStore: through.TransformFunction = function (store, enc, cb) {
  this.push(new Store(store));
  cb();
};

const transformProduct: through.TransformFunction = function (prod, enc, cb) {
  this.push(new StreamProduct(prod));
  cb();
};

const getProducts = () => {
  return getCsvStream(csvUrls.products, transformProduct);
};

const getStores = () => {
  return getCsvStream(csvUrls.stores, transformStore);
};

export default { getProducts, getStores };
