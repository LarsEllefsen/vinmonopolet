import facetsMap from "../datamaps/facetsMap";
import FacetValue from "./FacetValue";
import * as FacetCategories from "./FacetCategories";

const displayNames = {
  mainCategory: "Kategori",
  mainSubCategory: "Underkategori",
  mainSubSubCategory: "Varetype",
  mainCountry: "Land",
  volumeRanges: "Volum",
  isGoodfor: "Passer til",
  Soedme: "Sødme",
  "Tannin(Sulfates)": "Garvestoffer",
  Raastoff: "Råstoff",
  Biodynamic: "Biodynamisk",
  Eco: "Økologisk",
  Gluten: "Glutenfri",
  inStockFlag: "På lager",
};

export type FacetCategory = {
  [key in keyof typeof FacetCategories]: FacetValue;
};

export const FacetCategoryMapping = () => {
  const map = {};
  map[FacetCategories.ALCOHOL_FREE] = new FacetValue({
    name: "Alkoholfritt",
    query: { query: { value: "mainCategory:alkoholfritt" } },
  });

  map[FacetCategories.RED_WINE] = new FacetValue({
    name: "Rødvin",
    query: { query: { value: "mainCategory:rødvin" } },
  });

  map[FacetCategories.ROSE_WINE] = new FacetValue({
    name: "Rosévin",
    query: { query: { value: "mainCategory:rosévin" } },
  });

  map[FacetCategories.WHITE_WINE] = new FacetValue({
    name: "Hvitvin",
    query: { query: { value: "mainCategory:hvitvin" } },
  });

  map[FacetCategories.RIPPLING_WINE] = new FacetValue({
    name: "Perlende vin",
    query: { query: { value: "mainCategory:perlende_vin" } },
  });

  map[FacetCategories.FLAVORED_WINE] = new FacetValue({
    name: "Aromatisert vin",
    query: { query: { value: "mainCategory:aromatisert_vin" } },
  });

  map[FacetCategories.SPARKLING_WINE] = new FacetValue({
    name: "Musserende vin",
    query: { query: { value: "mainCategory:musserende_vin" } },
  });

  map[FacetCategories.FORTIFIED_WINE] = new FacetValue({
    name: "Sterkvin",
    query: { query: { value: "mainCategory:sterkvin" } },
  });

  map[FacetCategories.FRUIT_WINE] = new FacetValue({
    name: "Fruktvin",
    query: { query: { value: "mainCategory:fruktvin" } },
  });

  map[FacetCategories.LIQUOR] = new FacetValue({
    name: "Brennevin",
    query: { query: { value: "mainCategory:brennevin" } },
  });

  map[FacetCategories.CIDER] = new FacetValue({
    name: "Sider",
    query: { query: { value: "mainCategory:sider" } },
  });

  map[FacetCategories.BEER] = new FacetValue({
    name: "Øl",
    query: { query: { value: "mainCategory:øl" } },
  });

  map[FacetCategories.SAKE] = new FacetValue({
    name: "Sake",
    query: { query: { value: "mainCategory:Sake" } },
  });

  map[FacetCategories.MEAD] = new FacetValue({
    name: "Mjød",
    query: { query: { value: "mainCategory:mjød" } },
  });

  return map as FacetCategory;
};

class Facet {
  title: string;
  name: string;
  displayName: string;
  category: boolean;
  multiSelect: boolean;
  values: FacetValue[];

  constructor(facet) {
    const [title, valueFilter] = facetsMap[facet.code] || [];
    this.title = title || facet.code;
    this.name = facet.name;
    this.displayName = displayNames[facet.name] || facet.name;
    this.category = facet.category;
    this.multiSelect = facet.multiSelect;
    this.values = facet.values.map((val) => new FacetValue(val, valueFilter));
  }

  static Category: FacetCategory = FacetCategoryMapping();
}
export default Facet;
