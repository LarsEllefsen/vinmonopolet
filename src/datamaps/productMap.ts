import FoodPairing from "../models/FoodPairing";
import ProductImage from "../models/ProductImage";
import RawMaterial from "../models/RawMaterial";
import Category from "../models/Category";
import productUrl from "../util/productUrl";
import clockToPercentage from "../filters/clockToPercentage";
import number from "../filters/number";
import status from "../filters/status";
import price from "../filters/price";
import year from "../filters/year";

const matchPairings = (pairings) =>
  pairings.map((pairing) => FoodPairing[pairing.code]);

const toCategory = (category) => new Category(category);
const toCategories = (cats) => cats.map(toCategory);
const toImages = (imgs) => imgs.map((img) => new ProductImage(img));
const toRawMaterial = (mats): RawMaterial[] | null =>
  mats ? mats.map((mat) => new RawMaterial(mat)) : null;

const productType = (mainCat) => mainCat.value;
const toVolume = (volume) => {
  return {
    value: number(volume?.value),
    formattedValue: volume?.formattedValue,
    unit: volume?.formattedValue?.split(" ")[1],
  };
};

/* eslint-disable camelcase */
export default {
  productType: ["productType", productType],
  isGoodFor: ["foodPairing", matchPairings],
  litrePrice: ["pricePerLiter", price],
  bitterness: ["bitterness", clockToPercentage],
  freshness: ["freshness", clockToPercentage],
  sweetness: ["sweetness", clockToPercentage],
  fullness: ["fullness", clockToPercentage],
  sulfates: ["tannins", clockToPercentage],
  matured: ["storable"],
  images: ["images", toImages],
  alcohol: ["abv", number],
  volume: ["volume", toVolume],
  packageType: ["containerType"],
  price: ["price", price],
  nyhet: ["newProduct"],
  product_selection: ["productSelection"],
  wholeSaler: ["wholesaler"],
  status: ["status", status],
  raastoff: ["rawMaterial", toRawMaterial],
  sugar: ["sugar", number],
  acid: ["acid", number],
  smell: ["aroma"],
  year: ["vintage", year],
  url: ["url", productUrl],

  main_category: ["mainCategory", toCategory],
  main_sub_category: ["mainSubCategory", toCategory],
  main_country: ["mainCountry", toCategory],
  district: ["district", toCategory],
  sub_District: ["subDistrict", toCategory],
  style: ["style", toCategory],
};
/* eslint-enable camelcase */
