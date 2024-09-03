import { IAvailability } from "../models/Product";
import { Volume } from "../models/Volume";
import { capitalize } from "./capitalize";
import { getTextContent } from "./getTextContent";

export class ProductDocument {
  document: Document;

  constructor(document: Document) {
    this.document = document;
  }

  getName() {
    return getTextContent(this.document, ".product__name");
  }

  getABV() {
    const abvString = getTextContent(this.document, "[aria-label*='prosent']");
    const split = abvString.split("%");
    if (split.length != 2) {
      throw new Error("Unable to get ABV from string " + abvString);
    }

    return parseFloat(split[0].replace(",", "."));
  }

  getProductType() {
    const productTypeString = getTextContent(
      this.document,
      ".product__category-name"
    );
    const split = productTypeString.split("-");

    return {
      mainCategory: capitalize(split[0].trim()),
      mainSubCategory: split.length === 2 ? capitalize(split[1].trim()) : null,
    };
  }

  getPrice() {
    const priceString = getTextContent(this.document, ".product__price");
    const split = priceString.split("Kr");
    if (split.length != 2) {
      throw new Error("Unable to get price from string " + priceString);
    }

    return parseFloat(split[1].trim().replace(",", "."));
  }

  getVolume(): Volume {
    const volumeString = getTextContent(this.document, ".amount");
    const split = volumeString.split(" ");
    if (split.length != 2) {
      throw new Error("Unable to get volume from string " + volumeString);
    }

    return new Volume(
      parseFloat(split[0].trim().replace(",", ".")),
      volumeString,
      split[1].trim()
    );
  }

  getProductImages(): string[] {
    const pictureElement = this.document.querySelector(
      ".product__image-container > picture"
    );
    if (pictureElement === null) {
      throw new Error(
        "Unable to get product images: Expected query .product__image-container > picture to exist"
      );
    }

    if (pictureElement.childElementCount === 0) {
      throw new Error(
        "Unable to get product images: Expected query .product__image-container > picture to have children"
      );
    }

    const imageSources = Array.from(pictureElement.children);
    const sources = imageSources
      .map((source) => {
        if ("srcset" in source) {
          const srcset = source.srcset as string;
          return srcset.trim();
        }
        return "";
      })
      .filter((image) => image);

    return sources;
  }

  getBuyable() {
    return this.document.querySelector("div[class^='not-buyable']") === null
      ? true
      : false;
  }

  getCountry() {
    const countryElement = this.document.querySelector(".product__region");
    if (countryElement == null) {
      throw new Error("Unable to get country from query .product__region");
    }
    const children = Array.from(countryElement.children);

    if (children.length === 0) {
      throw new Error(
        "Unable to get country: Expected element with class .product__region to have at least 1 child element."
      );
    }

    if (children[0].textContent === null) {
      throw new Error(
        "Unable to get country: Expected first child element of .product__region to have text content"
      );
    }

    return {
      country: children[0].textContent,
      region: children.length > 1 ? children[1].textContent : null,
      district: children.length > 2 ? children[2].textContent : null,
    };
  }

  getContainerType() {
    return this.getPropertyFromList(
      this.document.querySelector("ul.product__tab-list"),
      "Emballasjetype"
    );
  }

  getProductSelection() {
    return this.getPropertyFromList(
      this.document.querySelector("ul.product__tab-list"),
      "Utvalg"
    );
  }

  getProductAvailability() {
    const availabilityElements = this.document.querySelectorAll(
      ".product-stock-status-line-text"
    );

    if (availabilityElements.length !== 2) {
      throw new Error("Unable to get availability for product");
    }

    const availableToBuyInStore =
      availabilityElements[0].children[0].textContent
        ?.toLocaleLowerCase()
        .includes("sluttsolgt");
    const storeAvailabilityText =
      availabilityElements[0].children[0].textContent;
    if (storeAvailabilityText === null) {
      throw new Error("Unable to get store availability text");
    }

    const avaialbleToBuyThroughPost =
      availabilityElements[1].children[1].textContent
        ?.toLocaleLowerCase()
        .includes("sluttsolgt");
    const postAvailabilityText =
      availabilityElements[1].children[1].textContent;
    if (storeAvailabilityText === null) {
      throw new Error("Unable to get store availability text");
    }

    return {
      storesAvailability: {
        availableForPurchase: availableToBuyInStore,
        text: storeAvailabilityText,
      },
      deliveryAvailability: {
        availableForPurchase: avaialbleToBuyThroughPost,
        text: postAvailabilityText,
      },
    } as IAvailability;
  }

  private getPropertyFromList(
    listElement: HTMLUListElement | null,
    property: string
  ) {
    if (listElement === null) {
      throw new Error("listElement was null");
    }
    const children = Array.from(listElement.children);
    const propertyElement = children.find(
      (x) =>
        x.hasChildNodes() &&
        Array.from(x.children).some(
          (y) => y.textContent?.toLowerCase() === property.toLowerCase()
        )
    );

    if (propertyElement === undefined) {
      throw new Error("Property " + property + " not found");
    }

    if (propertyElement.childElementCount != 2) {
      throw new Error(
        "Expected property element to have exactly 2 elements. Cannot determine property"
      );
    }

    const propertyValue = propertyElement.lastChild?.textContent;

    if (!propertyValue) {
      throw new Error("Unable to get property " + property);
    }

    return propertyValue;
  }
}
