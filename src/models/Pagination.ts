class Pagination {
  /**
   * The current page of the results.
   */
  currentPage: number;

  /**
   * The number of results in each page.
   */
  pageSize: number;

  /**
   * The total number of pages in the response.
   */
  totalPages: number;

  /**
   * The total number of items in the response.
   */
  totalResults: number;

  /**
   * Is true if there are more pages.
   */
  hasNext: boolean;

  /**
   * Is true if there previous pages.
   */
  hasPrevious: boolean;

  /**
   * A string of the sort options used.
   */
  sort: string;

  private fetcher: (opts?: any) => Promise<any>;
  private options: any;

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
