import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";

@Exclude()
export class PatientByImmunobiologicalFindAllForExportDto {
  @ApiProperty({
    type: Boolean,
    description: "Search by vaccinated",
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return undefined;
  })
  vaccinated?: boolean;

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
    description: "Search by patients ids",
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  patientsIds?: string;

  @ApiProperty({
    type: String,
    description: "Search by units id",
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  units?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  beginAgeDate?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  endAgeDate?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  acs?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  patientName?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  beginVaccinationDate?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  endVaccinationDate?: string;
}
