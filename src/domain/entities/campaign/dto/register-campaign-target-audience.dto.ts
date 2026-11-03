import { AgeRangeEnum } from "@/domain/consts";

export interface RegisterCampaignTargetAudienceDto {
  patientName: string;
  segmentId?: string;
  ageGroup: AgeRangeEnum[];
  tags: string[];
  unitId?: string;
}
