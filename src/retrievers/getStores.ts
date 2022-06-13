// const objectAssign = require("object-assign");
// const Store = require("../models/Store");
// const Pagination = require("../models/Pagination");
// const request = require("../util/request");
import Store from "../models/Store";
import Pagination from "../models/Pagination";
import request from "../util/request";
import { getStores as streamStores } from "../stream";

const defaults = {
  currentPage: 1,
  pageSize: 10,
  latitude: 59.9126054,
  longitude: 10.7515334,
};

interface getStoresOptions {
  currentPage?: number;
  nearLocation?: { lat: number; lon: number };
  pageSize: number;
}

interface StoreQuery {
  currentPage: number;
  longitude?: number;
  latitude?: number;
  pageSize: number;
  fields: string;
}

/**
 * @deprecated The api will no longer return all stores, but instead a max number of stores capped at 126 from the given coordinates.
 */
export function getStores(opts?: getStoresOptions): Promise<Array<any>> {
  const options = { ...defaults, ...opts };
  const query: StoreQuery = {
    fields: "BASIC",
    currentPage: Math.max(0, options.currentPage - 1),
    pageSize: options.pageSize,
  };

  const { lat, lon } = options.nearLocation || {};
  if (lat && lon) {
    query.latitude = lat;
    query.longitude = lon;
  }

  const req = request.get("/api/stores", {
    baseUrl: "https://www.vinmonopolet.no",
    query,
  });

  return req.then((res) => ({
    stores: (res.data || []).map((i) => new Store(i)),
    pagination: new Pagination(
      getPagination(query.currentPage, res),
      options,
      getStores
    ),
  }));
}

function getPagination(currentPage, res) {
  const pageSize = 10; // Hard coded in the API

  return {
    currentPage,
    pageSize,
    totalPages: Math.ceil(res.total / pageSize),
    totalResults: res.total,
  };
}

async function getAllStores() {
  const stream = await streamStores();
  stream.on("data", (res) => {
    console.log(res);
  });
}

export default getAllStores;
