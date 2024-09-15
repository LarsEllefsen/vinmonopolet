export interface ImageDTO {
  format: string;
  imageType: string;
  url: string;
  altText?: string;
}

export interface CategoryDTO {
  name: string;
  code?: string;
  searchQuery?: string;
  url?: string;
}
