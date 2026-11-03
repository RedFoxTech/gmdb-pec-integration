import api from "../api/api";
import { AxiosInstance } from "axios";
import { getAuthToken } from "../api/utils/tokenUtils";
import {
  CampaignEntity,
  GetCampaignEntity,
  GetCampaignReportDto,
  GetCampaignsDto,
  GetCampaignTargetAudienceReportDto,
  RegisterCampaignDto,
  UpdateCampaignDto,
} from "@/domain/entities/campaign";
import { parseObjectToQueryString } from "@/shared/stringUtils";
import { saveAs } from "file-saver";

export class CampaignService {
  private readonly api: AxiosInstance = api;
  private readonly path: string = "/campaign";

  constructor() {
    this.makePath = this.makePath.bind(this);
    this.getAll = this.getAll.bind(this);
    this.register = this.register.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.generalReport = this.generalReport.bind(this);
  }

  private makePath(path: string): string {
    return `${this.path}/${path}`;
  }

  async getAll(data?: GetCampaignsDto): Promise<GetCampaignEntity> {
    try {
      const result = await this.api.get<GetCampaignEntity>(
        `${this.path}${parseObjectToQueryString(data)}`,
        {
          headers: {
            authorization: getAuthToken(),
          },
        }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async register(data: RegisterCampaignDto): Promise<CampaignEntity> {
    try {
      const result = await this.api.post<CampaignEntity>(this.path, data, {
        headers: {
          authorization: getAuthToken(),
        },
      });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(data: UpdateCampaignDto): Promise<CampaignEntity> {
    try {
      const result = await this.api.patch<CampaignEntity>(
        this.makePath(data.id),
        data.data,
        {
          headers: {
            authorization: getAuthToken(),
          },
        }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(id: string): Promise<CampaignEntity> {
    try {
      const result = await this.api.delete<CampaignEntity>(this.makePath(id), {
        headers: {
          authorization: getAuthToken(),
        },
      });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async generalReport(data: GetCampaignReportDto) {
    try {
      const result = await this.api.get<undefined>(
        this.makePath(`${data.id}/export`),
        {
          headers: {
            authorization: getAuthToken(),
            "Content-Type": "text/csv",
          },
          responseType: "blob",
        }
      );
      if (result.data) {
        saveAs(result.data, `campaign-report-${new Date().toISOString()}.csv`);
      }
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async targetAudienceReport(data: GetCampaignTargetAudienceReportDto) {
    try {
      const result = await this.api.get<undefined>(
        this.makePath(`${data.id}/export-target-audience`),
        {
          headers: {
            authorization: getAuthToken(),
            "Content-Type": "text/csv",
          },
          responseType: "blob",
        }
      );
      if (result.data) {
        saveAs(
          result.data,
          `campaign-target-audience-report-${new Date().toISOString()}.csv`
        );
      }
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
