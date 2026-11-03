import { ApiProperty } from "@nestjs/swagger";
export class ExamAppointmentEntity {
  @ApiProperty({
    type: String,
    description: "id of type string",
  })
  id: string;
  @ApiProperty({
    type: String,
    description: "patientPecId of type string",
  })
  patientPecId: string;
  @ApiProperty({
    type: String,
    description: "createdAt of type string",
  })
  createdAt: string;
  @ApiProperty({
    type: String,
    description: "scheduled of type string",
  })
  agendaAt: string;
}
