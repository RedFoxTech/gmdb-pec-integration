import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Exclude()
export class UnitByRankingFindAllDto extends PaginationDto {
  @ApiProperty({
    type: String,
    description: "Search by immunobiologicals id",
    required: false,
  })
  @Expose()
  @IsString()
  immunobiologicalIds: string;

  @ApiProperty({
    type: String,
    description: "Search by unit ids",
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  units?: string;

  @ApiProperty({
    type: String,
    description: "Search by unit ranking position",
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  position?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  beginPatientAgeDate?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  endPatientAgeDate?: string;
}
