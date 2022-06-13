const identity = (val) => val;

const baseQuery = ":relevance:visibleInSearch:true:";
const reduceQuery = (query = "") => {
  return query.indexOf(baseQuery) === 0
    ? query.substr(baseQuery.length)
    : query;
};

interface IRawFacetValue {
  code?: string;
  name?: string;
  count?: number;
  query: {
    url?: string;
    query: {
      value: string;
      filterQueries?: string[];
    };
  };
}

class FacetValue {
  name: string;
  count: number | undefined;
  query: string;

  constructor(value: IRawFacetValue, filter = identity) {
    this.name = filter(value.name);
    this.count = value.count;
    this.query = reduceQuery(value.query && value.query.query.value);
  }

  static cooerce(facetVal) {
    if (facetVal instanceof FacetValue) {
      return facetVal;
    }

    const val = String(facetVal);
    if (!/^\w+:.+/i.test(val)) {
      throw new Error("Facet value string must be in <facet>:<value> format");
    }

    return new FacetValue({ query: { query: { value: val } } });
  }
}

FacetValue.prototype.toString = function () {
  return this.query;
};

export default FacetValue;
