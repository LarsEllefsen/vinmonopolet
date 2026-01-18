import { afterEach, expect, vi, test } from "vitest";
import getProduct from "../../../src/retrievers/getProduct";
import { mockFetch } from "../../mockFetch";
import getProductResponse from "../../files/getProductResponse.json";
import getGiftBackProductResponse from "../../files/getGiftBackProductResponse.json";
import getWineProductResponse from "../../files/getWineProductResponse.json";

afterEach(() => {
  vi.clearAllMocks();
});

test("Can get beer", async () => {
  mockFetch(getProductResponse);

  const product = await getProduct("7746702");

  expect(product.buyable).toBe(true);
  expect(product.code).toBe("7746702");
  expect(product.name).toBe("Lervig Supersonic");
  expect(product.price).toBe(104.1);
  expect(product.pricePerLiter).toBe(208.2);
  expect(product.productSelection).toBe("Basisutvalget");
  expect(product.url).toBe("/Land/Norge/Rogaland/Lervig-Supersonic/p/7746702");
  expect(product.status).toBe("aktiv");
  expect(product.abv).toBe(8);
  expect(product.ageLimit).toBe(18);
  expect(product.containerType).toBe("Emballasje med pant");
  expect(product.bioDynamic).toBe(false);
  expect(product.acid).toBeUndefined();
  expect(product.tannins).toBeUndefined();
  expect(product.bitterness).toBe(58);
  expect(product.freshness).toBe(42);
  expect(product.fullness).toBe(67);
  expect(product.productAvailability).toBeUndefined();
  expect(product.glutenFree).toBe(false);
  expect(product.allergens).toBe("Gluten");
  expect(product.color).toBe("Skyet, middels dyp strågul.");
  expect(product.aroma).toBe(
    "Humlepreget, sval og fruktig med ferskt lyst malt, toner av pasjonsfrukt, mango, kamfer og barnål."
  );
  expect(product.taste).toBe(
    "Fyldig og kremet med tydelig preg av humle, svale urter, ferskt lyst malt, mango og pasjonsfrukt."
  );
  expect(product.distributor).toBe("Lervig AS");
  expect(product.distributorId).toBe("30898");
  expect(product.eco).toBe(false);
  expect(product.environmentalPackaging).toBe(true);
  expect(product.expired).toBe(false);
  expect(product.fairTrade).toBe(false);
  expect(product.rawMaterial).toEqual([
    {
      id: "999",
      name: "Vann, malt (bygg, hvete), havre, humle, gjær",
      percentage: 100,
    },
  ]);
  expect(product.storable).toBe("Drikkeklar, ikke egnet for lagring");
  expect(product.method).toBe("Tradisjonell overgjæret brygging.");
  expect(product.kosher).toBe(false);
  expect(product.vintage).toBeUndefined();
  expect(product.sugar).toBeUndefined();
  expect(product.foodPairing).toEqual([
    {
      byName: null,
      code: "A",
      identifier: "aperitif",
      name: "Aperitiff/avec",
    },
  ]);
  expect(product.volume).toEqual({
    value: 50,
    unit: "cl",
    formattedValue: "50 cl",
  });
  expect(product.wholesaler).toBe("Lervig AS");
  expect(product.mainCategory).toEqual({
    code: "øl",
    name: "Øl",
    url: null,
  });
  expect(product.district).toEqual({
    code: "norge_rogaland",
    name: "Rogaland",
    url: "/search?searchType=product&q=:relevance:mainDistrict:norge_rogaland:mainCountry:norge",
  });
  expect(product.subDistrict).toBeUndefined();
  expect(product.mainCountry).toEqual({
    code: "norge",
    name: "Norge",
    url: "/search?searchType=product&q=:relevance:mainCountry:norge",
  });
  expect(product.mainSubCategory).toEqual({
    code: "øl_india_pale_ale",
    name: "India pale ale",
    url: null,
  });
  expect(product.producer).toEqual({
    code: "lervig_as",
    name: "Lervig AS",
    url: "/search?searchType=product&q=:name-asc:brand:lervig_as",
  });
  expect(product.images).toEqual([
    {
      format: "superZoom",
      description: "Lervig Supersonic",
      type: "PRIMARY",
      url: "https://bilder.vinmonopolet.no/cache/1200x1200-0/7746702-1.jpg",
      size: { maxWidth: 1200, maxHeight: 1200 },
    },
    {
      format: "zoom",
      description: "Lervig Supersonic",
      type: "PRIMARY",
      url: "https://bilder.vinmonopolet.no/cache/515x515-0/7746702-1.jpg",
      size: { maxWidth: 515, maxHeight: 515 },
    },
    {
      format: "product",
      description: "Lervig Supersonic",
      type: "PRIMARY",
      url: "https://bilder.vinmonopolet.no/cache/300x300-0/7746702-1.jpg",
      size: { maxWidth: 300, maxHeight: 300 },
    },
    {
      format: "thumbnail",
      description: "Lervig Supersonic",
      type: "PRIMARY",
      url: "https://bilder.vinmonopolet.no/cache/96x96-0/7746702-1.jpg",
      size: { maxWidth: 96, maxHeight: 96 },
    },
    {
      format: "cartIcon",
      description: "Lervig Supersonic",
      type: "PRIMARY",
      url: "https://bilder.vinmonopolet.no/cache/65x65-0/7746702-1.jpg",
      size: { maxWidth: 65, maxHeight: 65 },
    },
  ]);
});

