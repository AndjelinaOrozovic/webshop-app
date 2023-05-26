export interface IResponsePage<T> {
  currentPage: number;
  pageItems: T[];
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
