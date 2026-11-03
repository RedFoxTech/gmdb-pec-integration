import { ExamStatusEnum, ExamAppointmentStatusEnum } from "@/domain/consts";
import { PatientEntity } from "../../patient";

export interface ExamEntity {
  patientPecId: string;
  colectDate?: string;
  solicitationDate?: string;
  scheduled: boolean;
  evaluatedDate?: string;
  status: ExamStatusEnum;
  agendaAt?: string;
  scheduleStatus: ExamAppointmentStatusEnum;
  patient: PatientEntity;
  dtEfetiva?: string;
}
