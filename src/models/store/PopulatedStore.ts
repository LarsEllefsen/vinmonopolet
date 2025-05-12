import BaseStore from "./BaseStore";

export interface IOpeningHours {
  weekDay: string;
  opens?: { hour: number; minute: number };
  closes?: { hour: number; minute: number };
}

class PopulatedStore extends BaseStore {
  /**
   * The category of the store. The category ranges from 1 to 7, where 1 is the lowest possible product selection and 7 is the best possible product selection.
   */
  category: string;
  openingHours: IOpeningHours[];

  constructor(
    storeNumber: string,
    name: string,
    streetAddress: string,
    zip: string,
    city: string,
    latitude: number,
    longitude: number,
    category: string,
    openingHours: IOpeningHours[]
  ) {
    super(storeNumber, name, streetAddress, zip, city, latitude, longitude);
    this.category = category;
    this.openingHours = openingHours;
  }

  populate(): Promise<PopulatedStore> {
    return Promise.resolve(this);
  }
}

export default PopulatedStore;
