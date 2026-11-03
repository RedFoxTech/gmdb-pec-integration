import api from "../api/api";
import { AxiosInstance } from "axios";
import { getAuthToken } from "../api/utils/tokenUtils";
import { TagEntity } from "@/domain/entities/Tag";

export class TagService {
  private readonly api: AxiosInstance = api;
  private readonly path: string = "/tags";

  constructor() {
    this.makePath = this.makePath.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  private makePath(path: string): string {
    return `${this.path}/${path}`;
  }

  async getAll(): Promise<TagEntity[]> {
    try {
      const result = await this.api.get<TagEntity[]>(this.path, {
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
