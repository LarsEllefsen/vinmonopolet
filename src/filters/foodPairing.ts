import FoodPairing from "../models/FoodPairing";

export default (values?: string[] | null): FoodPairing[] => {
  if (!values) {
    return [];
  }

  return values.map((name) => FoodPairing.byName[name]).filter(Boolean);
};
