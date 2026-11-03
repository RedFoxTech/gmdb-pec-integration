import { AgeRangeEnum } from "@/domain/consts";
import { SegmentEntity } from "../../segment";
import { UnitEntity } from "../../unit";
import { TagEntity } from "../../Tag";

export interface CampaignTargetTag {
  tag: TagEntity;
}

export interface CampaignTargetEntity {
  id: string;
  patientName: string;
  ageGroup: AgeRangeEnum[];
  segment?: SegmentEntity;
  tags: CampaignTargetTag[];
  unit?: UnitEntity;
}
