import FoodPairing from "../models/FoodPairing";
import number from "../filters/number";
import clockToPercentage from "../filters/clockToPercentage";
import boolean from "../filters/boolean";

const pairingCodeToIdentifier = (code: string): FoodPairing =>
  FoodPairing[code] && FoodPairing[code].identifier;

export default {
  Butikker: ["stores"],
  Pris: ["price"],
  isGoodfor: ["foodPairing", pairingCodeToIdentifier],
  Fylde: ["fullness", clockToPercentage.range],
  Friskhet: ["freshness", clockToPercentage.range],
  Bitterhet: ["bitterness", clockToPercentage.range],
  Soedme: ["sweetness", clockToPercentage.range],
  "Tannin(Sulfates)": ["tannins", clockToPercentage.range],
  Sukker: ["sugar", number],
  Raastoff: ["rawMaterial"],
  Emballasjetype: ["containerType"],
  Lagringsgrad: ["storable"],
  Biodynamic: ["bioDynamic"],
  Eco: ["eco"],
  Fairtrade: ["fairtrade"],
  Gluten: ["gluten"],
  Kosher: ["kosher"],
  inStockFlag: ["inStock", boolean],
};
