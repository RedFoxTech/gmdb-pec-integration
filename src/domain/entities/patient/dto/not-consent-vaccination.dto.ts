import { SegmentEnum } from "@/domain/consts";

export interface NotConsentVaccinationDataDto {
  responsibleName: string;
  responsibleDocument: string;
  segmentId: SegmentEnum;
  cityHallIbge: string;
}

export interface NotConsentVaccinationDto {
  id: string;
  data: NotConsentVaccinationDataDto;
}
