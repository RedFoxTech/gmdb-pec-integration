import api from "../api/api";
import { AxiosInstance } from "axios";
import { getAuthToken } from "../api/utils/tokenUtils";
import {
  GetEarlyDetectionIndicatorsEntity,
  GetEarlyDetectionIndicatorsDto,
  GetHpvIndicatorsDto,
  GetHpvIndicatorsEntity,
} from "@/domain/entities/indicators";
import { parseObjectToQueryString } from "@/shared/stringUtils";

export class IndicatorsService {
  private readonly api: AxiosInstance = api;
  private readonly path: string = "/indicators";

  constructor() {
    this.makePath = this.makePath.bind(this);
    this.getHpvIndicators = this.getHpvIndicators.bind(this);
  }

  private makePath(path: string): string {
    return `${this.path}/${path}`;
  }

  async getHpvIndicators(
    data: GetHpvIndicatorsDto
  ): Promise<GetHpvIndicatorsEntity> {
    try {
      const result = await this.api.get<GetHpvIndicatorsEntity>(
        this.makePath(`hpv${parseObjectToQueryString(data)}`),
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
  async getEarlyDetectionIndicators(
    data: GetEarlyDetectionIndicatorsDto
  ): Promise<GetEarlyDetectionIndicatorsEntity> {
    try {
      const result = await this.api.get<GetEarlyDetectionIndicatorsEntity>(
        this.makePath(`early-detection${parseObjectToQueryString(data)}`),
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
}
