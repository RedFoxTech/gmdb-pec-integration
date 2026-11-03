import { PaginationDto } from "../dto/pagination.dto";

export const queryPaginationByWhereBuilder = (
  query: string,
  key: string,
  paginationDto: PaginationDto
) => {
  const { page, pageSize } = paginationDto;
  if (page !== undefined || pageSize !== undefined) {
    return `SELECT * FROM (${query}) as tb WHERE ${key} BETWEEN ${pageSize * page - pageSize} AND ${pageSize * page}`;
  }

  return query;
};
