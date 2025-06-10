import Product from "../../models/product/BaseProduct";
import GetProductsPagination from "../../models/Pagination";
import FacetValue from "../../models/FacetValue";
import { GET } from "../../util/GET";
import { VINMONOPOLET_SEARCH_URL } from "../../constants";
import { GetProductsSearchResultDTO } from "./types";
import Pagination from "../../models/Pagination";
import { fromDTOToBaseProduct } from "../../models/product/mapper";

const sortFields = ["relevance", "name", "price"] as const;
const sortOrders = ["asc", "desc"] as const;
export interface IGetProductsOptions {
  /**
   * Limits the number of products returned in a single, paginated response (Default: 50)
   */
  limit?: number;
  /**
   * Which page of the pagination you want to get. (Default: 1)
   */
  page?: number;
  /**
   * A freetext query used to filter the products.
   */
  query?: string;
  /**
   * Sorting options for the results.  E.g ["price", "asc"] or just "price";
   */
  sort?:
    | typeof sortFields[number]
    | [typeof sortFields[number], typeof sortOrders[number]];
  /**
   * An array of facets. Gets all products with these properties.
   */
  facets?: Array<FacetValue>;
}

export interface IGetProductsResponse {
  /**
   * Pagination object used to traverse the results.
   */
  pagination: GetProductsPagination<IGetProductsResponse>;
  /**
   * a list of products. Represents one page of the results, use pagination.next to fetch next page of results.
   */
  products: Product[];
}

export interface IQuery {
  [prop: string]: number | string;
  pageSize: number;
  currentPage: number;
  fields: string;
  query: string;
}

async function getProducts(
  options?: IGetProductsOptions
): Promise<IGetProductsResponse> {
  const query = createSearchQuery(options);
  const productSearchResult = await GET<GetProductsSearchResultDTO>(
    VINMONOPOLET_SEARCH_URL,
    query
  );

  return {
    pagination: new Pagination<IGetProductsResponse>(
      productSearchResult.pagination,
      options,
      getProducts
    ),
    products: productSearchResult.products.map(fromDTOToBaseProduct),
  };
}

function createSearchQuery(options?: IGetProductsOptions) {
  const facetquery = options?.facets?.map((facet) => facet.query) ?? [];
  const sortQuery = options?.sort ? `:${options.sort}:` : ":relevance:";
  const textQuery = options?.query ?? "";
  return new URLSearchParams({
    searchType: "product",
    fields: "FULL",
    pageSize: (options?.limit ? options.limit : 24).toString(),
    currentPage: (options?.page ? options.page - 1 : 0).toString(),
    q: textQuery + sortQuery + facetquery?.join(":"),
  });
}

export default getProducts;
