import { PaginationDto } from "../dto/pagination.dto";

export const queryPaginationBuilder = (
  query: string,
  paginationDto: PaginationDto
) => {
  const { page, pageSize } = paginationDto;
  let queryResult = query;

  if (page !== undefined || pageSize !== undefined)
    queryResult += `LIMIT ${pageSize ?? 0} OFFSET ${((page ?? 1) - 1) * pageSize}`;

  return queryResult;
};
