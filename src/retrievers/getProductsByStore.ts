import objectAssign from "object-assign";
import FacetValue from "../models/FacetValue";
import getProducts, { IGetProductsResponse } from "./getProducts";

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
}

interface getProductsByStoreResponse extends IGetProductsResponse {
  store: string;
}

async function getProductsByStore(
  store,
  opts?: IGetProductsByStoreOptions
): Promise<getProductsByStoreResponse> {
  const id = typeof store.name === "undefined" ? store : store.name;

  const storeFacet = new FacetValue({
    query: { query: { value: `availableInStores:${id}` } },
  });

  let facets = [storeFacet];
  if (opts?.facet) facets.push(opts?.facet);
  if (opts?.facets) {
    const safeFacets: FacetValue[] = opts?.facets.filter(
      (facet) => facet !== undefined
    ) as FacetValue[];
    facets = facets.concat(safeFacets);
  }

  delete opts?.facet;

  const options = { limit: opts?.limit, facets: facets };

  const allProducts = await getProducts(options);

  return { ...allProducts, store };
}

export default getProductsByStore;
