# vinmonopolet

**This is a fork of the original packge: https://www.npmjs.com/package/vinmonopolet**

Extracts information on products and stores from Vinmonopolet. 

## Installation
The `vinmonopolet` library can be installed using [npm](https://npmjs.org/):

```bash
npm install vinmonopolet
```

```bash
yarn add vinmonopolet
```

## Disclaimer & terms of service

Please see https://www.vinmonopolet.no/datadeling for the terms of service regarding usage of the data retrieved through this module. Please note that this module is not in any way endorsed by or affiliated with Vinmonopolet.

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
import vinmonopolet, {Facet} from 'vinmonopolet';

vinmonopolet.getProducts().then(response => {
  console.log(response.products) // Array of products
  console.log(response.pagination) // Info on pagination
})

// With options => get all beers sorted by price descending
vinmonopolet.getProducts({facet: Facet.category.BEER, sort: ["price", "desc"]}).then(response => {
  console.log(response.products) // Array of products
  console.log(response.pagination) // Info on pagination
})
```

### getProduct
### <code>getProduct(code: string)</code>
**Returns: <code>Promise<[PopulatedProduct](#PopulatedProduct)>**</code>

Gets a specific product by its code / id. Returns a fully populated product instance.

```ts
import vinmonopolet from 'vinmonopolet';

vinmonopolet.getProduct('1174701').then(product => {
  console.log(product)
})
```

### getProductsByStore
### <code>getProductsByStore(store_id: string)</code>
**Returns: <code>Promise<IGetProductsResponse>**</code>

Gets all products in stock in a given store. Takes the store id as parameter.

```ts
import vinmonopolet from 'vinmonopolet';

vinmonopolet.getProductsByStore('160').then(response => {
    console.log(response.products) // Array of products
  console.log(response.pagination) // Info on pagination
})
```

### searchProducts
### <code>searchproducts(query: string, options?: IGetProductOptions), defaults?: [Options](#IGetProductsOptions))</code>
**Returns: <code>Promise<[IGetProductsResponse](#IGetProductsResponse)>**</code>

Returns all products that matches the given query.

```ts
import vinmonopolet from 'vinmonopolet';

vinmonopolet.searchProducts('valpolicella', {sort: ['price', 'asc']}).then(response => {
  console.log(response.products) // Array of products
  console.log(response.pagination) // Info on pagination
})
```

### getProductByBarcode
### <code>getProductByBarcode(barcode: string)</code>
**Returns: <code>Promise<[PopulatedProduct](#PopulatedProduct)>**</code>

```ts
import vinmonopolet from 'vinmonopolet';

vinmonopolet.getProduct('5060154910315').then(product => {
  console.log(product)
})
```

### getProductsById
### <code>getProductsById(codes: string[])</code>
**Returns: <code>Promise<[PopulatedProduct[]](#PopulatedProduct)>**</code>

Gets all products given by the code array.

```js
import vinmonopolet from 'vinmonopolet';

vinmonopolet.getProductsById(['1174701', '1148714']).then(product => {
  console.log(product)
})
```

### getFacets
### <code>getFacets()</code>
**Returns: <code>Promise<[Facet[]](#PopulatedProduct)>**</code>

Gets all available facets. Facets are used to filter products on a given property, for example on country or product category. See [Facet](#Facet).

example usage:
```ts
import vinmonopolet from 'vinmonopolet';

vinmonopolet.getFacets().then(facets => {
  const countryFacet = facets.find(facet => facet.name === 'mainCountry')
  const norwayFacetValue = countryFacet.values.find(val => val.name === 'Norge')

  return vinmonopolet.getProducts({limit: 3, facet: norwayFacetValue})
}).then(response => {
  console.log(response.products) // 3 products from Norway
})
```

### getStores
### <code>getStores()</code>
**Returns: <code>Promise<Store[]>**</code>

Gets all Vinmonopolet stores.

```ts
import vinmonopolet from 'vinmonopolet';

vinmonopolet.getStores().then(stores => {
  console.log(stores)
})
```

### searchStores
### <code>searchStores(options?: [ISearchStoreOptions](#ISearchStoreOptions))</code>
**Returns: <code>Promise<[ISearchStoreResults](#ISearchStoreResults)>**</code>

Searches for stores with the given options. Returns a paginated results in descending relevancy, with a max result of 126 stores.
Note that the stores returned through this method may lack some properties, this is due to a limitation from vinmonopolet.

```ts
import vinmonopolet from 'vinmonopolet';

// Search by name
vinmonopolet.searchStores({query: 'Trondheim'}).then(res => {
  console.log(res.stores)
  console.log(res.pagination)
})

// Search by location
vinmonopolet.searchStores({nearLocation: {lat: 59.910478 , lon: 10.743937}}).then(res => {
  console.log(res.stores)
  console.log(res.pagination)
})
```

### stream.getProducts (Node only)
### <code>stream.getProducts()</code>
**Returns: <code>Promise<NodeJS.ReadableStream>**</code>

```ts
import vinmonopolet from 'vinmonopolet';

vinmonopolet
  .stream.getProducts().then((stream:NodeJS.ReadableStream) => {
    stream.on('data', function(product: StreamProduct) {
      console.log(product);
    })
    .on('end', function() {
      console.log('Done!');
    });
  })

```

### stream.getStores (Node only)
### <code>stream.getStoress()</code>
**Returns: <code>Promise<NodeJS.ReadableStream>**</code>

```ts
import vinmonopolet from 'vinmonopolet';

vinmonopolet
  .stream.getStores().then((stream:NodeJS.ReadableStream) => {
    stream.on('data', function(store: Store) {
      console.log(store);
    })
    .on('end', function() {
      console.log('Done!');
    });
  })

```

## Models

### Facet
Facets are used to filter products when getting products through searchProducts, getProducts or the likes. Example of facets are product country of origin (mainCountry), product category (mainCategory) and vintage (year).
Note that facets are not strongly typed, but there are however "static" facets for main product category supplied with this package. There are also exports of the static strings for this facet should you need it.

These static Facets can be used like this:
```ts
import vinmonopolet, { Facet, FacetCategory } from 'vinmonopolet';

async function approach1() {
  const productCategory = Facet.Category.CIDER, //Or MEAD, or WHITE_WINE etc...
  const {products, pagination} = await getProducts({facet: productCategory})
}

async function approach2() {
  const productCategory = Facet.Category[FacetCategory.CIDER],
  const {products, pagination} = await getProducts({facet: productCategory})
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
  name : string;
  /**
   * The product type (Øl, Mjød, Hvitvin etc)
   */
  productType : string;
  /**
   * The url to the vinmonopol.no product page
   */
  url : string;
  /**
   * The product price
   */
  price : number;
  /**
   * The product price per liter
   */
  pricePerLiter : number;
  /**
   * An array of product images
   */
  images: ProductImage[] = [];
  /**
   * The volume of the product.
   */
  volume = { value: 0, unit: "cl", formattedValue: "" };

  // Classification
  /**
   * The main category of the product (Øl, mjød, hvitvin etc..)
   */
  mainCategory: { name: string, code: string, url: string };
  /**
   * The sub category of the product (Porter & Stout, Rom, India Pale Ale etc..).
   */
  mainSubCategory: { name: string, code: string, url: string };
  /**
   * The country of origin.
   */
  mainCountry: { name: string, code: string, url: string };
  /**
   * The district the product is from. Might not always have values if no district is given.
   */
  district: {name: string, code: string, url: string }; 
  /**
   * The sub-district the product is from. Might not always have values if no sub-district is given.
   */
  subDistrict: {name: string, code: string, url: string }; 
  /**
   * The given product selection the product is available in (Bestillingsutvalget, Basisutvalget etc).
   */
  productSelection: string;

  // Stock/store-related
  /**
   * information regarding the product availability either in stores or through mail.
   */
  availability: {
    deliveryAvailability: { available: boolean, mainText: string },
    storeAvailability: { available: boolean, mainText: string }
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

Populated Product contains all the BaseProduct fields as well as a handful new ones. You can populate a [BaseProduct](#baseproduct) by calling the *populate()* command, which returns a new instance of PopulatedProduct.

```ts
class PopulatedProduct extends BaseProduct {
  // Detailed product info
  /**
   * The abv (alcohol by volume) of the product.
   */
  abv : number;
  /**
   * If any, the allergens of the product.
   */
  allergens : string;
  /**
   * a bool representing if the product is bioDynamic.
   */
  bioDynamic : boolean;
  /**
   * A string representation of the products color.
   */
  color : string;
  /**
   * A bool representing if the product is eco
   */
  eco : boolean;
  /**
   * A bool representing if the product has environmental packaging.
   */
  environmentalPackaging : boolean;
  /**
   * A bool representing if the product is expired.
   */
  expired : boolean;
  /**
   * A bool representing if the product is fairtrade.
   */
  fairTrade : boolean;
  /**
   * A bool representing if the product contains gluten.
   */
  gluten : boolean;
  /**
   * A set of Foodpairing objects. Describes what food the product pairs well with.
   */
  foodPairing: FoodPairing[] | null = null;
  /**
   *  A bool representing if the product is kosher.
   */
  kosher : boolean;
  /**
   *  A string representation of whether the product can be aged further.
   */
  storable : string;
  /**
   *  A string representation of the container type and material.
   */
  containerType : string;
  /**
   *  A string representation of the products taste.
   */
  taste : string;
  /**
   *  A string representation of the products aroma.
   */
  aroma : string;

  // Ingredients
  /**
   *  An array of RawMaterial objects.
   */
  rawMaterial: RawMaterial[] | null = null;
  /**
   *  A string or number representing the amount of sugar per litre in the product.
   */
  sugar: string | number : number;
  /**
   * The acidity of the product in percentage.
   */
  acid : number;
  /**
   * The amounts of tannins in percentage
   */
  tannins : number;

  // Tasting notes
  /**
   * The bitterness of the product in percentage.
   */
  bitterness : number;
  /**
   * The freshness of the product in percentage.
   */
  freshness : number;
  /**
   * The fullness of the product in percentage.
   */
  fullness : number;
  style = defaultCategory;

  // meta
  /**
   * The minimum age limit in order to buy this product.
   */
  ageLimit = 18;

  // These tend to not be set
  description : string;
  summary : string;
  method : string;

  // Producer/distributer/importer etc
  distributor : string;
  distributorId : number;
  wholesaler : string;
  vintage: number | null;
```

### Store



```ts
{
  name: 'Oslo, Briskeby',
  streetAddress: 'Briskebyveien 48',
  streetZip: '0258',
  streetCity: 'OSLO',
  postalAddress: 'Postboks  123',
  postalZip: '0258',
  postalCity: 'OSLO',
  phoneNumber: '04560',
  // Store category between 1 and 7, or independent (Norwegian)
  // The higher the number, the better the product selection
  category: 'Kategori 6',
  // Coordinates (longitude, latitude)
  gpsCoordinates: [10.7169757, 59.9206481],

  // Opening hour details for the given week
  // Numbers in `opens` and `closes` are minutes since midnight.
  // In other words: 600 means 10AM, 1080 means 6PM
  // Any null values means it's closed
  weekNumber: 20,
  openingHoursMonday: {opens: 600, closes: 1080},
  openingHoursTuesday: {opens: 600, closes: 1080},
  openingHoursWednesday: {opens: 600, closes: 1080},
  openingHoursThursday: null,
  openingHoursFriday: {opens: 540, closes: 1080},
  openingHoursSaturday: {opens: 540, closes: 900},

  // Opening hour details for the next week
  weekNumberNext: 21,
  openingHoursNextMonday: {opens: 600, closes: 1080},
  openingHoursNextTuesday: {opens: 600, closes: 1080},
  openingHoursNextWednesday: {opens: 600, closes: 1080},
  openingHoursNextThursday: {opens: 600, closes: 1080},
  openingHoursNextFriday: {opens: 540, closes: 1080},
  openingHoursNextSaturday: null
}
```

## Types 

### IGetProductsOptions

```ts
const sortFields: readonly ["relevance", "name", "price"];
const sortOrders: readonly ["asc", "desc"];

interface IGetProductsOptions {
  limit?: number;
  page?: number;
  query?: string;
  sort?: typeof sortFields[number] | [typeof sortFields[number], typeof sortOrders[number]]; // E.g ["price", "asc"] or just "price";
  facet?: FacetValue | string;
  facets?: Array<FacetValue | string | undefined>;
}
```

### IGetProductsResponse
```ts
interface IGetProductsResponse {
    pagination: Pagination;
    products: Product[];
}
```

## License

MIT-licensed. See LICENSE.
