export interface SelectOption {
  value?: string | number | null;
  label: string;
  [x: string]: any;
}

export interface RadiosOptions {
  value?: string | number;
  label: string;
  [x: string]: any;
}

export interface ListMeta {
  page: number;
  totalItems: number;
  totalPages?: number;
}

export interface FileDto {
  base64: string;
  name: string;
  type: string;
}

export interface FileEntity {
  id: string;
  name: string;
  customName: string;
  url: string;
  public: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface PaginationEntity<T> {
  data: T[];
  meta: ListMeta;
}

export interface PaginationDto {
  page?: number;
  pageSize?: number;
  sortOrder?: "asc" | "desc";
  sortBy?: string;
}
