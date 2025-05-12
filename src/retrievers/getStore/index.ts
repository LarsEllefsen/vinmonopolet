import { VINMONOPOLET_STORE_URL } from "../../constants";
import { toPopulatedStore } from "../../models/store/mapper";
import PopulatedStore from "../../models/store/PopulatedStore";
import { GET } from "../../util/GET";
import { IGetStoreDTO } from "./types";

const getStore = async (store_id: string): Promise<PopulatedStore> => {
  const response = await GET<IGetStoreDTO>(
    `${VINMONOPOLET_STORE_URL}${store_id}`,
    new URLSearchParams({ fields: "FULL" })
  );

  return toPopulatedStore(response);
};

export default getStore;
