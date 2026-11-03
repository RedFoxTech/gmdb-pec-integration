import { ApiProperty } from "@nestjs/swagger";
import { PatientEntity } from "../patient/patient.entity";
import { ExamEnum } from "./exam.enum";
import { ExamAppointmentEnum } from "./examSchedule.enum";
export class ExamEntity {
  @ApiProperty({
    type: String,
    description: "patientPecId of type string",
  })
  patientPecId: string;
  @ApiProperty({
    type: String,
    description: "colectDate of type string",
  })
  colectDate?: string;
  @ApiProperty({
    type: String,
    description: "solicitationDate of type string",
  })
  solicitationDate?: string;
  @ApiProperty({
    type: Boolean,
    description: "scheduled of type boolean",
  })
  scheduled: boolean;
  @ApiProperty({
    type: String,
    description: "evaluatedDate of type string",
  })
  evaluatedDate?: string;
  @ApiProperty({
    enum: ExamEnum,
    description: "status of type AppointmentEnum",
  })
  status: ExamEnum;
  @ApiProperty({
    type: String,
    description: "dt_utilizada of type string",
  })
  dtUtilizada?: string;
  @ApiProperty({
    type: String,
    description: "dt_efetiva of type string",
  })
  dtEfetiva?: string;
  @ApiProperty({
    type: String,
    description: "agendaAt of type string",
  })
  agendaAt?: string;
  @ApiProperty({
    enum: ExamAppointmentEnum,
    description: "scheduleStatus of type AppointmentScheduleEnum",
  })
  scheduleStatus: ExamAppointmentEnum;
  @ApiProperty({
    type: PatientEntity,
    description: "patient of type PatientEntity",
  })
  patient: PatientEntity;
  @ApiProperty({
    type: Boolean,
    description: "isHpvDnaCollected of type boolean",
  })
  isHpvDnaCollected: boolean;
  @ApiProperty({
    type: Boolean,
    description: "isHpvDnaRequested of type boolean",
  })
  isHpvDnaRequested: boolean;
  @ApiProperty({
    type: Boolean,
    description: "isHpvDnaEvaluated of type boolean",
  })
  isHpvDnaEvaluated: boolean;
}
