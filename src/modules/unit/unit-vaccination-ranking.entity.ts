import { ApiProperty } from "@nestjs/swagger";
import { UnitEntity } from "./unit.entity";

export class UnitVaccinationRanking extends UnitEntity {
  @ApiProperty({
    type: Number,
    description: "vaccinated of type number",
  })
  vaccinated: number;
  @ApiProperty({
    type: Number,
    description: "notVaccinated of type number",
  })
  notVaccinated: number;
  @ApiProperty({
    type: Number,
    description: "position of type number",
  })
  position: number;
}
