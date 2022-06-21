interface IOpeningHours {
  opens: { hour: number; minute: number };
  closes: { hour: number; minute: number };
}

const getOpeningHours = (
  weekday: string,
  weekDayOpening
): IOpeningHours | null => {
  try {
    if (Array.isArray(weekDayOpening)) {
      const weekDayEntry = weekDayOpening.find(
        (entry) => entry.weekDay.toLowerCase() === weekday.toLowerCase()
      );
      if (weekDayEntry.closed || !weekDayEntry) return null;
      return {
        opens: weekDayEntry?.openingTime,
        closes: weekDayEntry?.closingTIme,
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
    this.name = store?.Butikknavn ?? store?.displayName;
    this.streetAddress = store.Gateadresse ?? store.address.line1;
    this.streetZip = store?.Gate_postnummer ?? store.address.postalCode;
    this.streetCity = store?.Gate_poststed ?? store.address.town;
    this.postalAddress = store?.Postadresse ?? store.address.line2;
    this.postalZip = store?.Post_postnummer ?? store.address.postalCode;
    this.postalCity = store?.Post_poststed ?? store.address.town;
    this.phoneNumber = store?.Telefonnummer ?? store.address.phone;
    this.category = store?.Kategori ?? store?.assortment;
    this.gpsCoordinates = [
      store?.GPS_breddegrad ?? store?.geoPoint.latitude,
      store?.GPS_lengdegrad ?? store?.geoPoint.longitude,
    ];
    this.weekNumber = store?.Ukenummer;
    this.openingHoursMonday = getOpeningHours(
      "mandag",
      store?.Apn_mandag ?? store.openingHours
    );
    this.openingHoursTuesday = getOpeningHours(
      "tirsdag",
      store?.Apn_tirsdag ?? store.openingHours
    );
    this.openingHoursWednesday = this.openingHoursTuesday = getOpeningHours(
      "onsdag",
      store?.Apn_onsdag ?? store.openingHours
    );
    this.openingHoursThursday = this.openingHoursTuesday = getOpeningHours(
      "torsdag",
      store?.Apn_torsdag ?? store.openingHours
    );
    this.openingHoursFriday = this.openingHoursTuesday = getOpeningHours(
      "fredag",
      store?.Apn_fredag ?? store.openingHours
    );
    this.openingHoursSaturday = this.openingHoursTuesday = getOpeningHours(
      "lørdag",
      store?.Apn_lordag ?? store.openingHours
    );
    this.weekNumberNext = store?.Ukenummer_neste;
    this.openingHoursNextMonday = store?.Apn_neste_mandag;
    this.openingHoursNextTuesday = store?.Apn_neste_tirsdag;
    this.openingHoursNextWednesday = store?.Apn_neste_onsdag;
    this.openingHoursNextThursday = store?.Apn_neste_torsdag;
    this.openingHoursNextFriday = store?.Apn_neste_fredag;
    this.openingHoursNextSaturday = store?.Apn_neste_lordag;
    this.storeNumber = store?.Butikknummer ?? store?.id;
  }
}

export default Store;
