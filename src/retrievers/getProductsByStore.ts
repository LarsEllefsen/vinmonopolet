import FacetValue from "../models/FacetValue";
import getProducts, {
  IGetProductsOptions,
  IGetProductsResponse,
} from "./getProducts";

interface IGetProductsByStoreOptions {
  /**
   * An array of facets. Gets all products with these properties.
   */
  facets?: Array<FacetValue | undefined>;

  /**
   * Get all products with this facet (property).
   */
  facet?: FacetValue;

  /**
   * Limits the number of products returned in a single, paginated response (Default: 50)
   */
  limit?: number;

  /**
   * Which page of the pagination you want to get. (Default: 1)
   */
  page?: number;
}

export interface IGetProductsByStoreResponse extends IGetProductsResponse {
  store: string;
}

async function getProductsByStore(
  store: string,
  opts?: IGetProductsByStoreOptions
): Promise<IGetProductsByStoreResponse> {
  const storeFacet = new FacetValue({
    query: { query: { value: `availableInStores:${store}` } },
  });

  let facets = [storeFacet];
  if (opts?.facet) facets.push(opts?.facet);
  if (opts?.facets) {
    const safeFacets: FacetValue[] = opts?.facets.filter(
      (facet) => facet !== undefined
    ) as FacetValue[];
    facets = facets.concat(safeFacets);
  }

  const options = {
    limit: opts?.limit,
    facets: facets,
    page: opts?.page ?? 1,
  } as IGetProductsOptions;

  const allProducts = await getProducts(options);

  return { ...allProducts, store };
}

export default getProductsByStore;
