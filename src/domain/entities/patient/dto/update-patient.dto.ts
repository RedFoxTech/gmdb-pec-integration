import { SegmentEnum, VaccinationConsentStatusEnum } from "@/domain/consts";
import { FileDto } from "../../common";

export interface UpdatePatientDataDto {
  patientPecId: string;
  segmentId: SegmentEnum;
  consentStatus?: VaccinationConsentStatusEnum;
  active?: boolean;
  tags: string[];
  status?: string;
  consentFile?: FileDto;
}

export interface UpdatePatientDto {
  data: UpdatePatientDataDto;
}
