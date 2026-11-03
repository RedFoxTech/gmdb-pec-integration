import { ApiProperty } from "@nestjs/swagger";
export class UnitEntity {
  @ApiProperty({
    type: String,
    description: "id of type string",
  })
  id: string;
  @ApiProperty({
    type: String,
    description: "name of type string",
  })
  name: string;
  @ApiProperty({
    type: String,
    description: "address of type string",
  })
  address: string;
  @ApiProperty({
    type: String,
    description: "addressNumber of type string",
  })
  addressNumber: string;
  @ApiProperty({
    type: String,
    description: "neighborhood of type string",
  })
  neighborhood: string;
  @ApiProperty({
    type: String,
    description: "zipcode of type string",
  })
  zipcode: string;
}
