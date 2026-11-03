import { PatientSchedulingStatus } from "@/domain/consts";

export interface UpdatePatientSchedulingStatusDataDto {
  schedulingStatus: PatientSchedulingStatus;
}

export interface UpdatePatientSchedulingStatusDto {
  id: string;
  data: UpdatePatientSchedulingStatusDataDto;
}
