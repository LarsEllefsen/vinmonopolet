import request from "../util/request";
import Facet from "../models/Facet";

function getFacets(): Promise<Array<Facet>> {
  return request
    .get("/vmp/search/facets", {
      baseUrl: "https://www.vinmonopolet.no",
      query: {
        // 500 thrown if no "q" parameter supplied.
        q: "",
      },
    })
    .then((res) => res.facets.map((i) => new Facet(i)));
}

export default getFacets;
