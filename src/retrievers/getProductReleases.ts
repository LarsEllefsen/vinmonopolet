import { VINMONOPOLET_SEARCH_URL } from "../constants";
import ProductRelease from "../models/ProductRelease";
import { GET } from "../util/GET";

interface ProductReleaseDTO {
  title: string;
  label: string;
  primaryCategoryName: string;
  listImageUrl: string;
}

interface ISearchUpcomingReleasesDTO {
  contentSearchResult: {
    results: ProductReleaseDTO[];
  };
}

function getAbsoluteURL(path: string) {
  return path.startsWith("/")
    ? "www.vinmonopolet.no" + path
    : "www.vinmonopolet.no/" + path;
}

function tryToGetReleaseDate(title: string) {
  const splitTitle = title.split(":");
  if (splitTitle.length < 2) {
    return undefined;
  }

  return splitTitle[0];
}

function toProductRelease(dto: ProductReleaseDTO) {
  return new ProductRelease(
    dto.title,
    dto.primaryCategoryName,
    getAbsoluteURL(dto.label),
    getAbsoluteURL(dto.listImageUrl),
    tryToGetReleaseDate(dto.title)
  );
}

async function getProductReleases() {
  const { contentSearchResult } = await GET<ISearchUpcomingReleasesDTO>(
    VINMONOPOLET_SEARCH_URL,
    {
      queryParams: {
        categoryCode: "lanseringer",
      },
    }
  );

  return contentSearchResult.results.map(toProductRelease);
}

export default getProductReleases;
