import { GET } from "../../util/GET";
import Facet from "../../models/Facet";
import { VINMONOPOLET_SEARCH_URL } from "../../constants";

async function getFacets(): Promise<Array<Facet>> {
  const facetResponse = await GET<{ [key: string]: any }>(
    VINMONOPOLET_SEARCH_URL,
    new URLSearchParams({ fields: "FULL" })
  );

  return facetResponse.facets.map((i) => new Facet(i));
}

export default getFacets;
