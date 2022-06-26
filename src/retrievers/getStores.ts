import PopulatedStore, { BaseStore } from "../models/Store";
import Pagination from "../models/Pagination";
import request from "../util/request";
import stream from "../stream";

const defaults = {
  latitude: 59.9126054,
  longitude: 10.7515334,
};

interface ISearchStoresOptions {
  currentPage?: number;
  query?: string;
  nearLocation?: { lat: number; lon: number };
  pageSize?: number;
}

interface IStoreQuery {
  [prop: string]: number | string;
  currentPage: number;
  longitude: number;
  latitude: number;
  pageSize: number;
  fields: string;
}

interface ISearchStoreResult {
  stores: BaseStore[];
  pagination?: Pagination;
}

export function searchStores(
  opts?: ISearchStoresOptions
): Promise<ISearchStoreResult> {
  if (opts?.query) {
    return searchByQuery(opts.query);
  }
  const lat = opts?.nearLocation?.lat ?? defaults.latitude;
  const lon = opts?.nearLocation?.lon ?? defaults.longitude;
  return searchByLocation(lat, lon);
}

function searchByQuery(querystring: string): Promise<ISearchStoreResult> {
  const query = {
    query: querystring,
  };

  const req = request.get("/api/stores/autocomplete", {
    baseUrl: "https://www.vinmonopolet.no",
    query,
  });

  return req.then((res) => ({
    stores: (res.stores || []).map((i) => new BaseStore(i)) as BaseStore[],
  }));
}

function searchByLocation(
  lat: number,
  lon: number,
  currentPage = 1,
  pageSize = 10
): Promise<ISearchStoreResult> {
  const query: IStoreQuery = {
    fields: "BASIC",
    currentPage: Math.max(0, currentPage - 1),
    pageSize,
    latitude: lat,
    longitude: lon,
  };

  const req = request.get("/api/stores", {
    baseUrl: "https://www.vinmonopolet.no",
    query,
  });

  return req.then((res) => ({
    stores: (res.stores || []).map(
      (i) => new PopulatedStore(i)
    ) as PopulatedStore[],
    pagination: new Pagination(
      getPagination(query.currentPage, pageSize, res.pagination),
      { nearLocation: { lat, lon } } as ISearchStoresOptions,
      searchStores
    ),
  }));
}

function getPagination(currentPage, pageSize, res) {
  return {
    currentPage,
    pageSize,
    totalPages: res.totalPages,
    totalResults: res.totalResults,
  };
}

async function getAllStores(): Promise<PopulatedStore[]> {
  const readableStream = await stream.getStores();
  const storeStream: Promise<PopulatedStore[]> = new Promise(
    (resolve, reject) => {
      const completeResponse: PopulatedStore[] = [];
      const onData = (chunk: PopulatedStore) => {
        // console.log(chunk);
        completeResponse.push(chunk);
      };
      readableStream
        .on("data", onData)
        .on("end", () => {
          resolve(completeResponse);
        })
        .on("error", (err: Error) => {
          reject(err);
        });
    }
  );

  return storeStream;
}

export default getAllStores;
