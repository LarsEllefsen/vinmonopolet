import BaseStore from "../models/Store/BaseStore";
import Pagination from "../models/Pagination";
import request from "../util/request";

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

interface IGetStoresPagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;
}

export interface IStoreDTO {
  displayName: string;
  id: string;
  name: string;
  formattedDistance: string;
  geoPoint: {
    latitude: number;
    longitude: number;
  };
  address: {
    formattedAddress: string;
    id: string;
    line1: string;
  };
}

interface IGetStoresResult {
  pagination: IGetStoresPagination;
  stores: IStoreDTO[];
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

  const req = request.get<Omit<IGetStoresResult, "pagination">>(
    "/vmpws/v2/vmp/stores/autocomplete",
    {
      baseUrl: "https://www.vinmonopolet.no",
      query,
    }
  );

  return req.then((res) => ({
    stores: res.stores.map(toBaseStore),
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

  const req = request.get<IGetStoresResult>("/vmpws/v2/vmp/stores", {
    baseUrl: "https://www.vinmonopolet.no",
    query,
  });

  return req.then((res) => ({
    stores: (res.stores || []).map(toBaseStore),
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

async function getAllStores(): Promise<BaseStore[]> {
  let allStores: BaseStore[] = [];
  let currentPage = 0;
  let numPages = 2;
  while (currentPage < numPages) {
    const { totalPages, stores } = await getPaginatedStores(currentPage);
    currentPage += 1;
    numPages = totalPages;
    allStores = [...allStores, ...stores];
  }

  return allStores;
}

async function getPaginatedStores(page: number) {
  const query = {
    fields: "BASIC",
    currentPage: page,
    pageSize: 50,
  };

  const res = await request.get<IGetStoresResult>("/vmpws/v2/vmp/stores", {
    baseUrl: "https://www.vinmonopolet.no",
    query,
  });

  const stores = await Promise.all(res.stores.map(toBaseStore));

  return {
    totalPages: res.pagination.totalPages,
    stores,
  };
}

function toBaseStore(store: IStoreDTO): BaseStore {
  const address = getZipAndCityFromFormattedString(
    store.address.formattedAddress
  );

  return new BaseStore(
    store.id,
    store.displayName,
    store.address.line1,
    address?.zip,
    address?.city,
    store.geoPoint.latitude,
    store.geoPoint.longitude
  );
}

function getZipAndCityFromFormattedString(formattedAddressString: string) {
  try {
    const splitAddress = formattedAddressString.split(",");

    const city = splitAddress[splitAddress.length - 1].trim();
    const zip = splitAddress[splitAddress.length - 2].trim();

    return {
      zip,
      city,
    };
  } catch (error) {
    console.warn(
      "Unable to get zip and city from string: " + formattedAddressString
    );
  }
}

export default getAllStores;
