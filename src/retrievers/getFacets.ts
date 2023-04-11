import request from "../util/request";
import Facet from "../models/Facet";

function getFacets(): Promise<Array<Facet>> {
  return request
    .get("/api/search", {
      baseUrl: "https://www.vinmonopolet.no",
      query: {
        fields: "FULL",
      },
    })
    .then((res) => res.productSearchResult.facets.map((i) => new Facet(i)));
}

export default getFacets;
