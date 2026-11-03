import { ApiProperty } from "@nestjs/swagger";
import { StatusItem } from "./status-item.entity";
export class CityHallStatus {
  @ApiProperty({
    type: StatusItem,
  })
  patients: StatusItem;
  @ApiProperty({
    type: StatusItem,
  })
  vaccinations: StatusItem;
  @ApiProperty({
    type: StatusItem,
  })
  immunobiologicals: StatusItem;
  @ApiProperty({
    type: StatusItem,
  })
  doses: StatusItem;
  @ApiProperty({
    type: Number,
  })
  vaccinatedPatiends: number;
  @ApiProperty({
    type: Number,
  })
  notVaccinatedPatiends: number;
}
