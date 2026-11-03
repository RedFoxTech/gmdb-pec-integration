import { sqlText } from "src/common/sql";
import { PrismaService } from "src/prisma/city-hall/prisma.service";
import { PrismaService as SourcePrismaService } from "src/prisma/source/prisma.service";
import { AgeRangeEnum } from "./ageRange.enum";
import { PaginationDto } from "./dto/pagination.dto";
import { Paginated } from "./paginated.interface";
import { format, isWithinInterval, parse } from "date-fns";
import { queryPaginationBuilder } from "./query-builder/pagination";
import { Logger } from "@nestjs/common";
const fs = require("fs");
const csv = require("csv-parser");

export const IgnoreFieldsOnFind = [
  "page",
  "pageSize",
  "sortOrder",
  "sortBy",
  "includes",
  "active",
];

export class Utils {
  async findAllResponser<T>(
    model,
    paginationDto: PaginationDto,
    where: any,
    include?: any,
  ): Promise<Paginated<T>> {
    const { page, pageSize, sortBy, sortOrder } = paginationDto;
    const skip = page && pageSize ? (page - 1) * pageSize : undefined;
    const orderBy = sortBy ? { [sortBy]: sortOrder || "asc" } : undefined;

    const [totalItems, data] = await Promise.all([
      model.count({ where }),
      model.findMany({
        where,
        include,
        orderBy,
        skip,
        take: pageSize,
      }),
    ]);
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data,
      meta: {
        page,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  }
  async findAllByQueryResponse<T>(
    service: PrismaService | SourcePrismaService,
    query: string,
    paginationDto: PaginationDto,
    queryValues: Array<any[]> = [],
  ): Promise<Paginated<T>> {
    // const [countData, data] = await Promise.all([
    //   service.$queryRawUnsafe(
    //     `SELECT COUNT(*) FROM (${query}) as count`,
    //     ...queryValues
    //   ) as Promise<Array<{ count: string }>>,
    //   service.$queryRawUnsafe(
    //     queryPaginationBuilder(query, paginationDto),
    //     ...queryValues
    //   ) as Promise<T>,
    // ]);

    const data = (await service.$queryRawUnsafe(
      queryPaginationBuilder(query, paginationDto),
      ...queryValues,
    )) as T[];

    let countData = [{ count: data.length.toString() }];

    if (
      paginationDto.page !== undefined &&
      paginationDto.pageSize !== undefined
    ) {
      countData = (await service.$queryRawUnsafe(
        `SELECT COUNT(*) FROM (${query}) as count`,
        ...queryValues,
      )) as Array<{ count: string }>;
    }

    const { page = 0, pageSize = 0 } = paginationDto;
    const totalItems = parseInt(countData[0]?.count, 10);
    const totalPages = pageSize === 0 ? 0 : Math.ceil(totalItems / pageSize);
    return {
      data,
      meta: {
        page,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  }
}

export function generatePassword(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  return password;
}

export function formatISODate(dateString: string | Date) {
  return format(dateString, "yyyy-MM-dd'T'HH:mm:ssXX");
}

export function obfuscateString(str, visibleCharCount) {
  if (!str) return "";
  const visible = Math.min(visibleCharCount, str.length);
  return str.slice(0, visible) + "*".repeat(str.length - visible);
}

export function obfuscateEmail(email, visibleCharCount) {
  if (!email || !email.includes("@")) return "";
  const [username, domain] = email.split("@");
  const obfuscatedUsername = obfuscateString(username, visibleCharCount);
  // const obfuscatedDomain = obfuscateString(domain, visibleCharCount);
  return `${obfuscatedUsername}@${domain}`;
}

export function obfuscatePhone(phone, visibleCharCount) {
  if (!phone || phone.length <= visibleCharCount) return phone;
  const visible = Math.min(visibleCharCount, phone.length);
  return "*".repeat(phone.length - visible) + phone.slice(-visible);
}

export function isDateBetween(date, startDate, endDate, ignoreYear = false) {
  const parsedDate =
    typeof date === "string" ? parse(date, "yyyy-MM-dd", new Date()) : date;
  const parsedStartDate =
    typeof startDate === "string"
      ? parse(startDate, "yyyy-MM-dd", new Date())
      : startDate;
  const parsedEndDate =
    typeof endDate === "string"
      ? parse(endDate, "yyyy-MM-dd", new Date())
      : endDate;

  if (ignoreYear) {
    // Normalize all dates to the same year
    const year = 2000; // Arbitrary year
    const normalize = (d) =>
      parse(format(d, "MM-dd"), "MM-dd", new Date(year, 0, 1));
    const normalizedDate = normalize(parsedDate);
    const normalizedStartDate = normalize(parsedStartDate);
    const normalizedEndDate = normalize(parsedEndDate);

    return isWithinInterval(normalizedDate, {
      start: normalizedStartDate,
      end: normalizedEndDate,
    });
  }

  return isWithinInterval(parsedDate, {
    start: parsedStartDate,
    end: parsedEndDate,
  });
}

export function rangeByUserAgeType(value: AgeRangeEnum) {
  switch (value) {
    case AgeRangeEnum.NINE_TO_ELEVEN:
      return { min: 12 };
    case AgeRangeEnum.TWELVE_TO_FOURTEEN:
      return { min: 15, max: 12 };
    default:
      return { max: 15 };
  }
}

export const csvToJson = (csvFilePath: string, jsonFilePath: string) => {
  const outputStream = fs.createWriteStream(jsonFilePath);
  outputStream.write("[\n"); // Inicia o JSON

  let firstLine = true;

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      if (!firstLine) {
        outputStream.write(",\n"); // Adiciona vírgula entre os objetos JSON
      }
      outputStream.write(JSON.stringify(row));
      firstLine = false;
    })
    .on("end", () => {
      outputStream.write("\n]"); // Fecha o JSON
      outputStream.end();
      console.log(`Conversão concluída! JSON salvo em: ${jsonFilePath}`);
    })
    .on("error", (error) => console.error("Erro ao processar o CSV:", error));
};

export function groupAgeLabelById(id: number) {
  switch (id) {
    case 0:
      return "9 a 11 anos";
    case 1:
      return "12 a 14 anos";
    default:
      return "15 a 19 anos";
  }
}

export const groupAgeLabelByAge = (age: number) => {
  if (age <= 11) {
    return "9 a 11 anos";
  }
  if (age <= 14) {
    return "12 a 14 anos";
  }

  return "15 a 19 anos";
};

export const normalize = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

export const normalizeQueryToStr = (text: string, separator = "|") => {
  return text
    .split(separator)
    .map((n) => `'${sqlText(n)}'`)
    .join(",");
};
