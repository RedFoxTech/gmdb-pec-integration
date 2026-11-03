import { BadRequestException } from "@nestjs/common";

// The query builders interpolate filters into SQL text. These helpers keep the
// generated SQL identical for every valid filter and reject or neutralize
// anything that could change the query structure.

const INTEGER = /^\s*-?\d+\s*$/;

// For values placed inside single quotes ('...')
export const sqlText = (value: string): string => {
  const text = String(value);
  // Backslashes only matter when standard_conforming_strings is off; no valid filter contains one
  if (text.includes("\\") || text.includes("\0")) {
    throw new BadRequestException("Invalid filter value");
  }
  return text.replace(/'/g, "''");
};

// For a single integer placed without quotes
export const sqlInteger = (value: string | number): string => {
  const text = String(value);
  if (!INTEGER.test(text)) {
    throw new BadRequestException("Invalid numeric filter");
  }
  return text;
};

// For a "|"-separated integer list placed without quotes, e.g. IN (1,2,3)
export const sqlIntegerList = (value: string, separator = "|"): string => {
  const text = String(value);
  text.split(separator).forEach((item) => sqlInteger(item));
  return text.split(separator).join(",");
};
