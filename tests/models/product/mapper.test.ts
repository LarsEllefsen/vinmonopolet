import { expect, test } from "vitest";
import { fromDTOToPopulatedProduct } from "../../../src/models/product/mapper";
import { PopulatedProductDTO } from "../../../src/retrievers/getProduct/types";

function createMinimalDTO(
  overrides: Partial<PopulatedProductDTO> = {}
): PopulatedProductDTO {
  return {
    ageLimit: 18,
    allergens: "",
    bioDynamic: false,
    buyable: true,
    code: "123",
    color: "",
    description: "",
    distributor: "",
    distributorId: 0,
    eco: false,
    environmentalPackaging: false,
    expired: false,
    fairTrade: false,
    gluten: false,
    images: [],
    kosher: false,
    litrePrice: { formattedValue: "", readableValue: "", value: 0 },
    method: "",
    name: "Test Product",
    packageType: "",
    product_selection: "",
    regularTags: [],
    releaseMode: false,
    similarProducts: false,
    smell: "",
    storeCategory: "",
    status: "aktiv",
    statusNotification: false,
    stickers: [],
    summary: "",
    sustainabilityTags: [],
    sustainable: false,
    tags: [],
    taste: "",
    url: "/test",
    wholeSaler: "",
    ...overrides,
  } as PopulatedProductDTO;
}

test("parses storeCategory with multiple values into a list", () => {
  const dto = createMinimalDTO({ storeCategory: "SB6L, SB6R" });
  const product = fromDTOToPopulatedProduct(dto);
  expect(product.storeCategories).toEqual(["SB6L", "SB6R"]);
});

test("parses storeCategory with single value into a list", () => {
  const dto = createMinimalDTO({ storeCategory: "SB6L" });
  const product = fromDTOToPopulatedProduct(dto);
  expect(product.storeCategories).toEqual(["SB6L"]);
});

test("returns empty array when storeCategory is empty", () => {
  const dto = createMinimalDTO({ storeCategory: "" });
  const product = fromDTOToPopulatedProduct(dto);
  expect(product.storeCategories).toEqual([]);
});

test("returns empty array when storeCategory is undefined", () => {
  const dto = createMinimalDTO();
  // @ts-expect-error - testing undefined case
  dto.storeCategory = undefined;
  const product = fromDTOToPopulatedProduct(dto);
  expect(product.storeCategories).toEqual([]);
});
