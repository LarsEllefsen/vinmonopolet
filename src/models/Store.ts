interface IOpeningHours {
  opens: number;
  closes: number;
}

class Store {
  datotid: string;
  name: string;
  streetAddress: string;
  streetZip: string;
  streetCity: string;
  postalAddress: string;
  postalZip: string;
  postalCity: string;
  phoneNumber: string;
  category: string;
  gpsCoordinates: [number, number];
  weekNumber: number;
  openingHoursMonday: IOpeningHours | null;
  openingHoursTuesday: IOpeningHours | null;
  openingHoursWednesday: IOpeningHours | null;
  openingHoursThursday: IOpeningHours | null;
  openingHoursFriday: IOpeningHours | null;
  openingHoursSaturday: IOpeningHours | null;
  weekNumberNext: number;
  openingHoursNextMonday: IOpeningHours | null;
  openingHoursNextTuesday: IOpeningHours | null;
  openingHoursNextWednesday: IOpeningHours | null;
  openingHoursNextThursday: IOpeningHours | null;
  openingHoursNextFriday: IOpeningHours | null;
  openingHoursNextSaturday: IOpeningHours | null;
  storeNumber: string;

  constructor(store) {
    this.datotid = store?.datotid;
    this.name = store?.name;
    this.streetAddress = store.streetAddress;
    this.streetZip = store?.streetZip;
    this.streetCity = store?.streetCity;
    this.postalAddress = store?.postalAddress;
    this.postalZip = store?.postalZip;
    this.postalCity = store?.postalCity;
    this.phoneNumber = store?.phoneNumber;
    this.category = store?.category;
    this.gpsCoordinates = [store?.latitude, store?.longitude];
    this.weekNumber = store?.weekNumber;
    this.openingHoursMonday = store?.openingHoursMonday;
    this.openingHoursTuesday = store?.openingHoursMonday;
    this.openingHoursWednesday = store?.openingHoursMonday;
    this.openingHoursThursday = store?.openingHoursMonday;
    this.openingHoursFriday = store?.openingHoursMonday;
    this.openingHoursSaturday = store?.openingHoursMonday;
    this.weekNumberNext = store?.weekNumberNext;
    this.openingHoursNextMonday = store?.openingHoursMonday;
    this.openingHoursNextTuesday = store?.openingHoursMonday;
    this.openingHoursNextWednesday = store?.openingHoursMonday;
    this.openingHoursNextThursday = store?.openingHoursMonday;
    this.openingHoursNextFriday = store?.openingHoursMonday;
    this.openingHoursNextSaturday = store?.openingHoursMonday;
    this.storeNumber = store?.butikkNummer;
  }
}

export default Store;
