export interface IOpeningTimeDTO {
  closingTime: {
    formattedHour: string;
    hour: number;
    minute: number;
  };
  openingTime: {
    formattedHour: string;
    hour: number;
    minute: number;
  };
  weekDay: string;
  closed: false;
  formattedDate: string;
  readableValue: string;
}

export interface IGetStoreDTO {
  address: {
    defaultAddress: boolean;
    formattedAddress: string;
    line1: string;
    line2: string;
    phone: string;
    postalCode: string;
    town: string;
  };
  assortment: string;
  clickAndCollect: boolean;
  displayName: string;
  geoPoint: {
    latitude: number;
    longitude: number;
  };
  name: string;
  openingTimes: IOpeningTimeDTO[];
}
