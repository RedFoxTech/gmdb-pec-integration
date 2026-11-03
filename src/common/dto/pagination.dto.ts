import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsOptional, IsInt, Min, IsPositive, IsIn } from "class-validator";

export class PaginationDto {
  @ApiProperty({
    type: "number",
    description: "Page of type number",
    example: 1,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @IsPositive()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    type: "number",
    description: "Page Size of type number",
    example: 10,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize?: number;

  @ApiProperty({
    type: "string",
    description: "Sort order of type string",
    example: "asc",
  })
  @Expose()
  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc" = "asc";

  @ApiProperty({
    type: "string",
    description: "Sort by of type string",
    // example: 'createdAt',
  })
  @Expose()
  @IsOptional()
  @IsIn(["name", "email", "createdAt"])
  sortBy?: string = "createdAt";
}
