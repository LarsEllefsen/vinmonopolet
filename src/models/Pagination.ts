class Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;
  hasNext: boolean;
  hasPrevious: boolean;
  sort: string;

  private fetcher: (opts?: any) => any;
  options: any;

  constructor(paging, options, fetcher: () => any) {
    this.currentPage = paging.currentPage;
    this.pageSize = paging.pageSize;
    this.totalPages = paging.totalPages;
    this.totalResults = paging.totalResults;
    this.hasNext = paging.currentPage < this.totalPages;
    this.hasPrevious = paging.currentPage > 0;
    this.sort = paging.sort;

    this.fetcher = fetcher;
    this.options = options;
  }

  next() {
    return this.fetcher(
      Object.assign({}, this.options, { page: this.options.page + 1 })
    );
  }

  previous() {
    return this.fetcher(
      Object.assign({}, this.options, {
        page: Math.max(0, this.options.page - 1),
      })
    );
  }
}

export default Pagination;
