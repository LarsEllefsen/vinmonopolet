import { IsNotEmpty, IsOptional, IsString } from "class-validator";

interface ICategory {
  code: string;
  name: string;
  url: string;
}

class Category {
  @IsOptional()
  @IsString()
  code: string | null;

  @IsOptional()
  @IsString()
  name: string | null;

  @IsOptional()
  @IsString()
  url: string | null;

  constructor({ code, name, url }: ICategory) {
    this.code = code ?? null;
    this.name = name ?? null;
    this.url = url ?? null;
  }
}

export default Category;
