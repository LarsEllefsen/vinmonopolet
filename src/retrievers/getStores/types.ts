import Pagination from "../../models/Pagination";
import BaseStore from "../../models/store/BaseStore";

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

export interface IStoreQuery {
  [prop: string]: string;
  currentPage: string;
  longitude: string;
  latitude: string;
  pageSize: string;
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

export interface IGetStoresPagination {
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

export interface IGetStoresResult {
  pagination: IGetStoresPagination;
  stores: IStoreDTO[];
}
