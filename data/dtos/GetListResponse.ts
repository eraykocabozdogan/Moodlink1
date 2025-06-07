export interface GetListResponse<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
