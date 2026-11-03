import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class CheckCityHallDbStatusDto {
  @ApiProperty({
    type: String,
    description: "Search by immunobiologicals id",
    required: false,
  })
  @Expose()
  @IsString()
  immunobiologicalIds: string;
}
