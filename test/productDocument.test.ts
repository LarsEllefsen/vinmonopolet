import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { ProductDocument } from "../src/util/productDocument";
import { expect } from "chai";

let document: ProductDocument;

describe("productDocument", () => {
  before(async () => {
    const dom = await JSDOM.fromFile(path.resolve(__dirname, "test.html"));
    document = new ProductDocument(dom.window.document);
  });

  it("getName should get name", () => {
    expect(document.getName()).to.equal("Baladin Wayan");
  });

  it("getAbv should get abv", () => {
    const abv = document.getABV();

    expect(abv).to.equal(5.8);
  });

  it("getProductType should get main category and main sub category", () => {
    const { mainCategory, mainSubCategory } = document.getProductType();

    expect(mainCategory).to.equal("Øl");
    expect(mainSubCategory).to.equal("Saison farmhouse ale");
  });

  it("getPrice should get price", () => {
    const price = document.getPrice();

    expect(price).to.equal(134);
  });

  it("getVolume should get volume", () => {
    const volume = document.getVolume();

    expect(volume.formattedValue).to.equal("75 cl");
    expect(volume.unit).to.equal("cl");
    expect(volume.value).to.equal(75);
  });

  it("getBuyable should return buyable status", () => {
    const buyable = document.getBuyable();

    expect(buyable).to.be.true;
  });

  it("getCountry should return country, region and district", () => {
    const { country, region, district } = document.getCountry();

    expect(country).to.equal("Italia");
    expect(region).to.equal("Piemonte");
    expect(district).to.be.null;
  });

  it("getContainerType should return container type", () => {
    const containerType = document.getContainerType();

    expect(containerType).to.equal("Glass");
  });

  it("getProductAvailability should return product availability", () => {
    const { deliveryAvailability, storesAvailability } =
      document.getProductAvailability();

    expect(deliveryAvailability.availableForPurchase).to.be.true;
    expect(deliveryAvailability.text).to.equal("Kan bestilles");
    expect(storesAvailability.availableForPurchase).to.be.true;
    expect(storesAvailability.text).to.equal("Kan bestilles til alle butikker");
  });

  it("getProductImages should get a list of product images", () => {
    const productImages = document.getProductImages();

    expect(productImages).to.have.length(2);
    expect(productImages).to.eql([
      "https://bilder.vinmonopolet.no/cache/300x300-0/229601-1.jpg",
      "https://bilder.vinmonopolet.no/cache/515x515-0/229601-1.jpg",
    ]);
  });
});
