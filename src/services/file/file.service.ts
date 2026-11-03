import api from "../api/api";
import { AxiosInstance } from "axios";
import { getAuthToken } from "../api/utils/tokenUtils";
import { GetPrivateFileEntity } from "@/domain/entities/File";

export class FileService {
  private readonly api: AxiosInstance = api;
  private readonly path: string = "/file";

  constructor() {
    this.makePath = this.makePath.bind(this);
    this.getPrivateUrl = this.getPrivateUrl.bind(this);
  }

  private makePath(path: string): string {
    return `${this.path}/${path}`;
  }

  async getPrivateUrl(fileName: string): Promise<GetPrivateFileEntity> {
    try {
      const result = await this.api.get<GetPrivateFileEntity>(
        this.makePath(`private-url/${fileName}`),
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
