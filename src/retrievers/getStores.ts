import Store from "../models/Store";
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
  currentPage: number;
  longitude: number;
  latitude: number;
  pageSize: number;
  fields: string;
}

interface IStoreAutocompleteQuery {
  query: string;
}

interface ISearchStoreResult {
  stores: Store[];
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
  const query: IStoreAutocompleteQuery = {
    query: querystring,
  };

  const req = request.get("/api/stores/autocomplete", {
    baseUrl: "https://www.vinmonopolet.no",
    query,
  });

  return req.then((res) => ({
    stores: (res.stores || []).map((i) => new Store(i)) as Store[],
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
    stores: (res.stores || []).map((i) => new Store(i)) as Store[],
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

async function getAllStores(): Promise<Store[]> {
  const readableStream = await stream.getStores();
  const storeStream: Promise<Store[]> = new Promise((resolve, reject) => {
    const completeResponse: Store[] = [];
    const onData = (chunk: Store) => {
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
  });

  return storeStream;
}

export default getAllStores;
