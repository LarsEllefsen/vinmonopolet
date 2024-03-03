// import "reflect-metadata";
import { expect } from "chai";
import {
  getAllStores,
  getProducts,
  getProductCount,
  getFacets,
  getProductsByStore,
  getProduct,
  getProductsByIds,
  getStore,
  Facet,
  Pagination,
  searchStores,
  BaseStore,
  PopulatedStore,
  FacetValue,
  searchProducts,
  FoodPairing,
  ProductImage,
  RawMaterial,
  stream,
  getProductReleases,
} from "../src/index";
import BaseProduct, {
  PopulatedProduct,
  StreamProduct,
} from "../src/models/Product";
import mocha from "mocha";

import { transform, countBy } from "lodash";
import filters from "../src/filters";
import productUrl from "../src/util/productUrl";
import { IGetProductsResponse } from "../src/retrievers/getProducts";
import { validate } from "class-validator";
import ProductRelease from "../src/models/ProductRelease";

/* Don't depend on mocha globals */
const describe = mocha.describe;
const it = mocha.it;

/* Helper functions */
const first = (res) => res.products[0];

const dupes = (array) =>
  transform(
    countBy(array),
    (result, count, value) => {
      if (count > 1) {
        result.push(value);
      }
    },
    []
  );

const getProductCode = (): Promise<string> =>
  getProducts({ sort: ["price", "desc"], limit: 1 })
    .then(first)
    .then((res) => res.code);

