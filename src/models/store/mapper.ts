import { IGetStoreDTO, IOpeningTimeDTO } from "../../retrievers/getStore/types";
import { IOpeningHours } from "./PopulatedStore";
import PopulatedStore from "./PopulatedStore";

export function toPopulatedStore(storeDTO: IGetStoreDTO): PopulatedStore {
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

function toOpeningHours(openingTimeDTO: IOpeningTimeDTO): IOpeningHours {
  return {
    closes: openingTimeDTO.closingTime,
    opens: openingTimeDTO.openingTime,
    weekDay: openingTimeDTO.weekDay,
  };
}
