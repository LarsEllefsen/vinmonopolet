import PopulatedStore, { BaseStore } from "../models/Store";
import Pagination from "../models/Pagination";
import request from "../util/request";
import stream from "../stream";

const defaults = {
  latitude: 59.9126054,
  longitude: 10.7515334,
};

export interface ISearchStoresOptions {
  /**
   * Which page of the pagination you want to get. (Default: 1)
   */
  page?: number;

  /**
   * A freetext query used to search for stores. Note that only query OR nearLocation can be used at once, with query giving precidence.
   */
  query?: string;

  /**
   * Latitude and longitude coordinates used to search for stores near these coordinates. Note that only query OR nearLocation can be used at once, with query giving precidence.
   */
  nearLocation?: { lat: number; lon: number };

  /**
   * The number of stores returned in a single page. Default:
   */
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

export interface ISearchStoreResult {
  /**
   *  A list of stores. Represents one page of the results, use pagination.next to fetch next page of results.
   */
  stores: BaseStore[];
  /**
   * Pagination object used to traverse the results.
   */
  pagination?: Pagination<ISearchStoreResult>;
}

export function searchStores(
  opts?: ISearchStoresOptions
): Promise<ISearchStoreResult> {
  if (opts?.query) {
    return searchByQuery(opts.query);
  }
  const lat = opts?.nearLocation?.lat ?? defaults.latitude;
  const lon = opts?.nearLocation?.lon ?? defaults.longitude;
  return searchByLocation(lat, lon, opts?.page, opts?.pageSize);
}

function searchByQuery(querystring: string): Promise<ISearchStoreResult> {
  const query = {
    query: querystring,
  };

  const req = request.get("/vmpws/v2/vmp/stores/autocomplete", {
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

  const req = request.get("/vmpws/v2/vmp/stores", {
    baseUrl: "https://www.vinmonopolet.no",
    query,
  });

  return req.then((res) => ({
    stores: (res.stores || []).map((i) => new BaseStore(i)) as BaseStore[],
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
