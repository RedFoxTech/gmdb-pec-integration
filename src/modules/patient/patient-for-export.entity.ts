import { ApiProperty } from "@nestjs/swagger";
import { PatientEntity } from "./patient.entity";
export class PatientForExportEntity extends PatientEntity {
  @ApiProperty({
    type: String,
    description: "immunobiological of type string",
  })
  immunobiological?: string;
  @ApiProperty({
    type: String,
    description: "dose of type string",
  })
  dose?: string;
  @ApiProperty({
    type: Boolean,
    description: "updatedwithpni of type boolean",
  })
  updatedWithPni: boolean;
}
