import { CampaignStatusEnum } from "@/domain/consts";
import { CampaignTargetEntity } from "./campaign-target.entity";
import { FileEntity } from "../../common";

export interface CampaignEntity {
  id: string;
  title: string;
  description: string;
  publicationDate: string;
  message: string;
  campaignStatus: CampaignStatusEnum;
  campaignTarget: CampaignTargetEntity;
  fileCreative: FileEntity;
  audienceSize: number;
}
