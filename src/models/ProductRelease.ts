class ProductRelease {
  title: string;
  primaryCategoryName: string;
  url: string;
  image: string;
  releaseDate: string | undefined;

  constructor(
    title: string,
    primaryCategoryName: string,
    url: string,
    image: string,
    releaseDate: string | undefined
  ) {
    this.title = title;
    this.primaryCategoryName = primaryCategoryName;
    this.url = url;
    this.image = image;
    this.releaseDate = releaseDate;
  }
}

export default ProductRelease;
