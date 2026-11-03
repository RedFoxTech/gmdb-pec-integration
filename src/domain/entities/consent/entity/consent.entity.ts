import { VaccinationConsentStatusEnum } from "@/domain/consts";
import { FileEntity } from "../../common";
import { SegmentEntity } from "../../segment";

export interface ConsentEntity {
  id: string;
  segment: SegmentEntity;
  consentStatus: VaccinationConsentStatusEnum;
  consentFile: FileEntity;
}
