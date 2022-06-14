import FoodPairing from "../models/FoodPairing";

export default (values: string[]): FoodPairing[] => {
  if (!values) {
    return [];
  }

  return values.map((name) => FoodPairing.byName[name]).filter(Boolean);
};
