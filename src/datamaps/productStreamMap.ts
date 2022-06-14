import textFilter from "../filters/text";
import volumeFilter from "../filters/volume";
import priceFilter from "../filters/price";
import joinFilter from "../filters/join";
import clockToPrctFilter from "../filters/clockToPercentage";
import trimFilter from "../filters/trim";
import numberFilter from "../filters/number";
import foodPairingFilter from "../filters/foodPairing";
import productUrl from "../util/productUrl";

module.exports = {
  Varenummer: ["code"],
  Varenavn: ["name", textFilter],
  Volum: ["containerSize", volumeFilter],
  Pris: ["price", priceFilter],
  Literpris: ["pricePerLiter", priceFilter],
  Varetype: ["productType", textFilter],
  Produktutvalg: ["productSelection", textFilter],
  Butikkategori: ["storeCategory", textFilter],
  Fylde: ["fullness", clockToPrctFilter],
  Friskhet: ["freshness", clockToPrctFilter],
  Garvestoffer: ["tannins", clockToPrctFilter],
  Bitterhet: ["bitterness", clockToPrctFilter],
  Sodme: ["sweetness", clockToPrctFilter],
  Farge: ["color", trimFilter],
  Lukt: ["aroma", textFilter],
  Smak: ["taste", textFilter],
  Passertil01: [
    "foodPairing",
    joinFilter(["Passertil01", "Passertil02", "Passertil03"]),
    foodPairingFilter,
  ],
  Land: ["mainCountry", textFilter],
  Distrikt: ["district", textFilter],
  Underdistrikt: ["subDistrict", textFilter],
  Argang: ["vintage", numberFilter],
  Rastoff: ["rawMaterial", textFilter],
  Råstoff: ["rawMaterial", textFilter],
  Metode: ["method", textFilter],
  Alkohol: ["abv", numberFilter.greedy],
  Sukker: ["sugar", numberFilter.nullify(["Ukjent"])],
  Syre: ["acid", numberFilter.nullify(["Ukjent"])],
  Lagringsgrad: ["storable", textFilter],
  Produsent: ["mainProducer", textFilter],
  Grossist: ["wholesaler", textFilter],
  Distributor: ["distributor", textFilter],
  Distributør: ["distributor", textFilter],
  Emballasjetype: ["containerType", textFilter],
  Korktype: ["cork", textFilter],
  Vareurl: ["url", productUrl],
};
