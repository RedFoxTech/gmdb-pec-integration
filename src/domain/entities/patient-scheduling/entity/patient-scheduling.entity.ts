import { PatientSchedulingStatus } from "@/domain/consts";
import { AgendaEntity } from "../../agenda";
import { PatientEntity } from "../../patient";

export interface PatientSchedulingEntity {
  id: string;
  agenda: AgendaEntity;
  patient?: PatientEntity;
  name?: string;
  email?: string;
  document?: string;
  phone?: string;
  schedulingStatus: PatientSchedulingStatus;
}
