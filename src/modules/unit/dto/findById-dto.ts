import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";
import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Exclude()
export class UnitsByIdDto {
  @ApiProperty({
    type: String,
    description: "Search by unit ids",
    required: false,
  })
  @Expose()
  @IsString()
  ids: string;
}
