import api from "../api/api";
import { AxiosInstance } from "axios";
import { getAuthToken } from "../api/utils/tokenUtils";
import {
  AcsEntity,
  GetAcsByVaccinationRankingDto,
  GetAcsByVaccinationRankingEntity,
  GetAcsByVaccinationRankingReportDto,
} from "@/domain/entities/acs";
import { parseObjectToQueryString } from "@/shared/stringUtils";
import saveAs from "file-saver";
import { GetAcsDto } from "@/domain/entities/acs/dto/get-acs.dto";

export class AcsService {
  private readonly api: AxiosInstance = api;
  private readonly path: string = "/acs";

  constructor() {
    this.makePath = this.makePath.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getByVaccinationRanking = this.getByVaccinationRanking.bind(this);
  }

  private makePath(path: string): string {
    return `${this.path}/${path}`;
  }

  async getAll(data: GetAcsDto): Promise<AcsEntity[]> {
    try {
      const result = await this.api.get<AcsEntity[]>(
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

  async getByVaccinationRanking(
    data: GetAcsByVaccinationRankingDto
  ): Promise<GetAcsByVaccinationRankingEntity> {
    try {
      const result = await this.api.get<GetAcsByVaccinationRankingEntity>(
        this.makePath(
          `by-vaccination-ranking${parseObjectToQueryString(data)}`
        ),
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

  async byVaccinationRankingReport(data: GetAcsByVaccinationRankingReportDto) {
    try {
      const result = await this.api.get<undefined>(
        this.makePath(
          `by-vaccination-ranking-export${parseObjectToQueryString(data)}`
        ),
        {
          headers: {
            authorization: getAuthToken(),
          },
          responseType: "blob",
        }
      );
      if (result.data) {
        const blob = new Blob([result.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(
          blob,
          `acs-by-vaccination-ranking-${new Date().toISOString()}.xls`
        );
      }
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
