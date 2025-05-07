import {
  TraitDTO,
  PopulatedProductDTO,
  IsGoodForDTO,
  IngredientDTO,
  characteristicsDTO,
} from "../../retrievers/getProduct/types";
import { BaseProductDTO, VolumeDTO } from "../../retrievers/getProducts/types";
import { CategoryDTO, ImageDTO } from "../../retrievers/types";
import { tryParseFloat } from "../../util/tryParseFloat";
import Category from "../Category";
import FoodPairing from "../FoodPairing";
import ProductImage from "../ProductImage";
import RawMaterial from "../RawMaterial";
import { Volume } from "../Volume";
import BaseProduct from "./BaseProduct";
import { PopulatedProduct } from "./PopulatedProduct";

export function fromDTOToBaseProduct(dto: BaseProductDTO) {
  return new BaseProduct(
    dto.code,
    dto.name,
    dto.url,
    dto.price?.value ?? 0,
    calculatePricePerLiter(dto.price?.value, dto.volume),
    dto.images.map(mapToProductImage),
    mapToVolume(dto.volume),
    mapToCategory(dto.main_category),
    mapToCategory(dto.main_sub_category),
    mapToCategory(dto.main_country),
    mapToCategory(dto.district),
    mapToCategory(dto.sub_District),
    dto.product_selection,
    dto.productAvailability,
    dto.buyable,
    dto.status
  );
}

export function fromDTOToPopulatedProduct(dto: PopulatedProductDTO) {
  return new PopulatedProduct(
    dto.code,
    dto.name,
    dto.url,
    dto.price?.value ?? 0,
    calculatePricePerLiter(dto.price?.value, dto.volume),
    dto.images?.map(mapToProductImage) ?? [],
    mapToVolume(dto.volume),
    mapToCategory(dto.main_category),
    mapToCategory(dto.main_sub_category),
    mapToCategory(dto.main_country),
    mapToCategory(dto.district),
    mapToCategory(dto.sub_District),
    dto.product_selection,
    dto.buyable,
    dto.status,
    getAbvFromTraits(dto.content?.traits),
    dto.allergens,
    dto.bioDynamic,
    dto.color,
    dto.eco,
    dto.environmentalPackaging,
    dto.expired,
    dto.fairTrade,
    dto.gluten,
    dto.content?.isGoodFor?.map(mapToFoodPairing) ?? [],
    dto.kosher,
    dto.content?.storagePotential?.formattedValue,
    dto.packageType,
    dto.taste,
    dto.smell,
    dto.content?.ingredients?.map(mapToRawMaterial) ?? [],
    getSugarFromTraits(dto.content?.traits),
    getAcidFromTraits(dto.content?.traits),
    getPropertyFromCharacteristics(
      dto.content?.characteristics,
      "Garvestoffer"
    ),
    getPropertyFromCharacteristics(dto.content?.characteristics, "Bitterhet"),
    getPropertyFromCharacteristics(dto.content?.characteristics, "Friskhet"),
    getPropertyFromCharacteristics(dto.content?.characteristics, "Fylde"),
    dto.ageLimit,
    dto.description,
    dto.summary,
    dto.method,
    dto.distributor,
    dto.distributorId?.toString(),
    dto.wholeSaler,
    dto.year ? parseInt(dto.year) : undefined
  );
}

function calculatePricePerLiter(
  price: number | undefined,
  volume: VolumeDTO | undefined | Record<string, never>
): number {
  if (
    price === undefined ||
    volume == undefined ||
    Object.keys(volume).length === 0
  )
    return 0;
  const unit = getVolumeUnit(volume as VolumeDTO);
  switch (unit) {
    case "cl":
      return price / (volume.value / 100);
    case "dl":
      return price / volume.value / 10;
    case "l":
      return price / volume.value;
    default:
      console.warn(
        `Unknown volume unit ${unit}. Unable to calculate price per liter`
      );
      return 0;
  }
}

function mapToCategory(input?: CategoryDTO) {
  if (!input || (!input.name && !input.code && !input.url)) {
    return undefined;
  }
  return new Category(input);
}

function getVolumeUnit(input: VolumeDTO) {
  const split = input.formattedValue.split(" ");
  if (split.length != 2) {
    console.warn(
      `Unable to find volume unit from string ${input.formattedValue}`
    );
    return "";
  }
  return split[1].trim().toLowerCase();
}

function mapToVolume(input: VolumeDTO | undefined | Record<string, never>) {
  if (input === undefined || Object.keys(input).length === 0) return undefined;
  return new Volume(
    input.value,
    input.formattedValue,
    getVolumeUnit(input as VolumeDTO)
  );
}

function mapToProductImage(input: ImageDTO): ProductImage {
  return new ProductImage({
    format: input.format,
    altText: input.altText,
    imageType: input.imageType,
    url: input.url,
  });
}

function getAbvFromTraits(traits?: TraitDTO[]) {
  if (!traits) return 0;
  const alcoholTrait = traits.find((trait) => trait.name === "Alkohol");
  if (!alcoholTrait) {
    console.warn("Unable to get abv from response. No trait with 'Alcohol'");
    return 0;
  }
  const split = alcoholTrait.formattedValue.split("%");
  if (split.length != 2) {
    console.warn(
      "Unable to get abv from alcohol formatted value: " +
        alcoholTrait.formattedValue
    );
    return 0;
  }
  return parseFloat(split[0]);
}

function mapToFoodPairing(isGoodFor: IsGoodForDTO) {
  return FoodPairing[isGoodFor.code];
}

function mapToRawMaterial(ingredients: IngredientDTO) {
  return new RawMaterial({
    id: ingredients.code,
    name: ingredients.readableValue,
    percentage: 100,
  });
}

function getSugarFromTraits(traits?: TraitDTO[]) {
  if (!traits) return undefined;
  const trait = traits.find((x) => x.name.toLowerCase() == "sukker");
  if (!trait) return undefined;
  try {
    const split = trait.formattedValue.split(" ");
    return tryParseFloat(split[0]) ?? tryParseFloat(split[1]);
  } catch (e) {
    return undefined;
  }
}

function getAcidFromTraits(traits?: TraitDTO[]) {
  if (!traits) return undefined;
  const trait = traits.find((x) => x.name.toLowerCase() == "syre");
  if (!trait) return undefined;
  try {
    const split = trait.formattedValue.split(" ");
    return tryParseFloat(split[0]) ?? tryParseFloat(split[1]);
  } catch (e) {
    return undefined;
  }
}

function getPropertyFromCharacteristics(
  characteristics: characteristicsDTO[] | undefined,
  property: string
) {
  if (!characteristics) return undefined;

  const characteristic = characteristics.find(
    (x) => x.name.toLowerCase() === property.toLowerCase()
  );
  if (characteristic === undefined) return undefined;

  try {
    const split = characteristic.readableValue.split(",");
    const [currentValuesString, maxValueString] = split[1].trim().split("av");
    const currentValue = parseInt(currentValuesString.trim());
    const maxValue = parseInt(maxValueString.trim());
    return Math.round((currentValue / maxValue) * 100);
  } catch (e) {
    console.warn(`Error parsing characteristic ${property}:`, e);
    return undefined;
  }
}
