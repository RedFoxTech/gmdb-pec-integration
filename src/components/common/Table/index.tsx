"use client";

import {
  Box,
  TableContainer,
  Table as BaseTable,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TablePagination,
} from "@mui/material";
import { ReactElement } from "react";
import Text from "../Text";
import typography from "@/shared/theme/typography-theme";
import theme from "@/shared/theme/material-theme";
import Checkbox from "../Checkbox";

export type TableHeader<T> = {
  label: string;
  selector: (item: T) => any;
  customComponent?: (item: T) => ReactElement;
  minWidth?: string;
};

export type TableItems = {
  [field: string]: any;
};

export type PaginationProps = {
  rowsPerPageOptions: number[];
  count: number;
  rowsPerPage: number;
  page: number;
  onPageChange: (value: number) => void;
  onRowsPerPageChange: (value: number) => void;
};

export type TableProps<T> = {
  "data-testid"?: string;
  customId?: string;
  header: TableHeader<T>[];
  items: T[];
  tableAriaLabel: string;
  emptyMessage?: string;
  disabled?: boolean;
  checkboxSelection?: boolean;
  selectedItems?: T[];
  pagination?: PaginationProps;
  loading?: boolean;
  columnLength?: number;
  onSelectItem?: (selectedItems: T[], selectedItem?: T) => void;
  onClick?: (data: T, index?: number) => void;
};

const Table = <Values extends TableItems = TableItems>({
  "data-testid": dataTestid,
  customId,
  header,
  items,
  tableAriaLabel,
  emptyMessage,
  disabled,
  checkboxSelection,
  selectedItems,
  pagination,
  loading,
  columnLength = 1,
  onSelectItem,
  onClick,
}: TableProps<Values>) => {
  const handleCheckItem = (data: any) => {
    if (selectedItems) {
      const arrayCopy = [...selectedItems];
      const index = selectedItems.findIndex(
        (item) => item[customId ?? "id"] === data[customId ?? "id"]
      );
      if (index >= 0) {
        arrayCopy.splice(index, 1);
      } else {
        arrayCopy.push(data);
      }
      onSelectItem?.(arrayCopy, data);
    }
  };

  return (
    <div>
      <Box>
        <TableContainer data-testid={`${dataTestid}-${testId.TABLE_CONTAINER}`}>
          <BaseTable
            size="medium"
            sx={{ minWidth: 650 }}
            aria-label={tableAriaLabel}
          >
            <TableHead>
              <TableRow
                sx={{
                  "td, th": { border: 0 },
                }}
              >
                {checkboxSelection && (
                  <TableCell sx={{ p: 0 }}>
                    <Checkbox
                      checked={selectedItems?.length === items.length}
                      onChange={(_, checked) =>
                        onSelectItem?.(checked ? items : [])
                      }
                    />
                  </TableCell>
                )}
                {header.map((item) => {
                  return (
                    <TableCell
                      key={item.label}
                      sx={{
                        minWidth: item.minWidth || undefined,
                      }}
                    >
                      <Text
                        color={theme.palette.grey[900]}
                        {...typography.paragraph.r1}
                      >
                        {item.label}
                      </Text>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={columnLength}>
                    <Typography
                      fontSize={16}
                      textAlign="center"
                      fontWeight={600}
                      color={theme.palette.primary.main}
                    >
                      Carregando...
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {items.length > 0 &&
                  items.map((row, index) => (
                    <TableRow
                      data-testid={`${dataTestid}-${testId.TABLE_ROW}-${index}`}
                      key={row[customId ?? "id"]}
                      hover={!disabled && !!onClick}
                      role={!onClick ? "button" : undefined}
                      tabIndex={onClick ? 0 : -1}
                      sx={{
                        cursor: !disabled && onClick ? "pointer" : "default",
                      }}
                      onClick={() => !disabled && onClick?.(row, index)}
                    >
                      {checkboxSelection && (
                        <TableCell sx={{ p: 0 }}>
                          <Checkbox
                            checked={selectedItems?.some(
                              (data) =>
                                data[customId ?? "id"] === row[customId ?? "id"]
                            )}
                            onChange={() => handleCheckItem(row)}
                          />
                        </TableCell>
                      )}
                      {header.map((item, cellIndex) => (
                        <TableCell
                          data-testid={`${dataTestid}-${testId.TABLE_CELL}-${index}-${cellIndex}`}
                          key={`item-${row[customId ?? "id"]}-${cellIndex}`}
                          sx={{ borderWidth: 1 }}
                        >
                          {item.customComponent?.(row) || (
                            <Text
                              color={theme.palette.grey[900]}
                              {...typography.paragraph.l1}
                            >
                              {item.selector(row)}
                            </Text>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={header.length}>
                      <Box textAlign={"center"}>
                        <Typography fontSize={16}>
                          {emptyMessage || "Sem dados"}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </BaseTable>
          {pagination && (
            <TablePagination
              rowsPerPageOptions={pagination.rowsPerPageOptions}
              component="div"
              count={pagination.count}
              rowsPerPage={pagination.rowsPerPage}
              page={pagination.page - 1}
              onPageChange={(_, e) => pagination.onPageChange(e + 1)}
              onRowsPerPageChange={(e) =>
                pagination.onRowsPerPageChange(
                  e.target.value as unknown as number
                )
              }
            />
          )}
        </TableContainer>
      </Box>
    </div>
  );
};

export default Table;

export enum testId {
  TABLE_CONTAINER = "Table-container",
  TABLE_ROW = "Table-row",
  TABLE_CELL = "Table-cell",
}
