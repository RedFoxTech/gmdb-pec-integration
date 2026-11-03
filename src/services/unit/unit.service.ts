import api from "../api/api";
import { AxiosInstance } from "axios";
import { getAuthToken } from "../api/utils/tokenUtils";
import {
  GetUnitByVaccinationRankingDto,
  GetUnitByVaccinationRankingEntity,
  GetUnitByVaccinationRankingReportDto,
  UnitEntity,
} from "@/domain/entities/unit";
import { parseObjectToQueryString } from "@/shared/stringUtils";
import saveAs from "file-saver";

export class UnitService {
  private readonly api: AxiosInstance = api;
  private readonly path: string = "/unit";

  constructor() {
    this.makePath = this.makePath.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getByVaccinationRanking = this.getByVaccinationRanking.bind(this);
    this.byVaccinationRankingReport =
      this.byVaccinationRankingReport.bind(this);
  }

  private makePath(path: string): string {
    return `${this.path}/${path}`;
  }

  async getAll(): Promise<UnitEntity[]> {
    try {
      const result = await this.api.get<UnitEntity[]>(this.path, {
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

  async getByVaccinationRanking(
    data: GetUnitByVaccinationRankingDto
  ): Promise<GetUnitByVaccinationRankingEntity> {
    try {
      const result = await this.api.get<GetUnitByVaccinationRankingEntity>(
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

  async byVaccinationRankingReport(data: GetUnitByVaccinationRankingReportDto) {
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
          `units-by-vaccination-ranking-${new Date().toISOString()}.xls`
        );
      }
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
