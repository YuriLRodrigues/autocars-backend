export interface PaginatedResult<T> {
  data: T;
  meta: {
    page: number;
    perPage: number;
    totalPages: number;
    totalCount: number;
  };
}
