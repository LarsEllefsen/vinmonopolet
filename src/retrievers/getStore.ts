import PopulatedStore, { IOpeningHours } from "../models/Store";
import request from "../util/request";

interface IOpeningTime {
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

interface IGetStoreDTO {
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
  openingTimes: IOpeningTime[];
}

const getStore = async (store_id: string): Promise<PopulatedStore> => {
  const res = await request.get<IGetStoreDTO>(
    `/vmpws/v2/vmp/stores/${store_id}`,
    {
      baseUrl: "https://www.vinmonopolet.no",
      query: { fields: "FULL" },
    }
  );

  return toPopulatedStore(res);
};

function toPopulatedStore(storeDTO: IGetStoreDTO): PopulatedStore {
  return new PopulatedStore(
    storeDTO.name,
    storeDTO.displayName,
    storeDTO.address.line1,
    storeDTO.address.postalCode,
    storeDTO.address.town,
    storeDTO.geoPoint.latitude,
    storeDTO.geoPoint.longitude,
    storeDTO.assortment,
    storeDTO.openingTimes.map(toOpeningHours)
  );
}

function toOpeningHours(openingTimeDTO: IOpeningTime): IOpeningHours {
  return {
    closes: openingTimeDTO.closingTime,
    opens: openingTimeDTO.openingTime,
    weekDay: openingTimeDTO.weekDay,
  };
}

export default getStore;
