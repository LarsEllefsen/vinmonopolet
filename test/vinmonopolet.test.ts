import { expect } from "chai";
import vinmonopolet from "../src/index";
import BaseProduct from "../src/models/Product";

/* Helper functions */
const first = (res) => res.products[0];

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

    it("Can apply sorting by name (as a string)", async () => {
      const { products } = await vinmonopolet.getProducts({
        limit: 1,
        sort: "relevance",
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

    it("Can apply sorting by price (as a string)", async () => {
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
  });
});
