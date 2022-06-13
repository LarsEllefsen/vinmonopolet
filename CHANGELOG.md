#Changelog

## [6.0.0] - date here

A complete "rewrite" (or translation if you will) to TypeScript.

### Breaking changes
- Product: Removed property containerSize in favor of Volume to more closely mirror the api.
- Product: Removed categories property as it no longer exists.
- Product: removed isComplete(), as populate returns a new object instead.
- Removed onlyCount option from getProducts. It is now its own function getProductCount.
- Minimum Node version is now 12.

### Added
- Product: Added allergens property.
- Product: Added style property.
- Facets: Added static strings to generate product category facets.

### Changed
- GetStores is completely rewritten. The old api is no longer in use, and the current one returns a maximum of 126 stores in total. 
Instead we just use the stream api and make it more "synchronous" for those who dont want to use the stream implementation.
- Simplified stream api.

### Removed
- Removed the Request package as it is deprecated. Opted to use node-fetch instead.
- Removed through2 package as it is deprecated. Opted to use built-in node stream transform.