# vinmonopolet

**This is a fork of the original packge: https://www.npmjs.com/package/vinmonopolet**

Extracts information on products and stores from Vinmonopolet.

## Installation

The `vinmonopolet` library can be installed using [npm](https://npmjs.org/):

```bash
npm install vinmonopolet-ts
```

```bash
yarn add vinmonopolet-ts
```

## Disclaimer & terms of service

Please see https://www.vinmonopolet.no/datadeling for the terms of service regarding usage of the data retrieved through this module. Please note that this module is not in any way endorsed by or affiliated with Vinmonopolet.

IMPORTANT: Please note that there may be breaking changes at any time. This package aims to closely adhere to the Vinmonopolet api which may change without warning. Any such changes may be introduced in minor versions which may or may not break your project. Please refer to the changelog when upgrading.

## Changes from the original package

Please see CHANGELOG for a list of breaking changes if you are coming from the original version.

This project is a rewrite of the original package in typescript, so it is now fully typed! The package comes with both ESM and CommonJS, with browser support on the way. There have also been some fixes to previously broken functionality, such as GetStores.

## Documentation

### GetProducts

#### <code>getProducts(options?: IGetProductOptions), defaults?: [Options](#IGetProductsOptions))</code>

**Returns: <code>Promise<[IGetProductsResponse](#IGetProductsResponse)>**</code>

Get all products with the given facet and/or query. If no options are present it gets all products.

example:

```ts
import { getProducts, Facet } from "vinmonopolet-ts";

getProducts().then((response) => {
  console.log(response.products); // Array of products
  console.log(response.pagination); // Info on pagination
});

// With options => get all beers sorted by price descending
getProducts({ facet: Facet.category.BEER, sort: ["price", "desc"] }).then(
  (response) => {
    console.log(response.products); // Array of products
    console.log(response.pagination); // Info on pagination
  }
);
```

### getProduct

### <code>getProduct(code: string)</code>

**Returns: <code>Promise<[PopulatedProduct](#PopulatedProduct)>**</code>

Gets a specific product by its code / id. Returns a fully populated product instance.

```ts
import { getProduct } from "vinmonopolet-ts";

getProduct("1174701").then((product) => {
  console.log(product);
});
```

### getProductsByStore

### <code>getProductsByStore(store_number: string, options? [IGetProductsByStoreOptions](#IGetProductsByStoreOptions))</code>

**Returns: <code>Promise<[IGetProductsResponse](#IGetProductsResponse)>**</code>

Gets all products in stock in a given store. Takes the store id as parameter.

```ts
import { getProductsByStore } from "vinmonopolet-ts";

getProductsByStore("160").then((response) => {
  console.log(response.products); // Array of products
  console.log(response.pagination); // Info on pagination
});
```

### getProductsById

### <code>getProductsById(codes: string[])</code>

**Returns: <code>Promise<[PopulatedProduct[]](#PopulatedProduct)>**</code>

Gets all products given by the code array.

```js
import { getProductsById } from "vinmonopolet-ts";

getProductsById(["1174701", "1148714"]).then((product) => {
  console.log(product);
});
```

### getFacets

### <code>getFacets()</code>

**Returns: <code>Promise<[Facet[]](#PopulatedProduct)>**</code>

Gets all available facets. Facets are used to filter products on a given property, for example on country or product category. See [Facet](#Facet).

example usage:

```ts
import { getFacets, getProducts } from "vinmonopolet-ts";

getFacets()
  .then((facets) => {
    const countryFacet = facets.find((facet) => facet.name === "mainCountry");
    const norwayFacetValue = countryFacet.values.find(
      (val) => val.name === "Norge"
    );

    return getProducts({ limit: 3, facet: norwayFacetValue });
  })
  .then((response) => {
    console.log(response.products); // 3 products from Norway
  });
```

### getAllStores

### <code>getAllStores()</code>

**Returns: <code>Promise<Store[]>**</code>

Gets all Vinmonopolet stores.

```ts
import { getAllStores } from "vinmonopolet-ts";

getAllStores().then((stores) => {
  console.log(stores);
});
```

### getStore

### <code>getStore(store_number: string)</code>

**Returns: <code>Promise<[PopulatedStore](#PopulatedStore)>**</code>

Gets a single store by store number.

```ts
import { getStore } from "vinmonopolet-ts";

getStore("114").then((store) => {
  console.log(store);
});
```

### searchStores

### <code>searchStores(options?: [ISearchStoreOptions](#ISearchStoreOptions))</code>

**Returns: <code>Promise<[ISearchStoreResults](#ISearchStoreResults)>**</code>

Searches for stores with the given options. Returns a paginated results in descending relevancy, with a max result of 126 stores.
Note that the stores returned through this method may lack some properties, this is due to a limitation from vinmonopolet.

```ts
import { searchStores } from "vinmonopolet-ts";

// Search by name
searchStores({ query: "Trondheim" }).then((res) => {
  console.log(res.stores);
  console.log(res.pagination);
});

// Search by location
searchStores({ nearLocation: { lat: 59.910478, lon: 10.743937 } }).then(
  (res) => {
    console.log(res.stores);
    console.log(res.pagination);
  }
);
```

## Models

### Facet

Facets are used to filter products when getting products through getProducts and the likes. Example of facets are product country of origin (mainCountry), product category (mainCategory) and vintage (year).
Note that facets are not strongly typed, but there are however "static" facets for main product category supplied with this package. There are also exports of the static strings for this facet should you need it.

These static Facets can be used like this:

```ts
import { Facet, FacetCategory, getProducts } from "vinmonopolet-ts";

async function approach1() {
  const productCategory = Facet.Category.CIDER; //Or MEAD, or WHITE_WINE etc...
  const { products, pagination } = await getProducts({
    facet: productCategory,
  });
}

async function approach2() {
  const productCategory = Facet.Category[FacetCategory.CIDER];
  const { products, pagination } = await getProducts({
    facet: productCategory,
  });
}
```

### BaseProduct

Base product represents the basic, core product information that is returned when either searching or fetching products through getProducts. In order to fully populated a product you need to call the populate() function, which returns a new instance of [PopulatedProduct](#PopulatedProduct)

```ts
class BaseProduct {
  /**
   * Unique ID for the product.
   */
  code: string;
  /**
   * The product name
   */
  name: string;
  /**
   * The url to the vinmonopol.no product page
   */
  url: string;
  /**
   * The product price
   */
  price: number;
  /**
   * The product price per liter
   */
  pricePerLiter: number;
  /**
   * An array of product images
   */
  images: ProductImage[];
  /**
   * The volume of the product.
   */
  volume?: { value: number; unit: string; formattedValue: string };

  // Classification
  /**
   * The main category of the product (Øl, mjød, hvitvin etc..)
   */
  mainCategory?: { name: string; code: string; url: string };
  /**
   * The sub category of the product (Porter & Stout, Rom, India Pale Ale etc..).
   */
  mainSubCategory?: { name: string; code: string; url: string };
  /**
   * The country of origin.
   */
  mainCountry?: { name: string; code: string; url: string };
  /**
   * The district the product is from. Might not always have values if no district is given.
   */
  district?: { name: string; code: string; url: string };
  /**
   * The sub-district the product is from. Might not always have values if no sub-district is given.
   */
  subDistrict?: { name: string; code: string; url: string };
  /**
   * The given product selection the product is available in (Bestillingsutvalget, Basisutvalget etc).
   */
  productSelection: string;

  // Stock/store-related
  /**
   * information regarding the product availability either in stores or through mail.
   */
  productAvailability?: {
    deliveryAvailability: { available: boolean; mainText: string };
    storeAvailability: { available: boolean; mainText: string };
  };
  /**
   * A boolean representing if the product is currently buyable.
   */
  buyable: boolean;
  /**
   * The status of the product. Most commonly just "active".
   */
  status: string;

  /**
   * Gets the populated version of the product.
   * @returns Promise<PopulatedProduct>
   */
  populate(): () => Promise<PopulatedProduct>;
}
```

### PopulatedProduct

Populated Product contains all the BaseProduct fields as well as a handful new ones. You can populate a [BaseProduct](#baseproduct) by calling the _populate()_ command, which returns a new instance of PopulatedProduct.

```ts
class PopulatedProduct extends BaseProduct {
  // Detailed product info
  /**
   * The abv (alcohol by volume) of the product.
   */
  abv: number;
  /**
   * If any, the allergens of the product.
   */
  allergens?: string;
  /**
   * a bool representing if the product is bioDynamic.
   */
  bioDynamic: boolean;
  /**
   * A string representation of the products color.
   */
  color?: string;
  /**
   * A bool representing if the product is eco
   */
  eco: boolean;
  /**
   * A bool representing if the product has environmental packaging.
   */
  environmentalPackaging: boolean;
  /**
   * A bool representing if the product is expired.
   */
  expired: boolean;
  /**
   * A bool representing if the product is fairtrade.
   */
  fairTrade: boolean;
  /**
   * A bool representing if the product is glutenFree.
   */
  glutenFree: boolean;
  /**
   * A set of Foodpairing objects. Describes what food the product pairs well with.
   */
  foodPairing: FoodPairing[];
  /**
   *  A bool representing if the product is kosher.
   */
  kosher: boolean;
  /**
   *  A string representation of whether the product can be aged further.
   */
  storable?: string;
  /**
   *  A string representation of the container type and material.
   */
  containerType?: string;
  /**
   *  A string representation of the products taste.
   */
  taste?: string;
  /**
   *  A string representation of the products aroma.
   */
  aroma?: string;

  // Ingredients
  /**
   *  An array of RawMaterial objects.
   */
  rawMaterial: RawMaterial[];
  /**
   *  A string or number representing the amount of sugar per litre in the product.
   */
  sugar?: string | number;
  /**
   * The acidity of the product in percentage.
   */
  acid?: number;
  /**
   * The amounts of tannins in percentage
   */
  tannins?: number;

  // Tasting notes
  /**
   * The bitterness of the product in percentage.
   */
  bitterness?: number;
  /**
   * The freshness of the product in percentage.
   */
  freshness?: number;
  /**
   * The fullness of the product in percentage.
   */
  fullness?: number;
  style?: { code: string; description: string; name: string };

  // meta
  /**
   * The minimum age limit in order to buy this product.
   */
  ageLimit: number;

  // These tend to not be set
  description?: string;
  summary?: string;
  method?: string;

  // Producer/distributer/importer etc
  distributor?: string;
  distributorId?: number;
  wholesaler?: string;
  vintage?: number;
```

### BaseStore

A basic representation of a store with the core information. baseStore.populate() returns a new instance of [PopulatedStore](#populatedstore) with more detailed information.

```ts
class BaseStore {
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
```

### PopulatedStore

Fully detailed representation of the store. **NOTE: Unless using getAllStores, openinghours for next week, as well as week numbers wil be undefined**.

```ts
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
}
```

### Pagination

The pagination model is returned as part of every paginated request. It contains information regarding the total products, page size, current page as well as methods for traversing the result set.

```ts
class Pagination {
  /**
   * The current page of the results.
   */
  currentPage: number;

  /**
   * The number of results in each page.
   */
  pageSize: number;

  /**
   * The total number of pages in the response.
   */
  totalPages: number;

  /**
   * The total number of items in the response.
   */
  totalResults: number;

  /**
   * Is true if there are more pages.
   */
  hasNext: boolean;

  /**
   * Is true if there previous pages.
   */
  hasPrevious: boolean;

  /**
   * A string of the sort options used.
   */
  sort: string;

  /**
   * Returns the next page of the results.
   */
  next(): Promise<any>;

  /**
   * Returns the previous page of the results.
   */
  previous(): Promise<any>;
}
```

## Types

### IGetProductsOptions

```ts
const sortFields: readonly ["relevance", "name", "price"];
const sortOrders: readonly ["asc", "desc"];

interface IGetProductsOptions {
export interface IGetProductsOptions {
  /**
   * Limits the number of products returned in a single, paginated response (Default: 50)
   */
  limit?: number;

  /**
   * Which page of the pagination you want to get. (Default: 1)
   */
  page?: number;

  /**
   * A freetext query used to filter the products.
   */
  query?: string;

  /**
  * Sorting options for the results.  E.g ["price", "asc"] or just "price";
  */
  sort?: typeof sortFields[number] | [typeof sortFields[number], typeof sortOrders[number]];

  /**
  * Get all products with this facet (property).
  */
  facet?: FacetValue | string;

  /**
  * An array of facets. Gets all products with these properties.
  */
  facets?: Array<FacetValue | string | undefined>;
}
```

### IGetProductsResponse

```ts
interface IGetProductsResponse {
  /**
   * Pagination object used to traverse the results.
   */
  pagination: Pagination;

  /**
   * a list of products. Represents one page of the results, use pagination.next to fetch next page of results.
   */
  products: Product[];
}
```

### IGetProductsByStoreOptions

```ts
interface IGetProductsByStoreOptions {
  /**
   * An array of facets. Gets all products with these properties.
   */
  facets?: Array<FacetValue | undefined>;

  /**
   * Get all products with this facet (property).
   */
  facet?: FacetValue;

  /**
   * Limits the number of products returned in a single, paginated response (Default: 50)
   */
  limit?: number;
}
```

### IGetProductsByStoreResponse

```ts
interface getProductsByStoreResponse extends IGetProductsResponse {
  /**
   * Pagination object used to traverse the results.
   */
  pagination: Pagination;

  /**
   * a list of products. Represents one page of the results, use pagination.next to fetch next page of results.
   */
  products: Product[];

  /**
   * The store number for the results
   */
  store: string;
}
```

### ISearchStoresOptions

```ts
interface ISearchStoresOptions {
  /**
   * Which page of the pagination you want to get. (Default: 1)
   */
  page?: number;

  /**
   * A freetext query used to search for stores. Note that only query OR nearLocation can be used at once, with query giving precidence.
   */
  query?: string;

  /**
   * Latitude and longitude coordinates used to search for stores near these coordinates. Note that only query OR nearLocation can be used at once, with query giving precidence.
   */
  nearLocation?: { lat: number; lon: number };

  /**
   * The number of stores returned in a single page. Default:
   */
  pageSize?: number;
}
```

### ISearchStoresResults

**Note: pagination is not present when searching by query.**

```ts
interface ISearchStoreResult {
  /**
   *  A list of stores. Represents one page of the results, use pagination.next to fetch next page of results.
   */
  stores: BaseStore[];

  /**
   * Pagination object used to traverse the results.
   */
  pagination?: Pagination;
}
```

## License

MIT-licensed. See LICENSE.
