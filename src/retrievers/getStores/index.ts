import BaseStore from "../../models/store/BaseStore";
import Pagination from "../../models/Pagination";
import {
  IGetStoresResult,
  ISearchStoreResult,
  ISearchStoresOptions,
  IStoreDTO,
  IStoreQuery,
} from "./types";
import { GET } from "../../util/GET";
import { VINMONOPOLET_STORE_URL } from "../../constants";

const defaults = {
  latitude: 59.9126054,
  longitude: 10.7515334,
};

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

async function searchByQuery(querystring: string): Promise<ISearchStoreResult> {
  const response = await GET<Omit<IGetStoresResult, "pagination">>(
    `${VINMONOPOLET_STORE_URL}autocomplete`,
    new URLSearchParams({ query: querystring })
  );

  return { stores: response.stores.map(toBaseStore) };
}

async function searchByLocation(
  lat: number,
  lon: number,
  currentPage = 1,
  pageSize = 10
): Promise<ISearchStoreResult> {
  const query: IStoreQuery = {
    fields: "BASIC",
    currentPage: Math.max(0, currentPage - 1).toString(),
    pageSize: pageSize.toString(),
    latitude: lat.toString(),
    longitude: lon.toString(),
  };

  const response = await GET<IGetStoresResult>(
    VINMONOPOLET_STORE_URL,
    new URLSearchParams(query)
  );

  return {
    stores: response.stores.map(toBaseStore),
    pagination: new Pagination(
      getPagination(query.currentPage, pageSize, response.pagination),
      { nearLocation: { lat, lon } } as ISearchStoresOptions,
      searchStores
    ),
  };
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
    currentPage: page.toString(),
    pageSize: "50",
  };

  const res = await GET<IGetStoresResult>(
    VINMONOPOLET_STORE_URL,
    new URLSearchParams(query)
  );

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
