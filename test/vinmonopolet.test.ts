import chai, { expect } from "chai";
import vinmonopolet from "../src/index";
import BaseProduct from "../src/models/Product";
import chaiAsPromised from "chai-as-promised";

import { transform, countBy } from "lodash";

chai.use(chaiAsPromised);
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

describe("vinmonopolet", () => {
  describe("getProducts", () => {
    it("can get a basic listing of products", async () => {
      const { products } = await vinmonopolet.getProducts();
      expect(products).to.have.length.above(0);
    });

    it("returns array of Product instances", async () => {
      const { products } = await vinmonopolet.getProducts();
      products.forEach((product) => {
        expect(product).to.be.an.instanceOf(BaseProduct);
      });
    });

    it("Can apply a limit", async () => {
      const { products } = await vinmonopolet.getProducts({
        limit: 1,
      });
      expect(products).to.have.lengthOf(1);
    });

    it("can apply an offset (page number)", () => {
      Promise.all([
        vinmonopolet.getProducts({ limit: 1 }).then(first),
        vinmonopolet.getProducts({ limit: 1, page: 2 }).then(first),
      ]).then((res) => {
        expect(res[0].code).to.not.equal(
          res[1].code,
          "products are not the same when applying page"
        );
      });
    });

    it("can apply sorting by relevance (as a string)", async () => {
      const { products } = await vinmonopolet.getProducts({
        sort: "relevance",
        limit: 1,
      });
      expect(products).to.have.length.above(0);
    });

    it("can apply sorting by name (as a string)", async () => {
      const { products } = await vinmonopolet.getProducts({
        limit: 1,
        sort: "price",
      });
      const { products: products2 } = await vinmonopolet.getProducts({
        limit: 1,
        sort: "name",
      });

      expect(products[0].code).to.not.equal(
        products2[0].code,
        "products are not the same when applying different sorts"
      );
    });

    it("can apply sorting by name (ascending/descending)", async () => {
      const { products } = await vinmonopolet.getProducts({
        limit: 1,
        sort: ["name", "asc"],
      });
      const { products: products2 } = await vinmonopolet.getProducts({
        limit: 1,
        sort: ["name", "desc"],
      });

      expect(products[0].name.charCodeAt(0)).to.be.below(
        products2[0].name.charCodeAt(0),
        "products are not the same when applying different sorts"
      );
    });

    it("can apply sorting by price (as a string)", async () => {
      const { products } = await vinmonopolet.getProducts({
        limit: 1,
        sort: "name",
      });
      const { products: products2 } = await vinmonopolet.getProducts({
        limit: 1,
        sort: "price",
      });

      expect(products[0].code).to.not.equal(
        products2[0].code,
        "products are not the same when applying different sorts"
      );
    });

    it("can apply sorting by price (ascending/descending)", async () => {
      const { products } = await vinmonopolet.getProducts({
        limit: 1,
        sort: ["price", "asc"],
      });
      const { products: products2 } = await vinmonopolet.getProducts({
        limit: 1,
        sort: ["price", "desc"],
      });

      expect(products[0].price).to.be.below(
        products2[0].price,
        "products are not the same when applying different sorts"
      );
    });

    it("applying sort order to relevance makes no difference", async () => {
      const { products } = await vinmonopolet.getProducts({
        limit: 1,
        sort: ["relevance", "asc"],
      });

      const { products: products2 } = await vinmonopolet.getProducts({
        limit: 1,
        sort: ["relevance", "desc"],
      });

      expect(products[0].code).to.eq(products2[0].code);
    });

    it("throws if trying to sort on unknown field", async () => {
      expect(() => {
        vinmonopolet.getProducts({ sort: "foo" });
      }).to.throw(/not valid.*?relevance/);
    });

    it("throws if trying to sort in unknown order", async () => {
      expect(() => {
        vinmonopolet.getProducts({ sort: ["price", "bar"] });
      }).to.throw(/not valid.*?asc/);
    });

    it("can apply facet to limit result scope", async () => {
      const { products } = await vinmonopolet.getProducts({
        facet: vinmonopolet.Facet.Category.MEAD,
      });

      products.forEach((prod) => expect(prod.productType).to.equal("Mjød"));
    });

    it("can apply multiple facets to limit result scope", async () => {
      const { products } = await vinmonopolet.getProducts({
        facets: [vinmonopolet.Facet.Category.BEER, "mainCountry:norge"],
      });

      products.forEach(
        (prod) =>
          expect(prod.productType).to.equal("Øl") &&
          expect(prod.mainCountry.name).to.equal("Norge")
      );
    });

    it("throws is trying to apply invalid facet value", async () => {
      expect(() => {
        vinmonopolet.getProducts({ facet: "fooBar" });
      }).to.throw(/<facet>:<value>/);
    });

    it("accepts cooercion of valid facet values", () => {
      expect(() => {
        vinmonopolet.getProducts({ facet: "mainCategory:rødvin" });
      }).to.not.throw();
    });

    it("can apply a freetext query", async () => {
      const { products } = await vinmonopolet.getProducts({
        query: "valpolicella",
        limit: 3,
      });
      expect(products).to.have.length.above(0);
      products.forEach((product) =>
        expect(product.name.toLowerCase()).to.include("valpolicella")
      );
    });

    it("returns empty array if no results are found", async () => {
      const { products } = await vinmonopolet.getProducts({
        query: `nonexistant${Date.now()}`,
      });
      expect(products).to.have.lengthOf(0);
    });

    it("returns pagination info", async () => {
      const { pagination, products } = await vinmonopolet.getProducts({
        limit: 1,
        sort: ["name", "asc"],
      });

      expect(products).to.be.an("array").and.have.lengthOf(1);
      expect(pagination).to.be.an.instanceOf(vinmonopolet.Pagination);
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
      const getNext = (res) => {
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

      return vinmonopolet
        .getProducts({ limit: 1 })
        .then(getNext)
        .then(getNext)
        .then(getNext)
        .then(getPrev)
        .then(assertLast);
    });

    it("can get a populated product instance", async () => {
      const { products } = await vinmonopolet.getProducts({
        query: "valpolicella",
        limit: 1,
      });

      const populatedProduct = await products[0].populate();

      expect(populatedProduct).to.have.property("ageLimit").and.be.above(17);
      expect(populatedProduct).to.be.instanceOf(vinmonopolet.PopulatedProduct);
    });

    it("can get a populated product instance", async () => {
      const { products } = await vinmonopolet.getProducts({
        query: "valpolicella",
        limit: 1,
      });

      const populatedProduct = await products[0].populate();
      const rePopulatedProduct = await populatedProduct.populate();
      expect(rePopulatedProduct).to.have.property("ageLimit").and.be.above(17);
      expect(rePopulatedProduct).to.be.instanceOf(
        vinmonopolet.PopulatedProduct
      );
    });
  });

  describe("getProductCount", () => {
    it("can get a total count for a regular query", async () => {
      expect(vinmonopolet.getProductCount({ sort: "name" }))
        .to.eventually.be.a("number")
        .and.be.above(0);
    });

    it("can get a total count regardless of options", async () => {
      expect(
        vinmonopolet.getProductCount({
          sort: ["name", "desc"],
          query: "valpolicella",
          limit: 10,
          page: 2,
          facets: [vinmonopolet.Facet.Category.RED_WINE],
        })
      )
        .to.eventually.be.a("number")
        .and.be.above(0);
    });
  });

  describe("getStores", () => {
    // it('can get')
  });
});
