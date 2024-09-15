import { IsNotEmpty, IsOptional, IsString } from "class-validator";

const sizeMatcher = /cache\/(\d+)x(\d+)[/-]/;

export type ImageSize = {
  maxWidth: number | null;
  maxHeight: number | null;
};

export type ImageProps = {
  format: string;
  altText?: string;
  imageType: string;
  url: string;
};

class ProductImage {
  @IsString()
  @IsNotEmpty()
  format: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  size: ImageSize | null;

  constructor(img: ImageProps) {
    this.format = img.format;
    this.description = img.altText;
    this.type = img.imageType;
    this.url = img.url;
    this.size = guessSizeFromUrl(img.url);
  }
}

ProductImage.prototype.toString = function () {
  return this.url;
};

function guessSizeFromUrl(url) {
  const [, width, height] = (url && url.match(sizeMatcher)) || [];
  return width && height
    ? ({
        maxWidth: Number(width),
        maxHeight: Number(height),
      } as ImageSize)
    : null;
}

export default ProductImage;
