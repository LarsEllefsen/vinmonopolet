module.exports = {
  // Models
  Category: require('./models/Category'),
  Facet: require('./models/Facet'),
  FacetValue: require('./models/FacetValue'),
  FoodPairing: require('./models/FoodPairing'),
  Product: require('./models/Product'),
  ProductImage: require('./models/ProductImage'),
  ProductStatus: require('./models/ProductStatus'),
  RawMaterial: require('./models/RawMaterial'),
  Store: require('./models/Store'),

  // Searchers
  getFacets: require('./retrievers/getFacets'),
  getProducts: require('./retrievers/getProducts'),
  searchProducts: require('./retrievers/searchProducts'),
  getProduct: require('./retrievers/getProduct'),
  getProductByBarcode: require('./retrievers/getProductByBarcode'),

  // Stream interface
  stream: require('./stream')
}
