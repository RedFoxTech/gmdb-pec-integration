import api from "../api/api";
import { AxiosInstance } from "axios";
import {
  GetPatientSchedulingEntity,
  PatientSchedulingEntity,
  PatientExamSchedulingDto,
  GetPatientSchedulingDto,
  UpdatePatientSchedulingStatusDto,
} from "@/domain/entities/patient-scheduling";
import { parseObjectToQueryString } from "@/shared/stringUtils";
import { getAuthToken } from "../api/utils/tokenUtils";

export class PatientSchedulingService {
  private readonly api: AxiosInstance = api;
  private readonly path: string = "/patient-scheduling";

  constructor() {
    this.makePath = this.makePath.bind(this);
    this.getAll = this.getAll.bind(this);
    this.register = this.register.bind(this);
    this.delete = this.delete.bind(this);
    this.updateSchedulingStatus = this.updateSchedulingStatus.bind(this);
  }

  private makePath(path: string): string {
    return `${this.path}/${path}`;
  }

  async getAll(
    data?: GetPatientSchedulingDto
  ): Promise<GetPatientSchedulingEntity> {
    try {
      const result = await this.api.get<GetPatientSchedulingEntity>(
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

  async register(
    data: PatientExamSchedulingDto
  ): Promise<PatientSchedulingEntity> {
    try {
      const result = await this.api.post<PatientSchedulingEntity>(
        this.path,
        data
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(id: string): Promise<PatientSchedulingEntity> {
    try {
      const result = await this.api.delete<PatientSchedulingEntity>(
        this.makePath(id),
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

  async updateSchedulingStatus(
    data: UpdatePatientSchedulingStatusDto
  ): Promise<PatientSchedulingEntity> {
    try {
      const result = await this.api.patch<PatientSchedulingEntity>(
        this.makePath(`schedule-status/${data.id}`),
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
}
