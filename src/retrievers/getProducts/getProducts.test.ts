import { afterEach, vi, expect, test } from "vitest";
import getProducts from ".";
import { mockFetch } from "../../../tests/mockFetch";
import searchProductsResponse from "../../../tests/files/searchProductsResponse.json";

afterEach(() => {
  vi.clearAllMocks();
});

test("Can get all products", async () => {
  mockFetch(searchProductsResponse);

  const { products, pagination } = await getProducts();

  expect(pagination.currentPage).toBe(0);
  expect(pagination.hasNext).toBe(true);
  expect(pagination.hasPrevious).toBe(false);
  expect(pagination.pageSize).toBe(24);
  expect(pagination.totalPages).toBe(1516);
  expect(pagination.totalResults).toBe(36377);
  expect(pagination.sort).toBe("relevance");
  expect(products.length).toBe(24);
  expect(products[0].code).toBe("142801");
  expect(products[0].name).toBe("Pierre André Châteauneuf-du-Pape 2021");
  expect(products[0].price).toBe(599);
  expect(products[0].pricePerLiter).toBe(798.6666666666666);
  expect(products[0].productSelection).toBe("Bestillingsutvalget");
  expect(products[0].url).toBe(
    "/Land/Frankrike/Rh%C3%B4ne/Ch%C3%A2teauneuf-du-Pape/Pierre-Andr%C3%A9-Ch%C3%A2teauneuf-du-Pape-2021/p/142801"
  );
  expect(products[0].status).toBe("aktiv");
  expect(products[0].productAvailability).toEqual({
    deliveryAvailability: {
      availableForPurchase: true,
      infos: [
        {
          availability: "Kan bestilles",
          location: "Post/Levering",
          readableValue: "Post/Levering: Kan bestilles",
        },
      ],
      openStockLocator: false,
    },
    storesAvailability: {
      availableForPurchase: true,
      infoAvailabilityAllStores: "Vis butikker med varen på lager",
      infos: [
        {
          availability: "Kan bestilles til alle butikker",
          readableValue: "Kan bestilles til alle butikker",
        },
      ],

      openStockLocator: true,
    },
  });
  expect(products[0].volume).toEqual({
    value: 75,
    unit: "cl",
    formattedValue: "75 cl",
  });
  expect(products[0].mainCategory).toEqual({
    code: "rødvin",
    name: "Rødvin",
    url: null,
  });
  expect(products[0].district).toEqual({
    code: "frankrike_rhône",
    name: "Rhône",
    url: null,
  });
  expect(products[0].subDistrict).toEqual({
    code: "frankrike_rhône_châteauneuf-du-pape",
    name: "Châteauneuf-du-Pape",
    url: null,
  });
  expect(products[0].mainCountry).toEqual({
    code: "frankrike",
    name: "Frankrike",
    url: null,
  });
  expect(products[0].mainSubCategory).toBeUndefined();
  expect(products[0].images).toEqual([
    {
      format: "thumbnail",
      description: undefined,
      type: "PRIMARY",
      url: "https://bilder.vinmonopolet.no/cache/96x96-0/142801-1.jpg",
      size: { maxWidth: 96, maxHeight: 96 },
    },
    {
      format: "product",
      description: undefined,
      type: "PRIMARY",
      url: "https://bilder.vinmonopolet.no/cache/300x300-0/142801-1.jpg",
      size: { maxWidth: 300, maxHeight: 300 },
    },
  ]);
});
