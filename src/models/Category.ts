interface ICategory {
  code: string;
  name: string;
  url: string;
}

class Category {
  code: string | null;
  name: string | null;
  url: string | null;

  constructor({ code, name, url }: ICategory) {
    this.code = code ?? null;
    this.name = name ?? null;
    this.url = url ?? null;
  }
}

export default Category;
