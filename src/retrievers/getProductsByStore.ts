import objectAssign from "object-assign";
import FacetValue from "../models/FacetValue";
import getProducts from "./getProducts";

interface getProductsByStoreOptions {
  facets?: Array<FacetValue | undefined>;
  facet?: FacetValue;
}

function getProductsByStore(store, opts?: getProductsByStoreOptions) {
  const id = typeof store.name === "undefined" ? store : store.name;
  const facet = new FacetValue({
    query: { query: { value: `availableInStores:${id}` } },
  });
  const options = Object.assign({}, opts || {});

  if (options.facet) {
    options.facets?.push(options.facet);
  }

  let facets = [facet];
  if (options.facets) {
    const safeFacets: FacetValue[] = options.facets.filter(
      (facet) => facet !== undefined
    ) as FacetValue[];
    facets = facets.concat(safeFacets);
  }

  delete options.facet;
  options.facets = facets;

  return getProducts(options);
}

export default getProductsByStore;
