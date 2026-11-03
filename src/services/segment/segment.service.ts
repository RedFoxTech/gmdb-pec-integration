import api from "../api/api";
import { AxiosInstance } from "axios";
import { getAuthToken } from "../api/utils/tokenUtils";
import { SegmentEntity } from "@/domain/entities/segment";

export class SegmentService {
  private readonly api: AxiosInstance = api;
  private readonly path: string = "/segments";

  constructor() {
    this.makePath = this.makePath.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  private makePath(path: string): string {
    return `${this.path}/${path}`;
  }

  async getAll(): Promise<SegmentEntity[]> {
    try {
      const result = await this.api.get<SegmentEntity[]>(this.path, {
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
