import { ApiProperty } from "@nestjs/swagger";
import { PatientGenderEnum } from "./patientGender.enum";
import { IsEnum } from "class-validator";
import { AcsEntity } from "../acs/acs.entity";
import { UnitEntity } from "../unit/unit.entity";
export class PatientEntity {
  @ApiProperty({
    type: String,
    description: "patientId of type string",
  })
  patientPecId: string;
  @ApiProperty({
    type: String,
    description: "name of type string",
  })
  name: string;
  @ApiProperty({
    type: String,
    description: "document of type string",
  })
  document?: string;
  @ApiProperty({
    type: String,
    description: "birthdate of type string",
  })
  birthdate: string;
  @ApiProperty({
    type: String,
    description: "cns of type string",
  })
  cns?: string;
  @ApiProperty({
    enum: PatientGenderEnum,
  })
  @IsEnum(PatientGenderEnum)
  gender?: PatientGenderEnum;
  @ApiProperty({
    type: String,
    description: "address of type string",
  })
  address?: string;
  @ApiProperty({
    type: String,
    description: "neighborhood of type string",
  })
  neighborhood?: string;
  @ApiProperty({
    type: String,
    description: "phone of type string",
  })
  phone?: string;
  @ApiProperty({
    type: String,
    description: "email of type string",
  })
  email?: string;
  @ApiProperty({
    type: String,
    description: "responsibleName of type string",
  })
  responsibleName?: string;
  @ApiProperty({
    type: String,
    description: "responsibleDocument of type string",
  })
  responsibleDocument?: string;
  @ApiProperty({
    type: Boolean,
    description: "vaccinated of type boolen",
  })
  vaccinated?: boolean;
  @ApiProperty({
    type: String,
    description: "applicationDate of type string",
  })
  applicationDate?: string;
  @ApiProperty({
    type: AcsEntity,
    description: "acs of type AcsEntity",
  })
  acs?: AcsEntity;
  @ApiProperty({
    type: UnitEntity,
    description: "unit of type UnitEntity",
  })
  unit?: UnitEntity;
}
