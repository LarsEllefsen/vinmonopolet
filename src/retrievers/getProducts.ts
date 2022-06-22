import Product from "../models/Product";
import Pagination from "../models/Pagination";
import FacetValue from "../models/FacetValue";
import request from "../util/request";
import arrayify from "../util/arrayify";
import oneOfMessage from "../util/oneOfMessage";

const defaults = { limit: 50, page: 1 };
const sortFields = ["relevance", "name", "price"] as const;
const sortOrders = ["asc", "desc"] as const;
const sortTakesOrder = ["name", "price"] as const;

export interface IGetProductsOptions {
  limit?: number;
  page?: number;
  query?: string;
  sort?:
    | typeof sortFields[number]
    | [typeof sortFields[number], typeof sortOrders[number]];
  facet?: FacetValue | string;
  facets?: Array<FacetValue | string | undefined>;
}

export interface IGetProductsResponse {
  pagination: Pagination;
  products: Product[];
}

export interface IQuery {
  pageSize: number;
  currentPage: number;
  fields: string;
  query: string;
}

function getProducts(
  opts?: IGetProductsOptions
): Promise<IGetProductsResponse> {
  const options = { ...defaults, ...opts };
  const query = getQuery(opts);

  const getter = request.get;
  const req = getter("/products/search", { query });

  return req.then((res) => ({
    products: (res.products || []).map((i) => new Product(i)),
    pagination: new Pagination(res.pagination, options, getProducts),
  }));
}

function getSortParam(sort) {
  if (!sort) {
    return undefined;
  }

  const [sortField, sortOrder] = arrayify(sort);

  if (sortFields.indexOf(sortField) === -1) {
    throw new Error(
      `"options.sort[0]" is not valid. ${oneOfMessage(sortFields)}`
    );
  }

  if (sortOrder && sortOrders.indexOf(sortOrder) === -1) {
    throw new Error(
      `"options.sort[1]" is not valid. ${oneOfMessage(sortOrders)}`
    );
  }

  const takesOrder = sortTakesOrder.indexOf(sortField) !== -1;
  let newSortOrder = sortOrder;
  if (!sortOrder && takesOrder) {
    newSortOrder = sortOrders[0];
  } else if (sortOrder && !takesOrder) {
    newSortOrder = undefined;
  }

  return [sortField, newSortOrder].filter(Boolean).join("-");
}

function getQuery(opts?: IGetProductsOptions): IQuery {
  const options = { ...defaults, ...opts };

  // The `query` query parameter (heh) has the following syntax (a bit weird, this);
  // freeTextSearch:sort:facetKey1:facetValue1:facetKey2:facetValue2
  const queryParts = {
    freeTextSearch: "",
    sort: "relevance",
    facets: [] as string[],
  };

  if (options.query) {
    queryParts.freeTextSearch = options.query;
  }

  const sort = getSortParam(options.sort);
  if (sort) {
    queryParts.sort = sort;
  }

  if (options.facet || options.facets) {
    const facets = arrayify(options.facet || options.facets);
    queryParts.facets = facets.map(FacetValue.cooerce).map((val) => val.query);
  }

  // Serialize actual "query" query param as outlined above
  const serializedQuery = [queryParts.freeTextSearch, queryParts.sort]
    .concat(queryParts.facets)
    .join(":");

  const query: IQuery = {
    pageSize: options.limit,
    currentPage: Math.max(0, options.page - 1),
    fields: "FULL",
    query: serializedQuery,
  };

  return query;
}

export const getProductCount = (
  opts?: IGetProductsOptions
): Promise<number> => {
  const query = getQuery(opts);
  const getter = request.head;
  const req = getter("/products/search", { query });

  return req.then((res) => Number(res.headers.get("x-total-count")));
};

export default getProducts;
