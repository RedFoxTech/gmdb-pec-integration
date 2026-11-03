import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

@Exclude()
export class AcsFindAllDto {
  @ApiProperty({
    type: String,
    description: "Search by unit ids",
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  units?: string;
}
