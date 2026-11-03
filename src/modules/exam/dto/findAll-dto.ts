import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { PatientGenderEnum } from "src/modules/patient/patientGender.enum";

@Exclude()
export class ExamFindAllDto extends PaginationDto {
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
  patientBeginAgeDate?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  patientEndAgeDate?: string;

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
  examStatus?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  examAppointmentStatus?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  examDateTo?: string;

  @ApiProperty({
    required: false,
    enum: PatientGenderEnum,
  })
  @Expose()
  @IsString()
  @IsOptional()
  @IsEnum(PatientGenderEnum)
  gender?: PatientGenderEnum;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  collectionYear?: number;
}
