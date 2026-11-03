import { CampaignStatusEnum } from "@/domain/consts";
import { RegisterCampaignTargetAudienceDto } from "./register-campaign-target-audience.dto";
import { FileDto } from "../../common";

export interface RegisterCampaignDto {
  title: string;
  description: string;
  publicationDate: string;
  message: string;
  target: RegisterCampaignTargetAudienceDto;
  fileCreative: FileDto;
  campaignStatus?: CampaignStatusEnum;
}
