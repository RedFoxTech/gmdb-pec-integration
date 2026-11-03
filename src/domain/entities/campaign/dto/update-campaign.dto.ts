import { CampaignStatusEnum } from "@/domain/consts";
import { RegisterCampaignDto } from "./register-campaign.dto";
import { FileDto } from "../../common";

export interface UpdateCampaignDataDto
  extends Omit<RegisterCampaignDto, "fileCreative"> {
  campaignTargetId: string;
  campaignStatus: CampaignStatusEnum;
  fileCreative?: FileDto;
}

export interface UpdateCampaignDto {
  id: string;
  data: UpdateCampaignDataDto;
}
