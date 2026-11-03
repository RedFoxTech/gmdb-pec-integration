import { ApiProperty } from "@nestjs/swagger";
export class AcsEntity {
  @ApiProperty({
    type: String,
    description: "id of type number",
  })
  id: string;
  @ApiProperty({
    type: String,
    description: "name of type string",
  })
  name: string;
  @ApiProperty({
    type: String,
    description: "cns of type string",
  })
  cns: string;
  @ApiProperty({
    type: String,
    description: "unitId of type string",
  })
  unitId: string;
}
