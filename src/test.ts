import {
  Facet,
  getAllStores,
  getProduct,
  getProducts,
  getProductsByStore,
  getStore,
} from ".";
import { searchStores } from "./retrievers/getStores";

// getProducts({
//   facets: [Facet.Category.BEER, Facet.UpcomingProduct],
//   limit: 10,
// }).then((res) => {
//   res.products.forEach((x) => console.log(x));
// });

searchStores({ query: "Oslo" }).then((res) => {
  res.stores.forEach((x) => console.log(x));
});
