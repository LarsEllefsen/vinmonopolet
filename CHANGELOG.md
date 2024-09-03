#Changelog

## [5.0.0]

- Fixed broken api endpoints.

### Breaking changes

- Removed getProductCount
- Facet option in getProduct is replaced by facets.
- Removed searchProducts. Replaced by getProducts with query option.

## [4.0.0]

### Breaking changes

- Availability is renamed to ProductAvailability to match changes in the Vinmonopolet API.

## [3.1.0]

### Changed

- Adjusted product availability to match changes in the Vinmonopolet api.

## [3.0.0]

### Changed

- getAllStores now uses the vinmonopolet api instead of the stream api.
- Adjusted BaseStore and PopulatedStore to match the new api.

### Breaking changes

- Removed stream package. Vinmonopolet no longer maintains a csv of products and stores.
- getStores now returns BaseStore instead of PopulatedStore. You will need to call .populate() on the BaseStore if you want a PopulatedStore.
- Adjusted BaseStore and PopulatedStore:
  - StreetZip is now called zip
  - StreetCity is now called city
  - Removed phoneNumber, weekNumber, weekNumberNext postalAddress postalZip and postalCity
  - openingHours are now in an array called openingHours instead of individual properties.

## [2.1.1]

### Changed

- Made UpcomingProduct a FacetValue object

## [2.1.0]

#### Added

- Added getProductReleases
- Added upcomingProduct facet

### Breaking changes

- Minimum node version is now v18

## [2.0.4]

#### Added

- GetProductsByStore now accepts page option.
- Paginatiation now has correct return type for next and previous functions.

### Changed

- GetProductsByStore store parameter is now statically typed as a string.

## [2.0.0]

Changed package export method to individual exports so that you no longer need to import the whole package.

### Breaking changes

The package no longer exports a default object, but rather individual exports.

## [1.0.0]

A complete "rewrite" (or translation if you will) to TypeScript.

### Breaking changes IF YOU ARE COMING FROM THE ORGINAL VINMONOPOLET PACKAGE:

- Product: Removed property containerSize in favor of Volume to more closely mirror the api.
- Product: Removed categories property as it no longer exists.
- Product: Removed pointOfService property, as it no longer exists.
- Split Product into BaseProduct, StreamProduct and PopulatedProduct. Import for the old Product is now BaseProduct, and populate returns a new instance of PopulatedProduct instead.
- Product: removed isComplete(), as populate returns a new object instead.
- Removed onlyCount option from getProducts. It is now its own function getProductCount.
- Removed getStores as vinmonopolet now only returns a maximum of 126 stores. The old functionality is now effectively split in two new APIs:
  - getAllStores: Takes no arguments and returns all stores without pagination.
  - searchStores: Takes the same arguments as the old getStores (And effectively the same functionality) but will never be able to return more than 126 stores.
- Store model is changed to better reflect the new API:
  - Like products Store is now split into BaseStore and PopulatedStore. This is due to changes from vinmonopolet.
  - getAllStores will return PopulatedProduct w
- Streams now return a promise you need to resolve before you can interact with the stream.
- stream.getProducts now only returns name and code as per april 2021. This is due to changes in data from Vinmonopolet.
- Minimum Node version is now 14.

### Added

- Product: Added allergens property.
- Product: Added style property.
- Facets: Added static strings to generate product category facets.
- GetProductCount function that returns the count of a given getProducts query.
- PopulatedProduct model.
- GetAllStores and SearchStores functions (see Breaking Changes).
- GetProductsByStore now returns the store number along pagination and products.
- SearchStore function.

### Changed

- GetStores is completely rewritten. The old api is no longer in use, and the current one returns a maximum of 126 stores in total.
  Instead we just use the stream api and make it more "synchronous" for those who dont want to use the stream implementation.
- Facet: Facet title now maps to the "code" property instead of the name property. This should restore the old functionality where title now maps to the english name.
