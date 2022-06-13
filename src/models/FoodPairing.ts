const foodPairingMap = [
  { code: "A", identifier: "aperitif", name: "Aperitiff/avec" },
  { code: "B", identifier: "shellfish", name: "Skalldyr" },
  { code: "C", identifier: "fish", name: " Fisk" },
  { code: "D", identifier: "light_meat", name: "Lyst kjøtt" },
  { code: "E", identifier: "beef", name: "Storfe" },
  { code: "F", identifier: "mutton", name: "Lam og sau" },
  { code: "G", identifier: "small_game", name: "Småvilt og fugl" },
  { code: "H", identifier: "large_game", name: "Storvilt" },
  { code: "L", identifier: "cheese", name: "Ost" },
  { code: "N", identifier: "dessert", name: "Dessert, kake, frukt" },
  { code: "Q", identifier: "pork", name: "Svinekjøtt" },
  { code: "R", identifier: "vegetables", name: "Grønnsaker" },
];

class FoodPairing {
  code: string;
  identifier: string;
  name: string;

  constructor({ code, identifier, name }) {
    this.code = code;
    this.identifier = identifier;
    this.name = name;
    // this.byName =
  }
}

FoodPairing.prototype.toString = function () {
  return this.name;
};

// Assign pairings as constants
[
  { code: "A", identifier: "aperitif", name: "Aperitiff/avec" },
  { code: "B", identifier: "shellfish", name: "Skalldyr" },
  { code: "C", identifier: "fish", name: " Fisk" },
  { code: "D", identifier: "light_meat", name: "Lyst kjøtt" },
  { code: "E", identifier: "beef", name: "Storfe" },
  { code: "F", identifier: "mutton", name: "Lam og sau" },
  { code: "G", identifier: "small_game", name: "Småvilt og fugl" },
  { code: "H", identifier: "large_game", name: "Storvilt" },
  { code: "L", identifier: "cheese", name: "Ost" },
  { code: "N", identifier: "dessert", name: "Dessert, kake, frukt" },
  { code: "Q", identifier: "pork", name: "Svinekjøtt" },
  { code: "R", identifier: "vegetables", name: "Grønnsaker" },
].forEach((pairing) => {
  FoodPairing[pairing.code] = new FoodPairing(pairing);
  FoodPairing[pairing.name] = new FoodPairing(pairing);
});

export default FoodPairing;
