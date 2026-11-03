import { ListMeta } from "../../common";
import { CampaignEntity } from "./campaign.entity";

export interface GetCampaignEntity {
  data: CampaignEntity[];
  meta: ListMeta;
}
