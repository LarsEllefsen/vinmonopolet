import getStore from "../retrievers/getStore";

interface IOpeningHours {
  opens: { hour: number; minute: number };
  closes: { hour: number; minute: number };
}

const getOpeningHours = (
  weekday: string,
  store: { [property: string]: any }
): IOpeningHours | null => {
  try {
    let weekDayOpening =
      store["Apn_" + weekday.toLowerCase().replace("ø", "o")];
    weekDayOpening = weekDayOpening ?? store.openingHours?.weekDayOpeningList;
    if (Array.isArray(weekDayOpening)) {
      const weekDayEntry = weekDayOpening.find(
        (entry) => entry.weekDay.toLowerCase() === weekday.toLowerCase()
      );
      if (weekDayEntry.closed || !weekDayEntry) return null;
      return {
        opens: weekDayEntry?.openingTime,
        closes: weekDayEntry?.closingTime,
      } as IOpeningHours;
    }

    if (weekDayOpening && weekDayOpening != "Stengt") {
      weekDayOpening = weekDayOpening as string;
      let [opening, closing]: string[] = weekDayOpening.split("-");
      opening = opening.trim();
      closing = closing.trim();
      return {
        opens: {
          hour: Number(opening?.slice(0, 3)),
          minute: Number(opening?.slice(2, opening.length)),
        },
        closes: {
          hour: Number(closing?.slice(0, 3)),
          minute: Number(closing?.slice(2, opening.length)),
        },
      } as IOpeningHours;
    }

    return null;
  } catch (e) {
    return null;
  }
};

export class BaseStore {
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
  streetZip: string;
  /**
   * The city the store is located in.
   */
  streetCity: string;
  /**
   * The postal address. Usually just the same as streetAddress.
   */
  postalAddress: string;
  /**
   * The zip code of the stores postal address. Usually just the same as streetZip.
   */
  postalZip: string;
  /**
   * The postal city of the store. Usually just the same as the streetCity property.
   */
  postalCity: string;
  /**
   * The phone number for the store.
   */
  phoneNumber: string;
  /**
   * GPS coordinates of the store given as a [lat, lon] array.
   */
  gpsCoordinates: [number, number];

  constructor(store) {
    this.name = store?.Butikknavn ?? store?.displayName;
    this.streetAddress = store.Gateadresse ?? store.address.line1;
    this.streetZip = store?.Gate_postnummer ?? store.address.postalCode;
    this.streetCity = store?.Gate_poststed ?? store.address.town;
    this.postalAddress = store?.Postadresse ?? store.address.line2;
    this.postalZip = store?.Post_postnummer ?? store.address.postalCode;
    this.postalCity = store?.Post_poststed ?? store.address.town;
    this.phoneNumber = store?.Telefonnummer ?? store.address.phone;
    this.gpsCoordinates = [
      store?.GPS_breddegrad ?? store?.geoPoint.latitude,
      store?.GPS_lengdegrad ?? store?.geoPoint.longitude,
    ];
    this.storeNumber = store?.Butikknummer ?? store?.name;
  }

  /**
   * Returns a new instance of PopulatedStore, with more fields.
   * @returns Promise<PopulatedStore>
   */
  populate(): Promise<PopulatedStore> {
    return new Promise((resolve, reject) => {
      getStore(this.storeNumber)
        .then((populatedStore) => resolve(populatedStore))
        .catch((err) => {
          reject(err);
        });
    });
  }
}

class PopulatedStore extends BaseStore {
  /**
   * The category of the store. The category ranges from 1 to 7, where 1 is the lowest possible product selection and 7 is the best possible product selection.
   */
  category: string;
  /**
   * The current week. Usually undefined unless using getAllStores.
   */
  weekNumber: number | undefined;
  /**
   * An oject representing the opening and closing times of the store on monday this week. Is null if the store is not open that day.
   */
  openingHoursMonday: IOpeningHours | null;
  /**
   * An oject representing the opening and closing times of the store on tuesday this week. Is null if the store is not open that day.
   */
  openingHoursTuesday: IOpeningHours | null;
  /**
   * An oject representing the opening and closing times of the store on wednesday this week. Is null if the store is not open that day.
   */
  openingHoursWednesday: IOpeningHours | null;
  /**
   * An oject representing the opening and closing times of the store on thursday this week. Is null if the store is not open that day.
   */
  openingHoursThursday: IOpeningHours | null;
  /**
   * An oject representing the opening and closing times of the store on friday this week. Is null if the store is not open that day.
   */
  openingHoursFriday: IOpeningHours | null;
  /**
   * An oject representing the opening and closing times of the store on saturday this week. Is null if the store is not open that day.
   */
  openingHoursSaturday: IOpeningHours | null;
  /**
   * The next weeks number.
   */
  weekNumberNext: number;
  /**
   * An oject representing the opening and closing times of the store on monday next week. Is null if the store is not open that day.
   */
  openingHoursNextMonday: IOpeningHours | null;
  /**
   * An oject representing the opening and closing times of the store on tuesday next week. Is null if the store is not open that day.
   */
  openingHoursNextTuesday: IOpeningHours | null;
  /**
   * An oject representing the opening and closing times of the store on wendesday next week. Is null if the store is not open that day.
   */
  openingHoursNextWednesday: IOpeningHours | null;
  /**
   * An oject representing the opening and closing times of the store on thursday next week. Is null if the store is not open that day.
   */
  openingHoursNextThursday: IOpeningHours | null;
  /**
   * An oject representing the opening and closing times of the store on friday next week. Is null if the store is not open that day.
   */
  openingHoursNextFriday: IOpeningHours | null;
  /**
   * An oject representing the opening and closing times of the store on saturday next week. Is null if the store is not open that day.
   */
  openingHoursNextSaturday: IOpeningHours | null;

  constructor(store) {
    super(store);
    this.category = store?.Kategori ?? store?.assortment;
    this.weekNumber = store?.Ukenummer;
    this.openingHoursMonday = getOpeningHours("mandag", store);
    this.openingHoursTuesday = getOpeningHours("tirsdag", store);
    this.openingHoursWednesday = getOpeningHours("onsdag", store);
    this.openingHoursThursday = getOpeningHours("torsdag", store);
    this.openingHoursFriday = getOpeningHours("fredag", store);
    this.openingHoursSaturday = getOpeningHours("lørdag", store);
    this.weekNumberNext = store?.Ukenummer_neste;
    this.openingHoursNextMonday = store?.Apn_neste_mandag;
    this.openingHoursNextTuesday = store?.Apn_neste_tirsdag;
    this.openingHoursNextWednesday = store?.Apn_neste_onsdag;
    this.openingHoursNextThursday = store?.Apn_neste_torsdag;
    this.openingHoursNextFriday = store?.Apn_neste_fredag;
    this.openingHoursNextSaturday = store?.Apn_neste_lordag;
  }

  populate(): Promise<PopulatedStore> {
    return Promise.resolve(this);
  }
}

export default PopulatedStore;
