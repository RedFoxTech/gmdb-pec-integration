import api from "../api/api";
import { AxiosInstance } from "axios";
import { getAuthToken } from "../api/utils/tokenUtils";
import {
  AgendaEntity,
  GetAgendaEntity,
  GetAgendasDto,
  RegisterAgendaDto,
  UpdateAgendatDto,
} from "@/domain/entities/agenda";
import { parseObjectToQueryString } from "@/shared/stringUtils";

export class AgendaService {
  private readonly api: AxiosInstance = api;
  private readonly path: string = "/agenda";

  constructor() {
    this.makePath = this.makePath.bind(this);
    this.getAll = this.getAll.bind(this);
    this.register = this.register.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  private makePath(path: string): string {
    return `${this.path}/${path}`;
  }

  async getAll(data?: GetAgendasDto): Promise<GetAgendaEntity> {
    try {
      const result = await this.api.get<GetAgendaEntity>(
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

  async register(data: RegisterAgendaDto): Promise<AgendaEntity> {
    try {
      const result = await this.api.post<AgendaEntity>(this.path, data, {
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

  async update(data: UpdateAgendatDto): Promise<AgendaEntity> {
    try {
      const result = await this.api.patch<AgendaEntity>(
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

  async delete(id: string): Promise<AgendaEntity> {
    try {
      const result = await this.api.delete<AgendaEntity>(this.makePath(id), {
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
}
