import api from "../api/api";
import { AxiosInstance } from "axios";
import {
  ConsentFormPatientEntity,
  GetConsentFormPatientInfoDto,
  GetPatientExamSchedulingDto,
  GetPatientsDto,
  GetPatientsEntity,
  GetPatientsReportDto,
  GetVaccinationChartOptions,
  NotConsentVaccinationDto,
  PatientEntity,
  PatientExamSchedulingEntity,
  UpdatePatientDto,
  VaccinationChartEntity,
} from "@/domain/entities/patient";
import { parseObjectToQueryString } from "@/shared/stringUtils";
import { getAuthToken } from "../api/utils/tokenUtils";
import saveAs from "file-saver";

export class PatientService {
  private readonly api: AxiosInstance = api;
  private readonly path: string = "/patient";

  constructor() {
    this.makePath = this.makePath.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getVaccinationChart = this.getVaccinationChart.bind(this);
    this.update = this.update.bind(this);
    this.getConsentFormPatientInfo = this.getConsentFormPatientInfo.bind(this);
    this.notConsentVaccination = this.notConsentVaccination.bind(this);
    this.getPatientExamScheduling = this.getPatientExamScheduling.bind(this);
  }

  private makePath(path: string): string {
    return `${this.path}/${path}`;
  }

  async getAll(data?: GetPatientsDto): Promise<GetPatientsEntity> {
    try {
      const result = await this.api.get<GetPatientsEntity>(
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

  async getVaccinationChart(
    data: GetVaccinationChartOptions
  ): Promise<VaccinationChartEntity> {
    try {
      const result = await this.api.get<VaccinationChartEntity>(
        this.makePath(`vaccination-chart${parseObjectToQueryString(data)}`),
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

  async update(data: UpdatePatientDto) {
    try {
      const result = await this.api.patch<PatientEntity>(this.path, data.data, {
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

  async getConsentFormPatientInfo(
    data: GetConsentFormPatientInfoDto
  ): Promise<ConsentFormPatientEntity> {
    try {
      const result = await this.api.get<ConsentFormPatientEntity>(
        this.makePath(
          `${data.pecId}/consent-form-info?cityHallIbge=${data.cityHallIbge}`
        )
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async notConsentVaccination(data: NotConsentVaccinationDto) {
    try {
      const result = await this.api.patch<null>(
        this.makePath(`${data.id}/not-consent-vaccination-administration`),
        data.data
      );

      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getPatientExamScheduling(
    data: GetPatientExamSchedulingDto
  ): Promise<PatientExamSchedulingEntity> {
    try {
      const result = await this.api.get<PatientExamSchedulingEntity>(
        this.makePath(
          `exam-scheduling/${data.document}?cityHallIbge=${data.cityHallIbge}`
        )
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async generalReport(data: GetPatientsReportDto) {
    try {
      const result = await this.api.get<undefined>(
        this.makePath(`export${parseObjectToQueryString(data)}`),
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
        saveAs(blob, `pacientes-${new Date().toISOString()}.xls`);
      }
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