test("Can parse 'Under 3 g/l' sugar value as 0", async () => {
  mockFetch(getWineProductResponse);

  const product = await getProduct("1234567");

  expect(product.code).toBe("1234567");
  expect(product.sugar).toBe(0);
});

test("Can get gift article item", async () => {
  mockFetch(getGiftBackProductResponse);

  const product = await getProduct("407");

  expect(product.buyable).toBe(true);
  expect(product.code).toBe("407");
  expect(product.name).toBe("Gaveeske 1 flaske");
  expect(product.price).toBe(35);
  expect(product.pricePerLiter).toBe(0);
  expect(product.productSelection).toBe("Basisutvalget");
  expect(product.url).toBe("/c/Gaveeske-1-flaske/p/407");
  expect(product.status).toBe("utgatt");
  expect(product.abv).toBe(0);
  expect(product.ageLimit).toBe(0);
  expect(product.containerType).toBeUndefined();
  expect(product.bioDynamic).toBe(false);
  expect(product.acid).toBeUndefined();
  expect(product.tannins).toBeUndefined();
  expect(product.bitterness).toBeUndefined();
  expect(product.freshness).toBeUndefined();
  expect(product.fullness).toBeUndefined();
  expect(product.productAvailability).toBeUndefined();
  expect(product.glutenFree).toBe(false);
  expect(product.allergens).toBeUndefined();
  expect(product.color).toBeUndefined();
  expect(product.aroma).toBeUndefined();
  expect(product.taste).toBeUndefined();
  expect(product.distributor).toBe("ScanLog AS Distribusjonssenter");
  expect(product.distributorId).toBe("900");
  expect(product.eco).toBe(false);
  expect(product.environmentalPackaging).toBe(false);
  expect(product.expired).toBe(false);
  expect(product.fairTrade).toBe(false);
  expect(product.rawMaterial).toHaveLength(0);
  expect(product.storable).toBeUndefined();
  expect(product.method).toBeUndefined();
  expect(product.kosher).toBe(false);
  expect(product.vintage).toBeUndefined();
  expect(product.sugar).toBeUndefined();
  expect(product.foodPairing).toHaveLength(0);
  expect(product.volume).toBeUndefined();
  expect(product.wholesaler).toBe("Allsidige Nord AS");
  expect(product.mainCategory).toEqual({
    code: "gaveartikler_og_tilbehør",
    name: "Gaveartikler og tilbehør",
    url: null,
  });
  expect(product.district).toBeUndefined();
  expect(product.subDistrict).toBeUndefined();
  expect(product.mainCountry).toBeUndefined();
  expect(product.mainSubCategory).toEqual({
    code: "gaveartikler_og_tilbehør_gaveesker",
    name: "Gaveesker",
    url: null,
  });
  expect(product.producer).toBeUndefined();
  expect(product.images).toEqual([
    {
      format: "superZoom",
      description: "Gaveeske 1 flaske",
      type: "PRIMARY",
      url: "https://bilder.vinmonopolet.no/cache/1200x1200-0/407-1.jpg",
      size: { maxWidth: 1200, maxHeight: 1200 },
    },
    {
      format: "zoom",
      description: "Gaveeske 1 flaske",
      type: "PRIMARY",
      url: "https://bilder.vinmonopolet.no/cache/515x515-0/407-1.jpg",
      size: { maxWidth: 515, maxHeight: 515 },
    },
    {
      format: "product",
      description: "Gaveeske 1 flaske",
      type: "PRIMARY",
      url: "https://bilder.vinmonopolet.no/cache/300x300-0/407-1.jpg",
      size: { maxWidth: 300, maxHeight: 300 },
    },
    {
      format: "thumbnail",
      description: "Gaveeske 1 flaske",
      type: "PRIMARY",
      url: "https://bilder.vinmonopolet.no/cache/96x96-0/407-1.jpg",
      size: { maxWidth: 96, maxHeight: 96 },
    },
    {
      format: "cartIcon",
      description: "Gaveeske 1 flaske",
      type: "PRIMARY",
      url: "https://bilder.vinmonopolet.no/cache/65x65-0/407-1.jpg",
      size: { maxWidth: 65, maxHeight: 65 },
    },
  ]);
});
