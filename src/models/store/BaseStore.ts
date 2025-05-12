import PopulatedStore from "./PopulatedStore";

class BaseStore {
  /**
   * Unique ID for the store.
   */
  storeNumber: string;
  /**
   * The name of the store
   */
  name: string;
  /**
   * The street address of the store.
   */
  streetAddress: string;
  /**
   * The zip code of the store.
   */
  zip?: string;
  /**
   * The city the store is located in.
   */
  city?: string;
  /**
   * GPS coordinates of the store given as a [lat, lon] array.
   */
  gpsCoordinates: [number, number];

  constructor(
    storeNumber: string,
    name: string,
    streetAddress: string,
    zip: string | undefined,
    city: string | undefined,
    latitude: number,
    longitude: number
  ) {
    this.storeNumber = storeNumber;
    this.name = name;
    this.streetAddress = streetAddress;
    this.zip = zip;
    this.city = city;
    this.gpsCoordinates = [latitude, longitude];
  }

  /**
   * Returns a new instance of PopulatedStore, with more fields.
   * @returns Promise<PopulatedStore>
   */
  populate(): Promise<PopulatedStore> {
    return new Promise((resolve, reject) => {
      import("../../retrievers/getStore").then((getStore) => {
        const populatedStore = getStore.default(this.storeNumber);
        resolve(populatedStore);
      });
    });
  }
}

export default BaseStore;
