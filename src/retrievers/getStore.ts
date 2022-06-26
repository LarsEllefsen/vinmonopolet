import PopulatedStore from "../models/Store";
import request from "../util/request";

const getStore = async (store_id: string): Promise<PopulatedStore> => {
  const res = await request.get(`/api/stores/${store_id}`, {
    baseUrl: "https://www.vinmonopolet.no",
    query: { fields: "FULL" },
  });

  return new PopulatedStore(res);
};

export default getStore;