describe("vinmonopolet", () => {
  describe("getProducts", () => {
    it("can get a basic listing of products", async () => {
      const { products } = await getProducts();
      expect(products).to.have.length.above(0);
    });

    it("returns array of Product instances", async () => {
      const { products } = await getProducts();
      products.forEach((product) => {
        expect(product).to.be.an.instanceOf(BaseProduct);
      });
    });

    it("Can apply a limit", async () => {
      const { products } = await getProducts({
        limit: 1,
      });
      expect(products).to.have.lengthOf(1);
    });

    it("can apply an offset (page number)", async () => {
      const { products } = await getProducts({ limit: 1 });
      const { products: products2 } = await getProducts({
        limit: 1,
        page: 2,
      });

      expect(products[0].code).to.not.equal(
        products2[0].code,
        "products are not the same when applying page"
      );
    });

    it("can apply sorting by relevance (as a string)", async () => {
      const { products } = await getProducts({
        sort: "relevance",
        limit: 1,
      });
      expect(products).to.have.length.above(0);
    });

    it("can apply sorting by name (as a string)", async () => {
      const { products } = await getProducts({
        limit: 1,
        sort: "price",
      });
      const { products: products2 } = await getProducts({
        limit: 1,
        sort: "name",
      });

      expect(products[0].code).to.not.equal(
        products2[0].code,
        "products are not the same when applying different sorts"
      );
    });

    it("can apply sorting by name (ascending/descending)", async () => {
      const { products } = await getProducts({
        limit: 1,
        sort: ["name", "asc"],
      });
      const { products: products2 } = await getProducts({
        limit: 1,
        sort: ["name", "desc"],
      });

      expect(products[0].name.charCodeAt(0)).to.be.below(
        products2[0].name.charCodeAt(0),
        "products are not the same when applying different sorts"
      );
    });

    it("can apply sorting by price (as a string)", async () => {
      const { products } = await getProducts({
        limit: 1,
        sort: "name",
      });
      const { products: products2 } = await getProducts({
        limit: 1,
        sort: "price",
      });

      expect(products[0].code).to.not.equal(
        products2[0].code,
        "products are not the same when applying different sorts"
      );
    });

    it("can apply sorting by price (ascending/descending)", async () => {
      const { products } = await getProducts({
        limit: 1,
        sort: ["price", "asc"],
      });
      const { products: products2 } = await getProducts({
        limit: 1,
        sort: ["price", "desc"],
      });

      expect(products[0].price).to.be.below(
        products2[0].price,
        "products are not the same when applying different sorts"
      );
    });

    it("applying sort order to relevance makes no difference", async () => {
      const { products } = await getProducts({
        limit: 1,
        sort: ["relevance", "asc"],
      });

      const { products: products2 } = await getProducts({
        limit: 1,
        sort: ["relevance", "desc"],
      });

      expect(products[0].code).to.eq(products2[0].code);
    });

    it("throws if trying to sort on unknown field", () => {
      expect(() => {
        getProducts({ sort: "foo" });
      }).to.throw(/not valid.*?relevance/);
    });

    it("throws if trying to sort in unknown order", () => {
      expect(() => {
        getProducts({ sort: ["price", "bar"] });
      }).to.throw(/not valid.*?asc/);
    });

    it("can apply facet to limit result scope", async () => {
      const { products } = await getProducts({
        facet: Facet.Category.MEAD,
      });

      products.forEach((prod) => expect(prod.productType).to.equal("Mjød"));
    });

    it("can apply multiple facets to limit result scope", async () => {
      const { products } = await getProducts({
        facets: [Facet.Category.BEER, "mainCountry:norge"],
      });

      products.forEach(
        (prod) =>
          expect(prod.productType).to.equal("Øl") &&
          expect(prod.mainCountry.name).to.equal("Norge")
      );
    });

    it("throws is trying to apply invalid facet value", async () => {
      expect(() => {
        getProducts({ facet: "fooBar" });
      }).to.throw(/<facet>:<value>/);
    });

    it("accepts cooercion of valid facet values", () => {
      expect(() => {
        getProducts({ facet: "mainCategory:rødvin" });
      }).to.not.throw();
    });

    it("can apply a freetext query", async () => {
      const { products } = await getProducts({
        query: "valpolicella",
        limit: 3,
      });
      expect(products).to.have.length.above(0);
      products.forEach((product) =>
        expect(product.name.toLowerCase()).to.include("valpolicella")
      );
    });

    it("returns empty array if no results are found", async () => {
      const { products } = await getProducts({
        query: `nonexistant${Date.now()}`,
      });
      expect(products).to.have.lengthOf(0);
    });

    it("returns pagination info", async () => {
      const { pagination, products } = await getProducts({
        limit: 1,
        sort: ["name", "asc"],
      });

      expect(products).to.be.an("array").and.have.lengthOf(1);
      expect(pagination).to.be.an.instanceOf(Pagination);
      expect(pagination).to.have.property("currentPage", 0);
      expect(pagination).to.have.property("pageSize", 1);
      expect(pagination).to.have.property("hasNext", true);
      expect(pagination).to.have.property("hasPrevious", false);
      expect(pagination).to.have.property("sort", "name-asc");
      expect(pagination.totalPages).to.be.a("number").and.be.above(10);
      expect(pagination.totalResults).to.be.a("number").and.be.above(100);
    });

    it("can use the pagination info to traverse next/previous page", () => {
      const chunks: any[] = [];
      const getNext = (res: IGetProductsResponse) => {
        chunks.push(res.products[0]);
        return res.pagination.next();
      };

      const getPrev = (res) => {
        chunks.push(res.products[0]);
        return res.pagination.previous();
      };

      const assertLast = (res) => {
        const productNames = chunks.map((prod) => prod.name);
        expect(dupes(productNames)).to.have.lengthOf(
          0,
          "should not have any duplicates when paginating"
        );
        expect(res.products[0].name).to.equal(
          chunks[2].name,
          "prev should go back to previous page"
        );
      };

      return getProducts({ limit: 1 })
        .then(getNext)
        .then(getNext)
        .then(getNext)
        .then(getPrev)
        .then(assertLast);
    });

    it("can get a populated product instance", async () => {
      const { products } = await getProducts({
        query: "valpolicella",
        limit: 1,
      });

      const populatedProduct = await products[0].populate();

      expect(populatedProduct).to.have.property("ageLimit").and.be.above(17);
      expect(populatedProduct).to.be.instanceOf(PopulatedProduct);
    });

    it("can get a populated product instance", async () => {
      const { products } = await getProducts({
        query: "valpolicella",
        limit: 1,
      });

      const populatedProduct = await products[0].populate();
      const rePopulatedProduct = await populatedProduct.populate();
      expect(rePopulatedProduct).to.have.property("ageLimit").and.be.above(17);
      expect(rePopulatedProduct).to.be.instanceOf(PopulatedProduct);
    });
  });

  describe("getProductCount", () => {
    it("can get a total count for a regular query", async () => {
      const count = await getProductCount({ sort: "name" });
      expect(count).to.be.a("number").and.be.above(0);
    });

    it("can get a total count regardless of options", async () => {
      const count = await getProductCount({
        sort: ["name", "desc"],
        query: "valpolicella",
        limit: 10,
        page: 2,
        facets: [Facet.Category.RED_WINE],
      });

      expect(count).to.be.a("number").and.be.above(0);
    });
  });

  describe("getStores", () => {
    it("can get all stores", async () => {
      const stores = await getAllStores();
      expect(stores).to.have.length.above(300);
    });

    it("can search for store by query", async () => {
      const { stores } = await searchStores({
        query: "Oslo, Aker Brygge",
      });
      expect(stores[0].name).to.be.equal("Oslo, Aker Brygge");
      expect(stores[0]).to.be.instanceOf(BaseStore);
    });

    it("can search for store by location", async () => {
      const { stores } = await searchStores({
        nearLocation: {
          lat: 63.405,
          lon: 10.402,
        },
      });
      expect(stores[0].name).to.be.equal("Trondheim, Byåsen");
    });

    it("returns pagination info", () =>
      searchStores({}).then((res) => {
        expect(res.stores).to.be.an("array").and.have.lengthOf(10);
        expect(res.pagination).to.be.an.instanceOf(Pagination);
        expect(res.pagination).to.have.property("currentPage", 0);
        expect(res.pagination).to.have.property("pageSize", 10);
        expect(res.pagination).to.have.property("hasNext", true);
        expect(res.pagination).to.have.property("hasPrevious", false);
        expect(res.pagination?.totalPages).to.be.a("number").and.be.above(10);
        expect(res.pagination?.totalResults)
          .to.be.a("number")
          .and.be.above(100);
      }));

    it("can populated a BaseStore", async () => {
      const { stores } = await searchStores();
      const populatedStore = await stores[0].populate();
      expect(populatedStore).to.be.instanceOf(PopulatedStore);
      expect(populatedStore).to.have.property("category");
      expect(populatedStore).to.have.property("openingHoursFriday");
      expect(populatedStore.openingHoursFriday?.opens).to.not.be.undefined.and
        .not.be.null;
    });

    it("can get a store by id", async () => {
      const store = await getStore("143");
      expect(store).to.be.instanceOf(PopulatedStore);
      expect(store.storeNumber).to.equal("143");
    });
  });

  describe("getFacets", () => {
    it("can get facets list, returns promise of array", async () => {
      const facets = await getFacets();
      expect(facets).to.have.length.above(0);
    });

    it("Cooerces to Facet instance", async () => {
      const facets = await getFacets();
      facets.forEach((facet) => expect(facet).to.be.instanceOf(Facet));
    });

    it("populates facets with title, name, category and values", async () => {
      const facets = await getFacets();
      facets.forEach((facet) => {
        expect(facet).to.have.property("title");
        expect(facet).to.have.property("name");
        expect(facet).to.have.property("category");
        expect(facet).to.have.property("values").and.be.an("array");

        facet.values.forEach((val) =>
          expect(val).to.be.an.instanceOf(FacetValue)
        );
      });
    });

    it("can use returned facets to search for products", async () => {
      const facets = await getFacets();
      const countryFacet = facets.find(
        (facet) => facet.title === "mainCountry"
      );
      expect(countryFacet).to.be.an.instanceOf(Facet);

      const norwayFacetValue = countryFacet?.values.find(
        (val) => val.name === "Norge"
      );
      expect(norwayFacetValue).to.be.an.instanceOf(FacetValue);

      const { products } = await getProducts({
        limit: 3,
        facet: norwayFacetValue,
      });

      products.forEach((product) => {
        expect(product).to.have.property("mainCountry");
        expect(product.mainCountry).to.have.property("name", "Norge");
      });
    });
  });

  describe("searchProducts", () => {
    it("takes the same options as getProducts", async () => {
      const { products } = await searchProducts("valpolicella", {
        limit: 3,
        sort: ["price", "asc"],
      });

      products.reduce((prevPrice, prod) => {
        expect(prod.price).to.not.be.below(prevPrice);
        expect(prod.name.toLowerCase()).to.include("valpolicella");
        return prod.price;
      }, 0);
    });
  });

  describe("getProduct", () => {
    it("fetches a given product", async () => {
      const product = await getProduct("gavekort");
      expect(product)
        .to.be.an.instanceOf(PopulatedProduct)
        .and.include.keys({ code: "gavekort", name: "Gavekort" });
    });

    it("populates with food pairing that can be stringified", async () => {
      const code = await getProductCode();
      const product = await getProduct(code);
      product.foodPairing?.forEach((food) => {
        expect(food).to.be.an.instanceOf(FoodPairing);
        expect(food.toString()).to.be.a("string").and.have.length.above(0);
      });
    });

    it("populates with raw materials that can be stringified", async () => {
      const code = await getProductCode();
      const product = await getProduct(code);
      product.rawMaterial?.forEach((raw) => {
        expect(raw).to.be.an.instanceOf(RawMaterial);
        expect(raw.toString()).to.be.a("string").and.have.length.above(0);
      });
    });

    it("populates with product images that can be stringified", async () => {
      const code = await getProductCode();
      const product = await getProduct(code);
      product.images?.forEach((img) => {
        expect(img).to.be.an.instanceOf(ProductImage);
        expect(img.toString()).to.match(/^https?:\/\//);
      });
    });
  });

  describe("getProductsById", () => {
    it("fetches products by id", async () => {
      const { products } = await getProducts({
        query: "valpolicella",
        limit: 3,
      });

      const codes = products.map((product) => product.code);

      const productsById = await getProductsByIds(codes);

      productsById.forEach((prod) => {
        expect(prod.name.toLowerCase()).to.contain("valpolicella");
      });
    });
  });

  describe("getProductsByStore", () => {
    it("fetches products by store id", async () => {
      const { products, store } = await getProductsByStore("160", {
        limit: 3,
      });
      expect(products).to.have.length(3);
      expect(store).to.equal("160");
    });

    it("fetches products by store and with facet", async () => {
      const { products, store } = await getProductsByStore("160", {
        facet: Facet.Category.BEER,
      });
      expect(store).to.be.equal("160");
      products.forEach((prod) => expect(prod.productType).to.equal("Øl"));
    });

    it("can use use page option to traverse the result set", async () => {
      const chunks: any[] = [];
      let currentPage = 1;
      const getNext = (res: IGetProductsResponse) => {
        chunks.push(res.products[0]);
        currentPage++;
        return getProductsByStore("160", {
          limit: 1,
          page: currentPage,
        });
      };

      const getPrev = (res) => {
        chunks.push(res.products[0]);
        currentPage--;
        return getProductsByStore("160", {
          limit: 1,
          page: currentPage,
        });
      };

      const assertLast = (res) => {
        const productNames = chunks.map((prod) => prod.name);
        expect(dupes(productNames)).to.have.lengthOf(
          0,
          "should not have any duplicates when paginating"
        );
        expect(res.products[0].name).to.equal(
          chunks[2].name,
          "prev should go back to previous page"
        );
      };

      return getProductsByStore("160", { limit: 1, page: currentPage })
        .then(getNext)
        .then(getNext)
        .then(getNext)
        .then(getPrev)
        .then(assertLast);
    });
  });

  describe("getProductReleases", () => {
    it("Can get a list of product releases", async () => {
      const productReleases = await getProductReleases();

      expect(productReleases).to.not.have.length(0);
      expect(productReleases[0]).to.be.instanceOf(ProductRelease);
    });
  });

  describe("stream.getProducts", () => {
    it("It can stream the whole dataset without crashing", async () => {
      const _stream = await stream.getProducts();
      return new Promise((resolve, reject) => {
        let totalProducts = 0;
        const onProduct = (prod) => {
          expect(prod).to.be.an.instanceOf(StreamProduct);
          expect(prod.code).to.be.a("string").and.have.length.above(0);
          expect(prod).to.not.be.an.instanceOf(
            PopulatedProduct,
            "should not say stream products are complete"
          );
          totalProducts++;
        };

        _stream.on("data", onProduct).once("end", () => {
          expect(totalProducts).to.be.above(20000);
          resolve();
        });
      });
    }).timeout(20000);
  });

  describe("stream.getStores", () => {
    it("can stream the entire set of data without crashing", async () => {
      const _stream = await stream.getStores();
      return new Promise((resolve, reject) => {
        let totalStores = 0;
        _stream
          .on("data", (prod) => {
            expect(prod).to.be.an.instanceOf(PopulatedStore);
            expect(prod.name).to.be.a("string").and.have.length.above(0);
            totalStores++;
          })
          .once("end", () => {
            expect(totalStores).to.be.above(300);
            resolve();
          });
      });
    }).timeout(20000);
  });

  describe("edge cases", () => {
    it("handles dirty data in filters", () => {
      expect(filters.foodPairing()).to.be.an("array").and.have.lengthOf(0);
      expect(filters.foodPairing(null)).to.be.an("array").and.have.lengthOf(0);

      expect(filters.number.greedy("")).to.be.a("null");

      expect(filters.openingHours("stengt")).to.be.a("null");
      expect(filters.openingHours("Stengt")).to.be.a("null");

      expect(filters.price(null)).to.be.a("null");

      expect(filters.volume(null)).to.be.a("null");
      expect(filters.volume(0.75)).to.equal(0.75);

      expect(productUrl("1234")).to.equal("https://www.vinmonopolet.no/p/1234");
    });
  });

  describe("Model validation", () => {
    it("baseProduct conforms to validation", async () => {
      const { products } = await getProducts({
        limit: 5,
        facet: Facet.Category.BEER,
      });
      const validateProduct = async (product: BaseProduct) => {
        const validationErrors = await validate(product);

        if (validationErrors.length > 0)
          throw new Error(
            "Validation of BaseProduct failed: " + validationErrors
          );

        return validationErrors;
      };

      for (const product of products) {
        const validationErrors = await validateProduct(product);
        expect(validationErrors).to.have.length(0);
      }
    });

    it("populatedProduct conforms to validation", async () => {
      const { products } = await getProducts({ limit: 5 });
      const populatedProduct = await getProduct(products[0].code);
      const validateProduct = async (product: BaseProduct) => {
        const validationErrors = await validate(product);

        if (validationErrors.length > 0)
          throw new Error(
            "Validation of BaseProduct failed: " + validationErrors
          );

        return validationErrors;
      };

      const validationErrors = await validateProduct(populatedProduct);
      expect(validationErrors).to.have.length(0);
    });
  });
});
