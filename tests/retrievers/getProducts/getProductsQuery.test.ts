import { afterEach, vi, expect, test, describe } from "vitest";
import getProducts from "../../../src/retrievers/getProducts";
import getProductsByStore from "../../../src/retrievers/getProductsByStore";
import FacetValue from "../../../src/models/FacetValue";
import { mockFetch } from "../../../tests/mockFetch";
import searchProductsResponse from "../../../tests/files/searchProductsResponse.json";

afterEach(() => {
  vi.clearAllMocks();
});

function getCapturedUrl(): URL {
  const call = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
  return new URL(call[0]);
}

describe("getProducts query building", () => {
  test("default query uses relevance sort", async () => {
    mockFetch(searchProductsResponse);
    await getProducts();

    const url = getCapturedUrl();
    const q = url.searchParams.get("q");
    expect(q).toBe(":relevance:");
  });

  test("sort as string produces correct query", async () => {
    mockFetch(searchProductsResponse);
    await getProducts({ sort: "price" });

    const url = getCapturedUrl();
    const q = url.searchParams.get("q");
    expect(q).toBe(":price:");
  });

  test("sort as tuple joins with hyphen", async () => {
    mockFetch(searchProductsResponse);
    await getProducts({ sort: ["name", "asc"] });

    const url = getCapturedUrl();
    const q = url.searchParams.get("q");
    expect(q).toBe(":name-asc:");
  });

  test("sort with facets produces correct query", async () => {
    mockFetch(searchProductsResponse);
    const categoryFacet = FacetValue.cooerce("mainCategory:rødvin");

    await getProducts({ sort: ["name", "asc"], facets: [categoryFacet] });

    const url = getCapturedUrl();
    const q = url.searchParams.get("q");
    expect(q).toBe(":name-asc:mainCategory:rødvin");
  });

  test("freetext query with sort and facets", async () => {
    mockFetch(searchProductsResponse);
    const categoryFacet = FacetValue.cooerce("mainCategory:rødvin");

    await getProducts({
      query: "barolo",
      sort: ["price", "desc"],
      facets: [categoryFacet],
    });

    const url = getCapturedUrl();
    const q = url.searchParams.get("q");
    expect(q).toBe("barolo:price-desc:mainCategory:rødvin");
  });

  test("limit and page are passed correctly", async () => {
    mockFetch(searchProductsResponse);
    await getProducts({ limit: 50, page: 3 });

    const url = getCapturedUrl();
    expect(url.searchParams.get("pageSize")).toBe("50");
    expect(url.searchParams.get("currentPage")).toBe("2"); // page is 0-indexed in the API
  });
});

describe("getProductsByStore query building", () => {
  test("store 104, sort name-asc, category rødvin produces correct query", async () => {
    mockFetch(searchProductsResponse);
    const categoryFacet = FacetValue.cooerce("mainCategory:rødvin");

    await getProductsByStore("104", {
      sort: ["name", "asc"],
      facets: [categoryFacet],
    });

    const url = getCapturedUrl();
    const q = url.searchParams.get("q");

    expect(q).toBe(":name-asc:availableInStores:104:mainCategory:rødvin");
  });

  test("store without sort defaults to relevance", async () => {
    mockFetch(searchProductsResponse);

    await getProductsByStore("104");

    const url = getCapturedUrl();
    const q = url.searchParams.get("q");
    expect(q).toBe(":relevance:availableInStores:104");
  });
});
