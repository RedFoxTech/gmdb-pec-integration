export interface Paginated<T> {
  data: T[];
  meta?: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}
